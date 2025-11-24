import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ClassModel from '../models/Class.ts';
import SchoolModel from '../models/School.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adapti_portal');
}

async function ensureXIIClasses() {
  await connectDB();
  console.log('Connected to MongoDB');

  const schoolName = 'SMK TI Bali Global Badung';
  const school = await SchoolModel.findOne({ schoolName });
  if (!school) {
    console.error(`School not found: ${schoolName}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const schoolId = school._id;

  const xiiClasses = [
    { name: 'XII TJKT 1', grade: 12, section: '1', major: 'TJKT', maxStudents: 40 },
    { name: 'XII TJKT 2', grade: 12, section: '2', major: 'TJKT', maxStudents: 40 },
    { name: 'XII PPLG 1', grade: 12, section: '1', major: 'PPLG', maxStudents: 40 },
    { name: 'XII PPLG 2', grade: 12, section: '2', major: 'PPLG', maxStudents: 40 },
    { name: 'XII DKV', grade: 12, section: '1', major: 'DKV', maxStudents: 40 },
    { name: 'XII BD', grade: 12, section: '1', major: 'BD', maxStudents: 40 },
    { name: 'XII TJKT 3', grade: 12, section: '3', major: 'TJKT', maxStudents: 40 },
  ];

  const created: string[] = [];
  const existing: string[] = [];

  for (const cls of xiiClasses) {
    const existingClass = await ClassModel.findOne({ className: cls.name, school: schoolId });
    if (existingClass) {
      existing.push(cls.name);
      continue;
    }

    const classDoc = {
      classId: `SMK-${schoolId.toString().slice(-6)}-${cls.major}-${cls.grade}-${cls.section}`,
      className: cls.name,
      grade: cls.grade,
      section: cls.section,
      school: schoolId,
      schoolId: schoolId.toString(),
      schoolName: schoolName,
      schoolType: 'SMK',
      majorCode: cls.major,
      majorName: cls.major,
      displayName: `Kelas ${cls.name}`,
      shortName: cls.name,
      academicYear: school.academicYear || '2025/2026',
      maxStudents: cls.maxStudents,
      currentStudents: 0,
      subjectTeachers: [],
      isActive: true,
    };

    await ClassModel.create(classDoc as any);
    created.push(cls.name);
  }

  console.log('Existing XII classes (kept):', existing);
  console.log('Created XII classes:', created);

  await mongoose.disconnect();
  console.log('Disconnected');
}

ensureXIIClasses().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
