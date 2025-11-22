import { beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Use a test database
const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/adapti-test';

beforeAll(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
});

afterEach(async () => {
  // Clean up after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('Disconnected from test database');
});
