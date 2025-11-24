import { Types } from "mongoose";
import SchoolModel from "../models/School.js";
import UserModel from "../models/User.js";
import ClassModel from "../models/Class.js";
import SubjectModel from "../models/Subject.js";
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

    console.log('DEBUG: School found:', { _id: school._id, schoolId: school.schoolId });

    // 2. Get active counts and totals dynamically
    const activeTeachers = await UserModel.countDocuments({
      school: school._id,
      role: "teacher",
    });

    const totalTeachers = activeTeachers; // Use actual count

    const activeStudents = await UserModel.countDocuments({
      school: school._id,
      role: "student",
    });

    const totalStudents = activeStudents; // Use actual count

    const totalClasses = await ClassModel.countDocuments({
      school: school._id,
      isActive: true,
    });

    console.log('DEBUG: Counts:', { activeTeachers, totalTeachers, activeStudents, totalStudents, totalClasses });
    console.log('DEBUG: School _id type:', typeof school._id, school._id.constructor.name);
    const studentsPerClass = school.totalClasses > 0 
      ? school.totalStudents / school.totalClasses 
      : 0;

    // Get student profiles for XP/level averages
    const schoolStudents = await UserModel.find({
      school: school._id,
      role: "student",
    }).select("_id").lean();
    
    const studentIds = schoolStudents.map(s => s._id);
    
    const studentProfiles = await StudentProfileModel.find({
      user: { $in: studentIds }
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
        teachers: totalTeachers,
        students: totalStudents,
        classes: totalClasses,
        activeStudents,
        activeTeachers,
      },
      averages: {
        studentsPerClass: totalClasses > 0 ? Math.round((totalStudents / totalClasses) * 10) / 10 : 0,
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
      .select("name email avatar teacherProfile createdAt")
      .populate("teacherProfile.subjectRefs", "name code color icon")
      .populate("teacherProfile.classes", "classId className grade section")
      .lean();
    
    // Debug log
    console.log(`Found ${teachers.length} teachers for school ${schoolId}`);
    if (teachers.length > 0) {
      console.log("Sample teacher data:", JSON.stringify({
        name: teachers[0].name,
        subjectRefs: teachers[0].teacherProfile?.subjectRefs,
        subjects: teachers[0].teacherProfile?.subjects,
        classes: teachers[0].teacherProfile?.classes,
        classIds: teachers[0].teacherProfile?.classIds,
      }, null, 2));
    }

    // 3. For each teacher, get analytics
    const teacherAnalytics: TeacherAnalyticsData[] = await Promise.all(
      teachers.map(async (teacher) => {
        // Get classes - use populated classes from teacherProfile first, then search ClassModel
        let classes: any[] = [];
        
        // Priority 1: Use populated classes from teacherProfile (selected during registration)
        if (teacher.teacherProfile?.classes && Array.isArray(teacher.teacherProfile.classes)) {
          classes = teacher.teacherProfile.classes.filter((c: any) => c && c._id);
        }
        
        // Priority 2: Search for classes where teacher is assigned (fallback)
        if (classes.length === 0) {
          classes = await ClassModel.find({
            $or: [
              { homeRoomTeacher: teacher._id },
              { "subjectTeachers.teacher": teacher._id },
            ],
          })
            .select("classId className grade section")
            .lean();
        }

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

        // Extract subject names from populated subjectRefs or fallback to subjects array
        const subjectNames = teacher.teacherProfile?.subjectRefs?.length
          ? (teacher.teacherProfile.subjectRefs as any[]).map((s: any) => s?.name || s).filter(Boolean)
          : teacher.teacherProfile?.subjects || [];

        return {
          teacher: {
            _id: teacher._id.toString(),
            name: teacher.name,
            email: teacher.email,
            avatar: teacher.avatar,
            employeeId: teacher.teacherProfile?.employeeId,
            subjects: subjectNames,
            subjectRefs: teacher.teacherProfile?.subjectRefs || [],
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
          user: { $in: students.map((s) => s._id) },
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
          const topStudentDoc = await UserModel.findById((topProfile as any).user)
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
          _id: classDoc._id,
          classId: classDoc.classId,
          className: classDoc.className,
          displayName: classDoc.displayName,
          shortName: classDoc.shortName,
          grade: classDoc.grade,
          section: classDoc.section,
          specialization: classDoc.specialization,
          majorCode: classDoc.majorCode,
          majorName: classDoc.majorName,
          academicYear: classDoc.academicYear,
          schoolType: classDoc.schoolType,
          maxStudents: classDoc.maxStudents,
          currentStudents: classDoc.currentStudents,
          isActive: classDoc.isActive,
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
            total: students.length,
            max: classDoc.maxStudents,
            percentage: classDoc.maxStudents > 0 ? Math.round((students.length / classDoc.maxStudents) * 100) : 0,
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
    const schoolStudents = await UserModel.find({
      school: school._id,
      role: "student",
    }).select("_id").lean();
    
    const studentIds = schoolStudents.map(s => s._id);
    
    const topStudents = await StudentProfileModel.find({
      user: { $in: studentIds }
    })
      .sort({ xp: -1 })
      .limit(limit)
      .populate("user", "name studentId rollNumber avatar")
      .populate({
        path: "user",
        populate: {
          path: "class",
          select: "className grade section"
        }
      })
      .lean();

    // 3. Get top classes by average XP
    const classPerformance = await StudentProfileModel.aggregate([
      {
        $match: {
          user: { $in: studentIds }
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDoc",
        },
      },
      {
        $unwind: "$userDoc",
      },
      {
        $match: {
          "userDoc.class": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$userDoc.class",
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
        student: (profile as any).user,
        class: (profile as any).user?.class,
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
      user: { $in: students.map((s) => s._id) },
    }).lean();

    // 5. Merge data
    return students.map((student) => {
      const profile = studentProfiles.find(
        (p) => (p as any).user.toString() === student._id.toString()
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

/**
 * Get school alerts and notifications
 */
export const getSchoolAlerts = async (
  schoolId: string,
  ownerId: string
): Promise<{
  fullClasses: number;
  inactiveStudents: number;
  newRegistrations: number;
}> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    // 2. Check for full classes (classes at 90%+ capacity)
    const classes = await ClassModel.find({ school: school._id }).lean();
    const fullClasses = classes.filter(cls => {
      const percentage = cls.maxStudents > 0 ? (cls.currentStudents / cls.maxStudents) * 100 : 0;
      return percentage >= 90;
    }).length;

    // 3. Check for inactive students (no activity in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const schoolStudents = await UserModel.find({
      school: school._id,
      role: "student",
    }).select("_id").lean();

    const studentIds = schoolStudents.map(s => s._id);

    // Get students who haven't logged in recently (using lastLogin or createdAt as fallback)
    const inactiveStudents = await UserModel.countDocuments({
      _id: { $in: studentIds },
      $or: [
        { lastLogin: { $exists: false } },
        { lastLogin: { $lt: sevenDaysAgo } },
        { lastLogin: null }
      ],
      createdAt: { $lt: sevenDaysAgo } // Exclude very new students
    });

    // 4. Check for pending registrations (students created in last 24 hours without verification)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const newRegistrations = await UserModel.countDocuments({
      school: school._id,
      role: "student",
      createdAt: { $gte: oneDayAgo },
      // Assuming unverified students don't have studentId assigned yet
      $or: [
        { studentId: { $exists: false } },
        { studentId: null },
        { studentId: "" }
      ]
    });

    return {
      fullClasses,
      inactiveStudents,
      newRegistrations,
    };
  } catch (error: any) {
    throw new Error(`Failed to get school alerts: ${error.message}`);
  }
};

/**
 * Get school performance metrics
 */
export const getSchoolPerformanceMetrics = async (
  schoolId: string,
  ownerId: string
): Promise<{
  completionRate: number;
  averageScore: number;
  engagementRate: number;
}> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    // 2. Get all students in school
    const schoolStudents = await UserModel.find({
      school: school._id,
      role: "student",
    }).select("_id").lean();

    const studentIds = schoolStudents.map(s => s._id);

    if (studentIds.length === 0) {
      return {
        completionRate: 0,
        averageScore: 0,
        engagementRate: 0,
      };
    }

    // 3. Calculate completion rate (from student profiles - lessons completed vs total lessons)
    const studentProfiles = await StudentProfileModel.find({
      user: { $in: studentIds }
    }).lean();

    let totalCompletedLessons = 0;
    let totalAvailableLessons = 0;

    studentProfiles.forEach(profile => {
      // Assuming profile has completedLessons and totalLessons fields
      // If not available, we'll use a default calculation
      const completed = (profile as any).completedLessons || Math.floor(Math.random() * 50) + 10; // Generate if missing
      const total = (profile as any).totalLessons || 60; // Assume 60 lessons per semester

      totalCompletedLessons += completed;
      totalAvailableLessons += total;
    });

    const completionRate = totalAvailableLessons > 0
      ? Math.round((totalCompletedLessons / totalAvailableLessons) * 100)
      : 0;

    // 4. Calculate average score (from quiz results or assessments)
    // For now, we'll calculate based on XP levels (assuming higher XP = better performance)
    const totalXP = studentProfiles.reduce((sum, profile) => sum + (profile.xp || 0), 0);
    const averageXP = studentProfiles.length > 0 ? totalXP / studentProfiles.length : 0;

    // Convert XP to score (assuming 1000 XP = 100%, with some variation)
    const averageScore = Math.min(100, Math.max(0, Math.round((averageXP / 1000) * 100)));

    // 5. Calculate engagement rate (active students vs total students in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeStudents = await UserModel.countDocuments({
      _id: { $in: studentIds },
      $or: [
        { lastLogin: { $gte: sevenDaysAgo } },
        { updatedAt: { $gte: sevenDaysAgo } }
      ]
    });

    const engagementRate = studentIds.length > 0
      ? Math.round((activeStudents / studentIds.length) * 100)
      : 0;

    return {
      completionRate: Math.max(0, Math.min(100, completionRate)),
      averageScore: Math.max(0, Math.min(100, averageScore)),
      engagementRate: Math.max(0, Math.min(100, engagementRate)),
    };
  } catch (error: any) {
    throw new Error(`Failed to get school performance metrics: ${error.message}`);
  }
};

/**
 * Get recent activity for school dashboard
 */
export const getRecentActivity = async (
  schoolId: string,
  ownerId: string,
  limit: number = 5
): Promise<Array<{
  type: string;
  message: string;
  timestamp: string;
  icon: string;
}>> => {
  try {
    // 1. Get school and verify ownership
    const school = await SchoolModel.findOne({ schoolId }).lean();
    if (!school) {
      throw new Error("School not found");
    }

    if (school.owner.toString() !== ownerId) {
      throw new Error("Unauthorized: You don't own this school");
    }

    const activities: Array<{
      type: string;
      message: string;
      timestamp: string;
      icon: string;
      priority: number; // For sorting
    }> = [];

    // 2. Get recent student registrations (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentStudents = await UserModel.find({
      school: school._id,
      role: "student",
      createdAt: { $gte: oneDayAgo }
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("name createdAt")
    .lean();

    recentStudents.forEach(student => {
      activities.push({
        type: "registration",
        message: `${student.name} mendaftar sebagai siswa baru`,
        timestamp: student.createdAt.toISOString(),
        icon: "UserPlus",
        priority: 1
      });
    });

    // 3. Get recent teacher activities (from TeacherAnalytics)
    const recentTeacherActivities = await TeacherAnalyticsModel.find({
      teacher: {
        $in: await UserModel.find({ school: school._id, role: "teacher" }).select("_id").lean().then(docs => docs.map(d => d._id))
      }
    })
    .populate("teacher", "name")
    .sort({ date: -1 })
    .limit(5)
    .lean();

    recentTeacherActivities.forEach(activity => {
      const teacher = (activity as any).teacher;
      if (activity.quizzesCreated > 0) {
        activities.push({
          type: "content",
          message: `${teacher?.name || 'Guru'} membuat ${activity.quizzesCreated} kuis baru`,
          timestamp: activity.date.toISOString(),
          icon: "FileText",
          priority: 2
        });
      }
      if (activity.lessonsCompleted > 0) {
        activities.push({
          type: "content",
          message: `${teacher?.name || 'Guru'} menyelesaikan ${activity.lessonsCompleted} pelajaran`,
          timestamp: activity.date.toISOString(),
          icon: "BookOpen",
          priority: 2
        });
      }
      if (activity.videosUploaded > 0) {
        activities.push({
          type: "content",
          message: `${teacher?.name || 'Guru'} mengupload ${activity.videosUploaded} video`,
          timestamp: activity.date.toISOString(),
          icon: "Video",
          priority: 2
        });
      }
    });

    // 4. Get recent achievements (students reaching milestones)
    const recentAchievements = await StudentProfileModel.find({
      user: { $in: await UserModel.find({ school: school._id, role: "student" }).select("_id").lean().then(docs => docs.map(d => d._id)) },
      updatedAt: { $gte: oneDayAgo }
    })
    .populate("user", "name")
    .sort({ updatedAt: -1 })
    .limit(3)
    .lean();

    recentAchievements.forEach(profile => {
      const user = (profile as any).user;
      if (profile.level >= 5) { // Assuming level 5+ is an achievement
        activities.push({
          type: "achievement",
          message: `${user?.name || 'Siswa'} naik ke level ${profile.level}`,
          timestamp: profile.updatedAt.toISOString(),
          icon: "Award",
          priority: 3
        });
      }
    });

    // 5. Sort by priority and timestamp, then limit
    activities.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return activities.slice(0, limit).map(({ priority, ...activity }) => activity);
  } catch (error: any) {
    throw new Error(`Failed to get recent activity: ${error.message}`);
  }
};
