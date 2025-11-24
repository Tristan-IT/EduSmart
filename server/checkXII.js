import mongoose from 'mongoose';
import { UserModel } from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function checkXIIStudents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const classes = ['XII TJKT 1', 'XII TJKT 2', 'XII TJKT 3', 'XII PPLG 1', 'XII PPLG 2', 'XII DKV', 'XII BD'];

    for (const className of classes) {
      const count = await UserModel.countDocuments({ role: 'student', className });
      console.log(className + ': ' + count + ' students');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkXIIStudents();