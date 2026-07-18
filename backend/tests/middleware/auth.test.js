import '../setup.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

const JWT_SECRET = 'test-secret-key';

// We need to test the middleware in isolation
// Import will happen after we set up the env
process.env.JWT_SECRET = JWT_SECRET;

const { authenticate, authorizeAdmin } = await import('../../src/middleware/auth.js');

/**
 * Helper to create a mock Express request/response/next triplet.
 */
const mockReqResNext = (overrides = {}) => {
  const req = {
    headers: {},
    ...overrides,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe('authenticate middleware', () => {
  it('should call next and set req.user with a valid token', () => {
    const payload = { id: '123', email: 'test@example.com', role: 'user' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const { req, res, next } = mockReqResNext({
      headers: { authorization: `Bearer ${token}` },
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.email).toBe('test@example.com');
  });

  it('should return 401 when no token is provided', () => {
    const { req, res, next } = mockReqResNext();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(Object) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    const { req, res, next } = mockReqResNext({
      headers: { authorization: 'Bearer invalid-token-here' },
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('authorizeAdmin middleware', () => {
  it('should call next when user is admin', () => {
    const { req, res, next } = mockReqResNext();
    req.user = { id: '123', role: 'admin' };

    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 when user is not admin', () => {
    const { req, res, next } = mockReqResNext();
    req.user = { id: '123', role: 'user' };

    authorizeAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(Object) })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
