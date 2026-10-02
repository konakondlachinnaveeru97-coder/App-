import mongoose from 'mongoose';

// Fail fast instead of buffering queries forever when Mongo is down.
mongoose.set('bufferCommands', false);

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  return mongoose.connection;
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}
