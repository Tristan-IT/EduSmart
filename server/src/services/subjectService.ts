import SubjectModel, { ISubject } from "../models/Subject";
import { getSubjectsForSchoolType } from "../data/subjectTemplates";
import mongoose from "mongoose";

/**
 * Get subject preview for school types without creating them
 */
export const getSubjectPreview = (
  schoolTypes: Array<"SD" | "SMP" | "SMA" | "SMK">
): Array<any> => {
  const preview: any[] = [];

  for (const schoolType of schoolTypes) {
    const templates = getSubjectsForSchoolType(schoolType);
    preview.push(...templates);
  }

  // Remove duplicates based on code (some subjects may appear in multiple school types)
  const uniqueSubjects = preview.reduce((acc: any[], current) => {
    const exists = acc.find(item => item.code === current.code);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  return uniqueSubjects;
};

/**
 * Create multiple subjects from templates
 */
export const createSubjectsFromTemplates = async (
  schoolId: mongoose.Types.ObjectId,
  schoolTypes: Array<"SD" | "SMP" | "SMA" | "SMK">
): Promise<ISubject[]> => {
  try {
    const createdSubjects: ISubject[] = [];

    for (const schoolType of schoolTypes) {
      const templates = getSubjectsForSchoolType(schoolType);

      for (const template of templates) {
        // Check if subject already exists
        const existing = await SubjectModel.findOne({
          school: schoolId,
          code: template.code,
        });

        if (!existing) {
          const subject = await SubjectModel.create({
            school: schoolId,
            code: template.code,
            name: template.name,
            category: template.category,
            schoolTypes: template.schoolTypes,
            grades: template.grades,
            smaSpecializations: template.smaSpecializations,
            smkMajors: template.smkMajors,
            description: template.description,
            color: template.color,
            icon: template.icon,
            isActive: true,
          });

          createdSubjects.push(subject);
        }
      }
    }

    return createdSubjects;
  } catch (error) {
    console.error("Error creating subjects from templates:", error);
    throw error;
  }
};

/**
 * Get subjects for a specific class
 */
export const getSubjectsForClass = async (
  schoolId: mongoose.Types.ObjectId,
  schoolType: "SD" | "SMP" | "SMA" | "SMK",
  grade: number,
  specialization?: string,
  major?: string
): Promise<ISubject[]> => {
  try {
    const query: any = {
      school: schoolId,
      schoolTypes: schoolType,
      grades: grade,
      isActive: true,
    };

    // Filter by specialization for SMA
    if (schoolType === "SMA" && specialization) {
      query.$or = [
        { category: "WAJIB" },
        {
          category: "PEMINATAN",
          smaSpecializations: specialization,
        },
      ];
    }

    // Filter by major for SMK
    if (schoolType === "SMK" && major) {
      query.$or = [
        { category: "WAJIB" },
        {
          category: "PEMINATAN",
          smkMajors: major,
        },
      ];
    }

    const subjects = await SubjectModel.find(query).sort({ category: 1, name: 1 });

    return subjects;
  } catch (error) {
    console.error("Error getting subjects for class:", error);
    throw error;
  }
};

/**
 * Get subject statistics for school
 */
export const getSubjectStats = async (schoolId: mongoose.Types.ObjectId) => {
  try {
    const totalSubjects = await SubjectModel.countDocuments({
      school: schoolId,
      isActive: true,
    });

    const byCategory = await SubjectModel.aggregate([
      {
        $match: {
          school: schoolId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const bySchoolType = await SubjectModel.aggregate([
      {
        $match: {
          school: schoolId,
          isActive: true,
        },
      },
      {
        $unwind: "$schoolTypes",
      },
      {
        $group: {
          _id: "$schoolTypes",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      total: totalSubjects,
      byCategory: byCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      bySchoolType: bySchoolType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
    };
  } catch (error) {
    console.error("Error getting subject stats:", error);
    throw error;
  }
};

/**
 * Validate subject belongs to school
 */
export const validateSubjectBelongsToSchool = async (
  subjectId: mongoose.Types.ObjectId,
  schoolId: mongoose.Types.ObjectId
): Promise<boolean> => {
  try {
    const subject = await SubjectModel.findOne({
      _id: subjectId,
      school: schoolId,
      isActive: true,
    });

    return !!subject;
  } catch (error) {
    console.error("Error validating subject:", error);
    return false;
  }
};

/**
 * Get subjects by IDs (for batch operations)
 */
export const getSubjectsByIds = async (
  subjectIds: mongoose.Types.ObjectId[],
  schoolId: mongoose.Types.ObjectId
): Promise<ISubject[]> => {
  try {
    const subjects = await SubjectModel.find({
      _id: { $in: subjectIds },
      school: schoolId,
      isActive: true,
    });

    return subjects;
  } catch (error) {
    console.error("Error getting subjects by IDs:", error);
    throw error;
  }
};

/**
 * Search subjects by name or code
 */
export const searchSubjects = async (
  schoolId: mongoose.Types.ObjectId,
  searchTerm: string
): Promise<ISubject[]> => {
  try {
    const subjects = await SubjectModel.find({
      school: schoolId,
      isActive: true,
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { code: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .sort({ name: 1 })
      .limit(20);

    return subjects;
  } catch (error) {
    console.error("Error searching subjects:", error);
    throw error;
  }
};
