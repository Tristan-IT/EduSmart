import mongoose from "mongoose";
import UserModel from "../models/User.js";
import SchoolModel from "../models/School.js";

/**
 * Fill missing data in database
 */
async function fillMissingData() {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect("mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal");

    // Find SMK TI Bali Global school
    const school = await SchoolModel.findOne({ schoolId: "SCH-00001" });
    if (!school) {
      console.log("❌ School not found");
      return;
    }

    console.log(`📊 Filling missing data for: ${school.schoolName}`);

    // Get all students and teachers
    const students = await UserModel.find({ school: school._id, role: "student" });
    const teachers = await UserModel.find({ school: school._id, role: "teacher" });

    console.log(`👨‍🎓 Found ${students.length} students`);
    console.log(`👨‍🏫 Found ${teachers.length} teachers`);

    // Fill missing student data
    console.log("🎯 Filling student data...");
    let studentCounter = 1;
    for (const student of students) {
      let needsUpdate = false;

      // Generate studentId if missing
      if (!student.studentId) {
        const year = new Date().getFullYear();
        student.studentId = `${year}${studentCounter.toString().padStart(4, '0')}`;
        needsUpdate = true;
      }

      // Generate rollNumber if missing
      if (!student.rollNumber) {
        student.rollNumber = studentCounter;
        needsUpdate = true;
      }

      // Add student profile if missing
      if (!student.studentProfile) {
        student.studentProfile = {
          currentGrade: "SMK",
          currentClass: Math.floor(Math.random() * 3) + 10, // 10-12
          currentSemester: Math.random() > 0.5 ? 1 : 2,
          major: ["PPLG", "TJKT", "DKV", "BD"][Math.floor(Math.random() * 4)],
          onboardingComplete: Math.random() > 0.3, // 70% complete
        };
        needsUpdate = true;
      }

      // Add gamification data if missing
      if (!student.level || student.level === 1) {
        student.level = Math.floor(Math.random() * 10) + 1; // 1-10
        student.xp = (student.level - 1) * 200 + Math.floor(Math.random() * 200); // XP based on level
        student.weeklyXP = Math.floor(Math.random() * 500);
        student.gems = Math.floor(Math.random() * 100);
        student.hearts = Math.floor(Math.random() * 5) + 5;
        student.streak = Math.floor(Math.random() * 10);
        student.bestStreak = Math.max(student.streak, Math.floor(Math.random() * 20));
        student.league = ["bronze", "silver", "gold", "platinum"][Math.floor(Math.random() * 4)];
        needsUpdate = true;
      }

      // Add settings if missing
      if (!student.settings) {
        student.settings = {
          notifications: {
            emailNotifications: true,
            assignmentReminders: true,
            gradeUpdates: true,
            teacherMessages: true,
            parentNotifications: true,
            examSchedule: true,
            weeklyDigest: false,
            studentProgress: true,
            classUpdates: true,
            assignmentSubmissions: true,
            systemAnnouncements: true,
          },
          learning: {
            studyReminders: true,
            dailyGoalMinutes: 60,
            difficultyPreference: "adaptive",
            learningMode: "mixed",
            showHints: true,
          },
          academic: {
            defaultGradingSystem: "100",
            autoGrade: false,
            latePenalty: "10",
            maxRetakes: "2",
          },
          privacy: {
            parentAccessLevel: "full",
            profileVisibility: "school",
            allowPeerConnections: true,
            showOnlineStatus: true,
            showEmail: false,
            showPhone: false,
            allowMessages: true,
          },
          sound: {
            enabled: true,
            volume: 0.5,
          },
        };
        needsUpdate = true;
      }

      if (needsUpdate) {
        await student.save();
      }

      studentCounter++;
    }

    // Fill missing teacher data
    console.log("👨‍🏫 Filling teacher data...");
    let teacherCounter = 1;
    for (const teacher of teachers) {
      let needsUpdate = false;

      // Add teacher profile if missing
      if (!teacher.teacherProfile) {
        teacher.teacherProfile = {
          employeeId: `PGW${new Date().getFullYear()}${teacherCounter.toString().padStart(3, '0')}`,
          subjects: ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fisika", "Kimia", "Biologi", "Sejarah", "Geografi"].slice(0, Math.floor(Math.random() * 3) + 1),
          subjectRefs: [], // Will be populated later
          classes: [], // Will be populated later
          classIds: [],
          yearsOfExperience: Math.floor(Math.random() * 20) + 1,
          qualification: ["S1", "S2", "S3"][Math.floor(Math.random() * 3)],
          specialization: ["Matematika", "Bahasa", "IPA", "IPS"][Math.floor(Math.random() * 4)],
          bio: `Pengajar berpengalaman dengan ${teacher.teacherProfile?.yearsOfExperience || 5} tahun pengalaman mengajar.`,
        };
        needsUpdate = true;
      }

      // Add gamification data if missing
      if (!teacher.level || teacher.level === 1) {
        teacher.level = Math.floor(Math.random() * 15) + 5; // 5-20
        teacher.xp = (teacher.level - 1) * 200 + Math.floor(Math.random() * 200);
        teacher.weeklyXP = Math.floor(Math.random() * 300);
        teacher.gems = Math.floor(Math.random() * 200);
        teacher.hearts = Math.floor(Math.random() * 3) + 7;
        teacher.streak = Math.floor(Math.random() * 15);
        teacher.bestStreak = Math.max(teacher.streak, Math.floor(Math.random() * 30));
        teacher.league = ["silver", "gold", "platinum", "diamond"][Math.floor(Math.random() * 4)];
        needsUpdate = true;
      }

      // Add settings if missing
      if (!teacher.settings) {
        teacher.settings = {
          notifications: {
            emailNotifications: true,
            assignmentReminders: true,
            gradeUpdates: true,
            teacherMessages: true,
            parentNotifications: false,
            examSchedule: true,
            weeklyDigest: true,
            studentProgress: true,
            classUpdates: true,
            assignmentSubmissions: true,
            systemAnnouncements: true,
          },
          learning: {
            studyReminders: false,
            dailyGoalMinutes: 30,
            difficultyPreference: "standard",
            learningMode: "structured",
            showHints: false,
          },
          academic: {
            defaultGradingSystem: "100",
            autoGrade: true,
            latePenalty: "5",
            maxRetakes: "3",
          },
          privacy: {
            parentAccessLevel: "limited",
            profileVisibility: "school",
            allowPeerConnections: true,
            showOnlineStatus: true,
            showEmail: true,
            showPhone: true,
            allowMessages: true,
          },
          sound: {
            enabled: true,
            volume: 0.7,
          },
        };
        needsUpdate = true;
      }

      if (needsUpdate) {
        await teacher.save();
      }

      teacherCounter++;
    }

    // Update school totals
    console.log("🏫 Updating school totals...");
    const totalStudents = await UserModel.countDocuments({ school: school._id, role: "student" });
    const totalTeachers = await UserModel.countDocuments({ school: school._id, role: "teacher" });

    await SchoolModel.findByIdAndUpdate(school._id, {
      totalStudents,
      totalTeachers,
    });

    console.log("✅ Data filling completed!");
    console.log("📊 Summary:");
    console.log(`   - ${students.length} students updated`);
    console.log(`   - ${teachers.length} teachers updated`);
    console.log(`   - School totals updated`);

  } catch (error) {
    console.error("❌ Error filling missing data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
fillMissingData();