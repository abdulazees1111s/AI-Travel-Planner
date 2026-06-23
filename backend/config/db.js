import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer;

const connectLocalMemoryDB = async () => {
  if (!mongoMemoryServer) {
    mongoMemoryServer = await MongoMemoryServer.create();
  }
  const mongoUri = mongoMemoryServer.getUri();
  const conn = await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`✓ MongoDB Memory Server Connected: ${conn.connection.host}`);
  return conn;
};

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`⚠️ Failed to connect using MONGO_URI (${error.message}). Falling back to in-memory MongoDB.`);
    }
  } else {
    console.warn('⚠️ MONGO_URI not set. Starting in-memory MongoDB instance.');
  }

  try {
    return await connectLocalMemoryDB();
  } catch (memoryError) {
    console.error(`✗ Error connecting to in-memory MongoDB: ${memoryError.message}`);
    process.exit(1);
  }
};
