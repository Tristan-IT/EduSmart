import mongoose from 'mongoose';
import UserModel from './src/models/User.js';

async function checkUsers() {
  await mongoose.connect('mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');

  const teachers = await UserModel.countDocuments({ role: 'teacher' });
  const students = await UserModel.countDocuments({ role: 'student' });
  console.log('Total teachers:', teachers, 'students:', students);

  const bySchool = await UserModel.aggregate([
    { $match: { role: { $in: ['teacher', 'student'] } } },
    { $group: { _id: '$school', count: { $sum: 1 } } }
  ]);

  console.log('By school:', bySchool);

  await mongoose.disconnect();
}

checkUsers().catch(console.error);