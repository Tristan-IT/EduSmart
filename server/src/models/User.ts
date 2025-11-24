import { Schema, model, type Document, Types } from "mongoose";

export type UserRole = "student" | "teacher" | "admin" | "school_owner";

export interface TeacherProfile {
  employeeId?: string; // NIP/NIK
  subjects: string[]; // Mata pelajaran yang diajar (legacy - subject names)
  subjectRefs: Types.ObjectId[]; // Reference to Subject model (new)
  classes: Types.ObjectId[]; // Ref to Class
  classIds: string[];
  yearsOfExperience?: number;
  qualification?: string; // S1, S2, etc.
  specialization?: string;
  bio?: string;
}

export interface StudentProfile {
  currentGrade: "SD" | "SMP" | "SMA" | "SMK";
  currentClass: number; // 1-12
  currentSemester: 1 | 2;
  major?: string; // For SMK only (PPLG, TJKT, DKV, BD, etc.)
  onboardingComplete: boolean;
}

export interface UserSettings {
  notifications?: {
    emailNotifications?: boolean;
    assignmentReminders?: boolean;
    gradeUpdates?: boolean;
    teacherMessages?: boolean;
    parentNotifications?: boolean;
    examSchedule?: boolean;
    weeklyDigest?: boolean;
    studentProgress?: boolean;
    classUpdates?: boolean;
    assignmentSubmissions?: boolean;
    systemAnnouncements?: boolean;
  };
  learning?: {
    studyReminders?: boolean;
    dailyGoalMinutes?: number;
    difficultyPreference?: string;
    learningMode?: string;
    showHints?: boolean;
  };
  academic?: {
    defaultGradingSystem?: string;
    autoGrade?: boolean;
    latePenalty?: string;
    maxRetakes?: string;
  };
  privacy?: {
    parentAccessLevel?: string;
    profileVisibility?: string;
    allowPeerConnections?: boolean;
    showOnlineStatus?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    allowMessages?: boolean;
  };
  sound?: {
    enabled?: boolean;
    volume?: number;
  };
  updatedAt?: Date;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatar?: string;
  className?: string;
  googleId?: string;
  phone?: string;
  address?: string;
  
  // School relationship
  school?: Types.ObjectId; // Ref to School
  schoolId?: string;
  schoolName?: string;
  
  // For Students
  class?: Types.ObjectId; // Ref to Class
  classId?: string;
  rollNumber?: number; // Nomor absen (1-40)
  studentId?: string; // NIS/NISN
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  studentProfile?: StudentProfile; // Learning path preferences
  
  // For Teachers
  teacherProfile?: TeacherProfile;
  
  // User Settings (for all roles)
  settings?: UserSettings;
  
  // For School Owners
  isSchoolOwner?: boolean;
  ownedSchool?: Types.ObjectId; // Ref to School
  
  // Gamification fields
  level?: number; // User level (1-100)
  xp?: number; // Experience points
  weeklyXP?: number; // XP earned this week
  gems?: number; // Premium currency
  hearts?: number; // Lives/attempts
  streak?: number; // Current login streak
  bestStreak?: number; // Best streak record
  league?: string; // bronze, silver, gold, etc.
  
  createdAt: Date;
  updatedAt: Date;
}

const teacherProfileSchema = new Schema({
  employeeId: { type: String },
  subjects: { type: [String], default: [] },
  subjectRefs: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
  classIds: { type: [String], default: [] },
  yearsOfExperience: { type: Number },
  qualification: { type: String },
  specialization: { type: String },
  bio: { type: String },
}, { _id: false });

const studentProfileSchema = new Schema({
  currentGrade: { type: String, enum: ["SD", "SMP", "SMA", "SMK"], required: true },
  currentClass: { type: Number, min: 1, max: 12, required: true },
  currentSemester: { type: Number, enum: [1, 2], required: true },
  major: { type: String }, // For SMK only
  onboardingComplete: { type: Boolean, default: false },
}, { _id: false });

const settingsSchema = new Schema({
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    assignmentReminders: { type: Boolean, default: true },
    gradeUpdates: { type: Boolean, default: true },
    teacherMessages: { type: Boolean, default: true },
    parentNotifications: { type: Boolean, default: true },
    examSchedule: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false },
    studentProgress: { type: Boolean, default: true },
    classUpdates: { type: Boolean, default: true },
    assignmentSubmissions: { type: Boolean, default: true },
    systemAnnouncements: { type: Boolean, default: true },
  },
  learning: {
    studyReminders: { type: Boolean, default: true },
    dailyGoalMinutes: { type: Number, default: 60 },
    difficultyPreference: { type: String, default: "adaptive" },
    learningMode: { type: String, default: "mixed" },
    showHints: { type: Boolean, default: true },
  },
  academic: {
    defaultGradingSystem: { type: String, default: "100" },
    autoGrade: { type: Boolean, default: false },
    latePenalty: { type: String, default: "10" },
    maxRetakes: { type: String, default: "2" },
  },
  privacy: {
    parentAccessLevel: { type: String, default: "full" },
    profileVisibility: { type: String, default: "school" },
    allowPeerConnections: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    allowMessages: { type: Boolean, default: true },
  },
  sound: {
    enabled: { type: Boolean, default: true },
    volume: { type: Number, default: 0.5 },
  },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["student", "teacher", "admin", "school_owner"], required: true },
    avatar: { type: String },
    className: { type: String },
    googleId: { type: String, index: true },
    phone: { type: String },
    address: { type: String },
    
    // School relationship
    school: { type: Schema.Types.ObjectId, ref: "School", index: true },
    schoolId: { type: String, index: true },
    schoolName: { type: String },
    
    // For Students
    class: { type: Schema.Types.ObjectId, ref: "Class", index: true },
    classId: { type: String, index: true },
    rollNumber: { type: Number, min: 1, max: 9999 },
    studentId: { type: String }, // NIS/NISN
    parentName: { type: String },
    parentPhone: { type: String },
    parentEmail: { type: String },
    studentProfile: { type: studentProfileSchema },
    
    // For Teachers
    teacherProfile: { type: teacherProfileSchema },
    
    // User Settings
    settings: { type: settingsSchema },
    
    // For School Owners
    isSchoolOwner: { type: Boolean, default: false },
    ownedSchool: { type: Schema.Types.ObjectId, ref: "School" },
    
    // Gamification fields
    level: { type: Number, default: 1, min: 1, max: 100 },
    xp: { type: Number, default: 0, min: 0 },
    weeklyXP: { type: Number, default: 0, min: 0 },
    gems: { type: Number, default: 0, min: 0 },
    hearts: { type: Number, default: 5, min: 0, max: 10 },
    streak: { type: Number, default: 0, min: 0 },
    bestStreak: { type: Number, default: 0, min: 0 },
    league: { type: String, default: 'bronze' },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);

export default UserModel;
