// src/lib/mongoClientPromise.ts
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromiseForAuth: Promise<MongoClient> | undefined;
}

const options = {}; // Add any MongoClient options here if needed

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromiseForAuth: Promise<MongoClient> | undefined
  }

  if (!globalWithMongo._mongoClientPromiseForAuth) {
    client = new MongoClient(MONGODB_URI, options)
    globalWithMongo._mongoClientPromiseForAuth = client.connect()
    console.log("MongoDB Client: New connection created for NextAuth (Development).");
  }
  clientPromise = globalWithMongo._mongoClientPromiseForAuth
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options)
  clientPromise = client.connect()
   console.log("MongoDB Client: New connection created for NextAuth (Production).");
}

// Export the promise resolving to the MongoClient
export default clientPromise