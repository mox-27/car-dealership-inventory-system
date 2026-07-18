import '../setup.js';
import request from 'supertest';
import createApp from '../../src/app.js';

const app = createApp();

describe('App health check', () => {
  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
