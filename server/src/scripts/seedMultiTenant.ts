import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import School from "../models/School";
import Class from "../models/Class";
import User from "../models/User";
import Subject from "../models/Subject";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/adapti-portal";

interface TestAccount {
  role: string;
  name: string;
  email: string;
  password: string;
  schoolId?: string;
  classId?: string;
}

const testAccounts: TestAccount[] = [];

async function seedMultiTenantData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing multi-tenant data
    console.log("\n🗑️  Clearing existing multi-tenant data...");
    await School.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    
    // Delete only multi-tenant users
    await User.deleteMany({ role: { $in: ["school_owner", "teacher", "student"] } });

    console.log("✅ Cleared old data");

    // ========================================
    // CREATE SCHOOL 1
    // ========================================
    console.log("\n🏫 Creating School 1...");

    const owner1 = await User.create({
      name: "Dr. Budiman Santoso",
      email: "owner@smanjkt.sch.id",
      password: "owner123",
      role: "school_owner",
    });

    const school1 = await School.create({
      schoolId: `SCH-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`,
      schoolName: "SMA Negeri 1 Jakarta",
      address: "Jl. Merdeka No. 123",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      phone: "021-1234567",
      email: "admin@smanjkt.sch.id",
      totalClasses: 30,
      owner: owner1._id,
      ownerName: owner1.name,
      ownerEmail: owner1.email,
    });

    owner1.schoolId = school1._id as string;
    await owner1.save();

    console.log(`✅ School: ${school1.schoolName} (${school1.schoolId})`);
    console.log(`✅ Owner: ${owner1.name}`);

    testAccounts.push({
      role: "School Owner",
      name: owner1.name,
      email: owner1.email,
      password: "owner123",
      schoolId: school1.schoolId,
    });

    // ========================================
    // CREATE SUBJECTS FOR SCHOOL 1
    // ========================================
    console.log("\n📚 Creating subjects...");

    const subjectsData = [
      { name: "Matematika Wajib", code: "MAT-W", color: "#3B82F6", icon: "📐", category: "Wajib" },
      { name: "Bahasa Indonesia", code: "BIND", color: "#EF4444", icon: "📖", category: "Wajib" },
      { name: "Bahasa Inggris", code: "BING", color: "#10B981", icon: "🌍", category: "Wajib" },
      { name: "Fisika", code: "FIS", color: "#8B5CF6", icon: "⚛️", category: "Peminatan" },
      { name: "Kimia", code: "KIM", color: "#F59E0B", icon: "🧪", category: "Peminatan" },
      { name: "Biologi", code: "BIO", color: "#059669", icon: "🧬", category: "Peminatan" },
      { name: "Sejarah", code: "SEJ", color: "#DC2626", icon: "📜", category: "Wajib" },
      { name: "Geografi", code: "GEO", color: "#14B8A6", icon: "🌏", category: "Peminatan" },
      { name: "Ekonomi", code: "EKO", color: "#F97316", icon: "💰", category: "Peminatan" },
      { name: "Sosiologi", code: "SOS", color: "#6366F1", icon: "👥", category: "Peminatan" },
    ];

    const subjects1 = await Subject.insertMany(
      subjectsData.map(subject => ({
        ...subject,
        school: school1._id,
        schoolId: school1.schoolId,
        schoolName: school1.schoolName,
        isActive: true,
      }))
    );

    console.log(`✅ Created ${subjects1.length} subjects`);

    // ========================================
    // CREATE CLASSES FOR SCHOOL 1
    // ========================================
    console.log("\n🎓 Creating classes...");

    const class10A = await Class.create({
      classId: `CLS-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`,
      className: "10 IPA 1",
      grade: 10,
      section: "IPA 1",
      maxStudents: 30,
      currentStudents: 0,
      school: school1._id,
      schoolId: school1.schoolId,
      schoolName: school1.schoolName,
      academicYear: "2024/2025",
      isActive: true,
      subjectTeachers: [],
    });

    console.log(`✅ Class: ${class10A.className} (${class10A.classId})`);

    // ========================================
    // CREATE TEACHER
    // ========================================
    console.log("\n👨‍🏫 Creating teacher...");

    // Get subject references for teacher
    const matematika = subjects1.find(s => s.name === "Matematika Wajib");
    const fisika = subjects1.find(s => s.name === "Fisika");

    const teacher1 = await User.create({
      name: "Budi Wijaya, S.Pd",
      email: "teacher@smanjkt.sch.id",
      password: "teacher123",
      role: "teacher",
      schoolId: school1._id,
      teacherProfile: {
        employeeId: "T001",
        subjects: ["Matematika Wajib", "Fisika"],
        subjectRefs: [matematika?._id, fisika?._id].filter(Boolean),
        classes: [class10A._id],
        classIds: [class10A.classId],
        qualification: "S1 Pendidikan Matematika",
      },
    });

    console.log(`✅ Teacher: ${teacher1.name}`);

    testAccounts.push({
      role: "Teacher",
      name: teacher1.name,
      email: teacher1.email,
      password: "teacher123",
      schoolId: school1.schoolId,
    });

    // Assign teacher to class
    class10A.homeRoomTeacher = teacher1._id as mongoose.Types.ObjectId;
    class10A.homeRoomTeacherName = teacher1.name;
    class10A.subjectTeachers.push({
      teacher: teacher1._id as mongoose.Types.ObjectId,
      teacherName: teacher1.name,
      subject: "Matematika",
    });
    await class10A.save();

    console.log(`✅ Teacher assigned to ${class10A.className}`);

    // ========================================
    // CREATE STUDENTS
    // ========================================
    console.log("\n👨‍🎓 Creating students...");

    for (let i = 1; i <= 5; i++) {
      const student = await User.create({
        name: `Siswa ${i} Kelas 10A`,
        email: `student${i}.10a@smanjkt.sch.id`,
        password: "student123",
        role: "student",
        schoolId: school1._id,
        classId: class10A._id,
        studentProfile: {
          rollNumber: `10A${String(i).padStart(2, "0")}`,
          parentName: `Orang Tua Siswa ${i}`,
          parentPhone: `0812345678${i}`,
          parentEmail: `parent${i}@email.com`,
        },
      });

      if (i === 1) {
        testAccounts.push({
          role: "Student",
          name: student.name,
          email: student.email,
          password: "student123",
          schoolId: school1.schoolId,
          classId: class10A.classId,
        });
      }
    }

    // Update class student count
    class10A.currentStudents = 5;
    await class10A.save();

    console.log(`✅ Created 5 students for ${class10A.className}`);

    // ========================================
    // PRINT TEST ACCOUNTS
    // ========================================
    console.log("\n" + "=".repeat(80));
    console.log("🔑 TEST ACCOUNTS - Save these credentials!");
    console.log("=".repeat(80));

    testAccounts.forEach((account, index) => {
      console.log(`\n${index + 1}. ${account.role.toUpperCase()}`);
      console.log(`   Name     : ${account.name}`);
      console.log(`   Email    : ${account.email}`);
      console.log(`   Password : ${account.password}`);
      if (account.schoolId) console.log(`   School ID: ${account.schoolId}`);
      if (account.classId) console.log(`   Class ID : ${account.classId}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("\n✅ Multi-tenant seed data created successfully!");
    console.log(`   - 1 School`);
    console.log(`   - ${subjects1.length} Subjects (Mata Pelajaran)`);
    console.log(`   - 1 Class`);
    console.log(`   - 1 School Owner`);
    console.log(`   - 1 Teacher`);
    console.log(`   - 5 Students`);
    console.log("\n🚀 You can now test the multi-tenant system!");
    console.log("\n💡 Teacher registration will now show subject dropdown!");

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding multi-tenant data:", error);
    process.exit(1);
  }
}

seedMultiTenantData();

