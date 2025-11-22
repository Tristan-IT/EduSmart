import mongoose from "mongoose";
import SkillTreeNodeModel from "../models/SkillTreeNode";
import SkillTreePathModel from "../models/SkillTreePath";
import env from "../config/env";

/**
 * Generate Template Paths Script
 * 
 * This script automatically generates learning paths by grouping existing
 * skill tree nodes based on their gradeLevel, classNumber, semester, subject, and major.
 * 
 * Run: npx tsx server/src/scripts/generateTemplatePaths.ts
 */

interface PathGroup {
  gradeLevel: string;
  classNumber: number;
  semester: number;
  subject: string;
  major?: string;
  curriculum: string;
  nodes: any[];
}

async function generateTemplatePaths() {
  try {
    console.log("🚀 Starting template path generation...\n");

    // Connect to database
    await mongoose.connect(env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Fetch all skill tree nodes
    const allNodes = await SkillTreeNodeModel.find({ isActive: true }).sort({
      gradeLevel: 1,
      classNumber: 1,
      semester: 1,
      level: 1,
    });

    console.log(`📊 Found ${allNodes.length} active skill tree nodes\n`);

    // Group nodes by path criteria
    const pathGroups = new Map<string, PathGroup>();

    allNodes.forEach((node) => {
      // Create unique key for grouping
      // @ts-ignore - node.major may exist
      const key = `${node.gradeLevel}-${node.classNumber}-${node.semester}-${node.subject}-${
        // @ts-ignore - node.major may exist
        node.major || "NONE"
      }`;

      if (!pathGroups.has(key)) {
        pathGroups.set(key, {
          // @ts-ignore - node properties exist
          gradeLevel: node.gradeLevel || "",
          // @ts-ignore - node properties exist
          classNumber: node.classNumber || 0,
          // @ts-ignore - node properties exist  
          semester: node.semester || 0,
          // @ts-ignore - node properties exist
          subject: node.subject?.toString() || "",
          // @ts-ignore - node.major may exist
          major: node.major,
          curriculum: node.curriculum || "Kurikulum Merdeka",
          nodes: [],
        });
      }

      pathGroups.get(key)!.nodes.push(node);
    });

    console.log(`📦 Grouped into ${pathGroups.size} potential paths\n`);

    // Generate paths
    let createdCount = 0;
    let skippedCount = 0;

    for (const [key, group] of pathGroups) {
      // Generate pathId
      const pathId = `PATH-${group.gradeLevel}-${group.classNumber}-${group.semester}-${group.subject
        .replace(/\s+/g, "-")
        .toUpperCase()}${group.major ? `-${group.major}` : ""}-${Date.now().toString().slice(-6)}`;

      // Check if similar path already exists
      const existingPath = await SkillTreePathModel.findOne({
        gradeLevel: group.gradeLevel,
        classNumber: group.classNumber,
        semester: group.semester,
        subject: group.subject,
        major: group.major,
        isTemplate: true,
      });

      if (existingPath) {
        console.log(`⏭️  Skipping ${key} - path already exists (${existingPath.pathId})`);
        skippedCount++;
        continue;
      }

      // Calculate aggregate statistics
      const nodeIds = group.nodes.map((n) => n.nodeId);
      const totalXP = group.nodes.reduce((sum, n) => sum + (n.xpReward || 0), 0);
      const totalQuizzes = group.nodes.reduce((sum, n) => sum + (n.quizCount || 0), 0);
      const estimatedHours =
        Math.round(
          (group.nodes.reduce((sum, n) => sum + (n.estimatedMinutes || 0), 0) / 60) * 10
        ) / 10;
      const checkpointCount = group.nodes.filter((n) => n.isCheckpoint).length;

      // Extract learning outcomes from nodes
      const learningOutcomes = [
        ...new Set(
          group.nodes.flatMap((n) => n.learningOutcomes || []).filter((o) => o.trim() !== "")
        ),
      ];

      // Extract KD codes
      const kompetensiDasar = [
        ...new Set(
          group.nodes.flatMap((n) => n.kompetensiDasar || []).filter((k) => k.trim() !== "")
        ),
      ];

      // Determine overall difficulty
      const difficulties = group.nodes.map((n) => n.difficulty);
      const difficultySet = new Set(difficulties);
      let overallDifficulty: "Mudah" | "Sedang" | "Sulit" | "Campuran" = "Sedang";
      if (difficultySet.size === 1) {
        overallDifficulty = difficulties[0] as "Mudah" | "Sedang" | "Sulit";
      } else {
        overallDifficulty = "Campuran";
      }

      // Generate name and description
      const name = `${group.subject} - Kelas ${group.classNumber} Semester ${group.semester}${
        group.major ? ` (${group.major})` : ""
      }`;

      const description = `Jalur pembelajaran lengkap untuk ${group.subject} kelas ${
        group.classNumber
      } semester ${group.semester}${group.major ? ` jurusan ${group.major}` : ""}. Mencakup ${
        group.nodes.length
      } topik dengan total ${totalQuizzes} kuis dan estimasi ${estimatedHours} jam belajar.`;

      // Generate tags
      const tags = [
        group.gradeLevel,
        `Kelas-${group.classNumber}`,
        `Semester-${group.semester}`,
        group.subject,
        group.curriculum,
      ];
      if (group.major) tags.push(group.major);

      // Create path
      const newPath = new SkillTreePathModel({
        pathId,
        name,
        description,
        gradeLevel: group.gradeLevel,
        classNumber: group.classNumber,
        semester: group.semester,
        subject: group.subject,
        major: group.major,
        curriculum: group.curriculum,
        nodeIds,
        totalNodes: nodeIds.length,
        totalXP,
        totalQuizzes,
        estimatedHours,
        checkpointCount,
        learningOutcomes,
        kompetensiDasar,
        prerequisites: [], // Can be set manually later
        isTemplate: true,
        isPublic: true,
        isActive: true,
        tags,
        difficulty: overallDifficulty,
      });

      await newPath.save();

      console.log(`✅ Created: ${name}`);
      console.log(`   ID: ${pathId}`);
      console.log(`   Nodes: ${nodeIds.length}, XP: ${totalXP}, Quizzes: ${totalQuizzes}`);
      console.log(`   Estimated Hours: ${estimatedHours}, Checkpoints: ${checkpointCount}\n`);

      createdCount++;
    }

    console.log("\n📈 Summary:");
    console.log(`   ✅ Created: ${createdCount} paths`);
    console.log(`   ⏭️  Skipped: ${skippedCount} paths (already exist)`);
    console.log(`   📊 Total nodes: ${allNodes.length}`);

    console.log("\n✨ Template path generation complete!");

    await mongoose.connection.close();
    console.log("🔌 Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error generating template paths:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
generateTemplatePaths();
