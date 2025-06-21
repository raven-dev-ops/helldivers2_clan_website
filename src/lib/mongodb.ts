// src/lib/mongoClientPromise.ts
import { MongoClient } from 'mongodb';

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromiseForAuth: Promise<MongoClient> | undefined;
}

const options = {}; // Add any MongoClient options here if needed

/**
 * Returns a promise that resolves to a connected MongoClient.
 * Only throws if you actually try to connect without a URI.
 */
export function getMongoClientPromise(): Promise<MongoClient> {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromiseForAuth: Promise<MongoClient> | undefined;
    };
    if (!globalWithMongo._mongoClientPromiseForAuth) {
      client = new MongoClient(MONGODB_URI, options);
      globalWithMongo._mongoClientPromiseForAuth = client.connect();
      console.log("MongoDB Client: New connection created for NextAuth (Development).");
    }
    return globalWithMongo._mongoClientPromiseForAuth;
  } else {
    if (!clientPromise) {
      client = new MongoClient(MONGODB_URI, options);
      clientPromise = client.connect();
      console.log("MongoDB Client: New connection created for NextAuth (Production).");
    }
    return clientPromise;
  }
}
