import type { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyAccessToken } from "../utils/token.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    id: string;
    role: string;
    name: string;
    email: string;
  };
}

export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Otorisasi diperlukan." });
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    return res.status(401).json({ message: "Token tidak valid." });
  }

  try {
    const payload = verifyAccessToken(token);
    (req as any).user = {
      _id: payload.sub,
      id: payload.sub,
      role: payload.role,
      name: payload.name,
      email: payload.email,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token kedaluwarsa atau tidak valid." });
  }
};

/**
 * Middleware to require teacher or school_owner role
 */
export const requireTeacher: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ message: "Otorisasi diperlukan." });
  }

  if (user.role !== 'teacher' && user.role !== 'school_owner') {
    return res.status(403).json({ 
      message: "Akses ditolak. Hanya guru atau pemilik sekolah yang dapat mengakses fitur ini." 
    });
  }

  return next();
};
