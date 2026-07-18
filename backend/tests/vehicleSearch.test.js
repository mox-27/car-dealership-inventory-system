import './setup.js';
import request from 'supertest';
import createApp from '../src/app.js';

const app = createApp();

/**
 * Helper to register a user and return a JWT token.
 */
const getAuthToken = async (role = 'user') => {
  const uniqueEmail = `search-${Date.now()}-${Math.random()}@example.com`;
  await request(app).post('/api/auth/register').send({
    name: 'Search User',
    email: uniqueEmail,
    password: 'password123',
    role,
  });
  const loginRes = await request(app).post('/api/auth/login').send({
    email: uniqueEmail,
    password: 'password123',
  });
  return loginRes.body.token;
};

describe('GET /api/vehicles/search', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken();

    // Seed vehicles
    const vehicles = [
      { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
      { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 35000, quantity: 5 },
      { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 8 },
      { make: 'BMW', model: 'X5', category: 'SUV', price: 60000, quantity: 3 },
    ];

    for (const v of vehicles) {
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(v);
    }
  });

  it('should filter vehicles by make', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(2);
    expect(res.body.vehicles.every((v) => v.make === 'Toyota')).toBe(true);
  });

  it('should filter vehicles by category', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=SUV')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(2);
    expect(res.body.vehicles.every((v) => v.category === 'SUV')).toBe(true);
  });

  it('should filter vehicles by price range', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=20000&maxPrice=30000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(2);
    res.body.vehicles.forEach((v) => {
      expect(v.price).toBeGreaterThanOrEqual(20000);
      expect(v.price).toBeLessThanOrEqual(30000);
    });
  });

  it('should filter with multiple criteria', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota&category=SUV')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(1);
    expect(res.body.vehicles[0].model).toBe('RAV4');
  });

  it('should return empty array when no vehicles match', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Ferrari')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(0);
  });
});
