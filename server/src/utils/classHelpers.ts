import { IClass } from "../models/Class";

/**
 * Interface untuk data class yang akan dibuat
 */
export interface ClassCreationData {
  schoolType: "SD" | "SMP" | "SMA" | "SMK";
  grade: number;
  section: string;
  specialization?: string; // Untuk SMA grade 11-12
  majorCode?: string; // Untuk SMK
  majorName?: string; // Untuk SMK
}

/**
 * Interface untuk hasil generate class name
 */
export interface GeneratedClassName {
  className: string; // "10 PPLG 1"
  displayName: string; // "Kelas 10 PPLG 1"
  shortName: string; // "10 PPLG 1"
}

/**
 * Generate class name berdasarkan school type dan data kelas
 * 
 * SD: "Kelas 1 A" -> className: "1 A", displayName: "Kelas 1 A"
 * SMP: "Kelas 7 B" -> className: "7 B", displayName: "Kelas 7 B"
 * SMA: 
 *   - Grade 10: "Kelas 10 1" -> className: "10 1"
 *   - Grade 11-12: "Kelas 11 IPA 1" -> className: "11 IPA 1"
 * SMK: "Kelas 10 PPLG 1" -> className: "10 PPLG 1"
 */
export function generateClassName(data: ClassCreationData): GeneratedClassName {
  const { schoolType, grade, section, specialization, majorCode } = data;

  let className = "";
  let displayName = "";
  let shortName = "";

  if (schoolType === "SD" || schoolType === "SMP") {
    // SD/SMP: Simple format
    className = `${grade} ${section}`;
    displayName = `Kelas ${grade} ${section}`;
    shortName = `${grade} ${section}`;
  } else if (schoolType === "SMA") {
    // SMA: Grade 10 tidak ada peminatan
    if (grade === 10 || !specialization) {
      className = `${grade} ${section}`;
      displayName = `Kelas ${grade} ${section}`;
      shortName = `${grade}-${section}`;
    } else {
      // Grade 11-12 dengan peminatan
      className = `${grade} ${specialization} ${section}`;
      displayName = `Kelas ${grade} ${specialization} ${section}`;
      shortName = `${grade} ${specialization} ${section}`;
    }
  } else if (schoolType === "SMK") {
    // SMK: Semua grade dengan jurusan
    className = `${grade} ${majorCode} ${section}`;
    displayName = `Kelas ${grade} ${majorCode} ${section}`;
    shortName = `${grade} ${majorCode} ${section}`;
  }

  return {
    className: className.trim(),
    displayName: displayName.trim(),
    shortName: shortName.trim(),
  };
}

/**
 * Sort classes berdasarkan grade, specialization/major, dan section
 */
export function sortClasses(classes: IClass[]): IClass[] {
  return classes.sort((a, b) => {
    // 1. Sort by grade (ascending)
    if (a.grade !== b.grade) {
      return a.grade - b.grade;
    }

    // 2. Sort by specialization/major (alphabetically)
    const aSpec = a.specialization || a.majorCode || "";
    const bSpec = b.specialization || b.majorCode || "";
    if (aSpec !== bSpec) {
      return aSpec.localeCompare(bSpec);
    }

    // 3. Sort by section (alphabetically)
    return a.section.localeCompare(b.section, undefined, { numeric: true });
  });
}

/**
 * Group classes berdasarkan grade dan specialization/major
 * Returns Map dengan key berupa group label dan value array of classes
 */
export interface ClassGroup {
  label: string; // "Grade 10", "Grade 11 - IPA", "Grade 10 - PPLG"
  classes: IClass[];
  grade: number;
  specialization?: string;
  majorCode?: string;
}

export function groupClasses(classes: IClass[]): ClassGroup[] {
  const groupMap = new Map<string, IClass[]>();

  classes.forEach((cls) => {
    let key = "";
    let label = "";

    if (cls.schoolType === "SD" || cls.schoolType === "SMP") {
      key = `grade-${cls.grade}`;
      label = `Kelas ${cls.grade}`;
    } else if (cls.schoolType === "SMA") {
      if (cls.grade === 10 || !cls.specialization) {
        key = `grade-${cls.grade}`;
        label = `Kelas ${cls.grade}`;
      } else {
        key = `grade-${cls.grade}-${cls.specialization}`;
        label = `Kelas ${cls.grade} - ${cls.specialization}`;
      }
    } else if (cls.schoolType === "SMK") {
      key = `grade-${cls.grade}-${cls.majorCode}`;
      label = `Kelas ${cls.grade} - ${cls.majorCode}`;
    }

    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push(cls);
  });

  // Convert Map to array of ClassGroup
  const groups: ClassGroup[] = [];
  groupMap.forEach((classes, key) => {
    const firstClass = classes[0];
    groups.push({
      label: key,
      classes: sortClasses(classes),
      grade: firstClass.grade,
      specialization: firstClass.specialization,
      majorCode: firstClass.majorCode,
    });
  });

  // Sort groups by grade and specialization/major
  return groups.sort((a, b) => {
    if (a.grade !== b.grade) {
      return a.grade - b.grade;
    }
    const aSpec = a.specialization || a.majorCode || "";
    const bSpec = b.specialization || b.majorCode || "";
    return aSpec.localeCompare(bSpec);
  });
}

/**
 * Validate class data sebelum create/update
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateClassData(data: ClassCreationData): ValidationResult {
  const errors: string[] = [];

  // Validate grade based on school type
  if (data.schoolType === "SD") {
    if (data.grade < 1 || data.grade > 6) {
      errors.push("Grade untuk SD harus antara 1-6");
    }
  } else if (data.schoolType === "SMP") {
    if (data.grade < 7 || data.grade > 9) {
      errors.push("Grade untuk SMP harus antara 7-9");
    }
  } else if (data.schoolType === "SMA" || data.schoolType === "SMK") {
    if (data.grade < 10 || data.grade > 12) {
      errors.push("Grade untuk SMA/SMK harus antara 10-12");
    }
  }

  // Validate section
  if (!data.section || data.section.trim() === "") {
    errors.push("Section tidak boleh kosong");
  }

  // Validate SMA specialization
  if (data.schoolType === "SMA" && data.grade >= 11) {
    if (!data.specialization || data.specialization.trim() === "") {
      errors.push("Peminatan wajib diisi untuk SMA kelas 11 dan 12");
    }
  }

  // Validate SMK major
  if (data.schoolType === "SMK") {
    if (!data.majorCode || data.majorCode.trim() === "") {
      errors.push("Kode jurusan wajib diisi untuk SMK");
    }
    if (!data.majorName || data.majorName.trim() === "") {
      errors.push("Nama jurusan wajib diisi untuk SMK");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get available grades based on school type
 */
export function getAvailableGrades(schoolType: "SD" | "SMP" | "SMA" | "SMK"): number[] {
  switch (schoolType) {
    case "SD":
      return [1, 2, 3, 4, 5, 6];
    case "SMP":
      return [7, 8, 9];
    case "SMA":
    case "SMK":
      return [10, 11, 12];
    default:
      return [];
  }
}

/**
 * Check if grade needs specialization/major selection
 */
export function needsSpecialization(schoolType: "SD" | "SMP" | "SMA" | "SMK", grade: number): boolean {
  if (schoolType === "SMA" && grade >= 11) {
    return true;
  }
  if (schoolType === "SMK") {
    return true;
  }
  return false;
}

/**
 * Get label for section field based on school type
 */
export function getSectionLabel(schoolType: "SD" | "SMP" | "SMA" | "SMK"): string {
  switch (schoolType) {
    case "SD":
      return "Unit/Rombel (Contoh: A, B, 1, 2, Merah, Biru)";
    case "SMP":
      return "Unit/Rombel (Contoh: A, B, C, 1, 2, 3)";
    case "SMA":
    case "SMK":
      return "Unit/Rombel (Contoh: 1, 2, 3)";
    default:
      return "Unit/Rombel";
  }
}

/**
 * Format class display for UI
 */
export function formatClassDisplay(cls: Partial<IClass>): string {
  if (!cls.displayName) {
    return cls.className || "Kelas Tidak Diketahui";
  }
  return cls.displayName;
}

/**
 * Get grade label (e.g., "Kelas 10", "Kelas 7")
 */
export function getGradeLabel(grade: number, schoolType?: "SD" | "SMP" | "SMA" | "SMK"): string {
  if (schoolType === "SD" && grade >= 1 && grade <= 6) {
    return `Kelas ${grade}`;
  }
  if (schoolType === "SMP" && grade >= 7 && grade <= 9) {
    return `Kelas ${grade}`;
  }
  if ((schoolType === "SMA" || schoolType === "SMK") && grade >= 10 && grade <= 12) {
    return `Kelas ${grade}`;
  }
  return `Kelas ${grade}`;
}
