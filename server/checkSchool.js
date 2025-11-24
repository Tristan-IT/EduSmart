import mongoose from 'mongoose';
import School from './src/models/School.js';

async function checkSchool() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');
    const schools = await School.find({});
    console.log('Schools:', schools.map(s => ({ id: s._id, schoolId: s.schoolId, name: s.name })));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkSchool();