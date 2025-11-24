import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ClassModel from '../models/Class.ts';
import UserModel from '../models/User.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adapti_portal');
}

async function run() {
  await connectDB();
  console.log('Connected');

  const classes = await ClassModel.find({ grade: 12 }).lean();
  for (const cls of classes) {
    const count = await UserModel.countDocuments({ class: cls._id, role: 'student' });
    console.log(`${cls.className}: ${count} students (classId: ${cls._id.toString()})`);
  }

  await mongoose.disconnect();
  console.log('Disconnected');
}

run().catch(err => { console.error(err); process.exit(1); });
