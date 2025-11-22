import { Types } from "mongoose";
import UserModel from "../models/User.js";
import ClassModel from "../models/Class.js";
import StudentProfileModel from "../models/StudentProfile.js";

/**
 * Student Class Service
 * Handles student-specific class-related operations
 */

export interface ClassDetails {
  class: {
    classId: string;
    className: string;
    grade: string;
    section: string;
    academicYear: string;
    maxStudents: number;
    currentStudents: number;
  };
  school: {
    schoolId: string;
    schoolName: string;
    city?: string;
    province?: string;
  };
  homeRoomTeacher?: {
    name: string;
    email: string;
    avatar?: string;
    employeeId?: string;
  };
  subjectTeachers: {
    name: string;
    email: string;
    avatar?: string;
    subjects: string[];
  }[];
}

export interface Classmate {
  _id: string;
  name: string;
  studentId: string;
  rollNumber: number;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
}

/**
 * Get student's class details with teachers
 */
export const getMyClass = async (studentId: string): Promise<ClassDetails> => {
  try {
    // Get student
    const student = await UserModel.findById(studentId).populate("class").lean();
    if (!student || student.role !== "student") {
      throw new Error("Student not found");
    }

    if (!student.class) {
      throw new Error("Student is not enrolled in any class");
    }

    // Get class with populated fields
    const classDoc = await ClassModel.findById(student.class)
      .populate("school", "schoolId schoolName city province")
      .populate("homeRoomTeacher", "name email avatar teacherProfile.employeeId")
      .populate("subjectTeachers.teacher", "name email avatar")
      .lean();

    if (!classDoc) {
      throw new Error("Class not found");
    }

    // Format response
    return {
      class: {
        classId: classDoc.classId,
        className: classDoc.className,
        grade: String(classDoc.grade),
        section: classDoc.section,
        academicYear: classDoc.academicYear,
        maxStudents: classDoc.maxStudents,
        currentStudents: classDoc.currentStudents,
      },
      school: {
        schoolId: (classDoc.school as any).schoolId,
        schoolName: (classDoc.school as any).schoolName,
        city: (classDoc.school as any).city,
        province: (classDoc.school as any).province,
      },
      homeRoomTeacher: classDoc.homeRoomTeacher
        ? {
            name: (classDoc.homeRoomTeacher as any).name,
            email: (classDoc.homeRoomTeacher as any).email,
            avatar: (classDoc.homeRoomTeacher as any).avatar,
            employeeId: (classDoc.homeRoomTeacher as any).teacherProfile?.employeeId,
          }
        : undefined,
      subjectTeachers: classDoc.subjectTeachers.map((st: any) => ({
        name: st.teacher.name,
        email: st.teacher.email,
        avatar: st.teacher.avatar,
        subjects: st.subjects,
      })),
    };
  } catch (error: any) {
    throw new Error(`Failed to get class details: ${error.message}`);
  }
};

/**
 * Get student's classmates
 */
export const getMyClassmates = async (studentId: string): Promise<Classmate[]> => {
  try {
    // Get student
    const student = await UserModel.findById(studentId).lean();
    if (!student || student.role !== "student") {
      throw new Error("Student not found");
    }

    if (!student.class) {
      throw new Error("Student is not enrolled in any class");
    }

    // Get all students in the same class (excluding self)
    const classmates = await UserModel.find({
      role: "student",
      class: student.class,
      _id: { $ne: studentId },
    })
      .select("name studentId rollNumber avatar")
      .sort({ rollNumber: 1 })
      .lean();

    // Get student profiles for XP and level
    const studentProfiles = await StudentProfileModel.find({
      student: { $in: classmates.map((c) => c._id) },
    }).lean();

    // Merge data and calculate ranks
    const classmatesWithStats = classmates.map((classmate) => {
      const profile = studentProfiles.find(
        (p) => (p as any).user.toString() === classmate._id.toString()
      );
      return {
        _id: classmate._id.toString(),
        name: classmate.name,
        studentId: classmate.studentId || "",
        rollNumber: classmate.rollNumber || 0,
        avatar: classmate.avatar,
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        rank: 0, // Will be calculated
      };
    });

    // Sort by XP and assign ranks
    classmatesWithStats.sort((a, b) => b.xp - a.xp);
    classmatesWithStats.forEach((classmate, index) => {
      classmate.rank = index + 1;
    });

    // Sort back by roll number for display
    classmatesWithStats.sort((a, b) => a.rollNumber - b.rollNumber);

    return classmatesWithStats;
  } catch (error: any) {
    throw new Error(`Failed to get classmates: ${error.message}`);
  }
};

/**
 * Get class leaderboard (XP ranking within class)
 */
export const getClassLeaderboard = async (
  studentId: string,
  limit: number = 10
): Promise<{
  myRank: number;
  myXP: number;
  totalStudents: number;
  leaderboard: Classmate[];
}> => {
  try {
    // Get student
    const student = await UserModel.findById(studentId).lean();
    if (!student || student.role !== "student") {
      throw new Error("Student not found");
    }

    if (!student.class) {
      throw new Error("Student is not enrolled in any class");
    }

    // Get all students in the same class
    const classStudents = await UserModel.find({
      role: "student",
      class: student.class,
    })
      .select("name studentId rollNumber avatar")
      .lean();

    // Get student profiles
    const studentProfiles = await StudentProfileModel.find({
      student: { $in: classStudents.map((s) => s._id) },
    }).lean();

    // Merge data
    const studentsWithStats = classStudents.map((s) => {
      const profile = studentProfiles.find((p) => (p as any).user.toString() === s._id.toString());
      return {
        _id: s._id.toString(),
        name: s.name,
        studentId: s.studentId || "",
        rollNumber: s.rollNumber || 0,
        avatar: s.avatar,
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        rank: 0,
      };
    });

    // Sort by XP and assign ranks
    studentsWithStats.sort((a, b) => b.xp - a.xp);
    studentsWithStats.forEach((s, index) => {
      s.rank = index + 1;
    });

    // Find current student's rank
    const myStats = studentsWithStats.find((s) => s._id === studentId);
    const myRank = myStats?.rank || 0;
    const myXP = myStats?.xp || 0;

    // Get top N students
    const topStudents = studentsWithStats.slice(0, limit);

    return {
      myRank,
      myXP,
      totalStudents: studentsWithStats.length,
      leaderboard: topStudents,
    };
  } catch (error: any) {
    throw new Error(`Failed to get class leaderboard: ${error.message}`);
  }
};

/**
 * Get class assignments (placeholder - can be expanded)
 */
export const getClassAssignments = async (studentId: string): Promise<any[]> => {
  try {
    // Get student
    const student = await UserModel.findById(studentId).lean();
    if (!student || student.role !== "student") {
      throw new Error("Student not found");
    }

    if (!student.class) {
      throw new Error("Student is not enrolled in any class");
    }

    // This is a placeholder - you might want to create an Assignment model
    // For now, return empty array
    return [];
  } catch (error: any) {
    throw new Error(`Failed to get class assignments: ${error.message}`);
  }
};

/**
 * Get student's rank within class
 */
export const getMyClassRank = async (
  studentId: string
): Promise<{
  rank: number;
  totalStudents: number;
  xp: number;
  percentile: number;
}> => {
  try {
    // Get student
    const student = await UserModel.findById(studentId).lean();
    if (!student || student.role !== "student") {
      throw new Error("Student not found");
    }

    if (!student.class) {
      throw new Error("Student is not enrolled in any class");
    }

    // Get all students in class
    const classStudents = await UserModel.find({
      role: "student",
      class: student.class,
    }).lean();

    // Get student profiles
    const studentProfiles = await StudentProfileModel.find({
      student: { $in: classStudents.map((s) => s._id) },
    }).lean();

    // Get my profile
    const myProfile = studentProfiles.find((p) => (p as any).user.toString() === studentId);
    const myXP = myProfile?.xp || 0;

    // Calculate rank (count how many students have more XP)
    const studentsWithMoreXP = studentProfiles.filter((p) => (p.xp || 0) > myXP).length;
    const rank = studentsWithMoreXP + 1;

    // Calculate percentile
    const totalStudents = classStudents.length;
    const percentile =
      totalStudents > 1 ? ((totalStudents - rank) / (totalStudents - 1)) * 100 : 100;

    return {
      rank,
      totalStudents,
      xp: myXP,
      percentile: Math.round(percentile * 100) / 100,
    };
  } catch (error: any) {
    throw new Error(`Failed to get class rank: ${error.message}`);
  }
};

/**
 * Compare class rank vs school rank
 */
export const compareRanks = async (
  studentId: string
): Promise<{
  classRank: { rank: number; total: number; percentile: number };
  schoolRank: { rank: number; total: number; percentile: number };
  xp: number;
}> => {
  try {
    // Get student
    const student = await UserModel.findById(studentId).lean();
    if (!student || student.role !== "student") {
      throw new Error("Student not found");
    }

    if (!student.class || !student.school) {
      throw new Error("Student is not properly enrolled");
    }

    // Get my profile
    const myProfile = await StudentProfileModel.findOne({ student: studentId }).lean();
    const myXP = myProfile?.xp || 0;

    // Get class rank
    const classStudents = await UserModel.find({
      role: "student",
      class: student.class,
    }).lean();

    const classProfiles = await StudentProfileModel.find({
      student: { $in: classStudents.map((s) => s._id) },
    }).lean();

    const classStudentsWithMoreXP = classProfiles.filter((p) => (p.xp || 0) > myXP).length;
    const classRank = classStudentsWithMoreXP + 1;
    const classPercentile =
      classStudents.length > 1
        ? ((classStudents.length - classRank) / (classStudents.length - 1)) * 100
        : 100;

    // Get school rank
    const schoolStudents = await UserModel.find({
      role: "student",
      school: student.school,
    }).lean();

    const schoolProfiles = await StudentProfileModel.find({
      student: { $in: schoolStudents.map((s) => s._id) },
    }).lean();

    const schoolStudentsWithMoreXP = schoolProfiles.filter((p) => (p.xp || 0) > myXP).length;
    const schoolRank = schoolStudentsWithMoreXP + 1;
    const schoolPercentile =
      schoolStudents.length > 1
        ? ((schoolStudents.length - schoolRank) / (schoolStudents.length - 1)) * 100
        : 100;

    return {
      classRank: {
        rank: classRank,
        total: classStudents.length,
        percentile: Math.round(classPercentile * 100) / 100,
      },
      schoolRank: {
        rank: schoolRank,
        total: schoolStudents.length,
        percentile: Math.round(schoolPercentile * 100) / 100,
      },
      xp: myXP,
    };
  } catch (error: any) {
    throw new Error(`Failed to compare ranks: ${error.message}`);
  }
};
