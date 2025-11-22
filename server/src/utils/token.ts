import jwt from "jsonwebtoken";
import env from "../config/env.js";

export interface JwtPayload {
  sub: string;
  role: string;
  name: string;
  email: string;
}

export const signAccessToken = (payload: JwtPayload, expiresIn: string = "2h"): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn } as jwt.SignOptions);

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as JwtPayload;
