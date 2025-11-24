/**
 * Script to fix existing teachers who registered with old buggy form
 * This will prompt for each teacher to select their subjects and classes
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function fixExistingTeachers() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/edusmart");
    console.log("✅ Connected to MongoDB\n");

    const UserModel = (await import("../models/User.js")).default;
    const SubjectModel = (await import("../models/Subject.js")).default;
    const ClassModel = (await import("../models/Class.js")).default;

    // Find all teachers with empty subjects or classes
    const teachers = await UserModel.find({
      role: "teacher",
      $or: [
        { "teacherProfile.subjectRefs": { $size: 0 } },
        { "teacherProfile.subjectRefs": { $exists: false } },
        { "teacherProfile.subjects": { $size: 0 } },
        { "teacherProfile.subjects": { $exists: false } },
      ],
    }).populate("school");

    console.log(`📊 Found ${teachers.length} teachers with missing subject/class data\n`);

    if (teachers.length === 0) {
      console.log("✅ All teachers have complete data!");
      process.exit(0);
    }

    for (const teacher of teachers) {
      console.log("\n" + "=".repeat(60));
      console.log(`👨‍🏫 Teacher: ${teacher.name}`);
      console.log(`📧 Email: ${teacher.email}`);
      console.log(`🏫 School: ${(teacher.school as any)?.schoolName || "N/A"}`);
      console.log("=".repeat(60));

      // Get subjects for this school
      const subjects = await SubjectModel.find({
        school: teacher.school,
        isActive: true,
      }).sort({ name: 1 });

      if (subjects.length === 0) {
        console.log("⚠️  No subjects found for this school. Skipping...");
        continue;
      }

      console.log("\n📚 Available Subjects:");
      subjects.forEach((subject, index) => {
        console.log(`  ${index + 1}. ${subject.name} (${subject.code || "N/A"})`);
      });

      const subjectInput = await question(
        "\nEnter subject numbers (comma-separated, e.g., 1,3,5): "
      );

      const subjectIndexes = subjectInput
        .split(",")
        .map((s) => parseInt(s.trim()) - 1)
        .filter((i) => i >= 0 && i < subjects.length);

      const selectedSubjects = subjectIndexes.map((i) => subjects[i]);

      // Get classes for this school
      const classes = await ClassModel.find({
        school: teacher.school,
        isActive: true,
      }).sort({ className: 1 });

      if (classes.length === 0) {
        console.log("⚠️  No classes found for this school. Skipping...");
        continue;
      }

      console.log("\n🏛️  Available Classes:");
      classes.forEach((cls, index) => {
        console.log(
          `  ${index + 1}. ${cls.className} (${cls.grade || "N/A"}) - ${cls.classId}`
        );
      });

      const classInput = await question(
        "\nEnter class numbers (comma-separated, e.g., 1,2): "
      );

      const classIndexes = classInput
        .split(",")
        .map((s) => parseInt(s.trim()) - 1)
        .filter((i) => i >= 0 && i < classes.length);

      const selectedClasses = classIndexes.map((i) => classes[i]);

      // Update teacher
      const profile = teacher.teacherProfile || {
        subjects: [],
        subjectRefs: [],
        classes: [],
        classIds: []
      };
      profile.subjects = selectedSubjects.map((s) => s.name);
      profile.subjectRefs = selectedSubjects.map((s) => s._id) as any[];
      profile.classes = selectedClasses.map((c) => c._id) as any[];
      profile.classIds = selectedClasses.map((c) => c.classId);
      teacher.teacherProfile = profile as any;

      await teacher.save();

      console.log("\n✅ Updated successfully!");
      console.log(
        `   Subjects: ${teacher.teacherProfile?.subjects?.join(", ") || ''}`
      );
      console.log(
        `   Classes: ${selectedClasses.map((c) => c.className).join(", ")}`
      );
    }

    console.log("\n\n🎉 All teachers updated successfully!");
    console.log("💡 You can now check the school owner dashboard to see the data.");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    rl.close();
    process.exit(1);
  }
}

fixExistingTeachers();
