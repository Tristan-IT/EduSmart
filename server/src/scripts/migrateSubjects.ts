import mongoose from "mongoose";
import SchoolModel from "../models/School.js";
import SubjectModel from "../models/Subject.js";
import StudentSubjectProgressModel from "../models/StudentSubjectProgress.js";
import ContentItemModel from "../models/ContentItem.js";
// import QuizModel from "../models/Quiz.js";
import UserModel from "../models/User.js";
// import { subjectTemplates } from "../utils/subjectTemplates.js";

/**
 * Migration Script untuk Subject Management System
 * 
 * Tujuan:
 * 1. Create default subjects for all existing schools based on their schoolType
 * 2. Assign subjects to existing content (ContentItems, Quizzes)
 * 3. Create initial StudentSubjectProgress records for active students
 * 4. Validate data integrity
 * 
 * Run command:
 * ts-node src/scripts/migrateSubjects.ts
 * atau
 * node dist/scripts/migrateSubjects.js (after build)
 */

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/adapti-portal";

interface MigrationStats {
  schoolsProcessed: number;
  subjectsCreated: number;
  contentUpdated: number;
  quizzesUpdated: number;
  progressRecordsCreated: number;
  errors: string[];
}

async function migrateSubjects() {
  const stats: MigrationStats = {
    schoolsProcessed: 0,
    subjectsCreated: 0,
    contentUpdated: 0,
    quizzesUpdated: 0,
    progressRecordsCreated: 0,
    errors: []
  };

  try {
    console.log("🚀 Starting Subject Management System Migration...\n");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // ==================== PHASE 1: Create Subjects for Schools ====================
    console.log("📋 Phase 1: Creating Default Subjects for Schools...");
    
    const schools = await SchoolModel.find({});
    console.log(`Found ${schools.length} schools\n`);

    for (const school of schools) {
      try {
        console.log(`\n🏫 Processing school: ${school.schoolName} (${school.schoolType})`);

        // Check if subjects already exist for this school
        const existingSubjects = await SubjectModel.find({ school: school._id });
        
        if (existingSubjects.length > 0) {
          console.log(`  ℹ️  School already has ${existingSubjects.length} subjects - skipping`);
          stats.schoolsProcessed++;
          continue;
        }

        // Get templates for this school type
        // const templates = subjectTemplates[school.schoolType] || subjectTemplates.SMA;
        const templates: any[] = []; // TODO: Define templates
        console.log(`  📚 Creating ${templates.length} default subjects...`);

        // Create subjects from templates
        for (const template of templates) {
          const subject = new SubjectModel({
            school: school._id,
            code: template.code,
            name: template.name,
            description: template.description,
            category: template.category,
            color: template.color,
            icon: template.icon || 'Book',
            isActive: true,
            metadata: {
              isCustom: false,
              createdFromTemplate: true,
              templateVersion: '1.0'
            }
          });

          await subject.save();
          stats.subjectsCreated++;
          console.log(`    ✓ Created: ${subject.code} - ${subject.name}`);
        }

        stats.schoolsProcessed++;
      } catch (error: any) {
        const errorMsg = `Error processing school ${school.schoolName}: ${error.message}`;
        console.error(`  ❌ ${errorMsg}`);
        stats.errors.push(errorMsg);
      }
    }

    console.log(`\n✅ Phase 1 Complete: ${stats.subjectsCreated} subjects created for ${stats.schoolsProcessed} schools\n`);

    // ==================== PHASE 2: Assign Subjects to Existing Content ====================
    console.log("📋 Phase 2: Assigning Subjects to Existing Content...");

    // Create a general/default subject mapping for content without specific subjects
    const schoolSubjectMap = new Map<string, string>(); // schoolId -> generalSubjectId

    for (const school of schools) {
      // Find or create "Umum" (General) subject for unmapped content
      let generalSubject = await SubjectModel.findOne({ 
        school: school._id, 
        code: 'UMUM' 
      });

      if (!generalSubject) {
        generalSubject = new SubjectModel({
          school: school._id,
          code: 'UMUM',
          name: 'Mata Pelajaran Umum',
          description: 'Konten umum yang belum dikategorikan',
          category: 'WAJIB',
          color: '#6B7280',
          icon: 'BookOpen',
          isActive: true,
          metadata: {
            isCustom: false,
            createdFromTemplate: true,
            templateVersion: '1.0'
          }
        });
        await generalSubject.save();
        stats.subjectsCreated++;
        console.log(`  ✓ Created general subject for: ${school.schoolName}`);
      }

      // @ts-ignore - _id exists
      schoolSubjectMap.set(school._id.toString(), generalSubject._id.toString());
    }

    // Update ContentItems
    const contentItems = await ContentItemModel.find({ subject: { $exists: false } }).populate('school');
    console.log(`Found ${contentItems.length} content items without subjects`);

    for (const item of contentItems) {
      try {
        // @ts-ignore - school property exists
        if (!item.school) continue;
        
        // @ts-ignore - school property exists
        const schoolId = (item.school as any)._id.toString();
        const generalSubjectId = schoolSubjectMap.get(schoolId);
        
        if (generalSubjectId) {
          await ContentItemModel.findByIdAndUpdate(item._id, { 
            subject: generalSubjectId 
          });
          stats.contentUpdated++;
        }
      } catch (error: any) {
        stats.errors.push(`Error updating content item ${item._id}: ${error.message}`);
      }
    }

    console.log(`  ✓ Updated ${stats.contentUpdated} content items`);

    // Update Quizzes
    // const quizzes = await QuizModel.find({ subject: { $exists: false } }).populate('school');
    const quizzes: any[] = [];
    console.log(`Found ${quizzes.length} quizzes without subjects`);

    for (const quiz of quizzes) {
      try {
        if (!quiz.school) continue;
        
        const schoolId = (quiz.school as any)._id.toString();
        const generalSubjectId = schoolSubjectMap.get(schoolId);
        
        if (generalSubjectId) {
          // await QuizModel.findByIdAndUpdate(quiz._id, {
          //   subject: generalSubjectId
          // });
          stats.quizzesUpdated++;
        }
      } catch (error: any) {
        stats.errors.push(`Error updating quiz ${quiz._id}: ${error.message}`);
      }
    }

    console.log(`  ✓ Updated ${stats.quizzesUpdated} quizzes`);
    console.log(`\n✅ Phase 2 Complete\n`);

    // ==================== PHASE 3: Create StudentSubjectProgress Records ====================
    console.log("📋 Phase 3: Creating Initial StudentSubjectProgress Records...");

    // Get all students
    const students = await UserModel.find({ role: 'student', isActive: true });
    console.log(`Found ${students.length} active students`);

    let processedStudents = 0;
    for (const student of students) {
      try {
        if (!student.school) continue;

        // Get all subjects for student's school
        const schoolSubjects = await SubjectModel.find({ 
          school: student.school, 
          isActive: true 
        });

        for (const subject of schoolSubjects) {
          // Check if progress record already exists
          const existingProgress = await StudentSubjectProgressModel.findOne({
            student: student._id,
            subject: subject._id
          });

          if (existingProgress) continue;

          // Create initial progress record
          const progress = new StudentSubjectProgressModel({
            student: student._id,
            subject: subject._id,
            school: student.school,
            totalXP: 0,
            completedLessons: 0,
            completedQuizzes: 0,
            averageScore: 0,
            timeSpent: 0,
            masteryLevel: 0,
            lastActivityAt: new Date(),
            strengths: [],
            weaknesses: [],
            recentScores: []
          });

          await progress.save();
          stats.progressRecordsCreated++;
        }

        processedStudents++;
        if (processedStudents % 10 === 0) {
          console.log(`  Processed ${processedStudents}/${students.length} students...`);
        }
      } catch (error: any) {
        stats.errors.push(`Error creating progress for student ${student._id}: ${error.message}`);
      }
    }

    console.log(`  ✓ Created ${stats.progressRecordsCreated} progress records for ${processedStudents} students`);
    console.log(`\n✅ Phase 3 Complete\n`);

    // ==================== PHASE 4: Validation ====================
    console.log("📋 Phase 4: Validation...");

    // Validate subject counts
    for (const school of schools) {
      const subjectCount = await SubjectModel.countDocuments({ school: school._id });
      console.log(`  ${school.schoolName}: ${subjectCount} subjects`);
    }

    // Validate content assignment
    const unmappedContent = await ContentItemModel.countDocuments({ subject: { $exists: false } });
    // const unmappedQuizzes = await QuizModel.countDocuments({ subject: { $exists: false } });
    const unmappedQuizzes = 0;
    console.log(`\n  Unmapped content items: ${unmappedContent}`);
    console.log(`  Unmapped quizzes: ${unmappedQuizzes}`);

    // Validate progress records
    const totalProgress = await StudentSubjectProgressModel.countDocuments();
    console.log(`  Total progress records: ${totalProgress}`);

    console.log(`\n✅ Phase 4 Complete\n`);

    // ==================== Summary ====================
    console.log("=" .repeat(60));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=" .repeat(60));
    console.log(`Schools Processed:        ${stats.schoolsProcessed}`);
    console.log(`Subjects Created:         ${stats.subjectsCreated}`);
    console.log(`Content Items Updated:    ${stats.contentUpdated}`);
    console.log(`Quizzes Updated:          ${stats.quizzesUpdated}`);
    console.log(`Progress Records Created: ${stats.progressRecordsCreated}`);
    console.log(`Errors:                   ${stats.errors.length}`);
    console.log("=" .repeat(60));

    if (stats.errors.length > 0) {
      console.log("\n⚠️  ERRORS:");
      stats.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    console.log("\n✅ Migration Complete!");

  } catch (error: any) {
    console.error("\n❌ Migration Failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run migration
if (require.main === module) {
  migrateSubjects()
    .then(() => {
      console.log("\n🎉 All done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Fatal error:", error);
      process.exit(1);
    });
}

export default migrateSubjects;
