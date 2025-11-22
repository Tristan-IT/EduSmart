import { Schema, model, type Document, type Types } from "mongoose";
import type { UserDocument } from "./User.js";

export type TransactionType = "earn" | "spend";

export interface GemTransactionDocument extends Document {
  user: Types.ObjectId | UserDocument;
  type: TransactionType;
  amount: number;
  reason: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const gemTransactionSchema = new Schema<GemTransactionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["earn", "spend"], required: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Index untuk query transaction history
gemTransactionSchema.index({ user: 1, createdAt: -1 });

export const GemTransactionModel = model<GemTransactionDocument>("GemTransaction", gemTransactionSchema);

export default GemTransactionModel;
