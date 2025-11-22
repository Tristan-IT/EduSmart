import mongoose from "mongoose";
import SchoolModel from "../models/School.js";
import ClassModel from "../models/Class.js";
import { generateClassName } from "../utils/classHelpers.js";

/**
 * Migration Script untuk Class Management System
 * 
 * Tujuan:
 * 1. Update existing schools dengan default schoolType='SMA'
 * 2. Update existing classes dengan new required fields
 * 3. Backfill displayName dan shortName untuk existing classes
 * 
 * Run command:
 * ts-node src/scripts/migrateClassSystem.ts
 * atau
 * node dist/scripts/migrateClassSystem.js (after build)
 */

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/adapti-portal";

async function migrateClassSystem() {
  try {
    console.log("🚀 Starting Class Management System Migration...\n");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // ==================== PHASE 1: Migrate Schools ====================
    console.log("📋 Phase 1: Migrating Schools...");
    
    const schools = await SchoolModel.find({});
    console.log(`Found ${schools.length} schools\n`);

    let schoolsUpdated = 0;
    for (const school of schools) {
      const updates: any = {};

      // Set default schoolType if not exists
      if (!school.schoolType) {
        updates.schoolType = "SMA";
        console.log(`  - Setting schoolType='SMA' for school: ${school.schoolName}`);
      }

      // Set default SMA specializations if schoolType is SMA and not configured
      if (school.schoolType === "SMA" && (!school.smaSpecializations || school.smaSpecializations.length === 0)) {
        updates.smaSpecializations = ["IPA", "IPS", "BAHASA"];
        console.log(`  - Setting default SMA specializations for: ${school.schoolName}`);
      }

      // Clear incompatible configurations
      if (school.schoolType === "SD" || school.schoolType === "SMP") {
        if (school.smaSpecializations || school.smkMajors) {
          updates.smaSpecializations = undefined;
          updates.smkMajors = undefined;
          console.log(`  - Clearing SMA/SMK configs for ${school.schoolType}: ${school.schoolName}`);
        }
      }

      if (Object.keys(updates).length > 0) {
        await SchoolModel.findByIdAndUpdate(school._id, updates);
        schoolsUpdated++;
      }
    }

    console.log(`\n✅ Phase 1 Complete: ${schoolsUpdated} schools updated\n`);

    // ==================== PHASE 2: Migrate Classes ====================
    console.log("📋 Phase 2: Migrating Classes...");

    const classes = await ClassModel.find({}).populate("school");
    console.log(`Found ${classes.length} classes\n`);

    let classesUpdated = 0;
    let classesFailed = 0;
    const errors: string[] = [];

    for (const classDoc of classes) {
      try {
        const school = classDoc.school as any;
        if (!school) {
          console.log(`  ⚠️  Skipping class ${classDoc.className} - no school found`);
          classesFailed++;
          continue;
        }

        const updates: any = {};
        let needsUpdate = false;

        // Set schoolType from school
        if (!classDoc.schoolType) {
          updates.schoolType = school.schoolType || "SMA";
          needsUpdate = true;
        }

        // Set schoolId and schoolName if missing
        if (!classDoc.schoolId) {
          updates.schoolId = school.schoolId;
          needsUpdate = true;
        }
        if (!classDoc.schoolName) {
          updates.schoolName = school.schoolName;
          needsUpdate = true;
        }

        // Parse grade if it's a string
        if (typeof classDoc.grade === "string") {
          updates.grade = parseInt(classDoc.grade);
          needsUpdate = true;
        }

        // Ensure section exists
        if (!classDoc.section) {
          updates.section = "1";
          needsUpdate = true;
        }

        // Generate displayName and shortName if missing
        if (!classDoc.displayName || !classDoc.shortName) {
          const schoolType = updates.schoolType || classDoc.schoolType || school.schoolType;
          const grade = updates.grade || classDoc.grade;
          const section = updates.section || classDoc.section;

          // Try to extract specialization/major from existing className
          let specialization: string | undefined;
          let majorCode: string | undefined;

          if (schoolType === "SMA" && grade >= 11) {
            // Try to extract from className (e.g., "11 IPA 1" -> IPA)
            const match = classDoc.className?.match(/(IPA|IPS|BAHASA)/i);
            if (match) {
              specialization = match[1].toUpperCase();
              updates.specialization = specialization;
            }
          } else if (schoolType === "SMK") {
            // Try to extract major code from className
            const match = classDoc.className?.match(/([A-Z]{2,5})/);
            if (match) {
              majorCode = match[1].toUpperCase();
              updates.majorCode = majorCode;
              
              // Try to find major name from school config
              if (school.smkMajors && school.smkMajors.length > 0) {
                const major = school.smkMajors.find((m: any) => m.code === majorCode);
                if (major) {
                  updates.majorName = major.name;
                }
              }
            }
          }

          // Generate names
          const generated = generateClassName({
            schoolType,
            grade,
            section,
            specialization: specialization || classDoc.specialization,
            majorCode: majorCode || classDoc.majorCode,
            majorName: classDoc.majorName,
          });

          updates.className = generated.className;
          updates.displayName = generated.displayName;
          updates.shortName = generated.shortName;
          needsUpdate = true;

          console.log(`  - Generating names for class: ${generated.displayName}`);
        }

        // Update if needed
        if (needsUpdate) {
          await ClassModel.findByIdAndUpdate(classDoc._id, updates);
          classesUpdated++;
        }
      } catch (error: any) {
        classesFailed++;
        const errorMsg = `Failed to migrate class ${classDoc.className}: ${error.message}`;
        errors.push(errorMsg);
        console.log(`  ❌ ${errorMsg}`);
      }
    }

    console.log(`\n✅ Phase 2 Complete: ${classesUpdated} classes updated, ${classesFailed} failed\n`);

    if (errors.length > 0) {
      console.log("⚠️  Errors encountered:");
      errors.forEach((err) => console.log(`  - ${err}`));
      console.log();
    }

    // ==================== PHASE 3: Validation ====================
    console.log("📋 Phase 3: Validating Migration...");

    const schoolsWithoutType = await SchoolModel.countDocuments({ schoolType: { $exists: false } });
    const classesWithoutDisplayName = await ClassModel.countDocuments({
      displayName: { $exists: false },
    });
    const classesWithoutSchoolType = await ClassModel.countDocuments({
      schoolType: { $exists: false },
    });

    console.log(`  - Schools without schoolType: ${schoolsWithoutType}`);
    console.log(`  - Classes without displayName: ${classesWithoutDisplayName}`);
    console.log(`  - Classes without schoolType: ${classesWithoutSchoolType}`);

    if (schoolsWithoutType === 0 && classesWithoutDisplayName === 0 && classesWithoutSchoolType === 0) {
      console.log("\n✅ Phase 3 Complete: All data validated successfully\n");
    } else {
      console.log("\n⚠️  Phase 3 Complete: Some data may need manual review\n");
    }

    // ==================== Summary ====================
    console.log("============================================================");
    console.log("📊 MIGRATION SUMMARY");
    console.log("============================================================");
    console.log(`Total Schools: ${schools.length}`);
    console.log(`Schools Updated: ${schoolsUpdated}`);
    console.log(`Total Classes: ${classes.length}`);
    console.log(`Classes Updated: ${classesUpdated}`);
    console.log(`Classes Failed: ${classesFailed}`);
    console.log("============================================================");

    console.log("\n✅ Migration completed successfully!\n");
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run migration
migrateClassSystem();
