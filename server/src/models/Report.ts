import { Schema, model, type Document } from "mongoose";

export type ReportType = "kelas" | "individu" | "ringkas";

export interface ReportDocument extends Document {
  title: string;
  type: ReportType;
  generatedAt: Date;
  url: string;
  filters: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["kelas", "individu", "ringkas"], required: true },
    generatedAt: { type: Date, required: true },
    url: { type: String, required: true },
    filters: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ReportModel = model<ReportDocument>("Report", reportSchema);

export default ReportModel;
