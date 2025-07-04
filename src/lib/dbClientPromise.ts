// src/lib/dbClientPromise.ts
import { MongoClient } from "mongodb";

declare global {
  // Allow global to have _mongoClientPromise for serverless reuse.
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In dev, use global to preserve across HMR reloads.
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // ✅ In production, also use global for serverless to reuse connections.
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;
