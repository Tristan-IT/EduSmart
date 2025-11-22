import { Types } from "mongoose";
import SchoolModel from "../models/School.js";
import UserModel from "../models/User.js";
import ClassModel from "../models/Class.js";
import TeacherAnalyticsModel from "../models/TeacherAnalytics.js";
import SchoolAnalyticsModel from "../models/SchoolAnalytics.js";
import StudentProfileModel from "../models/StudentProfile.js";

/**
 * School Analytics Service
 * Provides comprehensive analytics for school owners
 */

export interface SchoolOverview {
  school: {
    schoolId: string;
    schoolName: string;
    city: string;
    province: string;
    subscriptionPlan: string;
    isActive: boolean;
  };
  totals: {
    teachers: number;
    students: number;
    classes: number;
    activeStudents: number;
    activeTeachers: number;
  };
  averages: {
    studentsPerClass: number;
    xpPerStudent: number;
    levelPerStudent: number;
  };
  createdAt: Date;
}

export interface TeacherAnalyticsData {
  teacher: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    employeeId?: string;
  };
  classes: any[];
  totalStudents: number;
  analytics: {
    totalLessons: number;
    completedLessons: number;
    totalQuizzes: number;
    totalAssignments: number;
    totalVideos: number;
    averageStudentEngagement: number;
  };
  lastActive: Date;
}

export interface ClassAnalyticsData {
  class: {
    classId: string;
    className: string;
    grade: string;
    section: string;
    academicYear: string;
  };
  homeRoomTeacher?: {
    name: string;
    email: string;
  };
  subjectTeachers: any[];
  students: {
    total: number;
    max: number;
    percentage: number;
  };
  performance: {
    averageXP: number;
    averageLevel: number;
    topStudent?: any;
  };
}

/**
 * Get comprehensive school overview
 */
export const getSchoolOverview = async (
  schoolId: string,
  ownerId: string
): Promise<SchoolOverview> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    // 2. Get active counts
    const activeTeachers = await UserModel.countDocuments({
      school: school._id,
      role: "teacher",
    });

    const activeStudents = await UserModel.countDocuments({
      school: school._id,
      role: "student",
    });

    // 3. Calculate averages
    const studentsPerClass = school.totalClasses > 0 
      ? school.totalStudents / school.totalClasses 
      : 0;

    // Get student profiles for XP/level averages
    const studentProfiles = await StudentProfileModel.find({
      school: school._id,
    }).lean();

    const totalXP = studentProfiles.reduce((sum, profile) => sum + (profile.xp || 0), 0);
    const totalLevel = studentProfiles.reduce((sum, profile) => sum + (profile.level || 1), 0);
    
    const xpPerStudent = studentProfiles.length > 0 ? totalXP / studentProfiles.length : 0;
    const levelPerStudent = studentProfiles.length > 0 ? totalLevel / studentProfiles.length : 1;

    return {
      school: {
        schoolId: school.schoolId,
        schoolName: school.schoolName,
        city: school.city || "",
        province: school.province || "",
        subscriptionPlan: school.subscriptionPlan || "free",
        isActive: school.isActive,
      },
      totals: {
        teachers: school.totalTeachers,
        students: school.totalStudents,
        classes: school.totalClasses,
        activeStudents,
        activeTeachers,
      },
      averages: {
        studentsPerClass: Math.round(studentsPerClass * 10) / 10,
        xpPerStudent: Math.round(xpPerStudent),
        levelPerStudent: Math.round(levelPerStudent * 10) / 10,
      },
      createdAt: school.createdAt,
    };
  } catch (error: any) {
    throw new Error(`Failed to get school overview: ${error.message}`);
  }
};

/**
 * Get analytics for all teachers in school
 */
export const getTeacherAnalytics = async (
  schoolId: string,
  ownerId: string
): Promise<TeacherAnalyticsData[]> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    // 2. Get all teachers in this school
    const teachers = await UserModel.find({
      school: school._id,
      role: "teacher",
    })
      .select("name email avatar teacherProfile")
      .lean();

    // 3. For each teacher, get analytics
    const teacherAnalytics: TeacherAnalyticsData[] = await Promise.all(
      teachers.map(async (teacher) => {
        // Get classes assigned to this teacher
        const classes = await ClassModel.find({
          $or: [
            { homeRoomTeacher: teacher._id },
            { "subjectTeachers.teacher": teacher._id },
          ],
        })
          .select("classId className grade section")
          .lean();

        // Get student count across all classes
        const studentCount = await UserModel.countDocuments({
          role: "student",
          class: { $in: classes.map((c) => c._id) },
        });

        // Get teacher analytics (aggregate from daily records)
        const analytics = await TeacherAnalyticsModel.aggregate([
          {
            $match: {
              teacher: teacher._id,
            },
          },
          {
            $group: {
              _id: null,
              totalLessons: { $sum: "$lessonsPlanned" },
              completedLessons: { $sum: "$lessonsCompleted" },
              totalQuizzes: { $sum: "$quizzesCreated" },
              totalAssignments: { $sum: "$assignmentsCreated" },
              totalVideos: { $sum: "$videosUploaded" },
              avgEngagement: { $avg: "$studentEngagementRate" },
              lastActive: { $max: "$date" },
            },
          },
        ]);

        const analyticsData = analytics[0] || {
          totalLessons: 0,
          completedLessons: 0,
          totalQuizzes: 0,
          totalAssignments: 0,
          totalVideos: 0,
          avgEngagement: 0,
          lastActive: teacher.createdAt,
        };

        return {
          teacher: {
            _id: teacher._id.toString(),
            name: teacher.name,
            email: teacher.email,
            avatar: teacher.avatar,
            employeeId: teacher.teacherProfile?.employeeId,
          },
          classes,
          totalStudents: studentCount,
          analytics: {
            totalLessons: analyticsData.totalLessons,
            completedLessons: analyticsData.completedLessons,
            totalQuizzes: analyticsData.totalQuizzes,
            totalAssignments: analyticsData.totalAssignments,
            totalVideos: analyticsData.totalVideos,
            averageStudentEngagement: Math.round(analyticsData.avgEngagement * 100) / 100,
          },
          lastActive: analyticsData.lastActive,
        };
      })
    );

    return teacherAnalytics;
  } catch (error: any) {
    throw new Error(`Failed to get teacher analytics: ${error.message}`);
  }
};

/**
 * Get analytics for all classes in school
 */
export const getClassAnalytics = async (
  schoolId: string,
  ownerId: string
): Promise<ClassAnalyticsData[]> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    // 2. Get all classes in this school
    const classes = await ClassModel.find({ school: school._id })
      .populate("homeRoomTeacher", "name email")
      .populate("subjectTeachers.teacher", "name email teacherProfile.subjects")
      .lean();

    // 3. For each class, get performance metrics
    const classAnalytics: any[] = await Promise.all(
      classes.map(async (classDoc) => {
        // Get all students in this class
        const students = await UserModel.find({
          role: "student",
          class: classDoc._id,
        }).lean();

        // Get student profiles for XP/level
        const studentProfiles = await StudentProfileModel.find({
          student: { $in: students.map((s) => s._id) },
        }).lean();

        // Calculate averages
        const totalXP = studentProfiles.reduce((sum, profile) => sum + (profile.xp || 0), 0);
        const totalLevel = studentProfiles.reduce((sum, profile) => sum + (profile.level || 1), 0);

        const averageXP = studentProfiles.length > 0 ? totalXP / studentProfiles.length : 0;
        const averageLevel = studentProfiles.length > 0 ? totalLevel / studentProfiles.length : 1;

        // Get top student
        const topProfile = studentProfiles.sort((a, b) => (b.xp || 0) - (a.xp || 0))[0];
        let topStudent = null;
        if (topProfile) {
          const topStudentDoc = await UserModel.findById((topProfile as any).student)
            .select("name studentId rollNumber")
            .lean();
          topStudent = topStudentDoc
            ? {
                name: topStudentDoc.name,
                studentId: topStudentDoc.studentId,
                rollNumber: topStudentDoc.rollNumber,
                xp: topProfile.xp,
                level: topProfile.level,
              }
            : null;
        }

        return {
          class: {
            classId: classDoc.classId,
            className: classDoc.className,
            grade: classDoc.grade,
            section: classDoc.section,
            academicYear: classDoc.academicYear,
          },
          homeRoomTeacher: classDoc.homeRoomTeacher
            ? {
                name: (classDoc.homeRoomTeacher as any).name,
                email: (classDoc.homeRoomTeacher as any).email,
              }
            : undefined,
          subjectTeachers: classDoc.subjectTeachers.map((st: any) => ({
            name: st.teacher.name,
            email: st.teacher.email,
            subjects: st.subjects,
          })),
          students: {
            total: classDoc.currentStudents,
            max: classDoc.maxStudents,
            percentage: Math.round((classDoc.currentStudents / classDoc.maxStudents) * 100),
          },
          performance: {
            averageXP: Math.round(averageXP),
            averageLevel: Math.round(averageLevel * 10) / 10,
            topStudent,
          },
        };
      })
    );

    return classAnalytics;
  } catch (error: any) {
    throw new Error(`Failed to get class analytics: ${error.message}`);
  }
};

/**
 * Get top performers in school
 */
export const getTopPerformers = async (
  schoolId: string,
  ownerId: string,
  limit: number = 10
): Promise<any> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    // 2. Get top students by XP
    const topStudents = await StudentProfileModel.find({ school: school._id })
      .sort({ xp: -1 })
      .limit(limit)
      .populate("student", "name studentId rollNumber avatar")
      .populate("class", "className grade section")
      .lean();

    // 3. Get top classes by average XP
    const classPerformance = await StudentProfileModel.aggregate([
      {
        $match: { school: school._id },
      },
      {
        $group: {
          _id: "$class",
          averageXP: { $avg: "$xp" },
          totalStudents: { $sum: 1 },
        },
      },
      {
        $sort: { averageXP: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // Populate class details
    const topClasses = await Promise.all(
      classPerformance.map(async (perf) => {
        const classDoc = await ClassModel.findById(perf._id)
          .select("classId className grade section")
          .lean();
        return {
          class: classDoc,
          averageXP: Math.round(perf.averageXP),
          totalStudents: perf.totalStudents,
        };
      })
    );

    // 4. Get top teachers by content creation
    const topTeachers = await TeacherAnalyticsModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "teacher",
          foreignField: "_id",
          as: "teacherDoc",
        },
      },
      {
        $unwind: "$teacherDoc",
      },
      {
        $match: {
          "teacherDoc.school": school._id,
        },
      },
      {
        $group: {
          _id: "$teacher",
          teacherName: { $first: "$teacherDoc.name" },
          teacherEmail: { $first: "$teacherDoc.email" },
          totalContent: {
            $sum: {
              $add: [
                "$lessonsCompleted",
                "$quizzesCreated",
                "$assignmentsCreated",
                "$videosUploaded",
              ],
            },
          },
          totalLessons: { $sum: "$lessonsCompleted" },
          totalQuizzes: { $sum: "$quizzesCreated" },
        },
      },
      {
        $sort: { totalContent: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    return {
      topStudents: topStudents.map((profile) => ({
        student: (profile as any).student,
        class: (profile as any).class,
        xp: profile.xp,
        level: profile.level,
        rank: profile.xp, // Can be used for ranking
      })),
      topClasses,
      topTeachers,
    };
  } catch (error: any) {
    throw new Error(`Failed to get top performers: ${error.message}`);
  }
};

/**
 * Get activity timeline for school
 */
export const getActivityTimeline = async (
  schoolId: string,
  ownerId: string,
  days: number = 7
): Promise<any[]> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    // 2. Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 3. Get school analytics for date range
    const schoolAnalytics = await SchoolAnalyticsModel.find({
      school: school._id,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: 1 })
      .lean();

    return schoolAnalytics.map((analytics) => ({
      date: analytics.date,
      activeTeachers: analytics.activeTeachers,
      activeStudents: analytics.activeStudents,
      totalContent: (analytics as any).totalContentCreated || 0,
      averageXP: Math.round((analytics as any).averageXP || 0),
      averageLevel: Math.round(((analytics as any).averageLevel || 0) * 10) / 10,
    }));
  } catch (error: any) {
    throw new Error(`Failed to get activity timeline: ${error.message}`);
  }
};

/**
 * Get student list with filters
 */
export const getStudentList = async (
  schoolId: string,
  ownerId: string,
  filters?: {
    classId?: string;
    grade?: string;
    search?: string;
  }
): Promise<any[]> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    // 2. Build query
    const query: any = {
      school: school._id,
      role: "student",
    };

    // Apply filters
    if (filters?.classId) {
      const classDoc = await ClassModel.findOne({ classId: filters.classId }).lean();
      if (classDoc) {
        query.class = classDoc._id;
      }
    }

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
        { studentId: { $regex: filters.search, $options: "i" } },
      ];
    }

    // 3. Get students
    const students = await UserModel.find(query)
      .populate("class", "className grade section")
      .select("name email studentId rollNumber avatar createdAt")
      .sort({ rollNumber: 1 })
      .lean();

    // 4. Get student profiles for XP/level
    const studentProfiles = await StudentProfileModel.find({
      student: { $in: students.map((s) => s._id) },
    }).lean();

    // 5. Merge data
    return students.map((student) => {
      const profile = studentProfiles.find(
        (p) => (p as any).student.toString() === student._id.toString()
      );
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        rollNumber: student.rollNumber,
        avatar: student.avatar,
        class: student.class,
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        createdAt: student.createdAt,
      };
    });
  } catch (error: any) {
    throw new Error(`Failed to get student list: ${error.message}`);
  }
};
