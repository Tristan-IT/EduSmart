import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/User.js';
import SchoolModel from '../models/School.js';
import ClassModel from '../models/Class.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/adapti_portal';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

async function clearAllData() {
  console.log('🗑️  Clearing ALL existing data...');

  try {
    await UserModel.deleteMany({});
    await SchoolModel.deleteMany({});
    await ClassModel.deleteMany({});
    console.log('✓ All data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

async function main() {
  await connectDB();
  await clearAllData();
  await mongoose.disconnect();
  console.log('✓ Disconnected from MongoDB\n');
}

main().catch((error) => {
  console.error('❌ Clearing failed:', error);
  process.exit(1);
});