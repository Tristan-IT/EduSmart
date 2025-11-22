import { connectDatabase } from "../config/database.js";
import { seedAchievements } from "./seedAchievements.js";
import { seedSkillTree } from "./seedSkillTree.js";
import { seedQuizzes } from "./seedQuizzes.js";
import mongoose from "mongoose";

async function seedAll() {
  try {
    console.log("🚀 Starting database seeding...\n");
    
    // Connect to database
    await connectDatabase();
    
    // Run all seed scripts
    await seedAchievements();
    console.log("");
    
    await seedSkillTree();
    console.log("");
    
    await seedQuizzes();
    console.log("");
    
    console.log("✅ All data seeded successfully!");
    console.log("🎉 Database is ready to use!\n");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("📤 Database connection closed");
    process.exit(0);
  }
}

// Run seeding
seedAll();
