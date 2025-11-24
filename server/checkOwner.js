import mongoose from 'mongoose';
import User from './src/models/User.js';

async function checkOwner() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');
    const owner = await User.findOne({ email: 'kepala.sekolah@smktiglobal.sch.id' });
    console.log('School Owner:', {
      id: owner._id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      ownedSchool: owner.ownedSchool
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkOwner();