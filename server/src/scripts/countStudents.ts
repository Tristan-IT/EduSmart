import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/User.js';

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

async function countStudents() {
  const totalStudents = await UserModel.countDocuments({ role: 'student' });
  console.log('Total students:', totalStudents);

  const gradeCounts = await UserModel.aggregate([
    { $match: { role: 'student' } },
    { $group: { _id: '$studentProfile.currentClass', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  console.log('Students by grade:');
  gradeCounts.forEach(item => {
    console.log(`  Grade ${item._id}: ${item.count} students`);
  });
}

async function main() {
  await connectDB();
  await countStudents();
  await mongoose.disconnect();
  console.log('✓ Disconnected from MongoDB\n');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});