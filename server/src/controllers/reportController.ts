import type { Request, Response } from "express";
import { ReportModel } from "../models/Report.js";

export const listReports = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  const query: Record<string, unknown> = {};
  if (from || to) {
    query.generatedAt = {};
    if (from) {
      (query.generatedAt as Record<string, Date>).$gte = new Date(from as string);
    }
    if (to) {
      (query.generatedAt as Record<string, Date>).$lte = new Date(to as string);
    }
  }
  const reports = await ReportModel.find(query).sort({ generatedAt: -1 }).exec();
  return res.json({ reports });
};
