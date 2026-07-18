import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';

/**
 * Creates and configures the Express application.
 * Separated from server.js for testability — tests import the app
 * without starting the HTTP server or connecting to the real DB.
 * @returns {express.Application}
 */
const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/vehicles', vehicleRoutes);

  // Error handling middleware
  app.use((err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Handle Mongoose Cast Errors (invalid ObjectIDs)
    if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Resource not found';
    }

    res.status(statusCode).json({
      error: {
        message,
        status: statusCode,
      },
    });
  });

  return app;
};

export default createApp;

