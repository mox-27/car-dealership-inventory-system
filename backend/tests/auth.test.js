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

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'incomplete@example.com',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    // Register a user before each login test
    await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });
  });

  it('should login with valid credentials and return a token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should return 401 with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 401 with non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
