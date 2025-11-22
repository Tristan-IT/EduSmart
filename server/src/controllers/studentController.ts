import type { Request, Response } from "express";
import UserModel, { type UserDocument } from "../models/User.js";
import { StudentProfileModel, type StudentProfileDocument } from "../models/StudentProfile.js";
import { TopicModel } from "../models/Topic.js";
import { MentorSessionModel } from "../models/MentorSession.js";

const mapStudentResponse = (user: UserDocument | null, profile?: any) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    className: user.className,
    masteryPerTopic: profile?.masteryPerTopic ?? {},
    xp: profile?.xp ?? 0,
    level: profile?.level ?? 1,
    league: profile?.league ?? "bronze",
    dailyGoalXP: profile?.dailyGoalXP ?? 0,
    dailyGoalProgress: profile?.dailyGoalProgress ?? 0,
    streak: profile?.streak ?? 0,
  riskLevel: profile?.riskLevel ?? "low",
  };
};

export const listStudents = async (_req: Request, res: Response) => {
  const profiles: Array<StudentProfileDocument & { user: unknown }> = await StudentProfileModel.find()
    .populate("user")
    .exec();
  const students = profiles
    .map((profileDoc) => {
      const profile = profileDoc as StudentProfileDocument & { user: UserDocument };
      return mapStudentResponse(profile.user, profile);
    })
    .filter(Boolean);
  return res.json({ students });
};

export const getStudentDashboard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserModel.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "Siswa tidak ditemukan" });
  }
  if (user.role !== "student") {
    return res.status(400).json({ message: "Akun bukan siswa" });
  }

  const profile = await StudentProfileModel.findOne({ user: user.id }).exec();
  if (!profile) {
    return res.status(404).json({ message: "Profil siswa belum tersedia" });
  }

  const topics = await TopicModel.find().sort({ createdAt: 1 }).exec();
  const mentorSession = await MentorSessionModel.findOne({ student: user.id }).exec();

  return res.json({
    student: mapStudentResponse(user, profile),
    profile: {
      studentId: user.id,
      displayName: user.name,
      xp: profile.xp,
      level: profile.level,
      xpInLevel: profile.xpInLevel,
      xpForNextLevel: profile.xpForNextLevel,
      streak: profile.streak,
      bestStreak: profile.bestStreak,
      dailyGoalXP: profile.dailyGoalXP,
      dailyGoalProgress: profile.dailyGoalProgress,
      dailyGoalMet: profile.dailyGoalMet,
      dailyGoalClaimed: profile.dailyGoalClaimed,
      league: profile.league,
      boosts: profile.boosts,
      lastLessonId: profile.lastLessonId,
      lastCompletedAt: profile.lastCompletedAt,
    },
    topics,
    dailyPlan: profile.dailyPlan,
    aiRecommendations: profile.aiRecommendations,
    aiRewards: profile.aiRewardQuests,
    skillTree: profile.skillTree,
    mentorSession: mentorSession
      ? {
          id: mentorSession.id,
          summary: mentorSession.summary,
          messages: mentorSession.messages,
        }
      : null,
  });
};

export const getMentorSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserModel.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "Siswa tidak ditemukan" });
  }
  const session = await MentorSessionModel.findOne({ student: user.id }).exec();
  if (!session) {
    return res.status(404).json({ message: "Sesi mentor belum ada" });
  }
  return res.json({
    id: session.id,
    summary: session.summary,
    messages: session.messages,
  });
};

export const addMentorMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, topicId } = req.body as { content?: string; topicId?: string };
  if (!content) {
    return res.status(400).json({ message: "Pesan tidak boleh kosong" });
  }

  const user = await UserModel.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "Siswa tidak ditemukan" });
  }
  let session = await MentorSessionModel.findOne({ student: user.id }).exec();
  if (!session) {
    session = await MentorSessionModel.create({
      student: user.id,
      summary: "Percakapan mentor adaptif",
      messages: [],
    });
  }

  session.messages.push({
    id: `msg-${session.messages.length + 1}`,
    role: "student",
    content,
    topicId,
    timestamp: new Date(),
  });

  session.messages.push({
    id: `msg-${session.messages.length + 1}`,
    role: "assistant",
    content: "AI mentor akan menindaklanjuti dengan rekomendasi personal begitu model produksi siap.",
    timestamp: new Date(),
  });

  session.summary = "AI mentor membantu siswa memahami langkah belajar berikutnya.";
  await session.save();

  return res.status(201).json({
    id: session.id,
    summary: session.summary,
    messages: session.messages,
  });
};
