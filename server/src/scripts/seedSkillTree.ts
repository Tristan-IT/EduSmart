import SkillTreeNodeModel from "../models/SkillTreeNode.js";

// Import SD and SMP skill trees
import { allSDNodes } from "../data/skillTreesSD.js";
import { allMathSMPNodes } from "../data/skillTreesSMP.js";
import { allIndoSMPNodes, allIPSSMPNodes } from "../data/skillTreesSMPOther.js";
import { allIPASMPNodes } from "../data/skillTreesSMPIPA.js";
import { allEngSMPNodes, allPKnSMPNodes } from "../data/skillTreesSMPLang.js";
import { allSMANodes } from "../data/skillTreesSMA.js";

// Import SMK skill trees (all programs including priority majors)
import { allSMKNodes } from "../data/skillTreesSMK.js";

export const skillTreeNodes = [
  // === LEVEL 1: Foundation (Algebra Basics) ===
  {
    nodeId: "node-1",
    moduleId: "alg-linear-eq",
    title: "Persamaan Linear",
    categoryId: "algebra",
    categoryName: "Aljabar",
    description: "Dasar persamaan linear satu variabel",
    position: { x: 50, y: 0 },
    xpReward: 50,
    prerequisites: [],
    isCheckpoint: false,
    difficulty: "Mudah",
    estimatedDuration: "45 menit",
  },
  {
    nodeId: "node-2",
    moduleId: "alg-quadratic",
    title: "Persamaan Kuadrat",
    categoryId: "algebra",
    categoryName: "Aljabar",
    description: "Menyelesaikan persamaan kuadrat",
    position: { x: 50, y: 200 },
    xpReward: 60,
    prerequisites: ["node-1"],
    isCheckpoint: false,
    difficulty: "Sedang",
    estimatedDuration: "60 menit",
  },
  {
    nodeId: "node-3",
    moduleId: "alg-systems",
    title: "Sistem Persamaan",
    categoryId: "algebra",
    categoryName: "Aljabar",
    description: "Sistem persamaan linear dua variabel",
    position: { x: 50, y: 400 },
    xpReward: 70,
    prerequisites: ["node-2"],
    isCheckpoint: true,
    difficulty: "Sedang",
    estimatedDuration: "75 menit",
  },

  // === LEVEL 2: Geometry Branch ===
  {
    nodeId: "node-4",
    moduleId: "geo-basic",
    title: "Geometri Dasar",
    categoryId: "geometry",
    categoryName: "Geometri",
    description: "Konsep dasar geometri bidang",
    position: { x: 30, y: 600 },
    xpReward: 50,
    prerequisites: ["node-3"],
    isCheckpoint: false,
    difficulty: "Mudah",
    estimatedDuration: "45 menit",
  },
  {
    nodeId: "node-5",
    moduleId: "geo-triangles",
    title: "Segitiga",
    categoryId: "geometry",
    categoryName: "Geometri",
    description: "Properti dan teorema segitiga",
    position: { x: 30, y: 800 },
    xpReward: 60,
    prerequisites: ["node-4"],
    isCheckpoint: false,
    difficulty: "Sedang",
    estimatedDuration: "60 menit",
  },
  {
    nodeId: "node-6",
    moduleId: "geo-circles",
    title: "Lingkaran",
    categoryId: "geometry",
    categoryName: "Geometri",
    description: "Keliling, luas, dan properti lingkaran",
    position: { x: 30, y: 1000 },
    xpReward: 65,
    prerequisites: ["node-5"],
    isCheckpoint: true,
    difficulty: "Sedang",
    estimatedDuration: "70 menit",
  },

  // === LEVEL 3: Statistics Branch ===
  {
    nodeId: "node-7",
    moduleId: "stat-basic",
    title: "Statistika Dasar",
    categoryId: "statistics",
    categoryName: "Statistika",
    description: "Mean, median, modus, dan range",
    position: { x: 70, y: 600 },
    xpReward: 50,
    prerequisites: ["node-3"],
    isCheckpoint: false,
    difficulty: "Mudah",
    estimatedDuration: "50 menit",
  },
  {
    nodeId: "node-8",
    moduleId: "stat-charts",
    title: "Diagram & Grafik",
    categoryId: "statistics",
    categoryName: "Statistika",
    description: "Membaca dan membuat diagram",
    position: { x: 70, y: 800 },
    xpReward: 55,
    prerequisites: ["node-7"],
    isCheckpoint: false,
    difficulty: "Mudah",
    estimatedDuration: "55 menit",
  },
  {
    nodeId: "node-9",
    moduleId: "stat-probability",
    title: "Peluang",
    categoryId: "statistics",
    categoryName: "Statistika",
    description: "Konsep dasar probabilitas",
    position: { x: 70, y: 1000 },
    xpReward: 70,
    prerequisites: ["node-8"],
    isCheckpoint: true,
    difficulty: "Sedang",
    estimatedDuration: "65 menit",
  },

  // === LEVEL 4: Advanced Topics ===
  {
    nodeId: "node-10",
    moduleId: "alg-functions",
    title: "Fungsi",
    categoryId: "algebra",
    categoryName: "Aljabar",
    description: "Fungsi linear dan kuadrat",
    position: { x: 50, y: 1200 },
    xpReward: 75,
    prerequisites: ["node-6", "node-9"],
    isCheckpoint: false,
    difficulty: "Sedang",
    estimatedDuration: "80 menit",
  },
  {
    nodeId: "node-11",
    moduleId: "geo-pythagorean",
    title: "Teorema Pythagoras",
    categoryId: "geometry",
    categoryName: "Geometri",
    description: "Teorema Pythagoras dan aplikasinya",
    position: { x: 30, y: 1400 },
    xpReward: 70,
    prerequisites: ["node-10"],
    isCheckpoint: false,
    difficulty: "Sedang",
    estimatedDuration: "60 menit",
  },
  {
    nodeId: "node-12",
    moduleId: "alg-exponential",
    title: "Eksponen",
    categoryId: "algebra",
    categoryName: "Aljabar",
    description: "Bilangan berpangkat dan akar",
    position: { x: 70, y: 1400 },
    xpReward: 80,
    prerequisites: ["node-10"],
    isCheckpoint: false,
    difficulty: "Sulit",
    estimatedDuration: "75 menit",
  },

  // === LEVEL 5: Master Level ===
  {
    nodeId: "node-13",
    moduleId: "calc-intro",
    title: "Pengantar Kalkulus",
    categoryId: "calculus",
    categoryName: "Kalkulus",
    description: "Limit dan turunan dasar",
    position: { x: 50, y: 1600 },
    xpReward: 100,
    prerequisites: ["node-11", "node-12"],
    isCheckpoint: true,
    difficulty: "Sulit",
    estimatedDuration: "90 menit",
  },
  {
    nodeId: "node-14",
    moduleId: "trig-basic",
    title: "Trigonometri Dasar",
    categoryId: "trigonometry",
    categoryName: "Trigonometri",
    description: "Sin, cos, tan dan teorema",
    position: { x: 30, y: 1800 },
    xpReward: 85,
    prerequisites: ["node-13"],
    isCheckpoint: false,
    difficulty: "Sulit",
    estimatedDuration: "70 menit",
  },
  {
    nodeId: "node-15",
    moduleId: "logic-proof",
    title: "Logika & Pembuktian",
    categoryId: "logic",
    categoryName: "Logika Matematika",
    description: "Logika matematika dan pembuktian",
    position: { x: 70, y: 1800 },
    xpReward: 90,
    prerequisites: ["node-13"],
    isCheckpoint: true,
    difficulty: "Sulit",
    estimatedDuration: "80 menit",
  },
];

export async function seedSkillTree() {
  try {
    console.log("🌳 Seeding skill tree nodes...");
    
    // Clear existing nodes
    await SkillTreeNodeModel.deleteMany({});
    
    // Insert legacy nodes (original skill tree)
    console.log("  📦 Seeding legacy skill tree nodes...");
    const legacyResult = await SkillTreeNodeModel.insertMany(skillTreeNodes);
    console.log(`  ✅ Seeded ${legacyResult.length} legacy nodes`);
    
    // Insert SD nodes (Elementary School)
    console.log("  🎒 Seeding SD (Sekolah Dasar) skill tree nodes...");
    const sdResult = await SkillTreeNodeModel.insertMany(allSDNodes);
    console.log(`  ✅ Seeded ${sdResult.length} SD nodes (Kelas 1-6, all subjects)`);
    
    // Insert SMP Math nodes (Junior High Math)
    console.log("  📐 Seeding SMP Matematika skill tree nodes...");
    const smpMathResult = await SkillTreeNodeModel.insertMany(allMathSMPNodes);
    console.log(`  ✅ Seeded ${smpMathResult.length} SMP Math nodes`);
    
    // Insert SMP B.Indonesia nodes
    console.log("  📝 Seeding SMP Bahasa Indonesia nodes...");
    const smpIndoResult = await SkillTreeNodeModel.insertMany(allIndoSMPNodes);
    console.log(`  ✅ Seeded ${smpIndoResult.length} SMP B.Indonesia nodes`);
    
    // Insert SMP IPA nodes
    console.log("  🔬 Seeding SMP IPA Terpadu nodes...");
    const smpIPAResult = await SkillTreeNodeModel.insertMany(allIPASMPNodes);
    console.log(`  ✅ Seeded ${smpIPAResult.length} SMP IPA nodes`);
    
    // Insert SMP IPS nodes
    console.log("  🌍 Seeding SMP IPS Terpadu nodes...");
    const smpIPSResult = await SkillTreeNodeModel.insertMany(allIPSSMPNodes);
    console.log(`  ✅ Seeded ${smpIPSResult.length} SMP IPS nodes`);
    
    // Insert SMP B.Inggris nodes
    console.log("  🇬🇧 Seeding SMP Bahasa Inggris nodes...");
    const smpEngResult = await SkillTreeNodeModel.insertMany(allEngSMPNodes);
    console.log(`  ✅ Seeded ${smpEngResult.length} SMP B.Inggris nodes`);
    
    // Insert SMP PKn nodes
    console.log("  🦅 Seeding SMP PKn nodes...");
    const smpPKnResult = await SkillTreeNodeModel.insertMany(allPKnSMPNodes);
    console.log(`  ✅ Seeded ${smpPKnResult.length} SMP PKn nodes`);
    
    // Insert SMA nodes (All subjects)
    console.log("  🎓 Seeding SMA (all subjects) nodes...");
    const smaResult = await SkillTreeNodeModel.insertMany(allSMANodes);
    console.log(`  ✅ Seeded ${smaResult.length} SMA nodes (Math, Physics, etc.)`);
    
    // Insert SMK nodes (Vocational programs)
    console.log("  🔧 Seeding SMK (vocational programs) nodes...");
    const smkResult = await SkillTreeNodeModel.insertMany(allSMKNodes);
    console.log(`  ✅ Seeded ${smkResult.length} SMK nodes (RPL, Multimedia, Accounting, PPLG, TJKT, DKV, BD)`);
    
    const totalNodes = 
      legacyResult.length + 
      sdResult.length + 
      smpMathResult.length +
      smpIndoResult.length +
      smpIPAResult.length +
      smpIPSResult.length +
      smpEngResult.length +
      smpPKnResult.length +
      smaResult.length +
      smkResult.length;
      
    console.log(`\n✅ Successfully seeded ${totalNodes} total skill tree nodes`);
    console.log(`\n📊 Breakdown by level:`);
    console.log(`   - Legacy (original): ${legacyResult.length}`);
    console.log(`   - SD (Kelas 1-6): ${sdResult.length}`);
    console.log(`   - SMP Total: ${smpMathResult.length + smpIndoResult.length + smpIPAResult.length + smpIPSResult.length + smpEngResult.length + smpPKnResult.length}`);
    console.log(`     • Matematika: ${smpMathResult.length}`);
    console.log(`     • B.Indonesia: ${smpIndoResult.length}`);
    console.log(`     • IPA Terpadu: ${smpIPAResult.length}`);
    console.log(`     • IPS Terpadu: ${smpIPSResult.length}`);
    console.log(`     • B.Inggris: ${smpEngResult.length}`);
    console.log(`     • PKn: ${smpPKnResult.length}`);
    console.log(`   - SMA (all subjects): ${smaResult.length}`);
    console.log(`   - SMK (vocational): ${smkResult.length}`);
    
    return { 
      legacy: legacyResult, 
      sd: sdResult, 
      smp: {
        math: smpMathResult,
        indo: smpIndoResult,
        ipa: smpIPAResult,
        ips: smpIPSResult,
        eng: smpEngResult,
        pkn: smpPKnResult
      },
      sma: smaResult,
      smk: smkResult
    };
  } catch (error) {
    console.error("❌ Error seeding skill tree:", error);
    throw error;
  }
}
