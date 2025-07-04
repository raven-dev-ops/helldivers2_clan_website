// src/lib/mongoClientPromise.ts
import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromiseForAuth: Promise<MongoClient> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {}; // Add MongoClient options if needed

let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromiseForAuth) {
  const client = new MongoClient(MONGODB_URI, options);
  global._mongoClientPromiseForAuth = client.connect();
  console.log('✅ MongoDB Client: New connection created for NextAuth.');
}

clientPromise = global._mongoClientPromiseForAuth;

export default clientPromise;
