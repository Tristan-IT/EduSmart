import { Schema, model, type Document } from "mongoose";

export type LeagueTier = "bronze" | "silver" | "gold" | "diamond" | "platinum" | "quantum";

interface LeagueUserStanding {
  userId: string;
  name: string;
  avatar: string;
  rank: number;
  weeklyXP: number;
  totalXP: number;
  trend: "up" | "down" | "same";
  previousRank?: number;
}

export interface LeagueStandingDocument extends Document {
  weekStart: Date;
  weekEnd: Date;
  league: LeagueTier;
  standings: LeagueUserStanding[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const leagueUserStandingSchema = new Schema<LeagueUserStanding>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    rank: { type: Number, required: true },
    weeklyXP: { type: Number, required: true, default: 0 },
    totalXP: { type: Number, required: true, default: 0 },
    trend: { type: String, enum: ["up", "down", "same"], default: "same" },
    previousRank: { type: Number },
  },
  { _id: false }
);

const leagueStandingSchema = new Schema<LeagueStandingDocument>(
  {
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    league: { 
      type: String, 
      enum: ["bronze", "silver", "gold", "diamond", "platinum", "quantum"], 
      required: true,
      index: true
    },
    standings: { type: [leagueUserStandingSchema], default: [] },
    lastUpdated: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Compound index untuk query standings by week and league
leagueStandingSchema.index({ league: 1, weekStart: -1 });

export const LeagueStandingModel = model<LeagueStandingDocument>("LeagueStanding", leagueStandingSchema);

export default LeagueStandingModel;
