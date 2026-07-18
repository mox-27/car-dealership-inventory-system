import dotenv from 'dotenv';
dotenv.config();

import createApp from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
