import type { Types } from "mongoose";
import TopicModel, { type TopicDocument } from "../models/Topic";
import QuizQuestionModel from "../models/QuizQuestion";
import type { ISubject } from "../models/Subject";
import { topicTemplateDefinitions, type GradeBand } from "../data/topicTemplates";
import { mathTemplates } from "../data/templates";
import allTemplates from "../data/templates";

interface NormalizedQuestion {
  question: string;
  type: "mcq" | "multi-select" | "short-answer";
  options?: string[];
  correctAnswer: string | string[];
  difficulty: number;
  hints: string[];
  explanation: string;
  tags?: string[];
  imageUrl?: string;
}

interface QuizTemplateLike {
  topicCode: string;
  questions: any[];
}

type SubjectLike = Pick<ISubject, "_id" | "code" | "grades" | "schoolTypes" | "school">;

const questionTemplatesByTopic: Record<string, NormalizedQuestion[]> = {};
const {
  physics: physicsTemplates,
  chemistry: chemistryTemplates,
  biology: biologyTemplates,
  indonesian: indonesianTemplates,
  english: englishTemplates,
  history: historyTemplates,
  geography: geographyTemplates,
  economics: economicsTemplates,
  sociology: sociologyTemplates,
  smpMath,
  smpScience,
  smpIndonesian,
  smpEnglish,
  sdMath,
  sdScience,
  sdIndonesian,
  sdCivic,
} = allTemplates;

registerQuizTemplates(mathTemplates as QuizTemplateLike[]);
registerQuizTemplates(physicsTemplates as QuizTemplateLike[]);
registerQuizTemplates(chemistryTemplates as QuizTemplateLike[]);
registerQuizTemplates(biologyTemplates as QuizTemplateLike[]);
registerQuizTemplates(indonesianTemplates as QuizTemplateLike[]);
registerQuizTemplates(englishTemplates as QuizTemplateLike[]);
registerQuizTemplates(historyTemplates as QuizTemplateLike[]);
registerQuizTemplates(geographyTemplates as QuizTemplateLike[]);
registerQuizTemplates(economicsTemplates as QuizTemplateLike[]);
registerQuizTemplates(sociologyTemplates as QuizTemplateLike[]);
registerGroupedQuestions(smpMath);
registerGroupedQuestions(smpScience);
registerGroupedQuestions(smpIndonesian);
registerGroupedQuestions(smpEnglish);
registerGroupedQuestions(sdMath);
registerGroupedQuestions(sdScience);
registerGroupedQuestions(sdIndonesian);
registerGroupedQuestions(sdCivic);

const subjectCodeAlias: Record<string, string> = {
  MAT: "MAT",
  MATW: "MAT",
  MATWAJIB: "MAT",
  MATP: "MAT",
  MATPEMINATAN: "MAT",
  MATEMATIKA: "MAT",
  FIS: "FIS",
  FISIKA: "FIS",
  KIM: "KIM",
  KIMIA: "KIM",
  BIO: "BIO",
  BIOLOGI: "BIO",
  BIND: "BIND",
  BINDONESIA: "BIND",
  BING: "BING",
  BINGGRIS: "BING",
  INGGRIS: "BING",
  SEJ: "SEJ",
  SEJARAH: "SEJ",
  GEO: "GEO",
  GEOGRAFI: "GEO",
  EKO: "EKO",
  EKONOMI: "EKO",
  SOS: "SOS",
  SOSIOLOGI: "SOS",
  IPA: "IPA",
  SAINS: "IPA",
  PKN: "PKN",
  CIVIC: "PKN",
};

const gradePriority: GradeBand[] = ["SMA", "SMP", "SD"];

export async function ensureTemplateContentForSubject(subject?: SubjectLike | null) {
  if (!subject) return;

  const gradeBand = determineGradeBand(subject);
  if (!gradeBand) {
    console.warn(`[ensureTemplateContent] Could not determine grade band for subject: ${subject.code}`);
    return;
  }

  const canonicalCode = canonicalizeSubjectCode(subject.code);
  if (!canonicalCode) {
    console.warn(`[ensureTemplateContent] Could not canonicalize subject code: ${subject.code}`);
    return;
  }

  const templates = topicTemplateDefinitions.filter(
    template => template.gradeBand === gradeBand && template.subjectCodes.includes(canonicalCode)
  );

  if (!templates.length) {
    console.log(`[ensureTemplateContent] No templates found for subject: ${subject.code} (${canonicalCode}) at grade: ${gradeBand}`);
    return;
  }

  console.log(`[ensureTemplateContent] Found ${templates.length} template topics for subject: ${subject.code} (${canonicalCode}) at grade: ${gradeBand}`);

  const subjectId = subject._id as Types.ObjectId;
  const topicKey = (topicCode: string) => `${subjectId.toString()}::${topicCode}`;
  const existingTopics = await TopicModel.find({ subject: subjectId });
  const topicMap = new Map<string, TopicDocument>();
  existingTopics.forEach(topic => topicMap.set(topicKey(topic.topicCode), topic));

  for (const template of templates) {
    const key = topicKey(template.topicCode);
    if (!topicMap.has(key)) {
      const slug = generateTopicSlug(subject.code, template.slug, subjectId);
      const topic = await TopicModel.create({
        subject: subjectId,
        school: subject.school,
        topicCode: template.topicCode,
        title: template.title,
        description: template.description,
        slug,
        order: template.order,
        estimatedMinutes: template.estimatedMinutes,
        difficulty: template.difficulty,
        learningObjectives: template.learningObjectives,
        icon: template.icon,
        color: template.color,
        isTemplate: true,
        metadata: {
          gradeLevel: [template.gradeBand],
          tags: template.tags,
          totalQuizzes: questionTemplatesByTopic[template.topicCode]?.length ?? 0,
        },
      });
      topicMap.set(key, topic);
    }
  }

  for (const template of templates) {
    const key = topicKey(template.topicCode);
    const topic = topicMap.get(key);
    if (!topic) continue;

    const prerequisiteIds: Types.ObjectId[] = [];
    for (const prerequisiteCode of template.prerequisiteCodes ?? []) {
      const dependency = topicMap.get(topicKey(prerequisiteCode));
      if (dependency) {
        prerequisiteIds.push(dependency._id as Types.ObjectId);
      }
    }

    const shouldUpdatePrereqs =
      prerequisiteIds.length !== (topic.prerequisites?.length || 0) ||
      !prerequisiteIds.every((id, index) => topic.prerequisites?.[index]?.equals(id));

    if (shouldUpdatePrereqs) {
      topic.prerequisites = prerequisiteIds;
      await topic.save();
    }
  }

  for (const template of templates) {
    const key = topicKey(template.topicCode);
    const topic = topicMap.get(key);
    if (!topic) continue;

    const existingQuestions = await QuizQuestionModel.countDocuments({
      subject: subjectId,
      topicId: template.topicCode,
    });

    if (existingQuestions > 0) continue;

    const templateQuestions = questionTemplatesByTopic[template.topicCode];
    if (!templateQuestions?.length) {
      console.warn(`No template questions found for topic ${template.topicCode}`);
      continue;
    }

    const docs = templateQuestions.map((question, index) => ({
      subject: subjectId,
      school: subject.school,
      topic: topic._id,
      topicId: template.topicCode,
      question: question.question,
      type: question.type,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      hints: question.hints,
      hintCount: question.hints?.length ?? 0,
      explanation: question.explanation,
      tags: question.tags,
      imageUrl: question.imageUrl,
      isTemplate: true,
      status: "published",
      order: index + 1,
    }));

    await QuizQuestionModel.insertMany(docs);
    console.log(`[ensureTemplateContent] Created ${docs.length} questions for topic: ${template.topicCode}`);

    topic.metadata = {
      ...(topic.metadata || {}),
      gradeLevel: [template.gradeBand],
      tags: template.tags,
      totalQuizzes: docs.length,
    };
    await topic.save();
  }
  console.log(`[ensureTemplateContent] Completed processing all templates for subject`);
}

export async function ensureTemplateContentForSubjects(subjects: SubjectLike[]) {
  for (const subject of subjects) {
    await ensureTemplateContentForSubject(subject);
  }
}

function registerQuizTemplates(templates?: QuizTemplateLike[]) {
  if (!templates) return;
  for (const template of templates) {
    if (!template?.topicCode || !template.questions) continue;
    questionTemplatesByTopic[template.topicCode] = template.questions.map(normalizeQuestion);
  }
}

function registerGroupedQuestions(questions?: any[]) {
  if (!questions) return;
  const groups = new Map<string, any[]>();
  for (const question of questions) {
    if (!question?.topicCode) continue;
    if (!groups.has(question.topicCode)) {
      groups.set(question.topicCode, []);
    }
    groups.get(question.topicCode)!.push(question);
  }

  for (const [topicCode, items] of groups) {
    questionTemplatesByTopic[topicCode] = items.map(normalizeQuestion);
  }
}

function normalizeQuestion(raw: any): NormalizedQuestion {
  return {
    question: raw.question,
    type: normalizeQuestionType(raw.type),
    options: raw.options,
    correctAnswer: raw.correctAnswer,
    difficulty: normalizeDifficulty(raw.difficulty),
    hints: Array.isArray(raw.hints) ? raw.hints : [],
    explanation: raw.explanation ?? "",
    tags: raw.tags,
    imageUrl: raw.imageUrl,
  };
}

function normalizeQuestionType(type?: string): "mcq" | "multi-select" | "short-answer" {
  const value = (type || "mcq").toLowerCase();
  if (value === "multiple-choice" || value === "mcq" || value === "choice") return "mcq";
  if (value === "multiple-select" || value === "multi-select") return "multi-select";
  if (value === "short-answer" || value === "shortanswer") return "short-answer";
  return "mcq";
}

function normalizeDifficulty(value?: string | number): number {
  if (typeof value === "number") return value;
  if (!value) return 2;
  const key = value.toLowerCase();
  if (key === "mudah" || key === "beginner") return 1;
  if (key === "sedang" || key === "intermediate") return 2;
  if (key === "sulit" || key === "advanced") return 3;
  return 2;
}

function canonicalizeSubjectCode(code?: string): string | null {
  if (!code) return null;
  const normalized = code.toUpperCase().replace(/[^A-Z]/g, "");
  return subjectCodeAlias[normalized] ?? normalized;
}

function determineGradeBand(subject: SubjectLike): GradeBand | null {
  const schoolTypes = subject.schoolTypes || [];
  if (
    schoolTypes.includes("SMA") ||
    schoolTypes.includes("SMK") ||
    subject.grades?.some(grade => grade >= 10)
  ) {
    return "SMA";
  }
  if (schoolTypes.includes("SMP") || subject.grades?.some(grade => grade >= 7 && grade <= 9)) return "SMP";
  if (schoolTypes.includes("SD") || subject.grades?.some(grade => grade <= 6)) return "SD";
  return gradePriority.find(band => schoolTypes.includes(band)) ?? null;
}

function generateTopicSlug(code: string, baseSlug: string, subjectId: Types.ObjectId) {
  const canonical = canonicalizeSubjectCode(code) ?? code;
  return slugify(`${baseSlug}-${canonical}-${subjectId.toString()}`);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
