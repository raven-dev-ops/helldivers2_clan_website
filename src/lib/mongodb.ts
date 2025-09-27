// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required at runtime');
  }

  if (!client) {
    client = new MongoClient(uri);
  }

  if (!clientPromise) {
    clientPromise = client.connect();
  }

  return clientPromise;
}
