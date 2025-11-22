import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import School from "../models/School";
import Class from "../models/Class";
import User from "../models/User";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/adapti-portal";

async function createQuickTestAccounts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if test accounts already exist
    const existingOwner = await User.findOne({ email: "owner@test.com" });
    if (existingOwner) {
      console.log("\n⚠️  Test accounts already exist. Use seedMultiTenant.ts to recreate.");
      await mongoose.connection.close();
      return;
    }

    console.log("\n🚀 Creating quick test accounts...");

    // Create school owner first
    const owner = await User.create({
      name: "Test School Owner",
      email: "owner@test.com",
      password: "test123",
      role: "school_owner",
    });

    // Create test school
    const school = await School.create({
      schoolId: `SCH-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`,
      schoolName: "Test School Academy",
      address: "Jl. Testing No. 123",
      city: "Jakarta",
      province: "DKI Jakarta",
      phone: "021-9999999",
      email: "admin@test.sch.id",
      totalClasses: 10,
      owner: owner._id,
      ownerName: owner.name,
      ownerEmail: owner.email,
    });

    // Update owner with schoolId
    owner.schoolId = school._id as string;
    await owner.save();

    // Create test class
    const testClass = await Class.create({
      classId: `CLS-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`,
      className: "Test Class A",
      grade: 10,
      section: "A",
      maxStudents: 30,
      currentStudents: 0,
      school: school._id,
      schoolId: school.schoolId,
      schoolName: school.schoolName,
      academicYear: "2024/2025",
      isActive: true,
      subjectTeachers: [],
    });

    // Create teacher
    const teacher = await User.create({
      name: "Test Teacher",
      email: "teacher@test.com",
      password: "test123",
      role: "teacher",
      schoolId: school._id,
      teacherProfile: {
        employeeId: "T999",
        subjects: ["Matematika", "Fisika"],
        qualification: "S1 Pendidikan Matematika",
      },
    });

    // Assign teacher to class
    testClass.homeRoomTeacher = teacher._id as mongoose.Types.ObjectId;
    testClass.homeRoomTeacherName = teacher.name;
    testClass.subjectTeachers.push({
      teacher: teacher._id as mongoose.Types.ObjectId,
      teacherName: teacher.name,
      subject: "Matematika",
    });
    testClass.subjectTeachers.push({
      teacher: teacher._id as mongoose.Types.ObjectId,
      teacherName: teacher.name,
      subject: "Fisika",
    });
    testClass.currentStudents = 1; // Will have 1 student
    await testClass.save();

    // Create student
    const student = await User.create({
      name: "Test Student",
      email: "student@test.com",
      password: "test123",
      role: "student",
      schoolId: school._id,
      classId: testClass._id,
      studentProfile: {
        rollNumber: "001",
        parentName: "Test Parent",
        parentPhone: "081234567890",
        parentEmail: "parent@test.com",
      },
    });

    // Print credentials
    console.log("\n" + "=".repeat(80));
    console.log("🔑 QUICK TEST ACCOUNTS CREATED");
    console.log("=".repeat(80));

    console.log("\n1. SCHOOL OWNER");
    console.log(`   Email    : owner@test.com`);
    console.log(`   Password : test123`);
    console.log(`   School ID: ${school.schoolId}`);

    console.log("\n2. TEACHER");
    console.log(`   Email    : teacher@test.com`);
    console.log(`   Password : test123`);
    console.log(`   School ID: ${school.schoolId}`);

    console.log("\n3. STUDENT");
    console.log(`   Email    : student@test.com`);
    console.log(`   Password : test123`);
    console.log(`   School ID: ${school.schoolId}`);
    console.log(`   Class ID : ${testClass.classId}`);

    console.log("\n" + "=".repeat(80));
    console.log("\n✅ Quick test accounts created successfully!");
    console.log("\n💡 To create more comprehensive test data, run: npx tsx src/scripts/seedMultiTenant.ts");

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error creating test accounts:", error);
    process.exit(1);
  }
}

createQuickTestAccounts();
