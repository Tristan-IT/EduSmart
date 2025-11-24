import mongoose from "mongoose";
import SchoolModel from "../models/School.js";
import UserModel from "../models/User.js";
import ClassModel from "../models/Class.js";
import TeacherAnalyticsModel from "../models/TeacherAnalytics.js";
import SchoolAnalyticsModel from "../models/SchoolAnalytics.js";
import StudentProfileModel from "../models/StudentProfile.js";

/**
 * Generate analytics data for school dashboard
 * This script generates realistic analytics data for testing the dashboard
 */

async function generateAnalyticsData() {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect("mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal");

    // Find SMK TI Bali Global school
    const school = await SchoolModel.findOne({ schoolId: "SCH-00001" });
    if (!school) {
      console.log("❌ School not found");
      return;
    }

    console.log(`📊 Generating analytics data for: ${school.schoolName}`);

    // Get all teachers and students
    const teachers = await UserModel.find({ school: school._id, role: "teacher" });
    const students = await UserModel.find({ school: school._id, role: "student" });

    console.log(`👨‍🏫 Found ${teachers.length} teachers`);
    console.log(`👨‍🎓 Found ${students.length} students`);

    // Generate teacher analytics for the last 30 days
    console.log("📈 Generating teacher analytics...");
    for (const teacher of teachers) {
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Check if analytics already exists
        const existing = await TeacherAnalyticsModel.findOne({
          teacher: teacher._id,
          date: {
            $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
          }
        });

        if (!existing) {
          const analytics = new TeacherAnalyticsModel({
            teacher: teacher._id,
            teacherId: teacher._id.toString(),
            teacherName: teacher.name,
            school: school._id,
            schoolId: school.schoolId,
            date,
            lessonsPlanned: Math.floor(Math.random() * 5) + 1,
            lessonsCompleted: Math.floor(Math.random() * 4) + 1,
            quizzesCreated: Math.floor(Math.random() * 3),
            assignmentsCreated: Math.floor(Math.random() * 2),
            videosUploaded: Math.floor(Math.random() * 2),
            studentEngagementRate: Math.floor(Math.random() * 30) + 70, // 70-100%
            assignmentsGiven: Math.floor(Math.random() * 3),
            assignmentsGraded: Math.floor(Math.random() * 2),
            studentsActive: Math.floor(Math.random() * 25) + 10,
            studentsAbsent: Math.floor(Math.random() * 5),
            averageAttendance: Math.floor(Math.random() * 20) + 80,
            exercisesCreated: Math.floor(Math.random() * 2),
            modulesCreated: Math.floor(Math.random() * 1),
            chatMessagesWithStudents: Math.floor(Math.random() * 10),
            feedbackGiven: Math.floor(Math.random() * 5),
            questionsAnswered: Math.floor(Math.random() * 8),
            averageQuizScore: Math.floor(Math.random() * 20) + 75,
            averageStudentXP: Math.floor(Math.random() * 500) + 800,
          });
          await analytics.save();
        }
      }
    }

    // Generate student profiles with realistic data
    console.log("🎯 Generating student profiles...");
    for (const student of students) {
      let profile = await StudentProfileModel.findOne({ user: student._id });

      if (!profile) {
        // Generate realistic XP and level based on student data
        const baseXP = Math.floor(Math.random() * 2000) + 500; // 500-2500 XP
        const level = Math.floor(baseXP / 200) + 1; // Level based on XP

        profile = new StudentProfileModel({
          user: student._id,
          xp: baseXP,
          level: Math.min(level, 15), // Max level 15
          completedLessons: Math.floor(Math.random() * 45) + 15, // 15-60 lessons
          totalLessons: 60, // Assume 60 lessons total
          totalQuizzes: Math.floor(Math.random() * 20) + 10, // 10-30 quizzes
          averageScore: Math.floor(Math.random() * 25) + 75, // 75-100%
          streakDays: Math.floor(Math.random() * 10), // 0-10 day streak
          lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
        });
        await profile.save();
      }
    }

    // Generate school analytics for the last 30 days
    console.log("🏫 Generating school analytics...");
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Check if analytics already exists
      const existing = await SchoolAnalyticsModel.findOne({
        school: school._id,
        date: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        }
      });

      if (!existing) {
        const analytics = new SchoolAnalyticsModel({
          school: school._id,
          schoolId: school.schoolId,
          date,
          totalTeachers: teachers.length,
          totalStudents: students.length,
          totalClasses: school.totalClasses,
          activeTeachers: Math.floor(Math.random() * 5) + teachers.length - 2,
          activeStudents: Math.floor(Math.random() * 50) + students.length - 20,
          totalLessons: Math.floor(Math.random() * 20) + 10,
          totalQuizzes: Math.floor(Math.random() * 15) + 5,
          totalAssignments: Math.floor(Math.random() * 10) + 3,
          averageStudentXP: Math.floor(Math.random() * 500) + 1000,
          averageStudentLevel: Math.floor(Math.random() * 3) + 4,
          averageClassAttendance: Math.floor(Math.random() * 20) + 80,
          totalStudentLogins: Math.floor(Math.random() * 100) + 50,
          totalVideos: Math.floor(Math.random() * 5) + 2,
          totalExercises: Math.floor(Math.random() * 8) + 3,
          totalModules: Math.floor(Math.random() * 3) + 1,
          totalAchievementsUnlocked: Math.floor(Math.random() * 20) + 5,
          averageQuizScore: Math.floor(Math.random() * 20) + 75,
          totalQuizzesTaken: Math.floor(Math.random() * 50) + 20,
          totalQuizzesGraded: Math.floor(Math.random() * 40) + 15,
        });
        await analytics.save();
      }
    }

    // Update some students with recent activity (last login)
    console.log("🔄 Updating student activity...");
    const recentStudents = students.slice(0, Math.floor(students.length * 0.7)); // 70% active recently
    for (const student of recentStudents) {
      const lastLogin = new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000); // Last 3 days
      await UserModel.findByIdAndUpdate(student._id, { lastLogin });
    }

    // Update some students with studentId if missing
    console.log("🆔 Generating student IDs...");
    let studentCounter = 1;
    for (const student of students) {
      if (!student.studentId) {
        const year = new Date().getFullYear();
        const studentId = `${year}${studentCounter.toString().padStart(3, '0')}`;
        await UserModel.findByIdAndUpdate(student._id, { studentId });
        studentCounter++;
      }
    }

    console.log("✅ Analytics data generation completed!");
    console.log("📊 Summary:");
    console.log(`   - ${teachers.length} teachers with 30 days of analytics`);
    console.log(`   - ${students.length} students with profiles and activity`);
    console.log(`   - 30 days of school-wide analytics`);
    console.log(`   - Recent activity data for active users`);

  } catch (error) {
    console.error("❌ Error generating analytics data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
generateAnalyticsData();