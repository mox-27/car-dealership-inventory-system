import mongoose from "mongoose";

/**
 * Connects to MongoDB using the URI from environment variables.
 * Falls back to a local MongoDB instance if MONGODB_URI is not set.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || "car-dealership",
  });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

export default connectDB;
