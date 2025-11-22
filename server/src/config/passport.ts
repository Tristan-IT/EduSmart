import passport, { type Profile } from "passport";
import { Strategy as GoogleStrategy, type VerifyCallback } from "passport-google-oauth20";
import type { Request } from "express";
import env from "./env.js";
import { upsertUserFromGoogle } from "../services/authService.js";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj as Express.User);
});

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        passReqToCallback: true,
      },
      async (
        req: Request,
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const roleState = (req.query.state as string) ?? "student";
          const role = roleState === "teacher" ? "teacher" : "student";
          const { user, token } = await upsertUserFromGoogle(
            {
              id: profile.id,
              displayName: profile.displayName,
              emails: profile.emails ?? undefined,
              photos: profile.photos ?? undefined,
            },
            role
          );
          done(null, { id: user.id, role: user.role, token });
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
} else {
  console.warn("Google OAuth credentials not configured. Google login disabled.");
}

export default passport;
