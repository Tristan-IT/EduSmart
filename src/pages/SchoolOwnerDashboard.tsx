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

interface OverviewData {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  activeClasses: number;
}

interface TeacherStat {
  teacherId: string;
  name: string;
  email: string;
  totalClasses: number;
  totalStudents: number;
  subjects: string[];
}

interface ClassOverview {
  classId: string;
  className: string;
  grade: string;
  studentCount: number;
  capacity: number;
  homeroomTeacher: string;
  subjectTeachers: number;
}

interface TopPerformer {
  studentId: string;
  name: string;
  className: string;
  xp: number;
  completedLessons: number;
  averageScore: number;
}

interface ActivityLog {
  date: string;
  count: number;
  type: string;
}

const SchoolOwnerDashboard = () => {
  const { token: authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSchoolIdDialog, setShowSchoolIdDialog] = useState(false);
  const [schoolId, setSchoolId] = useState("");
  const [copiedSchoolId, setCopiedSchoolId] = useState(false);

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [teacherStats, setTeacherStats] = useState<TeacherStat[]>([]);
  const [classOverview, setClassOverview] = useState<ClassOverview[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

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
      // Get token from AuthContext or fallback to localStorage
      const token = authToken || localStorage.getItem("token");
      const storedSchoolId = localStorage.getItem("schoolId");
      
      if (!token) {
        setError("Token autentikasi tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Load all dashboard data with schoolId parameter
      const [overviewRes, teachersRes, classesRes] =
        await Promise.all([
          fetch(`http://localhost:5000/api/school-dashboard/overview?schoolId=${storedSchoolId}`, { headers }),
          fetch(`http://localhost:5000/api/school-dashboard/teachers?schoolId=${storedSchoolId}`, { headers }),
          fetch(`http://localhost:5000/api/school-dashboard/classes?schoolId=${storedSchoolId}`, { headers }),
        ]);

      // Check for auth errors
      if (!overviewRes.ok || !teachersRes.ok || !classesRes.ok) {
        if (overviewRes.status === 401 || teachersRes.status === 401 || classesRes.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
          // Clear expired token
          localStorage.removeItem("token");
          localStorage.removeItem("schoolId");
          return;
        }
      }

      const overviewData = await overviewRes.json();
      const teachersData = await teachersRes.json();
      const classesData = await classesRes.json();

      if (overviewData.success) setOverview(overviewData.data);
      if (teachersData.success) setTeacherStats(teachersData.data);
      if (classesData.success) setClassOverview(classesData.data);
      
      // Mock data for top performers and activity logs (will be implemented later)
      setTopPerformers([]);
      setActivityLogs([]);
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
                  Dashboard Sekolah
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola dan pantau seluruh aktivitas sekolah
                </p>
              </div>
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
          </motion.div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Hero Stats */}
            {overview && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <motion.div variants={scaleIn}>
                  <Card className="border-2 border-teal-100 bg-gradient-to-br from-teal-50 to-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Guru
                      </CardTitle>
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <GraduationCap className="h-4 w-4 text-teal-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-br from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        {overview.totalTeachers}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Guru terdaftar</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <Card className="border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Siswa
                      </CardTitle>
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Users className="h-4 w-4 text-indigo-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {overview.totalStudents}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Siswa aktif</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Kelas
                      </CardTitle>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {overview.totalClasses}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Kelas tersedia</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Kelas Aktif
                      </CardTitle>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {overview.activeClasses}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Sedang berjalan</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Teacher Statistics */}
            <motion.div variants={fadeInUp}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <CardTitle>Statistik Guru</CardTitle>
                      <CardDescription>Ringkasan kinerja guru berdasarkan kelas dan siswa</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {teacherStats.length > 0 ? (
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead>Nama Guru</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Mata Pelajaran</TableHead>
                            <TableHead className="text-center">Jumlah Kelas</TableHead>
                            <TableHead className="text-center">Total Siswa</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teacherStats.map((teacher) => (
                            <TableRow key={teacher.teacherId} className="hover:bg-slate-50/50">
                              <TableCell className="font-medium">{teacher.name}</TableCell>
                              <TableCell className="text-muted-foreground">{teacher.email}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {teacher.subjects.slice(0, 2).map((subject) => (
                                    <Badge key={subject} variant="outline" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))}
                                  {teacher.subjects.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{teacher.subjects.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary">{teacher.totalClasses}</Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className="bg-indigo-600">{teacher.totalStudents}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">Belum ada data guru</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Guru akan muncul setelah mereka mendaftar dengan School ID
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Class Overview & Top Performers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Overview */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle>Ringkasan Kelas</CardTitle>
                        <CardDescription>Detail kapasitas kelas</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {classOverview.length > 0 ? (
                      <div className="space-y-3">
                        {classOverview.map((cls) => {
                          const percentage = (cls.studentCount / cls.capacity) * 100;
                          const isFull = percentage >= 100;
                          const isAlmostFull = percentage >= 80;

                          return (
                            <div key={cls.classId} className="p-4 rounded-lg border bg-gradient-to-r from-slate-50 to-white hover:shadow-sm transition-shadow">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-sm">{cls.className}</h4>
                                  <p className="text-xs text-muted-foreground">{cls.grade} • {cls.homeroomTeacher}</p>
                                </div>
                                {isFull ? (
                                  <Badge variant="destructive" className="text-xs">Penuh</Badge>
                                ) : isAlmostFull ? (
                                  <Badge variant="secondary" className="text-xs">Hampir Penuh</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">Tersedia</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {cls.studentCount}/{cls.capacity}
                                </span>
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3" />
                                  {cls.subjectTeachers} guru
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Belum ada data kelas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Performers */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle>Siswa Berprestasi</CardTitle>
                        <CardDescription>Top 10 siswa terbaik</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {topPerformers.length > 0 ? (
                      <div className="space-y-2">
                        {topPerformers.slice(0, 10).map((student, index) => (
                          <div key={student.studentId} className="flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-r from-slate-50 to-white hover:shadow-sm transition-shadow">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? "bg-yellow-100 text-yellow-700" :
                              index === 1 ? "bg-gray-100 text-gray-700" :
                              index === 2 ? "bg-orange-100 text-orange-700" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              #{index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.className}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {student.xp.toLocaleString()} XP
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {student.averageScore.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Award className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Belum ada data siswa berprestasi</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Activity Timeline */}
            {activityLogs.length > 0 && (
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>Aktivitas Terakhir</CardTitle>
                        <CardDescription>Timeline aktivitas sekolah</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activityLogs.slice(0, 10).map((log, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{log.type}</p>
                              <p className="text-xs text-muted-foreground">{log.date}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">{log.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
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
