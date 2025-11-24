import mongoose from 'mongoose';
import School from './src/models/School.js';
import User from './src/models/User.js';

async function attachOwnerToSchool() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');

    // Find the school owner
    const schoolOwner = await User.findOne({ email: 'kepala.sekolah@smktiglobal.sch.id', role: 'school_owner' });
    if (!schoolOwner) {
      console.log('School owner not found');
      return;
    }

    // Find the school
    const school = await School.findOne({ schoolId: 'SCH-00001' });
    if (!school) {
      console.log('School not found');
      return;
    }

    // Update both user and school
    schoolOwner.ownedSchool = school._id;
    await schoolOwner.save();

    school.owner = schoolOwner._id;
    school.ownerName = schoolOwner.name;
    school.ownerEmail = schoolOwner.email;
    await school.save();

    console.log('School owner attached to school successfully');
    console.log('School Owner:', { id: schoolOwner._id, name: schoolOwner.name, email: schoolOwner.email });
    console.log('School:', { id: school._id, schoolId: school.schoolId, name: school.schoolName });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

attachOwnerToSchool();