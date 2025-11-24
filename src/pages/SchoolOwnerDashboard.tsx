import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  Copy,
  CheckCircle2,
  Sparkles,
  Target,
  Shield,
  AlertTriangle,
  Activity,
  UserPlus,
  Zap,
  FileText,
  Settings,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
  overview: {
    school: {
      schoolId: string;
      schoolName: string;
      city: string;
      province: string;
    };
    totals: {
      teachers: number;
      students: number;
      classes: number;
      activeStudents: number;
      activeTeachers: number;
    };
    averages: {
      studentsPerClass: number;
      xpPerStudent: number;
      levelPerStudent: number;
    };
  };
  alerts: {
    fullClasses: number;
    inactiveStudents: number;
    newRegistrations: number;
  };
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
    icon: string;
  }>;
  performance: {
    averageXP: number;
    averageLevel: number;
    topStudents: number;
    completionRate: number;
    averageScore: number;
    engagementRate: number;
  };
}

const SchoolOwnerDashboard = () => {
  const { token: authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSchoolIdDialog, setShowSchoolIdDialog] = useState(false);
  const [schoolId, setSchoolId] = useState("");
  const [copiedSchoolId, setCopiedSchoolId] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Load schoolId from localStorage
    const storedSchoolId = localStorage.getItem("schoolId");
    if (storedSchoolId) {
      setSchoolId(storedSchoolId);
    }
    
    // Check if this is a newly registered owner
    const newSchoolId = localStorage.getItem("newSchoolId");
    if (newSchoolId) {
      setSchoolId(newSchoolId);
      setShowSchoolIdDialog(true);
      localStorage.removeItem("newSchoolId"); // Clear after showing
    }
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = authToken || localStorage.getItem("token");
      const storedSchoolId = localStorage.getItem("schoolId");
      
      if (!token) {
        setError("Token autentikasi tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }
      
      if (!storedSchoolId) {
        setError("School ID tidak ditemukan. Silakan login kembali untuk mendapatkan akses ke dashboard sekolah.");
        setLoading(false);
        return;
      }
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Get overview data
      const overviewRes = await fetch(`http://localhost:5000/api/school-dashboard/overview?schoolId=${storedSchoolId}`, { headers });
      
      if (!overviewRes.ok) {
        if (overviewRes.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
          localStorage.removeItem("token");
          localStorage.removeItem("schoolId");
          return;
        }
        throw new Error("Failed to fetch overview data");
      }

      const overviewData = await overviewRes.json();
      
      if (overviewData.success) {
        // Transform data for dashboard - API returns overview data directly in data field
        const overview = overviewData.data;
        
        // Get alerts data
        const alertsRes = await fetch(`http://localhost:5000/api/school-dashboard/alerts?schoolId=${storedSchoolId}`, { headers });
        const alertsData = alertsRes.ok ? (await alertsRes.json()).data : {
          fullClasses: 0,
          inactiveStudents: 0,
          newRegistrations: 0,
        };

        // Get performance metrics
        const performanceRes = await fetch(`http://localhost:5000/api/school-dashboard/performance?schoolId=${storedSchoolId}`, { headers });
        const performanceData = performanceRes.ok ? (await performanceRes.json()).data : {
          completionRate: 0,
          averageScore: 0,
          engagementRate: 0,
        };

        // Get recent activity
        const activityRes = await fetch(`http://localhost:5000/api/school-dashboard/recent-activity?schoolId=${storedSchoolId}&limit=5`, { headers });
        const recentActivity = activityRes.ok ? (await activityRes.json()).data : [];

        setDashboardData({
          overview,
          alerts: alertsData,
          recentActivity,
          performance: {
            averageXP: overview.averages.xpPerStudent,
            averageLevel: overview.averages.levelPerStudent,
            topStudents: Math.floor(Math.random() * 10) + 5, // Keep mock for now
            completionRate: performanceData.completionRate,
            averageScore: performanceData.averageScore,
            engagementRate: performanceData.engagementRate,
          }
        });
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const copySchoolId = () => {
    navigator.clipboard.writeText(schoolId);
    setCopiedSchoolId(true);
    setTimeout(() => setCopiedSchoolId(false), 2000);
  };

  const handleShowSchoolId = () => {
    // Ensure schoolId is loaded from localStorage
    const storedSchoolId = localStorage.getItem("schoolId");
    if (storedSchoolId && !schoolId) {
      setSchoolId(storedSchoolId);
    }
    setShowSchoolIdDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-12 w-12 text-indigo-600 mx-auto" />
          </motion.div>
          <p className="text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <AppSidebar role="school-owner" />
        
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <motion.div 
            className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Selamat Datang, Kepala Sekolah
                </h1>
                <p className="text-sm text-muted-foreground">
                  {dashboardData?.overview.school.schoolName} • {dashboardData?.overview.school.city}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowSchoolId}
                  className="gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  School ID
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Welcome Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Dashboard Sekolah</h2>
                  <p className="text-indigo-100 mb-4">
                    Pantau performa sekolah dan kelola aktivitas pembelajaran
                  </p>
                  <div className="flex gap-3">
                    <Button size="sm" variant="secondary" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Lihat Laporan
                    </Button>
                    <Button size="sm" variant="outline" className="text-white border-white/20 hover:bg-white/10 gap-2">
                      <Settings className="h-4 w-4" />
                      Pengaturan
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key Metrics - Redesigned */}
            {dashboardData && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {/* Total Siswa Card - Enhanced Design */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-blue-100">
                            Total Siswa
                          </CardTitle>
                          <p className="text-xs text-blue-200">Aktif & Terdaftar</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-blue-200">Live</span>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-baseline gap-2 mb-2">
                        <div className="text-3xl font-bold">
                          {dashboardData.overview.totals.students.toLocaleString()}
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-blue-200">
                          {dashboardData.overview.totals.activeStudents} aktif hari ini
                        </p>
                        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {Math.round((dashboardData.overview.totals.activeStudents / dashboardData.overview.totals.students) * 100)}% aktif
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                        <div
                          className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((dashboardData.overview.totals.activeStudents / dashboardData.overview.totals.students) * 100, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Total Guru Card - Enhanced Design */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-emerald-100">
                            Total Guru
                          </CardTitle>
                          <p className="text-xs text-emerald-200">Pengajar Aktif</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-emerald-200">Online</span>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-baseline gap-2 mb-2">
                        <div className="text-3xl font-bold">
                          {dashboardData.overview.totals.teachers.toLocaleString()}
                        </div>
                        <Award className="h-5 w-5 text-yellow-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-emerald-200">
                          {dashboardData.overview.totals.activeTeachers} aktif mengajar
                        </p>
                        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {Math.round((dashboardData.overview.totals.activeTeachers / dashboardData.overview.totals.teachers) * 100)}% aktif
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((dashboardData.overview.totals.activeTeachers / dashboardData.overview.totals.teachers) * 100, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Total Kelas Card - Enhanced Design */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-purple-100">
                            Total Kelas
                          </CardTitle>
                          <p className="text-xs text-purple-200">Ruang Belajar</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-purple-200">Aktif</span>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-baseline gap-2 mb-2">
                        <div className="text-3xl font-bold">
                          {dashboardData.overview.totals.classes.toLocaleString()}
                        </div>
                        <Target className="h-5 w-5 text-pink-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-purple-200">
                          {dashboardData.overview.averages.studentsPerClass} siswa rata-rata
                        </p>
                        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          Kapasitas optimal
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                        <div
                          className="bg-pink-400 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((dashboardData.overview.averages.studentsPerClass / 35) * 100, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Rata-rata XP Card - Enhanced Design */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-orange-100">
                            Rata-rata XP
                          </CardTitle>
                          <p className="text-xs text-orange-200">Poin Pengalaman</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                        <span className="text-xs text-orange-200">Trending</span>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-baseline gap-2 mb-2">
                        <div className="text-3xl font-bold">
                          {dashboardData.performance.averageXP.toLocaleString()}
                        </div>
                        <Sparkles className="h-5 w-5 text-yellow-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-orange-200">
                          Level {dashboardData.performance.averageLevel} rata-rata
                        </p>
                        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {Math.round((dashboardData.performance.averageLevel / 15) * 100)}% to max
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((dashboardData.performance.averageLevel / 15) * 100, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Alerts & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Alerts */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-red-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Pemberitahuan</CardTitle>
                        <CardDescription>Perlu perhatian segera</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {dashboardData?.alerts.fullClasses > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-900">
                          <strong>{dashboardData.alerts.fullClasses} kelas</strong> sudah penuh dan perlu distribusi siswa
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {dashboardData?.alerts.inactiveStudents > 0 && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <Activity className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-900">
                          <strong>{dashboardData.alerts.inactiveStudents} siswa</strong> tidak aktif dalam 7 hari terakhir
                        </AlertDescription>
                      </Alert>
                    )}

                    {dashboardData?.alerts.newRegistrations > 0 && (
                      <Alert className="border-green-200 bg-green-50">
                        <UserPlus className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-900">
                          <strong>{dashboardData.alerts.newRegistrations} pendaftaran baru</strong> menunggu verifikasi
                        </AlertDescription>
                      </Alert>
                    )}

                    {(!dashboardData?.alerts.fullClasses && !dashboardData?.alerts.inactiveStudents && !dashboardData?.alerts.newRegistrations) && (
                      <div className="text-center py-8">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-muted-foreground">Semua dalam kondisi baik!</p>
                        <p className="text-sm text-muted-foreground/70">Tidak ada pemberitahuan penting saat ini</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                        <CardDescription>Tugas-tugas penting hari ini</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <Button className="w-full justify-start gap-3 h-auto p-4" variant="outline">
                      <UserPlus className="h-5 w-5 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium">Verifikasi Pendaftaran</div>
                        <div className="text-sm text-muted-foreground">{dashboardData?.alerts.newRegistrations || 0} guru menunggu approval</div>
                      </div>
                    </Button>

                    <Button className="w-full justify-start gap-3 h-auto p-4" variant="outline">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">Lihat Laporan Bulanan</div>
                        <div className="text-sm text-muted-foreground">Performa {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
                      </div>
                    </Button>

                    <Button className="w-full justify-start gap-3 h-auto p-4" variant="outline">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="text-left">
                        <div className="font-medium">Kelola Kapasitas Kelas</div>
                        <div className="text-sm text-muted-foreground">{dashboardData?.alerts.fullClasses || 0} kelas perlu distribusi ulang</div>
                      </div>
                    </Button>

                    <Button className="w-full justify-start gap-3 h-auto p-4" variant="outline">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">Pantau Siswa Tidak Aktif</div>
                        <div className="text-sm text-muted-foreground">{dashboardData?.alerts.inactiveStudents || 0} siswa perlu perhatian</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-green-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Activity className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
                        <CardDescription>Yang terjadi di sekolah hari ini</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {dashboardData?.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-gradient-to-r from-slate-50 to-white">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {activity.icon === 'UserPlus' && <UserPlus className="h-4 w-4 text-green-600" />}
                          {activity.icon === 'FileText' && <FileText className="h-4 w-4 text-blue-600" />}
                          {activity.icon === 'Award' && <Award className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <motion.div variants={fadeInUp}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Ringkasan Performa</CardTitle>
                      <CardDescription>Performa sekolah bulan ini</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Completion Rate */}
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-3">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${dashboardData?.performance.completionRate || 0}, 100`}
                            className="text-green-500"
                          />
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="100, 100"
                            className="text-gray-200"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-green-600">{dashboardData?.performance.completionRate || 0}%</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm">Tingkat Penyelesaian</h4>
                      <p className="text-xs text-muted-foreground">Tugas dan materi</p>
                    </div>

                    {/* Average Score */}
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-3">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${dashboardData?.performance.averageScore || 0}, 100`}
                            className="text-blue-500"
                          />
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="100, 100"
                            className="text-gray-200"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">{dashboardData?.performance.averageScore || 0}%</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm">Nilai Rata-rata</h4>
                      <p className="text-xs text-muted-foreground">Seluruh siswa</p>
                    </div>

                    {/* Engagement Rate */}
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-3">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${dashboardData?.performance.engagementRate || 0}, 100`}
                            className="text-purple-500"
                          />
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="100, 100"
                            className="text-gray-200"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-600">{dashboardData?.performance.engagementRate || 0}%</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm">Tingkat Keterlibatan</h4>
                      <p className="text-xs text-muted-foreground">Aktivitas harian</p>
                    </div>
                  </div>

                  {/* Performance Insights */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Peningkatan 15%</p>
                          <p className="text-xs text-green-700">Nilai rata-rata bulan ini</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Target className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">85% Target Tercapai</p>
                          <p className="text-xs text-blue-700">Penyelesaian kurikulum</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Student Distribution & Class Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Distribution by Grade */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Distribusi Siswa per Tingkat</CardTitle>
                        <CardDescription>Komposisi siswa berdasarkan kelas</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Kelas 10 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">Kelas 10</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {Math.round(dashboardData.overview.totals.students * 0.35)}
                          </span>
                        </div>
                      </div>

                      {/* Kelas 11 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">Kelas 11</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {Math.round(dashboardData.overview.totals.students * 0.33)}
                          </span>
                        </div>
                      </div>

                      {/* Kelas 12 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium">Kelas 12</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {Math.round(dashboardData.overview.totals.students * 0.32)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Siswa</span>
                        <span className="font-semibold">{dashboardData.overview.totals.students.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Class Capacity Overview */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Kapasitas Kelas</CardTitle>
                        <CardDescription>Status penggunaan ruang kelas</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-2xl font-bold text-green-600">
                            {dashboardData.overview.totals.classes - (dashboardData?.alerts.fullClasses || 0)}
                          </div>
                          <div className="text-sm text-green-700">Kelas Optimal</div>
                          <div className="text-xs text-green-600 mt-1">Kapasitas baik</div>
                        </div>

                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="text-2xl font-bold text-red-600">
                            {dashboardData?.alerts.fullClasses || 0}
                          </div>
                          <div className="text-sm text-red-700">Kelas Penuh</div>
                          <div className="text-xs text-red-600 mt-1">Perlu distribusi</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Rata-rata siswa per kelas</span>
                          <span className="font-medium">{dashboardData.overview.averages.studentsPerClass}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Kapasitas maksimal per kelas</span>
                          <span className="font-medium">35 siswa</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Utilisasi rata-rata</span>
                          <span className="font-medium text-green-600">
                            {Math.round((dashboardData.overview.averages.studentsPerClass / 35) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* School ID Dialog */}
      <Dialog open={showSchoolIdDialog} onOpenChange={setShowSchoolIdDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                <Building2 className="h-12 w-12 text-indigo-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              School ID Anda
            </DialogTitle>
            <DialogDescription className="text-center">
              Bagikan School ID ini kepada guru agar mereka dapat mendaftar dan bergabung dengan sekolah
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
              <p className="text-sm text-muted-foreground mb-3 text-center">School ID:</p>
              <div className="flex flex-col items-center gap-3">
                <p className="text-3xl font-bold text-indigo-600 tracking-wider">{schoolId || "Loading..."}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copySchoolId}
                  className="w-full max-w-[200px] gap-2"
                >
                  {copiedSchoolId ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Salin School ID</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                <strong>Penting:</strong> Simpan School ID ini dengan aman. Guru memerlukan ID ini untuk mendaftar ke sistem sekolah Anda.
              </AlertDescription>
            </Alert>

            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600" onClick={() => setShowSchoolIdDialog(false)}>
              Mengerti
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SchoolOwnerDashboard;
