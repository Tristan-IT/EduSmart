import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, Flame, Sparkles, Trophy, Target, Gem, Heart, Users, TrendingUp, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { mockStudents } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";
import { LeagueIcon } from "@/components/LeagueIcon";
import { LeagueProgress } from "@/components/LeagueProgress";
import { LearningPath } from "@/components/LearningPath";
import { DailyGoals } from "@/components/DailyGoals";
import { StreakTracker } from "@/components/StreakTracker";
import { Hearts } from "@/components/Hearts";
import { SubjectSelector } from "@/components/SubjectSelector";
import { AiMentorChatLive } from "@/components/AiMentorChatLive";
import { useSubject } from "@/context/SubjectContext";
import { progressApi } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { skillTreeNodes, skillTreePaths, UserProgress, getModuleForNode, SkillTreeNode } from "@/data/skillTree";
import type { LeagueUser } from "@/data/leagueSystem";
import { useLeagueSystem } from "@/hooks/useLeagueSystem";

const Learning = () => {
  const navigate = useNavigate();
  const currentStudent = mockStudents[0]; // Tristan Firdaus
  const { selectedSubject, subjects, subjectProgress } = useSubject();
  const { user } = useAuth();
  
  // Get selected subject info
  const selectedSubjectData = selectedSubject
    ? subjects.find(s => s._id === selectedSubject)
    : null;
  
  // League system integration
  const { leagueState } = useLeagueSystem({
    userId: currentStudent.id,
    initialLeague: currentStudent.league,
    allUsers: mockStudents.map(s => ({
      userId: s.id,
      name: s.name,
      avatar: s.avatar,
      currentLeague: s.league,
      weeklyXP: s.weeklyXP ?? 0,
      totalXP: s.xp,
      rank: s.rank ?? 1,
      previousRank: s.previousRank,
      trend: s.trend ?? 'same',
      streak: s.streak,
    })),
  });

  // User progress - load from localStorage or use default
  const [userProgress, setUserProgress] = useState<UserProgress[]>(() => {
    const saved = localStorage.getItem('userProgress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse userProgress:', e);
      }
    }
    // Default: first node unlocked
    return [{
      nodeId: 'node-1',
      status: 'current',
      stars: 0,
      attempts: 0,
      bestScore: 0,
    }];
  });

  // Save userProgress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Track completed nodes to show CTA
  const [showContinueCTA, setShowContinueCTA] = useState(false);
  const [nextNode, setNextNode] = useState<SkillTreeNode | null>(null);

  // Handle node completion and unlock next module
  const handleNodeCompletion = async (moduleIdOrNodeId: string, score: number) => {
    const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;
    
    // Find the node by moduleId or nodeId
    const currentNode = skillTreeNodes.find(n => n.moduleId === moduleIdOrNodeId || n.id === moduleIdOrNodeId);
    if (!currentNode) {
      console.error('Node not found:', moduleIdOrNodeId);
      return;
    }

    const nodeId = currentNode.id;
    
    // Update StudentSubjectProgress if subject is selected and user is logged in
    if (selectedSubject && user?.id) {
      try {
        await progressApi.updateLessonProgress({
          studentId: user.id,
          subjectId: selectedSubject,
          timeSpent: 15, // Average lesson time
          xpEarned: currentNode.xpReward,
        });
      } catch (error) {
        console.error('Failed to update lesson progress:', error);
      }
    }
    
    // Update current node as completed
    setUserProgress(prev => {
      const existing = prev.find(p => p.nodeId === nodeId);
      if (existing) {
        return prev.map(p => 
          p.nodeId === nodeId 
            ? { ...p, status: 'completed', stars, bestScore: Math.max(p.bestScore, score) }
            : p
        );
      }
      return [...prev, { nodeId, status: 'completed', stars, attempts: 1, bestScore: score }];
    });

    // Find next node to unlock
    const currentNodeIndex = skillTreeNodes.findIndex(n => n.id === nodeId);
    if (currentNodeIndex >= 0 && currentNodeIndex < skillTreeNodes.length - 1) {
      const nextNodeData = skillTreeNodes[currentNodeIndex + 1];
      
      // Unlock next node
      setUserProgress(prev => {
        const existing = prev.find(p => p.nodeId === nextNodeData.id);
        if (!existing) {
          return [...prev, { nodeId: nextNodeData.id, status: 'current', stars: 0, attempts: 0, bestScore: 0 }];
        } else if (existing.status === 'locked') {
          // Update locked node to current
          return prev.map(p => 
            p.nodeId === nextNodeData.id 
              ? { ...p, status: 'current' }
              : p
          );
        }
        return prev;
      });

      // Show CTA for next module
      setNextNode(nextNodeData);
      setShowContinueCTA(true);

      // Show success toast with confetti
      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold">Modul Selesai!</p>
            <p className="text-sm text-muted-foreground">+{score} XP • {stars} ⭐</p>
          </div>
        </div>,
        { duration: 4000 }
      );
    }
  };

  // Hearts state (lives system)
  const [hearts, setHearts] = useState(5);
  const maxHearts = 5;

  // Gems state (virtual currency) - Initialize from currentStudent
  const [gems, setGems] = useState(currentStudent.gems || 100);

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    const module = getModuleForNode(nodeId);
    if (!module) {
      toast.error("Module tidak ditemukan");
      return;
    }

    // Navigate to lesson detail
    navigate(`/lesson/${module.id}`);
  };

  // Listen for lesson completion (from localStorage or route state)
  useEffect(() => {
    // Check if we just returned from a completed lesson
    const completedNodeId = localStorage.getItem('lastCompletedNode');
    const completedScore = localStorage.getItem('lastCompletedScore');
    
    if (completedNodeId && completedScore) {
      handleNodeCompletion(completedNodeId, parseInt(completedScore));
      // Clear the completion data
      localStorage.removeItem('lastCompletedNode');
      localStorage.removeItem('lastCompletedScore');
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-primary/5">
        <AppSidebar role="student" />
        <div className="flex-1">
          {/* Header - Simplified & Responsive */}
          <motion.header 
            className="sticky top-0 z-50 h-14 md:h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full items-center justify-between px-3 md:px-6">
              <div className="flex items-center gap-2 md:gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2 md:gap-3">
                  <motion.div
                    className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </motion.div>
                  <div className="hidden sm:block">
                    <h1 className="text-base md:text-lg font-bold">Jalur Pembelajaran</h1>
                    <p className="text-[10px] md:text-xs text-muted-foreground">Matematika SMA</p>
                  </div>
                </div>
              </div>

              {/* Header Stats - Responsive */}
              <div className="flex items-center gap-1.5 md:gap-3">
                <motion.div 
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
                  <span className="text-xs md:text-sm font-bold">{currentStudent.xp}</span>
                  <span className="hidden sm:inline text-[10px] md:text-xs text-muted-foreground">XP</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Gem className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                  <span className="text-xs md:text-sm font-bold">{gems}</span>
                  <span className="hidden sm:inline text-[10px] md:text-xs text-muted-foreground">Gems</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <LeagueIcon tier={leagueState.currentLeague} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold capitalize">{leagueState.currentLeague}</span>
                    <span className="text-[8px] md:text-[10px] text-muted-foreground">#{leagueState.rank}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.header>

          <div className="container px-4 py-6 md:py-8 max-w-7xl mx-auto">
            {/* Subject Selector - Only show if subjects are available */}
            {selectedSubject !== null && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SubjectSelector compact />
              </motion.div>
            )}

            {/* Mobile: Skill Tree First, then other cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
              
              {/* Left Column: Stats & AI Mentor */}
              <div className="order-2 lg:order-1 col-span-1 lg:col-span-7 space-y-4 md:space-y-6">
                {/* AI Mentor Chat Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <AiMentorChatLive
                    onSessionUpdate={(sessionId) => {
                      console.log("AI Session ID:", sessionId);
                    }}
                  />
                </motion.div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DailyGoals />
                  <StreakTracker />
                </div>
              </div>

              {/* Right Column: Skill Tree */}
              <div className="order-1 lg:order-2 col-span-1 lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-2 border-primary/20">
                    <CardHeader className="pb-3 md:pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                            <Trophy className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            Jalur Matematika
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs md:text-sm">
                            Selesaikan setiap node untuk unlock modul berikutnya
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-primary text-primary">
                            {userProgress.filter(p => p.status === 'completed').length}/{skillTreeNodes.length}
                          </Badge>
                          {/* Test Button - Remove in production */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const currentNode = userProgress.find(p => p.status === 'current');
                              if (currentNode) {
                                handleNodeCompletion(currentNode.nodeId, 85);
                              }
                            }}
                            className="hidden md:flex text-xs"
                          >
                            Test Complete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 md:px-6">
                      <LearningPath
                        nodes={skillTreeNodes}
                        paths={skillTreePaths}
                        userProgress={userProgress}
                        onNodeClick={handleNodeClick}
                        subjectFilter={selectedSubject}
                        subjectInfo={selectedSubjectData ? {
                          name: selectedSubjectData.name,
                          color: selectedSubjectData.color,
                          description: selectedSubjectData.description
                        } : undefined}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Bottom Row: Additional Cards */}
              <div className="order-3 col-span-1 lg:col-span-7 space-y-4">
                {/* Hearts System */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Hearts
                    userId={currentStudent.id}
                    currentGems={gems}
                    onSpendGems={(amount, reason) => {
                      setGems(prev => Math.max(0, prev - amount));
                      toast.success(`${reason} aktif! -${amount} gems`);
                    }}
                    onHeartsChange={(newHearts) => {
                      setHearts(newHearts);
                    }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-primary" />
                            Jalur Matematika
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Selesaikan setiap node untuk unlock path selanjutnya
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-primary border-primary">
                          {userProgress.filter(p => p.status === 'completed').length}/{skillTreeNodes.length} selesai
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <LearningPath
                        nodes={skillTreeNodes}
                        paths={skillTreePaths}
                        userProgress={userProgress}
                        onNodeClick={handleNodeClick}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Sidebar - Competition & Achievements */}
              <div className="order-3 col-span-1 lg:col-span-3 space-y-3 md:space-y-4">
                {/* Weekly League Progress */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-purple-500" />
                          Progress Mingguan
                        </CardTitle>
                        <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-600">
                          {leagueState.currentLeague}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">XP Mingguan</span>
                        <span className="text-sm font-bold text-purple-600">{leagueState.weeklyXP} XP</span>
                      </div>
                      <Progress value={(leagueState.weeklyXP / 1000) * 100} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Ranking</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold">#{leagueState.rank}</span>
                          {leagueState.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Mini Leaderboard */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4 text-yellow-500" />
                        Top 5 League
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {mockStudents
                        .filter(s => s.league === leagueState.currentLeague)
                        .sort((a, b) => (b.weeklyXP || 0) - (a.weeklyXP || 0))
                        .slice(0, 5)
                        .map((student, index) => (
                          <div 
                            key={student.id} 
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-lg transition-colors",
                              student.id === currentStudent.id 
                                ? "bg-primary/10 border border-primary/20" 
                                : "bg-muted/30 hover:bg-muted/50"
                            )}
                          >
                            <span className={cn(
                              "text-xs font-bold w-6 text-center",
                              index === 0 && "text-yellow-500",
                              index === 1 && "text-gray-400",
                              index === 2 && "text-orange-600",
                              index > 2 && "text-muted-foreground"
                            )}>
                              #{index + 1}
                            </span>
                            <Avatar className="h-6 w-6">
                              <img src={student.avatar} alt={student.name} />
                            </Avatar>
                            <span className="text-xs flex-1 truncate font-medium">{student.name}</span>
                            <span className="text-xs font-bold text-primary">{student.weeklyXP || 0}</span>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Next Achievement */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        Target Achievement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                            <Trophy className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold">Mathematician</p>
                            <p className="text-xs text-muted-foreground">Selesaikan 10 modul matematika</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Progress value={30} className="h-2" />
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Progress</p>
                            <p className="text-xs font-bold text-amber-600">3/10 modul</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Reward:</span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-orange-500" />
                                <span className="font-bold">500 XP</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Gem className="h-3 w-3 text-blue-500" />
                                <span className="font-bold">100 Gems</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue to Next Module CTA Modal */}
        <Dialog open={showContinueCTA} onOpenChange={setShowContinueCTA}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-center text-xl">
                Modul Selesai! 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                Kamu sudah menyelesaikan modul ini dengan baik!
              </DialogDescription>
            </DialogHeader>

            {nextNode && (
              <div className="space-y-4 py-4">
                {/* Current Node Summary */}
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Modul Selesai</p>
                      <p className="text-xs text-muted-foreground">Kamu mendapat reward XP & progress</p>
                    </div>
                  </div>
                </div>

                {/* Next Module Card */}
                <div className="rounded-lg border-2 border-primary bg-gradient-to-br from-primary/5 to-purple-500/5 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">Modul Berikutnya Terbuka</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold">{nextNode.title}</h4>
                    <p className="text-sm text-muted-foreground">{nextNode.description}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">
                        {nextNode.categoryName}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {nextNode.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                        <Sparkles className="h-3 w-3" />
                        +{nextNode.xpReward} XP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowContinueCTA(false)}
                className="w-full sm:w-auto"
              >
                Nanti Saja
              </Button>
              <Button
                onClick={() => {
                  if (nextNode) {
                    const module = getModuleForNode(nextNode.id);
                    if (module) {
                      navigate(`/lesson/${module.id}`);
                    }
                  }
                  setShowContinueCTA(false);
                }}
                className="w-full sm:w-auto gradient-primary"
              >
                Lanjut ke {nextNode?.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Learning;
