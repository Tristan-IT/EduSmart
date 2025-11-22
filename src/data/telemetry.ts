export type TelemetryEventType =
  | "lesson_completed"
  | "lesson_unlocked"
  | "skill_unlocked"
  | "unit_progressed"
  | "reward_claimed"
  | "daily_goal_claimed";

export interface TelemetryEvent {
  id: string;
  type: TelemetryEventType;
  studentId: string;
  studentName: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export const initialTelemetryEvents: TelemetryEvent[] = [
  {
    id: "telemetry-0001",
    type: "lesson_completed",
    studentId: "1",
    studentName: "Tristan Firdaus",
    timestamp: new Date("2025-01-14T08:35:00Z").toISOString(),
    metadata: {
      lessonId: "lesson-linear-2",
      skillId: "skill-linear",
      unitId: "unit-1",
      xpEarned: 20,
      streakIncrement: 1,
    },
  },
  {
    id: "telemetry-0002",
    type: "reward_claimed",
    studentId: "1",
    studentName: "Tristan Firdaus",
    timestamp: new Date("2025-01-14T08:40:00Z").toISOString(),
    metadata: {
      rewardType: "chest",
      rewardLabel: "Peti Emas Dasar",
      xpBonus: 80,
    },
  },
  {
    id: "telemetry-0003",
    type: "daily_goal_claimed",
    studentId: "3",
    studentName: "Budi Santoso",
    timestamp: new Date("2025-01-13T12:05:00Z").toISOString(),
    metadata: {
      streak: 5,
      xpBonus: 30,
    },
  },
];
