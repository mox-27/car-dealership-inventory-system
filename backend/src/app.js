import express from 'express';
import cors from 'cors';

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

  return app;
};

export default createApp;
