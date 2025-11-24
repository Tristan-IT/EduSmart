import mongoose from 'mongoose';
import UserModel from './src/models/User.js';
import ClassModel from './src/models/Class.js';
import SchoolModel from './src/models/School.js';

async function fixAssociations() {
  await mongoose.connect('mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');

  const correctSchoolId = '6923c68763ab766d1a5c0a81';

  // Update users
  const userResult = await UserModel.updateMany(
    { role: { $in: ['teacher', 'student'] } },
    { school: correctSchoolId }
  );
  console.log('Updated users:', userResult.modifiedCount);

  // Update classes
  const classResult = await ClassModel.updateMany(
    {},
    { school: correctSchoolId }
  );
  console.log('Updated classes:', classResult.modifiedCount);

  // Update school stats
  const teacherCount = await UserModel.countDocuments({ role: 'teacher', school: correctSchoolId });
  const studentCount = await UserModel.countDocuments({ role: 'student', school: correctSchoolId });
  const classCount = await ClassModel.countDocuments({ school: correctSchoolId });

  await SchoolModel.findByIdAndUpdate(correctSchoolId, {
    totalTeachers: teacherCount,
    totalStudents: studentCount,
    totalClasses: classCount
  });

  console.log('Updated school stats:', { teacherCount, studentCount, classCount });

  await mongoose.disconnect();
}

fixAssociations().catch(console.error);