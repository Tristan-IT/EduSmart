import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Flame, TrendingUp, Medal, Crown, Star, Zap, Award, Users } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LeagueIcon } from "@/components/LeagueIcon";
import { useState, useEffect, useMemo } from "react";
import { 
  fadeInUp, 
  fadeInLeft, 
  scaleIn, 
  staggerContainer, 
  hoverLift,
  bounce
} from "@/lib/animations";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

interface LeaderboardEntry {
  studentId: string;
  name: string;
  rank: number;
  xp: number;
  weeklyXP: number;
  level: number;
  streak: number;
  bestStreak: number;
  league: string;
  avatar: string;
}

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  league: string;
  weeklyXP: number;
  rank: number | null;
}

const Leaderboard = () => {
  const { userId } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'league' | 'friends'>('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile image from localStorage
    const savedImage = localStorage.getItem('userProfileImage');
    setProfileImage(savedImage);
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const params: any = { limit: 50 };
        
        // Add league filter for league tab
        if (activeTab === 'league' && currentUser?.league) {
          params.league = currentUser.league;
        }

        const url = `/gamification/leaderboard?${new URLSearchParams(params as any).toString()}`;
        const response: any = await apiClient.get(url);
        
        if (response.success) {
          setLeaderboardData(response.data.leaderboard);
          setCurrentUser(response.data.currentUser);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  // Filter leaderboard based on active tab
  const filteredLeaderboard = useMemo(() => {
    if (activeTab === 'friends') {
      // For friends tab, show classmates or top players (temporary)
      return leaderboardData.filter(entry => entry.studentId !== userId).slice(0, 10);
    }
    // For 'all' and 'league' tabs, backend already filters
    return leaderboardData;
  }, [activeTab, leaderboardData, userId]);

  // Helper to render avatar (photo or emoji)
  const renderAvatar = (studentId: string, avatarUrl: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const isCurrentUser = studentId === userId;
    const hasPhoto = isCurrentUser && profileImage;
    
    const sizeClasses = {
      sm: 'w-12 h-12 text-2xl',
      md: 'w-20 h-20 text-4xl',
      lg: 'w-24 h-24 text-5xl'
    };

    if (hasPhoto) {
      return (
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg`}>
          <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
          <AvatarFallback className={`${sizeClasses[size].split(' ')[2]}`}>
            {avatarUrl ? <AvatarImage src={avatarUrl} /> : '👤'}
          </AvatarFallback>
        </Avatar>
      );
    }

    return (
      <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg`}>
        <AvatarImage src={avatarUrl} alt="Avatar" />
        <AvatarFallback className={`${sizeClasses[size].split(' ')[2]}`}>👤</AvatarFallback>
      </Avatar>
    );
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex">
          <AppSidebar role="student" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat leaderboard...</p>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
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
                  className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Trophy className="w-5 h-5 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                  Leaderboard
                </h1>
              </div>
            </div>
          </motion.header>

          <div className="container px-4 py-8 max-w-4xl mx-auto">
            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Semua
                </TabsTrigger>
                <TabsTrigger value="league" className="flex items-center gap-2">
                  <LeagueIcon tier={currentUser?.league || 'bronze'} size="sm" />
                  Liga Saya
                </TabsTrigger>
                <TabsTrigger value="friends" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Teman
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* League Info Banner (shown only in Liga Saya tab) */}
            {activeTab === 'league' && currentUser && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <LeagueIcon tier={currentUser.league} size="md" />
                  <div>
                    <h3 className="font-bold capitalize">{currentUser.league} League</h3>
                    <p className="text-sm text-muted-foreground">
                      Kompetisi mingguan dalam liga kamu
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {filteredLeaderboard.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <Trophy className="w-24 h-24 text-muted-foreground/30 mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Belum Ada Data</h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'league' 
                    ? 'Belum ada siswa lain di liga kamu'
                    : activeTab === 'friends'
                    ? 'Belum ada teman atau teman sekelas'
                    : 'Belum ada data leaderboard tersedia'}
                </p>
                <div className="max-w-md mx-auto p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Mulai belajar dan kumpulkan XP untuk muncul di leaderboard!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Top 3 Podium */}
            {filteredLeaderboard.length >= 3 && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="mb-12"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                🏆 Top Performers
              </motion.h2>
              
              <div className="grid grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
                {/* Rank 2 - Silver */}
                <motion.div
                  variants={scaleIn}
                  custom={1}
                  className="transform translate-y-8"
                >
                  <Card className="relative overflow-hidden border-2 border-gray-400 hover:shadow-xl transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-500/20" />
                    <motion.div
                      className="absolute -top-16 -right-16 w-32 h-32 bg-gray-400/20 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div
                        className="flex items-center justify-center mb-3"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {renderAvatar(filteredLeaderboard[1].studentId, filteredLeaderboard[1].avatar, 'md')}
                      </motion.div>
                      <Badge className="mb-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white border-0">
                        <Medal className="w-3 h-3 mr-1" />
                        #2
                      </Badge>
                      <h4 className="font-bold text-lg mb-1">{filteredLeaderboard[1].name}</h4>
                      <p className="text-sm font-semibold text-muted-foreground mb-3">
                        <AnimatedCounter value={filteredLeaderboard[1].xp} /> XP
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                        </motion.div>
                        <span className="font-medium">{filteredLeaderboard[1].streak} hari</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Rank 1 - Gold */}
                <motion.div
                  variants={scaleIn}
                  custom={0}
                  className="relative"
                >
                  {/* Floating crown */}
                  <motion.div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 z-20"
                    animate={{ 
                      y: [-5, 5, -5],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Crown className="w-12 h-12 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
                  </motion.div>

                  {/* Floating stars */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `-${20 + i * 10}px`
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                  
                  <Card className="relative overflow-hidden border-4 border-yellow-500 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 opacity-90" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <CardContent className="p-8 text-center relative z-10 text-white">
                      <motion.div
                        className="flex items-center justify-center mb-4"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {renderAvatar(filteredLeaderboard[0].studentId, filteredLeaderboard[0].avatar, 'lg')}
                      </motion.div>
                      <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur">
                        <Crown className="w-4 h-4 mr-1" />
                        #1 Champion
                      </Badge>
                      <h4 className="font-bold text-xl mb-2">{filteredLeaderboard[0].name}</h4>
                      <p className="text-lg font-bold mb-4">
                        <AnimatedCounter value={filteredLeaderboard[0].xp} /> XP
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Flame className="w-5 h-5 fill-white" />
                        </motion.div>
                        <span className="font-bold text-lg">{filteredLeaderboard[0].streak} hari streak</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Rank 3 - Bronze */}
                <motion.div
                  variants={scaleIn}
                  custom={2}
                  className="transform translate-y-12"
                >
                  <Card className="relative overflow-hidden border-2 border-orange-600 hover:shadow-xl transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-700/20" />
                    <motion.div
                      className="absolute -top-16 -left-16 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    />
                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div
                        className="flex items-center justify-center mb-3"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      >
                        {renderAvatar(filteredLeaderboard[2].studentId, filteredLeaderboard[2].avatar, 'md')}
                      </motion.div>
                      <Badge className="mb-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white border-0">
                        <Medal className="w-3 h-3 mr-1" />
                        #3
                      </Badge>
                      <h4 className="font-bold text-lg mb-1">{filteredLeaderboard[2].name}</h4>
                      <p className="text-sm font-semibold text-muted-foreground mb-3">
                        <AnimatedCounter value={filteredLeaderboard[2].xp} /> XP
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        >
                          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                        </motion.div>
                        <span className="font-medium">{filteredLeaderboard[2].streak} hari</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
            )}

            {/* Full Leaderboard List */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                {filteredLeaderboard.map((entry, index) => {
                    const isCurrentUser = entry.studentId === userId;
                    const isTopThree = entry.rank <= 3;
                    
                    return (
                      <motion.div
                        key={entry.studentId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <Card 
                          className={cn(
                            "transition-all relative overflow-hidden group",
                            isCurrentUser && "border-2 border-primary shadow-lg shadow-primary/20"
                          )}
                        >
                          {/* Current user glow effect */}
                          {isCurrentUser && (
                            <>
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <motion.div
                                className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-lg opacity-20 blur"
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </>
                          )}
                          
                          <CardContent className="p-4 relative z-10">
                            <div className="flex items-center gap-4">
                              {/* Rank Badge */}
                              <motion.div
                                className={cn(
                                  "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md relative",
                                  entry.rank === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
                                  entry.rank === 2 && "bg-gradient-to-br from-gray-300 to-gray-500 text-white",
                                  entry.rank === 3 && "bg-gradient-to-br from-orange-500 to-orange-700 text-white",
                                  entry.rank > 3 && "bg-muted text-muted-foreground"
                                )}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                #{entry.rank}
                                {isTopThree && (
                                  <motion.div
                                    className="absolute inset-0 rounded-full"
                                    animate={{ boxShadow: ['0 0 0 0 rgba(251, 191, 36, 0.4)', '0 0 0 10px rgba(251, 191, 36, 0)'] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                )}
                              </motion.div>
                              
                              {/* Avatar */}
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                {renderAvatar(entry.studentId, entry.avatar, 'sm')}
                              </motion.div>
                              
                              {/* User Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-lg truncate">
                                    {entry.name}
                                  </h4>
                                  {isCurrentUser && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500 }}
                                    >
                                      <Badge className="bg-gradient-to-r from-primary to-purple-500 text-white border-0">
                                        <Star className="w-3 h-3 mr-1 fill-white" />
                                        Kamu
                                      </Badge>
                                    </motion.div>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm flex-wrap">
                                  {/* League Icon (for Liga Saya tab) */}
                                  {activeTab === 'league' && entry.league && (
                                    <span className="flex items-center gap-1.5">
                                      <LeagueIcon tier={entry.league} size="sm" />
                                      <span className="font-semibold capitalize text-muted-foreground">
                                        {entry.league}
                                      </span>
                                    </span>
                                  )}
                                  
                                  {/* XP Display - show weeklyXP for league tab, regular XP for all tab */}
                                  <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Zap className="w-4 h-4 text-primary" />
                                    <span className="font-semibold">
                                      <AnimatedCounter value={activeTab === 'league' ? (entry.weeklyXP || 0) : entry.xp} />
                                    </span> 
                                    {activeTab === 'league' ? 'XP Minggu Ini' : 'XP'}
                                  </span>
                                  
                                  <span className="flex items-center gap-1.5">
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                    </motion.div>
                                    <span className="font-semibold">{entry.streak} hari</span>
                                  </span>
                                </div>
                              </div>

                              {/* Medal Icon */}
                              {isTopThree && (
                                <motion.div
                                  className="text-4xl"
                                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
            </div>

            {/* Stats Card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="mt-8"
            >
              <Card className="relative overflow-hidden border-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-90" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-center text-white flex items-center justify-center gap-2">
                    <Award className="w-6 h-6" />
                    Statistik Kamu
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-3 gap-6 text-center text-white">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-4 rounded-lg bg-white/10 backdrop-blur"
                    >
                      <Trophy className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-4xl font-bold mb-1">
                        #{filteredLeaderboard[0]?.rank || 1}
                      </div>
                      <p className="text-sm text-white/80">Peringkat</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-4 rounded-lg bg-white/10 backdrop-blur"
                    >
                      <Zap className="w-8 h-8 mx-auto mb-2 fill-yellow-300 text-yellow-300" />
                      <div className="text-4xl font-bold mb-1">
                        <AnimatedCounter value={filteredLeaderboard[0]?.xp || 0} />
                      </div>
                      <p className="text-sm text-white/80">Total XP</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-4 rounded-lg bg-white/10 backdrop-blur"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Flame className="w-8 h-8 mx-auto mb-2 fill-orange-400 text-orange-400" />
                      </motion.div>
                      <div className="text-4xl font-bold mb-1 flex items-center justify-center gap-2">
                        {filteredLeaderboard[0]?.streak || 0}
                      </div>
                      <p className="text-sm text-white/80">Hari Streak</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Leaderboard;
