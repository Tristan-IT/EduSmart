import mongoose from 'mongoose';
import UserModel from './src/models/User.js';
import SchoolModel from './src/models/School.js';
import ClassModel from './src/models/Class.js';
import SubjectModel from './src/models/Subject.js';
import TopicModel from './src/models/Topic.js';
import QuizQuestionModel from './src/models/QuizQuestion.js';
import UserProgressModel from './src/models/UserProgress.js';
import SkillTreeNodeModel from './src/models/SkillTreeNode.js';
import TeacherAnalyticsModel from './src/models/TeacherAnalytics.js';
import SchoolAnalyticsModel from './src/models/SchoolAnalytics.js';
import StudentProfileModel from './src/models/StudentProfile.js';

async function cleanDatabase() {
  await mongoose.connect('mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal');

  console.log('🗑️  Starting database cleanup...');

  // Delete all data in reverse dependency order
  const deleteOperations = [
    StudentProfileModel.deleteMany({}),
    TeacherAnalyticsModel.deleteMany({}),
    SchoolAnalyticsModel.deleteMany({}),
    UserProgressModel.deleteMany({}),
    SkillTreeNodeModel.deleteMany({}),
    QuizQuestionModel.deleteMany({}),
    TopicModel.deleteMany({}),
    SubjectModel.deleteMany({}),
    ClassModel.deleteMany({}),
    UserModel.deleteMany({}),
    SchoolModel.deleteMany({}),
  ];

  const results = await Promise.all(deleteOperations);

  console.log('✅ Database cleanup completed:');
  results.forEach((result, index) => {
    const modelNames = [
      'StudentProfile',
      'TeacherAnalytics',
      'SchoolAnalytics',
      'UserProgress',
      'SkillTreeNode',
      'QuizQuestion',
      'Topic',
      'Subject',
      'Class',
      'User',
      'School'
    ];
    console.log(`  - ${modelNames[index]}: ${result.deletedCount} documents deleted`);
  });

  await mongoose.disconnect();
}

cleanDatabase().catch(console.error);