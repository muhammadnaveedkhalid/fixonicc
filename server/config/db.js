import mongoose from 'mongoose';

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;
  connectionPromise = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 20000,
  });
  try {
    const conn = await connectionPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    connectionPromise = null;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

/** Call this before any DB operation (e.g. in middleware) so serverless waits for connection */
export const ensureDb = async () => {
  if (mongoose.connection.readyState === 1) return;
  await connectDB();
};

export default connectDB;
