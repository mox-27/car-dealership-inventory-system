import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the URI from environment variables.
 * Falls back to a local MongoDB instance if MONGODB_URI is not set.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-dealership';
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

export default connectDB;
