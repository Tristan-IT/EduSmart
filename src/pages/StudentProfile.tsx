import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Star,
  Trophy,
  Zap,
  TrendingUp,
  Camera,
  Save,
  Lock,
  Shield,
  CheckCircle2,
  Target,
  Activity
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface StudentData {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  studentId: string;
  dateOfBirth?: string;
  address?: string;
  class: {
    _id: string;
    name: string;
    level: string;
  };
  school: {
    _id: string;
    name: string;
  };
  parents?: {
    fatherName?: string;
    motherName?: string;
    guardianPhone?: string;
  };
}

interface LearningStats {
  totalXP: number;
  currentLevel: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  achievementsEarned: number;
  currentStreak: number;
  masteryProgress: {
    subject: string;
    percentage: number;
    color: string;
  }[];
}

const StudentProfile = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchStudentData();
    fetchLearningStats();
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/student/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setUpdateStatus({
        type: "error",
        message: "Gagal memuat data profil. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLearningStats = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch gamification data (XP, level, etc.)
      const gamificationResponse = await fetch("http://localhost:5000/api/gamification/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Fetch progress data (completed lessons, mastery)
      const progressResponse = await fetch("http://localhost:5000/api/progress/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Fetch achievements
      const achievementsResponse = await fetch("http://localhost:5000/api/achievements/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let gamificationData = null;
      let progressData = null;
      let achievementsData = null;

      if (gamificationResponse.ok) {
        gamificationData = await gamificationResponse.json();
      }

      if (progressResponse.ok) {
        progressData = await progressResponse.json();
      }

      if (achievementsResponse.ok) {
        achievementsData = await achievementsResponse.json();
      }

      // Build learning stats from real data
      const stats: LearningStats = {
        totalXP: gamificationData?.xp || 0,
        currentLevel: gamificationData?.level || 1,
        completedLessons: progressData?.completedLessons || 0,
        totalLessons: progressData?.totalLessons || 0,
        averageScore: progressData?.averageScore || 0,
        achievementsEarned: achievementsData?.achievements?.length || 0,
        currentStreak: gamificationData?.streak || 0,
        masteryProgress: progressData?.masteryProgress || []
      };

      setLearningStats(stats);
    } catch (error) {
      console.error("Error fetching learning stats:", error);
      // Set empty stats if fetch fails
      setLearningStats({
        totalXP: 0,
        currentLevel: 1,
        completedLessons: 0,
        totalLessons: 0,
        averageScore: 0,
        achievementsEarned: 0,
        currentStreak: 0,
        masteryProgress: []
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/student/profile/me", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      });
      setUpdateStatus({
        type: "success",
        message: "Profil berhasil diperbarui!",
      });
    } catch (error) {
      setUpdateStatus({
        type: "error",
        message: "Gagal memperbarui profil",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      await fetch("http://localhost:5000/api/student/profile/password", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword: formData.get("currentPassword"),
          newPassword: formData.get("newPassword"),
        })
      });
      
      setUpdateStatus({
        type: "success",
        message: "Password berhasil diubah!",
      });
      form.reset();
    } catch (error) {
      setUpdateStatus({
        type: "error",
        message: "Gagal mengubah password",
      });
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar role="student" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const xpToNextLevel = learningStats ? (learningStats.currentLevel + 1) * 300 : 300;
  const xpProgress = learningStats ? (learningStats.totalXP % 300) / 300 * 100 : 0;
  const completionRate = learningStats && learningStats.totalLessons > 0 ? (learningStats.completedLessons / learningStats.totalLessons) * 100 : 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <AppSidebar role="student" />

        <main className="flex-1 overflow-auto">
          <motion.header
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md"
          >
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Profil Saya
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola profil dan lihat progres belajar Anda
                </p>
              </div>
            </div>
          </motion.header>

          <div className="p-6 max-w-7xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {updateStatus && (
                <motion.div variants={fadeInUp}>
                  <Alert
                    variant={updateStatus.type === "error" ? "destructive" : "default"}
                    className={updateStatus.type === "success" ? "border-emerald-500 bg-emerald-50" : ""}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{updateStatus.message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Avatar & Level Section */}
              <motion.div variants={fadeInUp}>
                <Card className="overflow-hidden border-2 border-emerald-200">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                          {studentData?.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute bottom-0 right-0 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900">
                            {studentData?.name || "Memuat..."}
                          </h2>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                            <Badge variant="secondary" className="gap-1">
                              <User className="h-3 w-3" />
                              {studentData?.studentId || "-"}
                            </Badge>
                            <Badge className="gap-1 bg-emerald-500">
                              <BookOpen className="h-3 w-3" />
                              {studentData?.class?.name || "-"}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              {studentData?.school?.name || "-"}
                            </Badge>
                          </div>
                        </div>

                        {learningStats ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                <span className="font-semibold">Level {learningStats.currentLevel}</span>
                              </div>
                              <span className="text-gray-600">{learningStats.totalXP} / {xpToNextLevel} XP</span>
                            </div>
                            <Progress value={xpProgress} className="h-3" />
                            <p className="text-xs text-gray-500">
                              {xpToNextLevel - (learningStats.totalXP % 300)} XP lagi ke level {learningStats.currentLevel + 1}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-400">Belum ada progres belajar</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Learning Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div variants={fadeInUp}>
                  <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total XP</p>
                          {learningStats ? (
                            <p className="text-2xl font-bold text-emerald-600">{learningStats.totalXP}</p>
                          ) : (
                            <p className="text-2xl font-bold text-gray-400">0</p>
                          )}
                          {!learningStats || learningStats.totalXP === 0 && (
                            <p className="text-xs text-gray-400 mt-1">Mulai belajar untuk mendapatkan XP</p>
                          )}
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-full">
                          <Zap className="h-6 w-6 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Rata-Rata Nilai</p>
                          {learningStats && learningStats.averageScore > 0 ? (
                            <p className="text-2xl font-bold text-blue-600">{learningStats.averageScore}%</p>
                          ) : (
                            <>
                              <p className="text-2xl font-bold text-gray-400">-</p>
                              <p className="text-xs text-gray-400 mt-1">Selesaikan kuis untuk melihat nilai</p>
                            </>
                          )}
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Pencapaian</p>
                          {learningStats && learningStats.achievementsEarned > 0 ? (
                            <p className="text-2xl font-bold text-purple-600">{learningStats.achievementsEarned}</p>
                          ) : (
                            <>
                              <p className="text-2xl font-bold text-gray-400">0</p>
                              <p className="text-xs text-gray-400 mt-1">Raih pencapaian pertamamu!</p>
                            </>
                          )}
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                          <Trophy className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Streak Hari</p>
                          {learningStats && learningStats.currentStreak > 0 ? (
                            <p className="text-2xl font-bold text-amber-600">{learningStats.currentStreak}</p>
                          ) : (
                            <>
                              <p className="text-2xl font-bold text-gray-400">0</p>
                              <p className="text-xs text-gray-400 mt-1">Mulai streak harianmu!</p>
                            </>
                          )}
                        </div>
                        <div className="p-3 bg-amber-100 rounded-full">
                          <Activity className="h-6 w-6 text-amber-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Mastery Progress */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      Progres Penguasaan Materi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {learningStats && learningStats.masteryProgress.length > 0 ? (
                      learningStats.masteryProgress.map((subject, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{subject.subject}</span>
                            <span className="text-sm font-semibold text-gray-600">{subject.percentage}%</span>
                          </div>
                          <Progress value={subject.percentage} className={`h-2 ${subject.color}`} />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Belum ada data penguasaan materi</p>
                        <p className="text-gray-400 text-xs mt-1">Mulai belajar untuk melihat progres penguasaan materimu</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-emerald-600" />
                        Informasi Pribadi
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nama Lengkap
                          </Label>
                          <Input
                            id="name"
                            value={studentData?.name || ""}
                            onChange={(e) =>
                              setStudentData((prev) => ({ ...prev!, name: e.target.value }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={studentData?.email || ""}
                            onChange={(e) =>
                              setStudentData((prev) => ({ ...prev!, email: e.target.value }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Nomor Telepon
                          </Label>
                          <Input
                            id="phone"
                            value={studentData?.phoneNumber || ""}
                            onChange={(e) =>
                              setStudentData((prev) => ({ ...prev!, phoneNumber: e.target.value }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dob" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Tanggal Lahir
                          </Label>
                          <Input
                            id="dob"
                            type="date"
                            value={studentData?.dateOfBirth?.split("T")[0] || ""}
                            onChange={(e) =>
                              setStudentData((prev) => ({ ...prev!, dateOfBirth: e.target.value }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Alamat
                          </Label>
                          <Input
                            id="address"
                            value={studentData?.address || ""}
                            onChange={(e) =>
                              setStudentData((prev) => ({ ...prev!, address: e.target.value }))
                            }
                          />
                        </div>

                        <Separator />

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Simpan Perubahan
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Security Settings */}
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-emerald-600" />
                        Keamanan Akun
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password Saat Ini
                          </Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password Baru
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Konfirmasi Password Baru
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                          />
                        </div>

                        <Separator />

                        <Button
                          type="submit"
                          variant="outline"
                          className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Ubah Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentProfile;
