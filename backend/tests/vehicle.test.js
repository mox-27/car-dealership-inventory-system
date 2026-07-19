import './setup.js';
import request from 'supertest';
import createApp from '../src/app.js';

const app = createApp();

/**
 * Helper to register a user and return a JWT token.
 */
const getAuthToken = async (role = 'user') => {
  const uniqueEmail = `testuser-${Date.now()}-${Math.random()}@example.com`;
  await request(app).post('/api/auth/register').send({
    name: 'Test User',
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

describe('Vehicle CRUD', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    userToken = await getAuthToken('user');
    adminToken = await getAuthToken('admin');
  });

  describe('POST /api/vehicles', () => {
    it('should create a vehicle when authenticated', async () => {
      const vehicleData = {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 10,
      };

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(vehicleData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('vehicle');
      expect(res.body.vehicle).toHaveProperty('make', 'Toyota');
      expect(res.body.vehicle).toHaveProperty('model', 'Camry');
      expect(res.body.vehicle).toHaveProperty('_id');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).post('/api/vehicles').send({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 10,
      });

      expect(res.statusCode).toBe(401);
    });

    it('should reject duplicate vehicle (same make + model)', async () => {
      const vehicleData = {
        make: 'Toyota',
        model: 'Supra',
        category: 'Sports',
        price: 50000,
        quantity: 3,
      };

      // First creation should succeed
      const first = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(vehicleData);

      expect(first.statusCode).toBe(201);

      // Second creation with same make+model should fail
      const second = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...vehicleData, price: 55000, quantity: 5 });

      expect(second.statusCode).toBe(409);
      expect(second.body.error.message).toMatch(/already exists/i);
    });
  });

  describe('POST /api/vehicles/bulk', () => {
    it('should bulk insert vehicles and ignore duplicates', async () => {
      // Insert one vehicle first
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 20000, quantity: 5 });

      const bulkData = {
        vehicles: [
          { make: 'Honda', model: 'Accord', category: 'Sedan', price: 22000, quantity: 2 }, // Duplicate
          { make: 'Nissan', model: 'Altima', category: 'Sedan', price: 21000, quantity: 3 }, // New
          { make: 'Chevrolet', model: 'Malibu', category: 'Sedan', price: 19000, quantity: 4 } // New
        ]
      };

      const res = await request(app)
        .post('/api/vehicles/bulk')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bulkData);

      expect(res.statusCode).toBe(201);
      expect(res.body.insertedCount).toBe(2);
      expect(res.body.failedCount).toBe(1);

      // Verify they are in DB
      const getRes = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(getRes.body.vehicles.length).toBe(3); // Accord + Altima + Malibu
    });
  });

  describe('GET /api/vehicles', () => {
    it('should list all vehicles', async () => {
      // Create a vehicle first
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'Honda',
          model: 'Civic',
          category: 'Sedan',
          price: 22000,
          quantity: 5,
        });

      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.vehicles)).toBe(true);
      expect(res.body.vehicles.length).toBe(1);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update a vehicle', async () => {
      // Create a vehicle
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'Toyota',
          model: 'Camry',
          category: 'Sedan',
          price: 25000,
          quantity: 10,
        });

      const vehicleId = createRes.body.vehicle._id;

      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 27000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.vehicle).toHaveProperty('price', 27000);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/vehicles/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 27000 });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should delete a vehicle as admin', async () => {
      // Create a vehicle
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Ford',
          model: 'Mustang',
          category: 'Sports',
          price: 45000,
          quantity: 3,
        });

      const vehicleId = createRes.body.vehicle._id;

      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 403 when non-admin tries to delete', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'Ford',
          model: 'Focus',
          category: 'Sedan',
          price: 20000,
          quantity: 7,
        });

      const vehicleId = createRes.body.vehicle._id;

      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
