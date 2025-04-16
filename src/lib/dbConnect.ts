// src/lib/dbConnect.ts

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: Promise<typeof mongoose> | undefined;
}

let cached = global.mongooseConn;
if (!cached) {
  cached = mongoose
    .connect(MONGODB_URI)
    .then((db) => {
      console.log("Connected to MongoDB");
      return db;
    })
    .catch((err: Error) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });

  global.mongooseConn = cached;
}

/**
 * Call this in a route or server function
 * to ensure a single DB connection is used.
 */
export default async function dbConnect() {
  return cached;
}
