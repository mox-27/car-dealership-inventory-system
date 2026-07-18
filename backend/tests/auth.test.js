import './setup.js';
import request from 'supertest';
import createApp from '../src/app.js';

const app = createApp();

describe('POST /api/auth/register', () => {
  it('should register a new user and return 201 with user data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    };

    const res = await request(app).post('/api/auth/register').send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('name', 'John Doe');
    expect(res.body.user).toHaveProperty('email', 'john@example.com');
    expect(res.body.user).toHaveProperty('role', 'user');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should return 409 when registering with a duplicate email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    };

    // Register first time
    await request(app).post('/api/auth/register').send(userData);

    // Register again with same email
    const res = await request(app).post('/api/auth/register').send({
      ...userData,
      name: 'Jane Doe',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });
});
