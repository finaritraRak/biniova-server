// lib/db.js
const mongoose = require('mongoose');

let cached = global._mongoose; // simple cache to avoid multiple connections in dev
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI not set, skipping DB connect');
    return null;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // other mongoose options
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then(m => {
      return m;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connect };
