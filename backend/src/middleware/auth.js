import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

/**
 * Verifies JWT from Authorization header and attaches decoded payload to req.user.
 * Responds with 401 if token is missing or invalid.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { message: 'Access denied. No token provided.', status: 401 },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: { message: 'Invalid or expired token.', status: 401 },
    });
  }
};

/**
 * Checks that the authenticated user has the 'admin' role.
 * Must be used after the authenticate middleware.
 * Responds with 403 if the user is not an admin.
 */
export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      error: { message: 'Admin access required.', status: 403 },
    });
  }
  next();
};
