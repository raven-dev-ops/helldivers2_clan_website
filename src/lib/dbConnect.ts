// src/lib/dbConnect.ts
import mongoose, { Mongoose } from 'mongoose';
import { logger } from '@/lib/logger';

// Import all your Mongoose models to register schemas once in dev.
import '@/models/User';
import '@/models/ForumCategory';
import '@/models/ForumThread';
import '@/models/ForumPost';
// Add more as needed.

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose_cache: MongooseCache | undefined;
}

if (!global.mongoose_cache) {
  global.mongoose_cache = { conn: null, promise: null };
}

const cached = global.mongoose_cache;

/**
 * Connect to MongoDB using Mongoose with caching.
 * Does NOT read secrets until called.
 */
async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable.');
  }

  if (!cached.promise) {
    const opts: Parameters<typeof mongoose.connect>[1] = {
      bufferCommands: false,
      // Use MONGODB_DB if provided; otherwise defer to DB in the URI
      ...(process.env.MONGODB_DB ? { dbName: process.env.MONGODB_DB } : {}),
      // Connection tuning for Heroku/dyno environments
      maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 10),
      minPoolSize: Number(process.env.MONGODB_MIN_POOL_SIZE || 1),
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000),
      socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || 20000),
      waitQueueTimeoutMS: Number(process.env.MONGODB_WAIT_QUEUE_TIMEOUT_MS || 2000),
      heartbeatFrequencyMS: Number(process.env.MONGODB_HEARTBEAT_FREQUENCY_MS || 10000),
      family: 4,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    logger.error('MongoDB connection error:', error);
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
