import mongoose, { Mongoose } from 'mongoose';

// Import all your Mongoose models once to prevent OverwriteModelError in dev.
import '@/models/User';
import '@/models/ForumCategory';
import '@/models/ForumThread';
import '@/models/ForumPost';
// Add more as needed...

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

const cached = global.mongoose_cache;

/**
 * Connect to MongoDB with connection caching for serverless.
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
    const opts = {
      bufferCommands: false,
      dbName: 'GPTHellbot',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection error:', error);
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
