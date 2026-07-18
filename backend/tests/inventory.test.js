import './setup.js';
import request from 'supertest';
import createApp from '../src/app.js';
import Vehicle from '../src/models/Vehicle.js';

const app = createApp();

const getAuthToken = async (role = 'user') => {
  const uniqueEmail = `inventory-${Date.now()}-${Math.random()}@example.com`;
  await request(app).post('/api/auth/register').send({
    name: 'Inventory User',
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

describe('Inventory Endpoints', () => {
  let userToken;
  let adminToken;
  let vehicleId;

  beforeEach(async () => {
    userToken = await getAuthToken('user');
    adminToken = await getAuthToken('admin');

    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Honda',
        model: 'Accord',
        category: 'Sedan',
        price: 25000,
        quantity: 1, // Start with 1 for purchase test
      });
    
    vehicleId = vehicleRes.body.vehicle._id;
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should decrement quantity by 1 on successful purchase', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.vehicle.quantity).toBe(0);
      
      const dbVehicle = await Vehicle.findById(vehicleId);
      expect(dbVehicle.quantity).toBe(0);
    });

    it('should return 400 when quantity is 0', async () => {
      // Purchase once to drop to 0
      await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      // Try to purchase again
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toMatch(/out of stock/i);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .post(`/api/vehicles/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should increment quantity as admin', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.vehicle.quantity).toBe(6); // 1 + 5 = 6
    });

    it('should return 403 when non-admin tries to restock', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(403);
    });

    it('should return 400 for invalid restock quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -2 });

      expect(res.statusCode).toBe(400);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .post(`/api/vehicles/${fakeId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(404);
    });
  });
});
