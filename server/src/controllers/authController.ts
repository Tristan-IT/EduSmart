import type { Request, Response } from "express";
import passport from "passport";
import env from "../config/env.js";
import { buildValidationError, loginWithEmail, registerUser } from "../services/authService.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

export const register = async (req: Request, res: Response) => {
  const validationErrors = buildValidationError(req);
  if (validationErrors) {
    return res.status(422).json({ errors: validationErrors });
  }

  try {
    const { user, token } = await registerUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      className: req.body.className,
    });
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        className: user.className,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const validationErrors = buildValidationError(req);
  if (validationErrors) {
    return res.status(422).json({ errors: validationErrors });
  }

  try {
    const { user, token } = await loginWithEmail(req.body.email, req.body.password);
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        className: user.className,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message });
  }
};

export const currentUser = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
  return res.status(200).json({
    user: req.user,
  });
};

export const startGoogleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const handleGoogleCallback = (
  req: Request,
  res: Response,
  next: (err?: unknown) => void
) => {
  passport.authenticate("google", { session: false }, (err: unknown, user: unknown) => {
    if (err || !user) {
      return res.redirect(`${env.CLIENT_ORIGIN}/auth/error`);
    }
    const { token, role } = user as { token: string; role: string };
    const redirectUrl = new URL("/auth/callback", env.CLIENT_ORIGIN);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("role", role);
    return res.redirect(redirectUrl.toString());
  })(req, res, next);
};
