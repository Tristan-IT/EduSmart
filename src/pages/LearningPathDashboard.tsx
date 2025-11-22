import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, Trophy, Star, Clock, Award, TrendingUp, 
  ChevronRight, Filter, Search, Zap, Target, CheckCircle2,
  Lock, Play, Calendar, BarChart3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/apiClient";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AlertMessage } from "@/components/AlertMessage";
import { SemesterToggle } from "@/components/SemesterToggle";

interface LearningPath {
  pathId: string;
  name: string;
  description: string;
  gradeLevel: string;
  classNumber: number;
  semester: number;
  subject: string;
  major?: string;
  totalNodes: number;
  totalXP: number;
  totalQuizzes: number;
  estimatedHours: number;
  checkpointCount: number;
  difficulty: "Mudah" | "Sedang" | "Sulit" | "Campuran";
  tags: string[];
  isTemplate: boolean;
}

interface PathProgress {
  pathId: string;
  completedNodes: number;
  inProgressNodes: number;
  lockedNodes: number;
  progressPercentage: number;
  totalXPEarned: number;
  totalXPAvailable: number;
  totalStars: number;
  maxPossibleStars: number;
  starPercentage: number;
}

interface StudentProfile {
  currentGrade: string;
  currentClass: number;
  currentSemester: number;
  major?: string;
  onboardingComplete: boolean;
}

export default function LearningPathDashboard() {
  const navigate = useNavigate();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [pathProgress, setPathProgress] = useState<Record<string, PathProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all"); // all, in-progress, not-started, completed
  const [userProfile, setUserProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    checkOnboardingAndFetchPaths();
  }, []);

  const checkOnboardingAndFetchPaths = async () => {
    try {
      setLoading(true);
      
      // Check onboarding status
      const onboardingResponse = await apiClient.get("/api/student/onboarding-status");
      // @ts-ignore - API response type
      if (!onboardingResponse.onboardingComplete) {
        // Redirect to onboarding if not completed
        navigate("/class-selection");
        return;
      }

      // Get student profile
      const profileResponse = await apiClient.get("/api/student/profile");
      // @ts-ignore - API response type
      const profile = profileResponse.profile;
      setUserProfile(profile);

      // Fetch paths based on profile
      await fetchPaths(profile);
    } catch (err: any) {
      console.error("Error initializing dashboard:", err);
      setError(err.message || "Failed to load dashboard");
      setLoading(false);
    }
  };

  const fetchPaths = async (profile: StudentProfile) => {
    try {
      setLoading(true);
      
      // Fetch paths based on user's profile
      // @ts-ignore - API response type
      const response = await apiClient.get(
        `/api/paths?gradeLevel=${profile.currentGrade}&classNumber=${profile.currentClass}&semester=${profile.currentSemester}&isActive=true${profile.major ? `&major=${profile.major}` : ''}`
      );

      // @ts-ignore - API response type
      const fetchedPaths = response.paths || [];
      setPaths(fetchedPaths);

      // Fetch progress for each path
      const userId = "current-user-id"; // Should come from auth context
      const progressPromises = fetchedPaths.map(async (path: LearningPath) => {
        try {
          const progressRes = await apiClient.get(`/api/paths/${path.pathId}/progress/${userId}`);
          // @ts-ignore - API response type
          return { pathId: path.pathId, progress: progressRes.progress };
        } catch (err) {
          return { pathId: path.pathId, progress: null };
        }
      });

      const progressResults = await Promise.all(progressPromises);
      const progressMap: Record<string, PathProgress> = {};
      progressResults.forEach(({ pathId, progress }) => {
        if (progress) {
          progressMap[pathId] = progress;
        }
      });
      setPathProgress(progressMap);

    } catch (err: any) {
      console.error("Error fetching paths:", err);
      setError(err.message || "Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  };

  const getPathStatus = (pathId: string): "not-started" | "in-progress" | "completed" => {
    const progress = pathProgress[pathId];
    if (!progress) return "not-started";
    if (progress.progressPercentage === 100) return "completed";
    if (progress.progressPercentage > 0) return "in-progress";
    return "not-started";
  };

  const filteredPaths = paths.filter((path) => {
    // Search filter
    if (searchQuery && !path.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !path.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Subject filter
    if (filterSubject !== "all" && path.subject !== filterSubject) {
      return false;
    }

    // Difficulty filter
    if (filterDifficulty !== "all" && path.difficulty !== filterDifficulty) {
      return false;
    }

    // Status filter
    if (filterStatus !== "all") {
      const status = getPathStatus(path.pathId);
      if (status !== filterStatus) {
        return false;
      }
    }

    return true;
  });

  const subjects = Array.from(new Set(paths.map((p) => p.subject)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah": return "bg-green-100 text-green-800 border-green-200";
      case "Sedang": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Sulit": return "bg-red-100 text-red-800 border-red-200";
      case "Campuran": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadge = (pathId: string) => {
    const status = getPathStatus(pathId);
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Selesai</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Play className="w-3 h-3 mr-1" />Sedang Belajar</Badge>;
      default:
        return <Badge variant="outline"><Lock className="w-3 h-3 mr-1" />Belum Dimulai</Badge>;
    }
  };

  const handleStartPath = (pathId: string) => {
    navigate(`/skill-tree?pathId=${pathId}`);
  };

  const handleSemesterChange = async (newSemester: 1 | 2) => {
    if (!userProfile) return;
    
    // Update local state
    const updatedProfile = { ...userProfile, currentSemester: newSemester };
    setUserProfile(updatedProfile);
    
    // Refetch paths with new semester
    await fetchPaths(updatedProfile);
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar role="student" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat jalur pembelajaran...</p>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5">
        <AppSidebar role="student" />
        
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Jalur Pembelajaran
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Pilih jalur pembelajaran yang sesuai dengan kelasmu
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Kelas {userProfile?.currentClass} {userProfile?.currentGrade}
                  </Badge>
                  {userProfile && (
                    <SemesterToggle
                      currentSemester={userProfile.currentSemester as 1 | 2}
                      onSemesterChange={handleSemesterChange}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {error && <AlertMessage type="danger" message={error} onClose={() => setError(null)} />}

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Total Jalur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{paths.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {filteredPaths.length} ditampilkan
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Selesai
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">
                    {paths.filter((p) => getPathStatus(p.pathId) === "completed").length}
                  </div>
                  <p className="text-xs text-green-600 mt-1">jalur diselesaikan</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Sedang Belajar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">
                    {paths.filter((p) => getPathStatus(p.pathId) === "in-progress").length}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">jalur aktif</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Total XP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700">
                    {Object.values(pathProgress).reduce((sum, p) => sum + p.totalXPEarned, 0)}
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    dari {paths.reduce((sum, p) => sum + p.totalXP, 0)} XP total
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter & Pencarian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari jalur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Mata Pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kesulitan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tingkat</SelectItem>
                        <SelectItem value="Mudah">Mudah</SelectItem>
                        <SelectItem value="Sedang">Sedang</SelectItem>
                        <SelectItem value="Sulit">Sulit</SelectItem>
                        <SelectItem value="Campuran">Campuran</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="not-started">Belum Dimulai</SelectItem>
                        <SelectItem value="in-progress">Sedang Belajar</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="recommended">Rekomendasi</TabsTrigger>
                <TabsTrigger value="in-progress">Aktif</TabsTrigger>
                <TabsTrigger value="completed">Selesai</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-6">
                <PathGrid 
                  paths={filteredPaths}
                  pathProgress={pathProgress}
                  onStartPath={handleStartPath}
                  getDifficultyColor={getDifficultyColor}
                  getStatusBadge={getStatusBadge}
                  getPathStatus={getPathStatus}
                />
              </TabsContent>

              <TabsContent value="recommended" className="space-y-4 mt-6">
                <PathGrid 
                  paths={filteredPaths.filter((p) => getPathStatus(p.pathId) === "not-started")}
                  pathProgress={pathProgress}
                  onStartPath={handleStartPath}
                  getDifficultyColor={getDifficultyColor}
                  getStatusBadge={getStatusBadge}
                  getPathStatus={getPathStatus}
                />
              </TabsContent>

              <TabsContent value="in-progress" className="space-y-4 mt-6">
                <PathGrid 
                  paths={filteredPaths.filter((p) => getPathStatus(p.pathId) === "in-progress")}
                  pathProgress={pathProgress}
                  onStartPath={handleStartPath}
                  getDifficultyColor={getDifficultyColor}
                  getStatusBadge={getStatusBadge}
                  getPathStatus={getPathStatus}
                />
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-6">
                <PathGrid 
                  paths={filteredPaths.filter((p) => getPathStatus(p.pathId) === "completed")}
                  pathProgress={pathProgress}
                  onStartPath={handleStartPath}
                  getDifficultyColor={getDifficultyColor}
                  getStatusBadge={getStatusBadge}
                  getPathStatus={getPathStatus}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

interface PathGridProps {
  paths: LearningPath[];
  pathProgress: Record<string, PathProgress>;
  onStartPath: (pathId: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  getStatusBadge: (pathId: string) => JSX.Element;
  getPathStatus: (pathId: string) => "not-started" | "in-progress" | "completed";
}

function PathGrid({ paths, pathProgress, onStartPath, getDifficultyColor, getStatusBadge, getPathStatus }: PathGridProps) {
  if (paths.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Tidak ada jalur pembelajaran yang ditemukan</p>
          <p className="text-sm mt-2">Coba ubah filter atau pencarian Anda</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paths.map((path, index) => {
        const progress = pathProgress[path.pathId];
        const status = getPathStatus(path.pathId);

        return (
          <motion.div
            key={path.pathId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getDifficultyColor(path.difficulty)}>
                    {path.difficulty}
                  </Badge>
                  {getStatusBadge(path.pathId)}
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {path.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {path.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Progress Bar */}
                  {progress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{progress.progressPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress.progressPercentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{progress.completedNodes}/{path.totalNodes} node</span>
                        <span>{progress.totalStars}/{progress.maxPossibleStars} ⭐</span>
                      </div>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-muted-foreground">
                        {progress ? `${progress.totalXPEarned}/${path.totalXP}` : path.totalXP} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground">{path.totalQuizzes} kuis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-muted-foreground">~{path.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span className="text-muted-foreground">{path.checkpointCount} checkpoint</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {path.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {path.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{path.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onStartPath(path.pathId)}
                  className="w-full mt-4 group-hover:scale-105 transition-transform"
                  variant={status === "not-started" ? "default" : status === "in-progress" ? "secondary" : "outline"}
                >
                  {status === "not-started" && (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Mulai Belajar
                    </>
                  )}
                  {status === "in-progress" && (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Lanjutkan
                    </>
                  )}
                  {status === "completed" && (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Lihat Detail
                    </>
                  )}
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
