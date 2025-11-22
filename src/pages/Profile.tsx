import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { XPBar } from "@/components/XPBar";
import { AchievementCard } from "@/components/AchievementCard";
import { Edit2, Trophy, Zap, Calendar, Target, Upload, Camera, TrendingUp, Award, Clock, CheckCircle2, Bell, User, Volume2, LogOut } from "lucide-react";
import { mockStudents } from "@/data/mockData";
import { mockAchievements, calculateLevel } from "@/data/gamificationData";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedInput } from "@/components/ui/animated-input";
import { toast } from "sonner";
import soundManager from "@/lib/soundManager";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  scaleIn, 
  staggerContainer, 
  hoverLift 
} from "@/lib/animations";
import { cn } from "@/lib/utils";

// Mock data for charts
const activityData = [
  { day: 'Sen', xp: 45 },
  { day: 'Sel', xp: 52 },
  { day: 'Rab', xp: 38 },
  { day: 'Kam', xp: 65 },
  { day: 'Jum', xp: 55 },
  { day: 'Sab', xp: 70 },
  { day: 'Min', xp: 48 },
];

const skillRadarData = [
  { skill: 'Aljabar', value: 85 },
  { skill: 'Geometri', value: 70 },
  { skill: 'Statistika', value: 60 },
  { skill: 'Kalkulus', value: 45 },
  { skill: 'Trigonometri', value: 75 },
];

const progressTimelineData = [
  { date: '2024-11-01', event: 'Menyelesaikan Aljabar Dasar', type: 'achievement' },
  { date: '2024-11-03', event: 'Streak 7 hari tercapai', type: 'milestone' },
  { date: '2024-11-05', event: 'Naik ke Level 5', type: 'level' },
  { date: '2024-11-07', event: 'Skor sempurna di Quiz Geometri', type: 'achievement' },
];

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    // Load from localStorage
    return localStorage.getItem('userProfileImage');
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sound settings state
  const [soundEnabled, setSoundEnabled] = useState(() => soundManager.getSettings().enabled);
  const [soundVolume, setSoundVolume] = useState(() => soundManager.getSettings().volume * 100);
  
  const totalXP = 2850;
  const levelData = calculateLevel(totalXP);
  const unlockedAchievements = mockAchievements.filter(a => a.unlocked);
  const lockedAchievements = mockAchievements.filter(a => !a.unlocked);

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success("Logout berhasil! Sampai jumpa lagi.");
    navigate("/");
  };

  // Sound settings handlers
  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundManager.setEnabled(enabled);
    if (enabled) {
      soundManager.play("achievement");
      toast.success("Efek suara diaktifkan");
    } else {
      toast.info("Efek suara dinonaktifkan");
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0];
    setSoundVolume(volume);
    soundManager.setVolume(volume / 100);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      // Read and convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        // Save to localStorage
        localStorage.setItem('userProfileImage', result);
        toast.success('Foto profil berhasil diupdate!');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    localStorage.removeItem('userProfileImage');
    toast.success('Foto profil dihapus');
  };

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
                  className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <User className="w-5 h-5 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Profil Saya
                </h1>
              </div>
            </div>
          </motion.header>

          <div className="container px-4 py-8 max-w-6xl mx-auto">
            {/* Header Card with XP */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <Card className="mb-6 relative overflow-hidden border-2">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-90" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                <CardContent className="p-8 relative z-10 text-primary-foreground">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar with upload overlay */}
                    <motion.div 
                      className="relative group"
                      variants={scaleIn}
                      onHoverStart={() => setAvatarHover(true)}
                      onHoverEnd={() => setAvatarHover(false)}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={handleAvatarClick}
                      >
                        <Avatar className="w-32 h-32 border-4 border-white/30 shadow-2xl cursor-pointer">
                          {profileImage ? (
                            <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
                          ) : (
                            <AvatarFallback className="text-6xl bg-white/20">
                              {user?.avatar || user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        
                        {/* Upload overlay */}
                        <AnimatePresence>
                          {avatarHover && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center cursor-pointer"
                            >
                              <Camera className="w-8 h-8 mb-1" />
                              <span className="text-xs font-medium">
                                {profileImage ? 'Ubah Foto' : 'Upload Foto'}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      
                      {/* Level badge */}
                      <motion.div
                        className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white flex items-center justify-center font-bold shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span className="text-white">{levelData.level}</span>
                      </motion.div>
                    </motion.div>
                  
                  <div className="flex-1 text-center md:text-left space-y-3">
                    <div>
                      <motion.h2 
                        variants={fadeInLeft}
                        className="text-3xl font-bold mb-1"
                      >
                        {user?.name || 'Pengguna'}
                      </motion.h2>
                      <motion.p 
                        variants={fadeInLeft}
                        className="text-white/80"
                      >
                        {user?.className || 'Kelas'} • Level {levelData.level}
                      </motion.p>
                      
                      {/* Photo management buttons */}
                      {profileImage && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 flex gap-2 justify-center md:justify-start"
                        >
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleAvatarClick}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          >
                            <Camera className="w-3 h-3 mr-1" />
                            Ganti Foto
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={removeProfileImage}
                            className="text-white hover:bg-white/20"
                          >
                            Hapus Foto
                          </Button>
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Zap className="w-3 h-3 mr-1 fill-yellow-300 text-yellow-300" />
                        {totalXP.toLocaleString()} XP
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        {unlockedAchievements.length} Achievements
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        🔥 7 Hari Streak
                      </Badge>
                    </div>

                    <div className="max-w-md">
                      <XPBar 
                        currentXP={levelData.xpInLevel}
                        xpForNextLevel={levelData.xpForNextLevel}
                        level={levelData.level}
                        title={levelData.title}
                        showLabel={false}
                        className="bg-white/10 p-3 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

            <Tabs defaultValue="stats" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stats">Statistik</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Pengaturan</TabsTrigger>
              </TabsList>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-6">
                {/* Stats Cards */}
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid md:grid-cols-3 gap-4"
                >
                  <motion.div variants={fadeInUp}>
                    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Target className="w-5 h-5 text-primary" />
                          </motion.div>
                          Topik Dikuasai
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                          <AnimatedCounter value={3} />/4
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">75% selesai</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <Calendar className="w-5 h-5 text-accent" />
                          </motion.div>
                          Total Hari Belajar
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-accent">
                          <AnimatedCounter value={47} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Sejak bergabung</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          </motion.div>
                          Rata-rata XP/Hari
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-yellow-600">
                          <AnimatedCounter value={60} />
                        </div>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +15% minggu ini
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* Activity Chart */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Aktivitas 7 Hari Terakhir
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={activityData}>
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="xp" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Skill Radar Chart */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-500" />
                        Analisis Kemampuan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={skillRadarData}>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar 
                            name="Kemampuan" 
                            dataKey="value" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary))" 
                            fillOpacity={0.5} 
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Progress Timeline */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-accent" />
                        Timeline Aktivitas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {progressTimelineData.map((item, index) => {
                          const getIcon = () => {
                            switch (item.type) {
                              case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
                              case 'milestone': return <Zap className="w-4 h-4 text-orange-500" />;
                              case 'level': return <TrendingUp className="w-4 h-4 text-blue-500" />;
                              default: return <CheckCircle2 className="w-4 h-4 text-green-500" />;
                            }
                          };
                          
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex gap-3 group"
                            >
                              <div className="relative">
                                <motion.div
                                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background shadow-sm group-hover:scale-110 transition-transform"
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  {getIcon()}
                                </motion.div>
                                {index < progressTimelineData.length - 1 && (
                                  <div className="absolute top-8 left-4 w-0.5 h-8 bg-gradient-to-b from-border to-transparent" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <p className="font-medium group-hover:text-primary transition-colors">
                                  {item.event}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(item.date).toLocaleDateString('id-ID', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-6"
                >
                  {/* Unlocked Achievements */}
                  <div>
                    <motion.h3 
                      variants={fadeInLeft}
                      className="text-lg font-semibold mb-4 flex items-center gap-2"
                    >
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Achievements Terbuka ({unlockedAchievements.length})
                    </motion.h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {unlockedAchievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <AchievementCard achievement={achievement} />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Locked Achievements */}
                  <div>
                    <motion.h3 
                      variants={fadeInLeft}
                      className="text-lg font-semibold mb-4 flex items-center gap-2"
                    >
                      🔒 Achievements Terkunci ({lockedAchievements.length})
                    </motion.h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lockedAchievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <AchievementCard achievement={achievement} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-6"
                >
                  {/* Personal Information */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Edit2 className="w-5 h-5 text-primary" />
                          Informasi Pribadi
                        </CardTitle>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant={isEditing ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            {isEditing ? 'Batal' : 'Edit'}
                          </Button>
                        </motion.div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isEditing ? 'editing' : 'viewing'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 gap-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="name">Nama Lengkap</Label>
                              {isEditing ? (
                                <AnimatedInput 
                                  id="name" 
                                  defaultValue={currentStudent.name}
                                />
                              ) : (
                                <Input 
                                  id="name" 
                                  defaultValue={currentStudent.name}
                                  disabled
                                />
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="class">Kelas</Label>
                              {isEditing ? (
                                <AnimatedInput 
                                  id="class" 
                                  defaultValue={currentStudent.class}
                                />
                              ) : (
                                <Input 
                                  id="class" 
                                  defaultValue={currentStudent.class}
                                  disabled
                                />
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              {isEditing ? (
                                <AnimatedInput 
                                  id="email" 
                                  type="email"
                                  defaultValue="tristan@sekolah.com"
                                />
                              ) : (
                                <Input 
                                  id="email" 
                                  type="email"
                                  defaultValue="tristan@sekolah.com"
                                  disabled
                                />
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Nomor HP</Label>
                              {isEditing ? (
                                <AnimatedInput 
                                  id="phone" 
                                  type="tel"
                                  defaultValue="081234567890"
                                />
                              ) : (
                                <Input 
                                  id="phone" 
                                  type="tel"
                                  defaultValue="081234567890"
                                  disabled
                                />
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                        
                        <AnimatePresence>
                          {isEditing && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <Button className="w-full md:w-auto gradient-primary">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Simpan Perubahan
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Notification Preferences */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-accent" />
                          Preferensi Notifikasi
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <motion.div 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex-1">
                            <p className="font-medium">Achievement Baru</p>
                            <p className="text-sm text-muted-foreground">Notifikasi saat membuka achievement</p>
                          </div>
                          <Switch defaultChecked />
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex-1">
                            <p className="font-medium">Pengingat Streak</p>
                            <p className="text-sm text-muted-foreground">Ingatkan jika belum belajar hari ini</p>
                          </div>
                          <Switch defaultChecked />
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex-1">
                            <p className="font-medium">Update Leaderboard</p>
                            <p className="text-sm text-muted-foreground">Notifikasi perubahan peringkat</p>
                          </div>
                          <Switch />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Sound Effects Settings */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Volume2 className="w-5 h-5 text-purple-500" />
                          Efek Suara
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <motion.div 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex-1">
                            <p className="font-medium">Aktifkan Efek Suara</p>
                            <p className="text-sm text-muted-foreground">
                              Suara untuk level up, achievement, dan lainnya
                            </p>
                          </div>
                          <Switch 
                            checked={soundEnabled}
                            onCheckedChange={handleSoundToggle}
                          />
                        </motion.div>

                        {soundEnabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3"
                          >
                            <div className="px-3">
                              <Label className="text-sm font-medium mb-3 block">
                                Volume Suara
                              </Label>
                              <div className="flex items-center gap-4">
                                <Slider
                                  value={[soundVolume]}
                                  onValueChange={handleVolumeChange}
                                  max={100}
                                  step={5}
                                  className="flex-1"
                                />
                                <span className="text-sm font-medium w-12 text-right">
                                  {Math.round(soundVolume)}%
                                </span>
                              </div>
                            </div>

                            <div className="px-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => soundManager.play("achievement")}
                                className="w-full"
                              >
                                🔊 Test Suara
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Logout Section */}
                  <motion.div
                    variants={fadeInUp}
                    whileHover="hover"
                    className="mt-6"
                  >
                    <Card className="border-2 border-destructive/20 hover:border-destructive/40 transition-all">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                          <LogOut className="h-5 w-5" />
                          Keluar dari Akun
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Keluar dari akun Anda dan kembali ke halaman login.
                        </p>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
