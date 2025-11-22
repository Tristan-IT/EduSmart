/**
 * Default Subject Templates for Indonesian Schools
 * Based on Kurikulum Merdeka and K-13
 */

export interface SubjectTemplate {
  code: string;
  name: string;
  category: "WAJIB" | "PEMINATAN" | "MUATAN_LOKAL" | "EKSTRAKURIKULER";
  schoolTypes: Array<"SD" | "SMP" | "SMA" | "SMK">;
  grades: number[];
  smaSpecializations?: string[];
  smkMajors?: string[];
  description: string;
  color: string;
  icon: string;
}

/**
 * SD (Sekolah Dasar) - Grades 1-6
 */
export const SD_SUBJECTS: SubjectTemplate[] = [
  {
    code: "MAT",
    name: "Matematika",
    category: "WAJIB",
    schoolTypes: ["SD"],
    grades: [1, 2, 3, 4, 5, 6],
    description: "Operasi bilangan, geometri, pengukuran, dan pemecahan masalah",
    color: "#3B82F6", // Blue
    icon: "Calculator",
  },
  {
    code: "B.IND",
    name: "Bahasa Indonesia",
    category: "WAJIB",
    schoolTypes: ["SD"],
    grades: [1, 2, 3, 4, 5, 6],
    description: "Membaca, menulis, berbicara, dan menyimak",
    color: "#EF4444", // Red
    icon: "BookOpen",
  },
  {
    code: "IPA",
    name: "Ilmu Pengetahuan Alam",
    category: "WAJIB",
    schoolTypes: ["SD"],
    grades: [3, 4, 5, 6], // IPA mulai kelas 3
    description: "Sains, alam, dan lingkungan",
    color: "#10B981", // Green
    icon: "Flask",
  },
  {
    code: "IPS",
    name: "Ilmu Pengetahuan Sosial",
    category: "WAJIB",
    schoolTypes: ["SD"],
    grades: [3, 4, 5, 6], // IPS mulai kelas 3
    description: "Sejarah, geografi, ekonomi, dan sosiologi",
    color: "#F59E0B", // Amber
    icon: "Globe",
  },
  {
    code: "PJOK",
    name: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
    category: "WAJIB",
    schoolTypes: ["SD"],
    grades: [1, 2, 3, 4, 5, 6],
    description: "Olahraga, kesehatan, dan kebugaran",
    color: "#8B5CF6", // Purple
    icon: "Dumbbell",
  },
  {
    code: "SBDP",
    name: "Seni Budaya dan Prakarya",
    category: "WAJIB",
    schoolTypes: ["SD"],
    grades: [1, 2, 3, 4, 5, 6],
    description: "Seni rupa, musik, tari, dan kerajinan",
    color: "#EC4899", // Pink
    icon: "Palette",
  },
  {
    code: "AGAMA",
    name: "Pendidikan Agama dan Budi Pekerti",
    category: "WAJIB",
    schoolTypes: ["SD"],
    grades: [1, 2, 3, 4, 5, 6],
    description: "Pendidikan agama dan nilai moral",
    color: "#14B8A6", // Teal
    icon: "Heart",
  },
  {
    code: "PKN",
    name: "Pendidikan Pancasila dan Kewarganegaraan",
    category: "WAJIB",
    schoolTypes: ["SD"],
    grades: [1, 2, 3, 4, 5, 6],
    description: "Kewarganegaraan dan karakter",
    color: "#DC2626", // Dark Red
    icon: "Flag",
  },
];

/**
 * SMP (Sekolah Menengah Pertama) - Grades 7-9
 */
export const SMP_SUBJECTS: SubjectTemplate[] = [
  {
    code: "MAT",
    name: "Matematika",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Aljabar, geometri, statistika, dan peluang",
    color: "#3B82F6",
    icon: "Calculator",
  },
  {
    code: "B.IND",
    name: "Bahasa Indonesia",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Sastra, teks, dan bahasa",
    color: "#EF4444",
    icon: "BookOpen",
  },
  {
    code: "B.ING",
    name: "Bahasa Inggris",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Grammar, reading, writing, speaking",
    color: "#06B6D4", // Cyan
    icon: "Languages",
  },
  {
    code: "IPA",
    name: "Ilmu Pengetahuan Alam",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Fisika, kimia, dan biologi terpadu",
    color: "#10B981",
    icon: "Flask",
  },
  {
    code: "IPS",
    name: "Ilmu Pengetahuan Sosial",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Sejarah, geografi, ekonomi, sosiologi",
    color: "#F59E0B",
    icon: "Globe",
  },
  {
    code: "PJOK",
    name: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Olahraga dan kesehatan",
    color: "#8B5CF6",
    icon: "Dumbbell",
  },
  {
    code: "SENI",
    name: "Seni Budaya",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Seni musik, rupa, tari, dan teater",
    color: "#EC4899",
    icon: "Music",
  },
  {
    code: "PRAKARYA",
    name: "Prakarya",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Kerajinan, rekayasa, budidaya, pengolahan",
    color: "#F97316", // Orange
    icon: "Hammer",
  },
  {
    code: "INFORMATIKA",
    name: "Informatika",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Computational thinking dan teknologi",
    color: "#6366F1", // Indigo
    icon: "Code",
  },
  {
    code: "AGAMA",
    name: "Pendidikan Agama dan Budi Pekerti",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Pendidikan agama dan akhlak",
    color: "#14B8A6",
    icon: "Heart",
  },
  {
    code: "PKN",
    name: "Pendidikan Pancasila dan Kewarganegaraan",
    category: "WAJIB",
    schoolTypes: ["SMP"],
    grades: [7, 8, 9],
    description: "Kewarganegaraan dan nasionalisme",
    color: "#DC2626",
    icon: "Flag",
  },
];

/**
 * SMA (Sekolah Menengah Atas) - Grades 10-12
 * Includes common subjects and peminatan-specific subjects
 */
export const SMA_COMMON_SUBJECTS: SubjectTemplate[] = [
  {
    code: "MAT.W",
    name: "Matematika Wajib",
    category: "WAJIB",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    description: "Matematika umum untuk semua peminatan",
    color: "#3B82F6",
    icon: "Calculator",
  },
  {
    code: "B.IND",
    name: "Bahasa Indonesia",
    category: "WAJIB",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    description: "Bahasa dan sastra Indonesia",
    color: "#EF4444",
    icon: "BookOpen",
  },
  {
    code: "B.ING",
    name: "Bahasa Inggris",
    category: "WAJIB",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    description: "English language and literature",
    color: "#06B6D4",
    icon: "Languages",
  },
  {
    code: "PJOK",
    name: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
    category: "WAJIB",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    description: "Kesehatan dan kebugaran",
    color: "#8B5CF6",
    icon: "Dumbbell",
  },
  {
    code: "AGAMA",
    name: "Pendidikan Agama dan Budi Pekerti",
    category: "WAJIB",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    description: "Pendidikan agama dan etika",
    color: "#14B8A6",
    icon: "Heart",
  },
  {
    code: "PKN",
    name: "Pendidikan Pancasila dan Kewarganegaraan",
    category: "WAJIB",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    description: "Civic education",
    color: "#DC2626",
    icon: "Flag",
  },
  {
    code: "SEJARAH",
    name: "Sejarah Indonesia",
    category: "WAJIB",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    description: "Sejarah Indonesia dan dunia",
    color: "#92400E", // Brown
    icon: "ScrollText",
  },
];

export const SMA_IPA_SUBJECTS: SubjectTemplate[] = [
  {
    code: "MAT.P",
    name: "Matematika Peminatan",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["IPA"],
    description: "Matematika lanjutan untuk IPA",
    color: "#1E40AF", // Dark Blue
    icon: "Sigma",
  },
  {
    code: "FISIKA",
    name: "Fisika",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["IPA"],
    description: "Mekanika, termodinamika, listrik, optik",
    color: "#059669", // Emerald
    icon: "Atom",
  },
  {
    code: "KIMIA",
    name: "Kimia",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["IPA"],
    description: "Kimia organik, anorganik, fisika",
    color: "#7C3AED", // Violet
    icon: "TestTube",
  },
  {
    code: "BIOLOGI",
    name: "Biologi",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["IPA"],
    description: "Sel, genetika, ekologi, evolusi",
    color: "#16A34A", // Green
    icon: "Leaf",
  },
];

export const SMA_IPS_SUBJECTS: SubjectTemplate[] = [
  {
    code: "GEOGRAFI",
    name: "Geografi",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["IPS"],
    description: "Geografi fisik dan sosial",
    color: "#0891B2", // Cyan
    icon: "Map",
  },
  {
    code: "EKONOMI",
    name: "Ekonomi",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["IPS"],
    description: "Mikro, makro, akuntansi",
    color: "#CA8A04", // Yellow
    icon: "TrendingUp",
  },
  {
    code: "SOSIOLOGI",
    name: "Sosiologi",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["IPS"],
    description: "Masyarakat, kelompok, perubahan sosial",
    color: "#DB2777", // Pink
    icon: "Users",
  },
  {
    code: "SEJARAH.P",
    name: "Sejarah Peminatan",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["IPS"],
    description: "Sejarah lanjutan",
    color: "#78350F", // Brown
    icon: "Library",
  },
];

export const SMA_BAHASA_SUBJECTS: SubjectTemplate[] = [
  {
    code: "B.IND.P",
    name: "Bahasa Indonesia Peminatan",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["BAHASA"],
    description: "Sastra Indonesia lanjutan",
    color: "#B91C1C", // Dark Red
    icon: "BookMarked",
  },
  {
    code: "B.ING.P",
    name: "Bahasa Inggris Peminatan",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["BAHASA"],
    description: "English literature and advanced grammar",
    color: "#0284C7", // Sky Blue
    icon: "GraduationCap",
  },
  {
    code: "SASTRA",
    name: "Sastra Indonesia",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["BAHASA"],
    description: "Sastra klasik dan modern",
    color: "#BE123C", // Rose
    icon: "Feather",
  },
  {
    code: "B.ASING",
    name: "Bahasa Asing Lainnya",
    category: "PEMINATAN",
    schoolTypes: ["SMA"],
    grades: [10, 11, 12],
    smaSpecializations: ["BAHASA"],
    description: "Mandarin, Jepang, Arab, Jerman, dll",
    color: "#7C2D12", // Orange-Brown
    icon: "MessageSquare",
  },
];

/**
 * SMK (Sekolah Menengah Kejuruan) - Grades 10-12
 * Common subjects + major-specific subjects
 */
export const SMK_COMMON_SUBJECTS: SubjectTemplate[] = [
  {
    code: "MAT",
    name: "Matematika",
    category: "WAJIB",
    schoolTypes: ["SMK"],
    grades: [10, 11, 12],
    description: "Matematika terapan",
    color: "#3B82F6",
    icon: "Calculator",
  },
  {
    code: "B.IND",
    name: "Bahasa Indonesia",
    category: "WAJIB",
    schoolTypes: ["SMK"],
    grades: [10, 11, 12],
    description: "Komunikasi bisnis dan teknis",
    color: "#EF4444",
    icon: "BookOpen",
  },
  {
    code: "B.ING",
    name: "Bahasa Inggris",
    category: "WAJIB",
    schoolTypes: ["SMK"],
    grades: [10, 11, 12],
    description: "English for specific purposes",
    color: "#06B6D4",
    icon: "Languages",
  },
  {
    code: "PJOK",
    name: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
    category: "WAJIB",
    schoolTypes: ["SMK"],
    grades: [10, 11, 12],
    description: "Kesehatan kerja",
    color: "#8B5CF6",
    icon: "Dumbbell",
  },
  {
    code: "AGAMA",
    name: "Pendidikan Agama dan Budi Pekerti",
    category: "WAJIB",
    schoolTypes: ["SMK"],
    grades: [10, 11, 12],
    description: "Etika profesional",
    color: "#14B8A6",
    icon: "Heart",
  },
  {
    code: "PKN",
    name: "Pendidikan Pancasila dan Kewarganegaraan",
    category: "WAJIB",
    schoolTypes: ["SMK"],
    grades: [10, 11, 12],
    description: "Civic dan professional ethics",
    color: "#DC2626",
    icon: "Flag",
  },
];

// SMK subjects are highly specific to majors
// These are examples for common IT-related majors
export const SMK_PPLG_SUBJECTS: SubjectTemplate[] = [
  {
    code: "PEMROG.DASAR",
    name: "Pemrograman Dasar",
    category: "PEMINATAN",
    schoolTypes: ["SMK"],
    grades: [10, 11, 12],
    smkMajors: ["PPLG", "RPL"],
    description: "Algoritma dan pemrograman",
    color: "#4F46E5", // Indigo
    icon: "Code2",
  },
  {
    code: "BASIS.DATA",
    name: "Basis Data",
    category: "PEMINATAN",
    schoolTypes: ["SMK"],
    grades: [10, 11, 12],
    smkMajors: ["PPLG", "RPL"],
    description: "Database design dan SQL",
    color: "#0D9488", // Teal
    icon: "Database",
  },
  {
    code: "WEB.PROG",
    name: "Pemrograman Web",
    category: "PEMINATAN",
    schoolTypes: ["SMK"],
    grades: [11, 12],
    smkMajors: ["PPLG"],
    description: "HTML, CSS, JavaScript, Backend",
    color: "#2563EB", // Blue
    icon: "Globe2",
  },
  {
    code: "MOBILE.DEV",
    name: "Pemrograman Mobile",
    category: "PEMINATAN",
    schoolTypes: ["SMK"],
    grades: [11, 12],
    smkMajors: ["PPLG"],
    description: "Android, iOS development",
    color: "#7C3AED", // Purple
    icon: "Smartphone",
  },
];

/**
 * Get all subjects for a specific school type
 */
export function getSubjectsForSchoolType(schoolType: "SD" | "SMP" | "SMA" | "SMK"): SubjectTemplate[] {
  switch (schoolType) {
    case "SD":
      return SD_SUBJECTS;
    case "SMP":
      return SMP_SUBJECTS;
    case "SMA":
      return [...SMA_COMMON_SUBJECTS, ...SMA_IPA_SUBJECTS, ...SMA_IPS_SUBJECTS, ...SMA_BAHASA_SUBJECTS];
    case "SMK":
      return [...SMK_COMMON_SUBJECTS, ...SMK_PPLG_SUBJECTS];
    default:
      return [];
  }
}

/**
 * Get SMA subjects by specialization
 */
export function getSMASubjectsBySpecialization(specialization: "IPA" | "IPS" | "BAHASA"): SubjectTemplate[] {
  const common = SMA_COMMON_SUBJECTS;
  switch (specialization) {
    case "IPA":
      return [...common, ...SMA_IPA_SUBJECTS];
    case "IPS":
      return [...common, ...SMA_IPS_SUBJECTS];
    case "BAHASA":
      return [...common, ...SMA_BAHASA_SUBJECTS];
    default:
      return common;
  }
}

/**
 * Get all default subjects (for migration/seeding)
 */
export function getAllDefaultSubjects(): SubjectTemplate[] {
  return [
    ...SD_SUBJECTS,
    ...SMP_SUBJECTS,
    ...SMA_COMMON_SUBJECTS,
    ...SMA_IPA_SUBJECTS,
    ...SMA_IPS_SUBJECTS,
    ...SMA_BAHASA_SUBJECTS,
    ...SMK_COMMON_SUBJECTS,
    ...SMK_PPLG_SUBJECTS,
  ];
}
