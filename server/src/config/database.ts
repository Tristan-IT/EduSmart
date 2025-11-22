import mongoose from "mongoose";
import env from "./env.js";

export const connectDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGODB_URI, {
      dbName: "adapti_portal",
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};

export default mongoose;
