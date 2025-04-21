// src/lib/dbConnect.ts (Corrected)
import mongoose, { Mongoose } from 'mongoose';

// --- Import ALL your Mongoose models HERE ---
import '@/models/User'; // Adjust path
import '@/models/ForumCategory'; // Adjust path
import '@/models/ForumThread'; // Adjust path
import '@/models/ForumPost';   // Adjust path
// Add imports for any other models you have

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose_cache: MongooseCache | undefined;
}

/**
 * Initialize the cache object on the global scope if it doesn't exist.
 * This prevents the 'cached is possibly undefined' error.
 */
if (!global.mongoose_cache) {
  global.mongoose_cache = { conn: null, promise: null };
}
// Now assign the initialized cache to the local variable.
let cached: MongooseCache = global.mongoose_cache;


async function dbConnect(): Promise<Mongoose> {
  // If a connection exists, return it immediately
  if (cached.conn) {
    // console.log('DB Cache: Using existing connection');
    return cached.conn;
  }

  // If no promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Recommended for serverless/edge
    };

    // console.log('DB Cache: Creating new connection promise');
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      // console.log('DB Cache: Connection successful');
      return mongooseInstance;
    }).catch(error => {
        cached.promise = null; // Clear promise on error
        console.error('DB Cache: MongoDB connection error:', error);
        throw error;
    });
  }

  // Wait for the connection promise to resolve and store the connection
  try {
    // console.log('DB Cache: Awaiting connection promise');
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Clear promise on error
    throw e;
  }

  // Return the established connection (TypeScript now knows cached.conn is not null here)
  // We can assert non-null because if await cached.promise succeeded, cached.conn was set.
  // If it threw, the function would have already exited.
  return cached.conn!;
}

export default dbConnect;