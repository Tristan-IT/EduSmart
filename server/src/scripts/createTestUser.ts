import { connectDatabase } from "../config/database.js";
import UserModel from "../models/User.js";
import StudentProfileModel from "../models/StudentProfile.js";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

async function createTestUser() {
  try {
    console.log("🚀 Creating test user...\n");
    
    await connectDatabase();

    // Create test user
    const existingUser = await UserModel.findOne({ email: "student@test.com" });
    
    if (existingUser) {
      console.log("✅ Test user already exists");
      console.log(`Email: student@test.com`);
      console.log(`ID: ${existingUser._id}`);
      
      // Check if profile exists
      const profile = await StudentProfileModel.findOne({ user: existingUser._id });
      if (profile) {
        console.log("✅ Student profile already exists");
      } else {
        // Create profile
        await createProfile(existingUser._id);
      }
      
      return;
    }

    const hashedPassword = await bcryptjs.hash("test123", 10);

    const user = await UserModel.create({
      name: "Test Student",
      email: "student@test.com",
      passwordHash: hashedPassword,
      role: "student",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
    });

    console.log("✅ Test user created successfully!");
    console.log(`Email: student@test.com`);
    console.log(`Password: test123`);
    console.log(`ID: ${user._id}`);

    // Create student profile
    await createProfile(user._id);

    console.log("\n🎉 Setup complete! You can now login with:");
    console.log("Email: student@test.com");
    console.log("Password: test123\n");

  } catch (error) {
    console.error("❌ Error creating test user:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("📤 Database connection closed");
    process.exit(0);
  }
}

async function createProfile(userId: any) {
  const profile = await StudentProfileModel.create({
    user: userId,
    masteryPerTopic: {},
    xp: 0,
    level: 1,
    xpInLevel: 0,
    xpForNextLevel: 100,
    streak: 0,
    bestStreak: 0,
    dailyGoalXP: 30,
    dailyGoalProgress: 0,
    dailyGoalMet: false,
    dailyGoalClaimed: false,
    league: "bronze",
    riskLevel: "low",
    boosts: [],
    dailyPlan: [],
    aiRecommendations: [],
    aiRewardQuests: [],
    skillTree: [],
  });

  console.log("✅ Student profile created!");
  console.log(`Profile ID: ${profile._id}`);
}

createTestUser();
