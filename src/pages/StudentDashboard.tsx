import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CircularMastery } from "@/components/CircularMastery";
import { LearningCard } from "@/components/LearningCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Flame, Play, Trophy, Sparkles, Award, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { XPBar } from "@/components/XPBar";
import realApi from "@/lib/realApi";
import { getAiRecommendations, getAiRewards } from "@/lib/mockApi";
import type { GamificationProfile, SkillTreeNode } from "@/lib/apiClient";
import type { AiRecommendationResponse } from "@/data/mockAi/recommendations";
import type { AiRewardResponse } from "@/data/mockAi/rewards";
import successImage from "@/assets/success-illustration.jpg";
import { 
  fadeInUp, 
  staggerContainer, 
  hoverLift, 
  scaleIn,
  fadeInLeft,
  fadeInRight 
} from "@/lib/animations";
import { SkeletonCard, SkeletonDashboard } from "@/components/ui/skeleton-loader";
import { LeagueProgress } from "@/components/LeagueProgress";
import type { LeagueUser } from "@/data/leagueSystem";
import { mockStudents } from "@/data/mockData";
import { useLeagueSystem } from "@/hooks/useLeagueSystem";
import { LeaguePromotionModal, LeagueDemotionModal, LeagueStayModal } from "@/components/LeagueModals";
import { algebraModules, geometryModules, statisticsModules } from "@/data/learningModules";
import { useAuth } from "@/context/AuthContext";
import { useSubject } from "@/context/SubjectContext";
import { SubjectSelector } from "@/components/SubjectSelector";
import { toast } from "sonner";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedSubject, subjects } = useSubject();
  const currentStudent = mockStudents[0];
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [skillTree, setSkillTree] = useState<SkillTreeNode[]>([]);
  
  // Get all learning modules
  const allLearningModules = [...algebraModules, ...geometryModules, ...statisticsModules];
  
  // Map topics to learning modules
  const topicModuleMap: Record<string, typeof algebraModules[0][]> = {
    'algebra': algebraModules,
    'geometry': geometryModules,
    'statistics': statisticsModules,
  };
  
  // League system integration - will be populated from API
  const { leagueState, addXP, modals } = useLeagueSystem({
    userId: user?.id || '',
    initialLeague: (profile?.league as any) || 'bronze',
    allUsers: [], // Will be populated from real API
  });
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendationResponse | null>(null);
  const [aiRecommendationError, setAiRecommendationError] = useState<string | null>(null);
  const [aiRewards, setAiRewards] = useState<AiRewardResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const [profileResponse, treeResponse, recommendationResponse, rewardResponse] = await Promise.all([
          realApi.getGamifiedProfile(),
          realApi.getSkillTree(),
          getAiRecommendations(),
          getAiRewards(),
        ]);
        if (!mounted) return;
        setProfile(profileResponse);
        setSkillTree(treeResponse);
        setAiRecommendationError(null);
        setAiRecommendations(recommendationResponse);
        setAiRewards(rewardResponse);
      } catch (error) {
        // silently ignore for now; UI still renders fallback data
        setAiRecommendationError("Rekomendasi AI tidak tersedia saat ini.");
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const overallMastery = Math.round(
    Object.values(currentStudent.masteryPerTopic).reduce((a, b) => a + b, 0) / 
    Object.values(currentStudent.masteryPerTopic).length
  );

  const currentUnit = useMemo(() => {
    // TODO: Update to use SkillTreeNode structure from API
    // if (skillTree.length === 0) return undefined;
    // return skillTree.find((unit) => unit.status === "current") ?? skillTree[0];
    return undefined;
  }, [skillTree]);

  const recommendationsToShow = aiRecommendations?.recommendations?.length ? aiRecommendations.recommendations : null;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar role="student" />
        <main className="flex-1 w-full">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Dashboard Siswa</h1>
            </div>
          </div>
          <div className="p-6">
            <SkeletonDashboard />
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <main className="flex-1 w-full">
        {/* Header dengan SidebarTrigger */}
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Dashboard Siswa
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto p-6 space-y-6">
          {/* Welcome Header */}
          <motion.div 
            className="mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Selamat Datang, {currentStudent.name}! 👋
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Mari lanjutkan perjalanan belajarmu hari ini
              {selectedSubject && subjects.find(s => s._id === selectedSubject) && (
                <span className="ml-2 font-semibold text-primary">
                  · {subjects.find(s => s._id === selectedSubject)?.name}
                </span>
              )}
            </motion.p>
          </motion.div>

          {/* Subject Selector */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <SubjectSelector />
          </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <motion.div 
              className="grid sm:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp} whileHover="hover" whileTap="tap">
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 cursor-pointer border-2 hover:border-accent/50 bg-gradient-to-br from-accent/5 via-background to-background">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-0"
                    variants={{
                      hover: { opacity: 1 }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Penguasaan</CardTitle>
                    <motion.div
                      className="p-2 rounded-lg bg-accent/10"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                      <Trophy className="h-5 w-5 text-accent" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <motion.div 
                      className="text-3xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
                      {overallMastery}%
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <span className="text-green-500 font-semibold">↑ 5%</span> dari minggu lalu
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover="hover" whileTap="tap">
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-warning/20 cursor-pointer border-2 hover:border-warning/50 bg-gradient-to-br from-warning/5 via-background to-background">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-warning/20 via-transparent to-transparent opacity-0"
                    variants={{
                      hover: { opacity: 1 }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Streak Hari</CardTitle>
                    <motion.div
                      className="p-2 rounded-lg bg-warning/10"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Flame className="h-5 w-5 text-warning fill-warning" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <motion.div 
                      className="text-3xl font-bold bg-gradient-to-r from-warning to-orange-500 bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", delay: 0.4 }}
                    >
                      {profile?.streak ?? currentStudent.streak} hari
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <span className="text-warning font-semibold">🔥 Pertahankan</span> momentum!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover="hover" whileTap="tap">
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-primary/5 via-background to-background">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0"
                    variants={{
                      hover: { opacity: 1 }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Target Hari Ini</CardTitle>
                    <motion.div
                      className="p-2 rounded-lg bg-primary/10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Target className="h-5 w-5 text-primary" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <motion.div 
                      className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                    >
                      2/3
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Sesi diselesaikan <span className="text-primary font-semibold">66%</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Recommended Practice */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-primary/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Rekomendasi Latihanmu
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5 text-primary" />
                      </motion.div>
                    </CardTitle>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-primary/20 to-purple-500/20">
                        <Sparkles className="h-3 w-3" />
                        AI Mentor
                      </Badge>
                    </motion.div>
                  </div>
                  {aiRecommendations?.goalFocus && (
                    <CardDescription>{aiRecommendations.goalFocus}</CardDescription>
                  )}
                </CardHeader>
              <CardContent className="space-y-4">
                {aiRecommendationError && (
                  <div className="rounded-md border border-dashed border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {aiRecommendationError}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendationsToShow
                    ? recommendationsToShow.map((item) => {
                        // Find matching module from learning modules
                        const topicModules = topicModuleMap[item.topicId] || [];
                        const matchingModule = topicModules[0]; // Get first module for the topic
                        
                        return (
                          <motion.div 
                            key={item.id} 
                            className="rounded-lg border-2 hover:border-primary/50 p-4 flex flex-col gap-3 bg-gradient-to-br from-primary/5 to-background transition-all hover:shadow-lg"
                            whileHover={{ scale: 1.02, y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {item.type === 'quiz' ? '📝 Quiz' : item.type === 'lesson' ? '📚 Modul' : '🎯 Latihan'}
                                  </Badge>
                                  {matchingModule && (
                                    <Badge variant="secondary" className="text-xs">
                                      {matchingModule.difficulty}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Badge variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "outline"} className="text-xs">
                                {item.priority === "high" ? "🔴 Tinggi" : item.priority === "medium" ? "🟡 Sedang" : "🟢 Rendah"}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.reason}</p>
                            
                            {matchingModule && (
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {matchingModule.title}
                                </p>
                                <p className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {matchingModule.estimatedDuration}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {item.estimatedMinutes} menit
                              </span>
                              {item.xpReward && (
                                <span className="flex items-center gap-1 text-primary font-semibold">
                                  <Trophy className="h-3 w-3" />
                                  +{item.xpReward} XP
                                </span>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              {matchingModule && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => navigate(`/learning/${matchingModule.id}`)}
                                >
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  Belajar Dulu
                                </Button>
                              )}
                              <Button
                                size="sm"
                                className={matchingModule ? "flex-1" : "w-full"}
                                onClick={() => {
                                  if (item.ctaHref) {
                                    navigate(item.ctaHref);
                                  } else if (item.type === 'quiz') {
                                    navigate('/quiz', { state: { topicId: item.topicId } });
                                  } else {
                                    navigate('/learning');
                                  }
                                }}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                {item.ctaLabel ?? (item.type === 'quiz' ? 'Mulai Quiz' : 'Mulai Belajar')}
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })
                    : // Fallback: Show modules directly
                      allLearningModules.slice(0, 2).map((module) => (
                        <motion.div 
                          key={module.id}
                          className="rounded-lg border-2 hover:border-primary/50 p-4 flex flex-col gap-3 bg-gradient-to-br from-primary/5 to-background transition-all hover:shadow-lg"
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base mb-1">{module.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  📚 {module.categoryName}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {module.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {module.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {module.estimatedDuration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {module.exercises.length} Latihan
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => navigate(`/learning/${module.id}`)}
                            >
                              <BookOpen className="h-3 w-3 mr-1" />
                              Pelajari Materi
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => navigate('/quiz', { state: { topicId: module.categoryId } })}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Latihan Quiz
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                </div>
              </CardContent>
              </Card>
            </motion.div>

            {/* Learning Path */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-2 hover:border-accent/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-accent/10">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2 bg-gradient-to-r from-accent to-pink-600 bg-clip-text text-transparent">
                    <BookOpen className="h-5 w-5 text-accent" />
                    Jalur Pembelajaran
                  </CardTitle>
                  <CardDescription>Pilih topik untuk melanjutkan belajar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* TODO: Replace with real topics from API */}
                    {skillTree.slice(0, 5).map((node, index) => (
                      <motion.div 
                        key={node.nodeId}
                        className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-accent/50 hover:bg-gradient-to-r hover:from-accent/5 hover:to-transparent transition-all cursor-pointer group"
                        onClick={() => navigate('/learning', { state: { nodeId: node.nodeId } })}
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <motion.div 
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ${
                            node.status === 'completed' ? 'bg-gradient-to-br from-accent to-accent/60 text-white' :
                            node.status === 'in-progress' ? 'bg-gradient-to-br from-primary to-purple-600 text-white' :
                            'bg-gradient-to-br from-muted to-muted/60 text-muted-foreground'
                          }`}
                          whileHover={{ rotate: 5 }}
                        >
                          {index + 1}
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base group-hover:text-accent transition-colors">{node.title}</h4>
                          <p className="text-sm text-muted-foreground">{node.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-accent">{node.stars}/3 ⭐</div>
                          <p className="text-xs text-muted-foreground">Penguasaan</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInRight}>
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-primary/10 bg-gradient-to-br from-primary/5 via-background to-background">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    <Award className="h-5 w-5 text-primary" />
                    XP & Liga
                  </CardTitle>
                  <CardDescription>Progress menuju level berikutnya.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <XPBar
                    currentXP={profile?.xpInLevel ?? currentStudent.dailyGoalProgress}
                    xpForNextLevel={profile?.xpForNextLevel ?? currentStudent.dailyGoalXP}
                    level={profile?.level ?? currentStudent.level}
                    title={`Liga ${profile?.league?.toUpperCase() ?? currentStudent.league.toUpperCase()}`}
                  />
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Flame className="h-4 w-4 text-warning fill-warning" />
                    Streak terbaik <span className="font-bold text-warning">{profile?.bestStreak ?? currentStudent.streak}+</span> hari
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Trophy className="h-4 w-4 text-accent" />
                    Total XP <span className="font-bold text-accent">{profile?.xp ?? currentStudent.xp}</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* League Progress */}
            <motion.div variants={fadeInRight}>
              <LeagueProgress
                user={{
                  userId: currentStudent.id,
                  name: currentStudent.name,
                  avatar: currentStudent.avatar,
                  currentLeague: leagueState.currentLeague,
                  weeklyXP: leagueState.weeklyXP,
                  totalXP: currentStudent.xp,
                  rank: leagueState.rank,
                  previousRank: leagueState.previousRank,
                  trend: leagueState.trend,
                } as LeagueUser}
                totalXP={currentStudent.xp}
                showWeeklyTimer={true}
              />
            </motion.div>

            {/* Overall Progress */}
            <motion.div variants={fadeInRight}>
              <Card className="border-2 hover:border-accent/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-accent" />
                    Progress Keseluruhan
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                  <CircularMastery 
                    percent={overallMastery} 
                    label="Penguasaan Total"
                    size="lg"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {currentUnit && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">Skill Tree Saat Ini</CardTitle>
                  <CardDescription>{currentUnit.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentUnit.skills.map((skill) => (
                    <div key={skill.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg">
                            {skill.icon}
                          </div>
                          <div>
                            <p className="font-semibold leading-tight">{skill.title}</p>
                            <p className="text-xs text-muted-foreground">Penguasaan {skill.mastery}%</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={skill.status === "completed" ? "border-success/40 text-success" : skill.status === "current" ? "border-primary text-primary" : "border-muted text-muted-foreground"}
                        >
                          {skill.status === "completed" ? "Selesai" : skill.status === "current" ? "Aktif" : "Terkunci"}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        {skill.lessons.slice(0, 2).map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-xs">
                            <span>{lesson.title}</span>
                            <span className="text-muted-foreground">{lesson.status === "mastered" ? "✔" : `${lesson.xpReward} XP`}</span>
                          </div>
                        ))}
                        {skill.lessons.length > 2 && (
                          <button
                            type="button"
                            className="text-xs font-semibold text-primary hover:underline"
                            onClick={() => navigate("/learning", { state: { topicId: skill.lessons[0].topicId } })}
                          >
                            Lanjutkan lesson →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {aiRewards && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">Misi Khusus AI</CardTitle>
                  <CardDescription>Dapatkan bonus XP dari rekomendasi adaptif.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiRewards.quests.map((quest) => (
                    <div key={quest.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm flex items-center gap-2">
                            <Award className="h-4 w-4 text-accent" />
                            {quest.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{quest.description}</p>
                        </div>
                        <Badge variant={quest.type === "daily" ? "secondary" : "outline"}>
                          {quest.type === "daily" ? "Harian" : "Mingguan"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{quest.aiRationale}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(quest.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                        <span className="font-semibold text-accent">{quest.xpReward} XP</span>
                      </div>
                      {quest.powerUpReward && (
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <Sparkles className="h-3 w-3" />
                          {quest.powerUpReward}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Today's Plan */}
            <Card className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Rencana Hari Ini</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* TODO: Replace with real daily plan from API */}
                  <div className="text-center text-muted-foreground py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Rencana pembelajaran akan muncul di sini</p>
                    <p className="text-xs mt-2">Mulai belajar untuk mendapat rekomendasi harian</p>
                  </div>
                  {/* {mockDailyPlan.map((plan, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full ${
                          plan.status === 'completed' ? 'bg-accent' :
                          plan.status === 'in-progress' ? 'bg-primary animate-pulse' :
                          'bg-muted'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{plan.activity}</p>
                          <p className="text-xs text-muted-foreground">{plan.time} · {plan.duration}</p>
                        </div>
                        {plan.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigate('/quiz', { state: { topicId: plan.topicId } })}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {index < mockDailyPlan.length - 1 && (
                        <div className="ml-1 w-px h-4 bg-border" />
                      )}
                    </div>
                  ))} */}
                </div>
              </CardContent>
            </Card>

            {/* Motivation Card */}
            <motion.div variants={fadeInRight}>
              <Card className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-accent/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardContent className="pt-6">
                  <motion.img 
                    src={successImage} 
                    alt="Motivasi" 
                    className="w-32 h-32 mx-auto mb-4 rounded-lg shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring" }}
                  />
                  <motion.p 
                    className="text-center font-bold text-xl mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Kamu luar biasa! 🌟
                  </motion.p>
                  <motion.p 
                    className="text-sm text-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Penguasaanmu di Statistika mencapai <span className="font-bold text-accent">90%</span>. Pertahankan konsistensi belajarmu!
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
        </div>
      </main>

      {/* League Modals */}
      {modals.promotion.data && (
        <LeaguePromotionModal
          isOpen={modals.promotion.isOpen}
          onClose={modals.promotion.onClose}
          fromLeague={modals.promotion.data.fromLeague}
          toLeague={modals.promotion.data.toLeague}
          rank={modals.promotion.data.rank}
          weeklyXP={modals.promotion.data.weeklyXP}
          rewards={modals.promotion.data.rewards}
        />
      )}

      {modals.demotion.data && (
        <LeagueDemotionModal
          isOpen={modals.demotion.isOpen}
          onClose={modals.demotion.onClose}
          fromLeague={modals.demotion.data.fromLeague}
          toLeague={modals.demotion.data.toLeague}
          rank={modals.demotion.data.rank}
          weeklyXP={modals.demotion.data.weeklyXP}
        />
      )}

      {modals.stay.data && (
        <LeagueStayModal
          isOpen={modals.stay.isOpen}
          onClose={modals.stay.onClose}
          league={modals.stay.data.league}
          rank={modals.stay.data.rank}
          weeklyXP={modals.stay.data.weeklyXP}
          rewards={modals.stay.data.rewards}
        />
      )}
    </SidebarProvider>
  );
};

export default StudentDashboard;
