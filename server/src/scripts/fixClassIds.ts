import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ClassModel from "../models/Class.js";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/adapti-portal";

async function fixClassIds() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get all classes
    const classes = await ClassModel.find({});
    console.log(`\n📊 Found ${classes.length} classes`);

    let fixed = 0;
    let skipped = 0;

    for (const cls of classes) {
      // Check if classId has correct format (CLS-XXXXX with 5 digits)
      const match = cls.classId?.match(/^CLS-(\d+)$/);
      
      if (!match) {
        console.log(`⚠️  Invalid format: ${cls.classId}`);
        continue;
      }

      const number = match[1];
      
      // If not 5 digits, fix it
      if (number.length !== 5) {
        const oldId = cls.classId;
        const newId = `CLS-${number.padStart(5, "0")}`;
        
        cls.classId = newId;
        await cls.save();
        
        fixed++;
        console.log(`✅ Fixed: ${oldId} → ${newId}`);
      } else {
        skipped++;
      }
    }

    console.log(`\n✅ Fix complete!`);
    console.log(`   - Fixed: ${fixed}`);
    console.log(`   - Already correct: ${skipped}`);
    console.log(`   - Total: ${classes.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixClassIds();
