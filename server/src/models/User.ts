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
}

export interface StudentProfile {
  currentGrade: "SD" | "SMP" | "SMA" | "SMK";
  currentClass: number; // 1-12
  currentSemester: 1 | 2;
  major?: string; // For SMK only (PPLG, TJKT, DKV, BD, etc.)
  onboardingComplete: boolean;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatar?: string;
  className?: string;
  googleId?: string;
  
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
  
  // For School Owners
  isSchoolOwner?: boolean;
  ownedSchool?: Types.ObjectId; // Ref to School
  
  // Gamification fields
  level?: number; // User level (1-100)
  xp?: number; // Experience points
  gems?: number; // Premium currency
  hearts?: number; // Lives/attempts
  
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
}, { _id: false });

const studentProfileSchema = new Schema({
  currentGrade: { type: String, enum: ["SD", "SMP", "SMA", "SMK"], required: true },
  currentClass: { type: Number, min: 1, max: 12, required: true },
  currentSemester: { type: Number, enum: [1, 2], required: true },
  major: { type: String }, // For SMK only
  onboardingComplete: { type: Boolean, default: false },
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
    
    // School relationship
    school: { type: Schema.Types.ObjectId, ref: "School", index: true },
    schoolId: { type: String, index: true },
    schoolName: { type: String },
    
    // For Students
    class: { type: Schema.Types.ObjectId, ref: "Class", index: true },
    classId: { type: String, index: true },
    rollNumber: { type: Number, min: 1, max: 50 },
    studentId: { type: String }, // NIS/NISN
    parentName: { type: String },
    parentPhone: { type: String },
    parentEmail: { type: String },
    studentProfile: { type: studentProfileSchema },
    
    // For Teachers
    teacherProfile: { type: teacherProfileSchema },
    
    // For School Owners
    isSchoolOwner: { type: Boolean, default: false },
    ownedSchool: { type: Schema.Types.ObjectId, ref: "School" },
    
    // Gamification fields
    level: { type: Number, default: 1, min: 1, max: 100 },
    xp: { type: Number, default: 0, min: 0 },
    gems: { type: Number, default: 0, min: 0 },
    hearts: { type: Number, default: 5, min: 0, max: 10 },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);

export default UserModel;
