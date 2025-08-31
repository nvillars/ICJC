import mongoose from 'mongoose'

// prefer explicit env var, otherwise default to local `icjc` database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/icjc'

if (!process.env.MONGODB_URI) {
  console.info('MONGODB_URI not set, defaulting to local mongodb://127.0.0.1:27017/icjc')
}

// Use a safe any-typed global cache to avoid TS7053 errors when indexing globalThis
const _g: any = globalThis as any
if (!_g.__mongooseCache) {
  _g.__mongooseCache = { conn: null as any, promise: null as any }
}

const cached = _g.__mongooseCache

export async function connect() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: undefined }).then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}
