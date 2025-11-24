import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  Calculator,
  Shapes,
  TrendingUp,
  PieChart,
  Triangle,
  Brain,
  Play,
  CheckCircle2,
  Clock,
  Star,
  BookOpen,
  Loader2
} from "lucide-react";
import {
  fadeInUp,
  scaleIn,
  staggerContainer
} from "@/lib/animations";
import { subjectApi, apiClient } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: typeof Calculator;
  totalQuestions: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  estimatedTime: number;
  color: string;
  gradient: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  progress?: number;
}

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: string;
  color: string;
  schoolTypes?: string[];
  grades?: number[];
  icon?: string;
  description?: string;
}

interface StudentProfile {
  currentGrade?: string;
  currentClass?: number;
  currentSemester?: number;
  major?: string;
}

interface TopicResponse {
  _id: string;
  title: string;
  description: string;
  difficulty?: string;
  icon?: string;
  color?: string;
  metadata?: {
    totalQuizzes?: number;
  };
  estimatedMinutes?: number;
  topicCode?: string;
}

const difficultyLabelMap: Record<string, QuizCategory['difficulty']> = {
  beginner: 'Mudah',
  intermediate: 'Sedang',
  advanced: 'Sulit',
};

const iconRegistry: Record<string, typeof Calculator> = {
  Calculator,
  Shapes,
  TrendingUp,
  PieChart,
  Triangle,
  Brain,
  ClipboardList,
  BookOpen,
};

const jenjangOptions = [
  { label: "Semua Jenjang", value: "all" },
  { label: "SD", value: "SD" },
  { label: "SMP", value: "SMP" },
  { label: "SMA", value: "SMA" },
  { label: "SMK", value: "SMK" },
];

const QuizCategories = () => {
  const navigate = useNavigate();
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const [classNumber, setClassNumber] = useState<number | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [educationFilter, setEducationFilter] = useState<string>("all");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectCategories, setSubjectCategories] = useState<Record<string, QuizCategory[]>>({});
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [masteryMap, setMasteryMap] = useState<Record<string, number>>({});
  const [averageMastery, setAverageMastery] = useState(0);

  useEffect(() => {
    loadStudentProfile();
    loadQuizStats();
  }, []);

  useEffect(() => {
    if (loadingProfile) return;
    loadSubjects();
  }, [loadingProfile]);

  const loadStudentProfile = async () => {
    try {
      setLoadingProfile(true);
      setProfileError(null);
      const response = await apiClient.get<{ success?: boolean; profile?: StudentProfile }>("/student/profile");
      const profile = (response as any)?.profile ?? (response as any)?.data?.profile ?? null;
      if (profile) {
        setStudentProfile(profile);
        setGradeLevel(profile.currentGrade ?? null);
        setClassNumber(profile.currentClass ?? null);
        if (profile.currentGrade) {
          setEducationFilter(profile.currentGrade);
        }
      } else {
        setStudentProfile(null);
        setGradeLevel(null);
        setClassNumber(null);
        setEducationFilter("all");
      }
    } catch (error) {
      console.error("Failed to load student profile:", error);
      setProfileError("Tidak dapat memuat profil siswa. Menampilkan semua mata pelajaran yang tersedia.");
      setStudentProfile(null);
      setGradeLevel(null);
      setClassNumber(null);
      setEducationFilter("all");
      loadSubjects();
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await subjectApi.getAll();
      let list: Subject[] = [];
      if (response?.success) {
        list = Array.isArray(response.subjects)
          ? response.subjects
          : Array.isArray((response as any)?.data?.subjects)
            ? (response as any).data.subjects
            : [];
      } else if (Array.isArray((response as any)?.data)) {
        list = (response as any).data;
      }

      setSubjects(list);
      await loadTopicsForSubjects(list);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      setSubjects([]);
      setSubjectCategories({});
    } finally {
      setLoadingSubjects(false);
    }
  };

  const loadQuizStats = async () => {
    try {
      const response = await apiClient.get<{ success?: boolean; masteryPerTopic?: Record<string, number>; averageMastery?: number }>("/quizzes/stats");
      const mastery = (response as any)?.masteryPerTopic ?? (response as any)?.data?.masteryPerTopic ?? {};
      const avg = (response as any)?.averageMastery ?? (response as any)?.data?.averageMastery ?? 0;
      if (mastery && typeof mastery === "object") {
        setMasteryMap(mastery as Record<string, number>);
      }
      setAverageMastery(typeof avg === "number" ? avg : 0);
    } catch (error) {
      console.error("Failed to load quiz stats:", error);
      setMasteryMap({});
      setAverageMastery(0);
    }
  };

  const transformTopics = useCallback((topics: TopicResponse[], subject: Subject) => {
    return topics.map((topic) => {
      const iconKey = topic.icon || "BookOpen";
      const IconComponent = iconRegistry[iconKey] || BookOpen;
      const difficulty = difficultyLabelMap[topic.difficulty || ""] || 'Sedang';
      const baseColor = subject.color || topic.color || '#6366F1';
      const gradient = `linear-gradient(135deg, ${baseColor} 0%, rgba(99,102,241,0.85) 100%)`;
      const mastery = masteryMap?.[topic._id] ?? masteryMap?.[topic.topicCode || ""] ?? 0;
      return {
        id: topic._id,
        title: topic.title,
        description: topic.description,
        icon: IconComponent,
        totalQuestions: topic.metadata?.totalQuizzes ?? 0,
        difficulty,
        estimatedTime: topic.estimatedMinutes ?? 20,
        color: baseColor,
        gradient,
        subjectId: subject._id,
        subjectName: subject.name,
        subjectColor: subject.color,
        progress: mastery,
      } satisfies QuizCategory;
    });
  }, [masteryMap]);

  const loadTopicsForSubjects = async (subjectList: Subject[]) => {
    try {
      if (!subjectList.length) {
        setSubjectCategories({});
        setTopicsLoading(false);
        return;
      }

      setTopicsLoading(true);
      setTopicsError(null);

      const entries = await Promise.all(
        subjectList.map(async (subject) => {
          try {
            const params = new URLSearchParams({ subject: subject._id });
            const query = params.toString();
            const response = await apiClient.get<{ success?: boolean; data?: TopicResponse[] }>(
              `/content/topics${query ? `?${query}` : ""}`
            );
            const data = Array.isArray((response as any)?.data)
              ? (response as any).data
              : Array.isArray((response as any)?.topics)
                ? (response as any).topics
                : [];
            return [subject._id, transformTopics(data, subject)] as [string, QuizCategory[]];
          } catch (error) {
            console.error(`Failed to load topics for ${subject.name}:`, error);
            return [subject._id, []] as [string, QuizCategory[]];
          }
        })
      );

      const map: Record<string, QuizCategory[]> = {};
      for (const [subjectId, categories] of entries) {
        map[subjectId] = categories;
      }
      setSubjectCategories(map);
    } catch (error) {
      console.error("Failed to load topics:", error);
      setSubjectCategories({});
      setTopicsError("Gagal memuat bank soal untuk jenjang ini");
    } finally {
      setTopicsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'Sedang': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'Sulit': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleStartQuiz = (category: QuizCategory) => {
    const subjectData = subjects.find(s => s._id === category.subjectId);
    navigate('/quiz-player', { 
      state: { 
        topicId: category.id,
        subjectInfo: subjectData ? {
          name: subjectData.name,
          color: subjectData.color,
          code: subjectData.code
        } : undefined
      } 
    });
  };

  const totalTrackedTopics = Object.keys(masteryMap || {}).length;
  const masteredTopics = Object.values(masteryMap || {}).filter(value => value >= 80).length;

  const filteredSubjects = educationFilter === "all"
    ? subjects
    : subjects.filter((subject) =>
        Array.isArray(subject.schoolTypes) ? subject.schoolTypes.includes(educationFilter) : false
      );

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-primary/5">
        <AppSidebar role="student" />
        <div className="flex-1">
          {/* Enhanced Header */}
          <motion.header 
            className="sticky top-0 z-50 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full items-center px-4 gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <ClipboardList className="w-5 h-5 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Bank Soal
                </h1>
              </div>
            </div>
          </motion.header>

          <div className="container px-4 py-8 max-w-6xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Header Section */}
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Pilih Kategori Quiz
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Latih kemampuanmu dengan berbagai kategori soal matematika. 
                    Setiap kategori memiliki ratusan soal yang akan di-random setiap hari!
                  </p>
                </div>

                {/* Subject Overview */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      {educationFilter === "all"
                        ? "Semua mata pelajaran aktif ditampilkan."
                        : `Menampilkan mata pelajaran untuk jenjang ${educationFilter}.`}
                      {gradeLevel && educationFilter === gradeLevel && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (Profil: {gradeLevel}{classNumber ? ` • Kelas ${classNumber}` : ""})
                        </span>
                      )}
                      {profileError && (
                        <span className="block text-xs text-red-500">{profileError}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Filter Jenjang
                      </span>
                      <Select value={educationFilter} onValueChange={setEducationFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Pilih jenjang" />
                        </SelectTrigger>
                        <SelectContent>
                          {jenjangOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {loadingSubjects ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-28" />
                      ))}
                    </div>
                  ) : filteredSubjects.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      {filteredSubjects.map((subject) => {
                        const availableCategories = subjectCategories[subject._id]?.length ?? 0;
                        return (
                          <div
                            key={subject._id}
                            className={cn(
                              "rounded-2xl border p-4 text-left bg-background",
                              "hover:shadow-lg transition-all"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
                                style={{ background: subject.color || "#6366F1" }}
                              >
                                {subject.code?.slice(0, 2).toUpperCase() || "MP"}
                              </div>
                              <div>
                                <p className="font-semibold">{subject.name}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">{subject.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Kategori tersedia</span>
                              <span className="font-semibold text-foreground">{availableCategories}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : subjects.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        Belum ada mata pelajaran aktif yang tercatat.
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        Tidak ada mata pelajaran untuk filter jenjang ini.
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>

              {/* Stats Overview */}
              <motion.div 
                variants={fadeInUp}
                className="grid md:grid-cols-3 gap-4 mb-8"
              >
                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Topik Terpantau</span>
                    </div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      {totalTrackedTopics}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">Rata-rata Mastery</span>
                    </div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {averageMastery}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Topik Dikuasai (&gt;=80%)</span>
                    </div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      {masteredTopics}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Categories by Subject */}
              <motion.div
                variants={staggerContainer}
                className="space-y-10"
              >
                {topicsLoading && (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}

                {topicsError && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6 text-center text-red-600">
                      {topicsError}
                    </CardContent>
                  </Card>
                )}

                {!topicsLoading && filteredSubjects.length === 0 && !loadingSubjects && (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      {subjects.length === 0
                        ? "Tambahkan mata pelajaran terlebih dahulu untuk menampilkan bank soal."
                        : "Tidak ada mata pelajaran pada filter jenjang ini."}
                    </CardContent>
                  </Card>
                )}

                {filteredSubjects.map((subject) => {
                  const categories = subjectCategories[subject._id] ?? [];
                  return (
                    <div key={subject._id} className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-semibold"
                            style={{ background: subject.color || "#6366F1" }}
                          >
                            {subject.code?.slice(0, 2).toUpperCase() || "MP"}
                          </div>
                          <div>
                            <p className="text-xl font-semibold">{subject.name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{subject.category}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-muted-foreground">
                          {categories.length} kategori soal
                        </Badge>
                      </div>

                      {categories.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                              <motion.div
                                key={category.id}
                                variants={scaleIn}
                                custom={index}
                              >
                                <Card
                                  className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group h-full"
                                >
                                  <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
                                    style={{ background: category.gradient }}
                                  />

                                  <motion.div
                                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20"
                                    style={{ background: category.gradient }}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                  />

                                  <CardHeader className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                      <motion.div
                                        className="p-3 rounded-xl"
                                        style={{ background: category.gradient }}
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                      >
                                        <Icon className="w-6 h-6 text-white" />
                                      </motion.div>

                                      <Badge className={getDifficultyColor(category.difficulty)}>
                                        {category.difficulty}
                                      </Badge>
                                    </div>

                                    <CardTitle className="text-xl mb-2">
                                      {category.title}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {category.description}
                                    </p>
                                  </CardHeader>

                                  <CardContent className="relative z-10 space-y-4">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div className="flex items-center gap-2">
                                        <ClipboardList className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          {category.totalQuestions} Soal
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          ~{category.estimatedTime} menit
                                        </span>
                                      </div>
                                    </div>

                                    {typeof category.progress === "number" && (
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-muted-foreground">Mastery</span>
                                          <span className="font-semibold" style={{ color: category.color }}>
                                            {Math.round(category.progress)}%
                                          </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                          <motion.div
                                            className="h-full"
                                            style={{ background: category.gradient }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, Math.max(0, category.progress ?? 0))}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                          />
                                        </div>
                                      </div>
                                    )}

                                    <motion.div
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <Button
                                        className="w-full text-white"
                                        style={{ background: category.gradient }}
                                        onClick={() => handleStartQuiz(category)}
                                      >
                                        <Play className="w-4 h-4 mr-2" />
                                        Mulai Quiz
                                      </Button>
                                    </motion.div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="p-6 text-center text-muted-foreground">
                            Belum ada bank soal untuk mata pelajaran ini.
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </motion.div>

              {/* Info Section */}
              <motion.div variants={fadeInUp} className="mt-8">
                <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Brain className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          💡 Tips Mengerjakan Quiz
                        </h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Soal akan di-random dari bank soal setiap kali kamu mulai quiz baru</li>
                          <li>• Kerjakan dengan tenang dan teliti, tidak ada batasan waktu</li>
                          <li>• Kamu bisa mengulang quiz berkali-kali untuk meningkatkan skor</li>
                          <li>• Setiap jawaban benar akan memberikan XP untuk naik level!</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QuizCategories;
