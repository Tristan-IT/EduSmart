import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["MONGODB_URI", "JWT_SECRET", "SESSION_SECRET"] as const;

type RequiredKey = (typeof requiredEnv)[number];

type EnvConfig = Record<RequiredKey, string> & {
  PORT: number;
  CLIENT_ORIGIN: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  AI_GATEWAY_URL?: string;
  AI_GATEWAY_KEY?: string;
  AI_MODEL_NAME?: string;
};

const env: EnvConfig = {
  MONGODB_URI: process.env.MONGODB_URI ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  SESSION_SECRET: process.env.SESSION_SECRET ?? "",
  PORT: Number(process.env.PORT ?? 5000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  AI_GATEWAY_URL: process.env.AI_GATEWAY_URL,
  AI_GATEWAY_KEY: process.env.AI_GATEWAY_KEY,
  AI_MODEL_NAME: process.env.AI_MODEL_NAME,
};

requiredEnv.forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export default env;
