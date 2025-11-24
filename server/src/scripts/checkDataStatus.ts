import mongoose from "mongoose";
import SchoolModel from "../models/School.js";
import UserModel from "../models/User.js";
import TeacherAnalyticsModel from "../models/TeacherAnalytics.js";
import SchoolAnalyticsModel from "../models/SchoolAnalytics.js";
import StudentProfileModel from "../models/StudentProfile.js";

/**
 * Check current data status in database
 */
async function checkDataStatus() {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect("mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal");

    // Find SMK TI Bali Global school
    const school = await SchoolModel.findOne({ schoolId: "SCH-00001" });
    if (!school) {
      console.log("❌ School not found");
      return;
    }

    console.log(`📊 Checking data for: ${school.schoolName}`);

    // Count teachers and students
    const teachers = await UserModel.find({ school: school._id, role: "teacher" });
    const students = await UserModel.find({ school: school._id, role: "student" });

    console.log(`👨‍🏫 Teachers: ${teachers.length}`);
    console.log(`👨‍🎓 Students: ${students.length}`);

    // Check analytics data
    const teacherAnalytics = await TeacherAnalyticsModel.find({ school: school._id });
    const schoolAnalytics = await SchoolAnalyticsModel.find({ school: school._id });
    const studentProfiles = await StudentProfileModel.find({});

    console.log(`📈 Teacher Analytics: ${teacherAnalytics.length} records`);
    console.log(`🏫 School Analytics: ${schoolAnalytics.length} records`);
    console.log(`🎯 Student Profiles: ${studentProfiles.length} records`);

    // Check recent analytics (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTeacherAnalytics = await TeacherAnalyticsModel.find({
      school: school._id,
      date: { $gte: sevenDaysAgo }
    });
    const recentSchoolAnalytics = await SchoolAnalyticsModel.find({
      school: school._id,
      date: { $gte: sevenDaysAgo }
    });

    console.log(`📈 Recent Teacher Analytics (7 days): ${recentTeacherAnalytics.length} records`);
    console.log(`🏫 Recent School Analytics (7 days): ${recentSchoolAnalytics.length} records`);

    // Sample data check
    if (teacherAnalytics.length > 0) {
      console.log("\n📊 Sample Teacher Analytics:");
      console.log(JSON.stringify(teacherAnalytics[0], null, 2));
    }

    if (schoolAnalytics.length > 0) {
      console.log("\n🏫 Sample School Analytics:");
      console.log(JSON.stringify(schoolAnalytics[0], null, 2));
    }

    if (studentProfiles.length > 0) {
      console.log("\n🎯 Sample Student Profile:");
      console.log(JSON.stringify(studentProfiles[0], null, 2));
    }

  } catch (error) {
    console.error("❌ Error checking data status:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
checkDataStatus();