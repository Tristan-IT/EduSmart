import { Router, type Request, type Response, type NextFunction } from "express";
import { loginValidation, registerValidation } from "../services/authService.js";
import { authenticate, type AuthenticatedRequest } from "../middleware/authenticate.js";
import {
  currentUser,
  handleGoogleCallback,
  login,
  register,
} from "../controllers/authController.js";
import passport from "passport";

export const authRouter = Router();

authRouter.post("/register", registerValidation, register);
authRouter.post("/login", loginValidation, login);
authRouter.get("/me", authenticate, currentUser as any);

authRouter.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const role = req.query.role === "teacher" ? "teacher" : "student";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: role,
  })(req, res, next);
});

authRouter.get("/google/callback", handleGoogleCallback);

export default authRouter;
