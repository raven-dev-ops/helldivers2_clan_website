// src/lib/mongoClientPromise.ts
import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromiseForAuth: Promise<MongoClient> | undefined;
}

export default function getMongoClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromiseForAuth) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('Missing MONGODB_URI');
    }
    const client = new MongoClient(MONGODB_URI);
    global._mongoClientPromiseForAuth = client.connect();
  }
  return global._mongoClientPromiseForAuth;
}
