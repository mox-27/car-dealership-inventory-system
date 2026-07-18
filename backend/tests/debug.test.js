import './setup.js';
import request from 'supertest';
import createApp from '../src/app.js';

const app = createApp();

describe('Debug', () => {
  it('debug register response', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', JSON.stringify(res.body, null, 2));
    console.log('TEXT:', res.text);
    expect(true).toBe(true);
  });
});
