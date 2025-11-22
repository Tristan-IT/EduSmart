import { mockStudents, mockContentItems, mockStudentEvents, mockReports, mockQuizQuestions } from "@/data/mockData";
import { baseSkillTree, baseProfile, cloneSkillTree, SkillTreeUnit, GamifiedProfile, LessonChallenge } from "@/data/gamifiedLessons";
import { initialTelemetryEvents, TelemetryEvent } from "@/data/telemetry";
import { mockAiMentorSession, AiMentorSession, AiMentorMessage } from "@/data/mockAi/mentor";
import { mockAiRecommendations } from "@/data/mockAi/recommendations";
import { mockAiInterventions } from "@/data/mockAi/interventions";
import { mockAiParentSummary } from "@/data/mockAi/parentSummary";
import { mockAiRewards } from "@/data/mockAi/rewards";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let skillTreeState: SkillTreeUnit[] = cloneSkillTree(baseSkillTree);
let gamifiedProfile: GamifiedProfile = { ...baseProfile };
let telemetryEvents: TelemetryEvent[] = [...initialTelemetryEvents];
let mentorSession: AiMentorSession = {
  ...mockAiMentorSession,
  messages: [...mockAiMentorSession.messages],
};

const findLessonById = (lessonId: string) => {
  for (let unitIndex = 0; unitIndex < skillTreeState.length; unitIndex += 1) {
    const unit = skillTreeState[unitIndex];
    for (let skillIndex = 0; skillIndex < unit.skills.length; skillIndex += 1) {
      const skill = unit.skills[skillIndex];
      const lessonIndex = skill.lessons.findIndex((lesson) => lesson.id === lessonId);
      if (lessonIndex !== -1) {
        return {
          unit,
          skill,
          lesson: skill.lessons[lessonIndex],
          unitIndex,
          skillIndex,
          lessonIndex,
        };
      }
    }
  }
  return null;
};

const unlockNextLesson = (skill: SkillTreeUnit["skills"][number], lessonIndex: number) => {
  const next = skill.lessons[lessonIndex + 1];
  if (next && next.status === "locked") {
    next.status = "available";
    return next;
  }
  return undefined;
};

type UnlockResult = {
  unlockedSkill?: SkillTreeUnit["skills"][number];
  unlockedLesson?: LessonChallenge;
  unlockedUnit?: SkillTreeUnit;
  unitCompleted?: SkillTreeUnit;
} | null;

const unlockNextSkill = (unitIndex: number, skillIndex: number): UnlockResult => {
  const unit = skillTreeState[unitIndex];
  const nextSkill = unit.skills[skillIndex + 1];
  if (!nextSkill) {
    unit.status = "completed";
    const nextUnit = skillTreeState[unitIndex + 1];
    if (nextUnit && nextUnit.status === "upcoming") {
      nextUnit.status = "current";
      const primarySkill = nextUnit.skills[0];
      primarySkill.unlocked = true;
      primarySkill.status = "current";
      if (primarySkill.lessons[0] && primarySkill.lessons[0].status === "locked") {
        primarySkill.lessons[0].status = "available";
        return { unlockedUnit: nextUnit, unlockedSkill: primarySkill, unlockedLesson: primarySkill.lessons[0] };
      }
      return { unlockedUnit: nextUnit, unlockedSkill: primarySkill };
    }
    return { unitCompleted: unit };
  }

  if (!nextSkill.unlocked) {
    nextSkill.unlocked = true;
    nextSkill.status = "current";
    if (nextSkill.lessons[0] && nextSkill.lessons[0].status === "locked") {
      nextSkill.lessons[0].status = "available";
      return { unlockedSkill: nextSkill, unlockedLesson: nextSkill.lessons[0] };
    }
    return { unlockedSkill: nextSkill };
  }

  return null;
};

const updateSkillMastery = (skill: SkillTreeUnit["skills"][number]) => {
  const total = skill.lessons.length || 1;
  const mastered = skill.lessons.filter((lesson) => lesson.status === "mastered").length;
  skill.mastery = Math.round((mastered / total) * 100);
  if (skill.mastery === 100) {
    skill.status = "completed";
  } else if (mastered > 0) {
    skill.status = "current";
  }
};

const logTelemetryEvent = (
  event: Omit<TelemetryEvent, "id" | "timestamp"> & { timestamp?: string }
) => {
  const entry: TelemetryEvent = {
    id: `telemetry-${String(telemetryEvents.length + 1).padStart(4, "0")}`,
    type: event.type,
    studentId: event.studentId,
    studentName: event.studentName,
    timestamp: event.timestamp ?? new Date().toISOString(),
    metadata: event.metadata,
  };
  telemetryEvents = [entry, ...telemetryEvents].slice(0, 100);
  return entry;
};

/**
 * Simulasi endpoint GET /api/students
 */
export const getStudents = async () => {
  await delay(300);
  return mockStudents;
};

/**
 * Simulasi endpoint POST /api/quiz/answer
 */
export const submitQuizAnswer = async (payload: {
  studentId: string;
  questionId: string;
  answer: string | string[];
}) => {
  await delay(500);
  const nextQuestion = mockQuizQuestions[Math.floor(Math.random() * mockQuizQuestions.length)];
  return {
    status: "success",
    feedback: "Terima kasih, jawaban kamu sudah tercatat.",
    nextQuestion,
  };
};

/**
 * Simulasi endpoint GET /api/reports?from=...&to=...
 */
export const getReports = async (params: { from?: string; to?: string }) => {
  await delay(200);
  return mockReports.filter((report) => {
    if (!params.from || !params.to) return true;
    return report.generatedAt >= params.from && report.generatedAt <= params.to;
  });
};

/**
 * Simulasi endpoint GET /api/content/items
 */
export const getContentLibrary = async () => {
  await delay(250);
  return mockContentItems;
};

/**
 * Simulasi endpoint GET /api/events/log
 */
export const getActivityLog = async () => {
  await delay(200);
  return mockStudentEvents;
};

export const getSkillTree = async () => {
  await delay(220);
  return cloneSkillTree(skillTreeState);
};

export const getGamifiedProfile = async () => {
  await delay(180);
  return { ...gamifiedProfile };
};

export const completeLesson = async (payload: { lessonId: string; studentId?: string }) => {
  await delay(400);
  const lookup = findLessonById(payload.lessonId);
  if (!lookup) {
    return {
      status: "error" as const,
      message: "Lesson tidak ditemukan",
    };
  }

  const { lesson, skill, unit, lessonIndex, skillIndex, unitIndex } = lookup;

  if (lesson.status === "locked") {
    return {
      status: "error" as const,
      message: "Lesson masih terkunci",
    };
  }

  const studentId = payload.studentId ?? gamifiedProfile.studentId;
  const studentName = gamifiedProfile.displayName;
  const xpEarned = lesson.status === "mastered" ? 0 : lesson.xpReward;
  const streakIncrement = lesson.status === "mastered" ? 0 : lesson.streakReward ?? 0;

  if (lesson.status !== "mastered") {
    lesson.status = "mastered";
    lesson.completedAt = new Date().toISOString();
    lesson.attempts = (lesson.attempts ?? 0) + 1;

    gamifiedProfile.xp += xpEarned;
    gamifiedProfile.xpInLevel += xpEarned;
    gamifiedProfile.dailyGoalProgress = Math.min(
      gamifiedProfile.dailyGoalProgress + xpEarned,
      gamifiedProfile.dailyGoalXP,
    );
    gamifiedProfile.dailyGoalMet = gamifiedProfile.dailyGoalProgress >= gamifiedProfile.dailyGoalXP;
    gamifiedProfile.lastLessonId = lesson.id;
    gamifiedProfile.lastCompletedAt = lesson.completedAt;

    if (gamifiedProfile.xpInLevel >= gamifiedProfile.xpForNextLevel) {
      gamifiedProfile.level += 1;
      gamifiedProfile.xpInLevel -= gamifiedProfile.xpForNextLevel;
      gamifiedProfile.xpForNextLevel = Math.round(gamifiedProfile.xpForNextLevel * 1.15);
    }

    if (streakIncrement > 0) {
      gamifiedProfile.streak += streakIncrement;
      gamifiedProfile.bestStreak = Math.max(gamifiedProfile.bestStreak, gamifiedProfile.streak);
    }

    const newlyUnlockedLesson = unlockNextLesson(skill, lessonIndex);
    updateSkillMastery(skill);

    let unlockInfo: UnlockResult = null;
    if (skill.status === "completed") {
      unlockInfo = unlockNextSkill(unitIndex, skillIndex);
      if (unit.reward && !unit.rewardClaimed) {
        gamifiedProfile.xp += unit.reward.xp;
        gamifiedProfile.xpInLevel += unit.reward.xp;
        unit.rewardClaimed = true;
        logTelemetryEvent({
          type: "reward_claimed",
          studentId,
          studentName,
          metadata: {
            unitId: unit.id,
            rewardType: unit.reward.type,
            rewardLabel: unit.reward.label,
            xpBonus: unit.reward.xp,
          },
        });
      }
    }

    logTelemetryEvent({
      type: "lesson_completed",
      studentId,
      studentName,
      metadata: {
        lessonId: lesson.id,
        skillId: skill.id,
        unitId: unit.id,
        xpEarned,
        streakIncrement,
      },
    });

    if (newlyUnlockedLesson) {
      logTelemetryEvent({
        type: "lesson_unlocked",
        studentId,
        studentName,
        metadata: {
          lessonId: newlyUnlockedLesson.id,
          skillId: skill.id,
          unitId: unit.id,
        },
      });
    }

    if (unlockInfo?.unlockedSkill) {
      logTelemetryEvent({
        type: "skill_unlocked",
        studentId,
        studentName,
        metadata: {
          skillId: unlockInfo.unlockedSkill.id,
          unitId: unit.id,
        },
      });
    }

    if (unlockInfo?.unlockedUnit) {
      logTelemetryEvent({
        type: "unit_progressed",
        studentId,
        studentName,
        metadata: {
          unitId: unlockInfo.unlockedUnit.id,
        },
      });
    }

    if (unlockInfo?.unlockedLesson) {
      logTelemetryEvent({
        type: "lesson_unlocked",
        studentId,
        studentName,
        metadata: {
          lessonId: unlockInfo.unlockedLesson.id,
          skillId: unlockInfo.unlockedSkill?.id ?? skill.id,
          unitId: unlockInfo.unlockedUnit?.id ?? unit.id,
        },
      });
    }

    if (unlockInfo?.unitCompleted) {
      logTelemetryEvent({
        type: "unit_progressed",
        studentId,
        studentName,
        metadata: {
          unitId: unlockInfo.unitCompleted.id,
          status: "completed",
        },
      });
    }
  }

  return {
    status: "success" as const,
    xpEarned,
    streakIncrement,
    profile: { ...gamifiedProfile },
    skillTree: cloneSkillTree(skillTreeState),
  };
};

export const claimStreakReward = async () => {
  await delay(250);
  if (!gamifiedProfile.dailyGoalMet || gamifiedProfile.dailyGoalClaimed) {
    return {
      status: "error" as const,
      message: "Daily goal belum terpenuhi atau sudah diklaim.",
    };
  }

  const xpBonus = 30;
  gamifiedProfile.dailyGoalClaimed = true;
  gamifiedProfile.xp += xpBonus;
  gamifiedProfile.xpInLevel += xpBonus;
  gamifiedProfile.streak += 1;
  gamifiedProfile.bestStreak = Math.max(gamifiedProfile.bestStreak, gamifiedProfile.streak);

  if (gamifiedProfile.xpInLevel >= gamifiedProfile.xpForNextLevel) {
    gamifiedProfile.level += 1;
    gamifiedProfile.xpInLevel -= gamifiedProfile.xpForNextLevel;
    gamifiedProfile.xpForNextLevel = Math.round(gamifiedProfile.xpForNextLevel * 1.15);
  }

  logTelemetryEvent({
    type: "daily_goal_claimed",
    studentId: gamifiedProfile.studentId,
    studentName: gamifiedProfile.displayName,
    metadata: {
      xpBonus,
      streak: gamifiedProfile.streak,
    },
  });

  return {
    status: "success" as const,
    xpBonus,
    profile: { ...gamifiedProfile },
  };
};

export const getTelemetryEvents = async () => {
  await delay(180);
  return [...telemetryEvents];
};

export const getAiMentorSession = async () => {
  await delay(200);
  return { ...mentorSession, messages: [...mentorSession.messages] };
};

export const sendAiMentorMessage = async (payload: { content: string; topicId?: string }) => {
  await delay(300);
  const message: AiMentorMessage = {
    id: `ai-msg-${mentorSession.messages.length + 1}`,
    role: "student",
    content: payload.content,
    topicId: payload.topicId,
    timestamp: new Date().toISOString(),
  };
  mentorSession.messages = [...mentorSession.messages, message];

  const assistantFollowUp: AiMentorMessage = {
    id: `ai-msg-${mentorSession.messages.length + 1}`,
    role: "assistant",
    content: "Terima kasih! AI akan meninjau jawabanmu dan memberi respons kustom saat model nyata terhubung.",
    timestamp: new Date().toISOString(),
  };
  mentorSession.messages = [...mentorSession.messages, assistantFollowUp];

  return {
    status: "success" as const,
    session: { ...mentorSession, messages: [...mentorSession.messages] },
  };
};

export const getAiRecommendations = async () => {
  await delay(220);
  return { ...mockAiRecommendations, recommendations: [...mockAiRecommendations.recommendations] };
};

export const getAiInterventions = async () => {
  await delay(220);
  return {
    ...mockAiInterventions,
    suggestions: mockAiInterventions.suggestions.map((item) => ({ ...item, supportingData: [...item.supportingData] })),
  };
};

export const getAiParentSummary = async () => {
  await delay(180);
  return { ...mockAiParentSummary, highlights: [...mockAiParentSummary.highlights], focusAreas: [...mockAiParentSummary.focusAreas], recommendedActions: [...mockAiParentSummary.recommendedActions] };
};

export const getAiRewards = async () => {
  await delay(200);
  return { ...mockAiRewards, quests: [...mockAiRewards.quests] };
};
