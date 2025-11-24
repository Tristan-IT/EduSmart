import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adapti_portal');
    console.log('✓ Connected to MongoDB');

    const schoolOwners = await UserModel.find({ role: 'school_owner' }).select('name email');
    console.log('School owners found:', schoolOwners.length);
    schoolOwners.forEach(owner => {
      console.log(`- ${owner.name}: ${owner.email}`);
    });

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();