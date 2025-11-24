import mongoose from 'mongoose';
import UserModel from './src/models/User.js';

async function findSchoolOwner() {
  try {
    await mongoose.connect('mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');

    const owner = await UserModel.findOne({ role: 'school_owner' });
    if (owner) {
      console.log('School Owner found:');
      console.log('Email:', owner.email);
      console.log('Name:', owner.name);
      console.log('School ID:', owner.schoolId || owner.school);
    } else {
      console.log('No school owner found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findSchoolOwner();