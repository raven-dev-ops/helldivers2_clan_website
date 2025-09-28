// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

type MongoGlobal = typeof globalThis & {
  _mongo?: { client?: MongoClient; promise?: Promise<MongoClient> };
};

const g = globalThis as MongoGlobal;
g._mongo ??= {};

/** Preferred lazy getter */
export async function getMongoClient(): Promise<MongoClient> {
  if (g._mongo!.client) return g._mongo!.client;

  if (!g._mongo!.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing: set it in Heroku config vars');
    g._mongo!.promise = MongoClient.connect(uri);
  }

  g._mongo!.client = await g._mongo!.promise!;
  return g._mongo!.client!;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  return getMongoClient();
}
