import { randomUUID } from "crypto";
import { body, validationResult } from "express-validator";
import type { Request } from "express";
import UserModel, { type UserDocument } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken } from "../utils/token.js";

export const loginValidation = [
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
];

export const registerValidation = [
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
  body("role").isIn(["student", "teacher"]).withMessage("Role tidak dikenali"),
];

export const buildValidationError = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array();
  }
  return null;
};

export const loginWithEmail = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email }).exec();
  if (!user || !user.passwordHash) {
    throw new Error("Email atau password salah");
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Email atau password salah");
  }

  const token = signAccessToken({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  return { user, token };
};

export const registerUser = async (
  payload: Pick<UserDocument, "name" | "email" | "role"> & { password: string; className?: string }
) => {
  const existing = await UserModel.findOne({ email: payload.email }).exec();
  if (existing) {
    throw new Error("Email sudah terdaftar");
  }

  const passwordHash = await hashPassword(payload.password);

  const user = await UserModel.create({
    name: payload.name,
    email: payload.email,
    role: payload.role,
    passwordHash,
    className: payload.className,
    avatar: payload.name ? payload.name.charAt(0).toUpperCase() : undefined,
    schoolId: payload.role === "teacher" ? randomUUID() : undefined,
  });

  const token = signAccessToken({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  return { user, token };
};

export const upsertUserFromGoogle = async (
  profile: { id: string; displayName: string; emails?: Array<{ value: string }>; photos?: Array<{ value: string }> },
  role: "student" | "teacher"
) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error("Google account tidak memiliki email");
  }

  const user = await UserModel.findOneAndUpdate(
    { googleId: profile.id },
    {
      googleId: profile.id,
      name: profile.displayName,
      email,
      role,
      avatar: profile.photos?.[0]?.value,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  const token = signAccessToken({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  return { user, token };
};
