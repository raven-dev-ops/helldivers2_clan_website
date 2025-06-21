// src/lib/dbConnect.ts
import mongoose, { Mongoose } from 'mongoose';

// Import all your models so they're registered
import '@/models/User';
import '@/models/ForumCategory';
import '@/models/ForumThread';
import '@/models/ForumPost';
// ...add any additional model imports here

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose_cache: MongooseCache | undefined;
}

if (!global.mongoose_cache) {
  global.mongoose_cache = { conn: null, promise: null };
}

let cached: MongooseCache = global.mongoose_cache;

/**
 * Connects to MongoDB using a cached connection if possible.
 * Only attempts to connect when called, not at module load.
 */
async function dbConnect(): Promise<Mongoose> {
  // Return cached connection if already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Make sure the URI is set ONLY when we try to connect
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local or in your deployment platform.'
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'GPTHellbot',
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cached.promise = null; // Clear promise on error
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn!;
}

export default dbConnect;
