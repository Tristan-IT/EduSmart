import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Bell, 
  Calendar, 
  Sparkles, 
  Zap,
  ClipboardList,
  BarChart3,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Target,
  TrendingDown,
  PlayCircle
} from "lucide-react";
import { getSkillTree } from "@/lib/mockApi";
import type { SkillTreeUnit } from "@/data/gamifiedLessons";
import teacherImage from "@/assets/teacher-dashboard.jpg";
import { toast } from "sonner";
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  staggerContainer,
  scaleIn 
} from "@/lib/animations";

// Interfaces for API data
interface MyStudent {
  studentId: string;
  name: string;
  email: string;
  className: string;
  xp: number;
  completedLessons: number;
  averageScore: number;
}

interface MyClass {
  _id: string;
  classId: string;
  className: string;
  grade: string;
  section: string;
  role: string;
  subjects: string[];
  students: {
    total: number;
    max: number;
    percentage: number;
  };
  performance: {
    averageXP: number;
    averageLevel: number;
  };
}

interface Analytics {
  totals: {
    lessonsPlanned: number;
    lessonsCompleted: number;
    quizzesCreated: number;
    assignmentsCreated: number;
    videosUploaded: number;
    totalContent: number;
  };
  averages: {
    studentEngagement: number;
    completionRate: number;
  };
  totalStudents?: number;
}

const TeacherDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [interventionType, setInterventionType] = useState("");
  const [interventionNote, setInterventionNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  // API Data States
  const [loading, setLoading] = useState(true);
  const [myStudents, setMyStudents] = useState<MyStudent[]>([]);
  const [myClasses, setMyClasses] = useState<MyClass[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  const [interventionLogs, setInterventionLogs] = useState<Array<{
    id: string;
    studentId: string;
    studentName: string;
    type: string;
    note: string;
    dueDate?: string;
    createdAt: string;
    status: "terkirim" | "selesai";
  }>>([
    {
      id: "log-001",
      studentId: "2",
      studentName: "Siti Nurhaliza",
      type: "Bimbingan 1-on-1",
      note: "Jadwalkan sesi mentoring Kamis.",
      dueDate: "2025-01-18",
      createdAt: "2025-01-14T09:00:00Z",
      status: "terkirim",
    },
  ]);
  const [skillTree, setSkillTree] = useState<SkillTreeUnit[]>([]);
  const [telemetryEvents, setTelemetryEvents] = useState<any[]>([]);

  // Load dashboard data from API
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Load each API independently with error handling
      const loadClasses = fetch("http://localhost:5000/api/teacher-dashboard/my-classes", { headers })
        .then(res => res.json())
        .then(data => data.success ? setMyClasses(data.data) : null)
        .catch(err => console.warn("Failed to load classes:", err));

      const loadAnalytics = fetch("http://localhost:5000/api/teacher-dashboard/my-analytics", { headers })
        .then(res => res.json())
        .then(data => data.success ? setAnalytics(data.data) : null)
        .catch(err => console.warn("Failed to load analytics:", err));

      const loadStudents = fetch("http://localhost:5000/api/teacher-dashboard/my-students", { headers })
        .then(res => res.json())
        .then(data => data.success ? setMyStudents(data.data) : null)
        .catch(err => console.warn("Failed to load students:", err));

      const loadActivities = fetch("http://localhost:5000/api/teacher-dashboard/recent-activities?limit=10", { headers })
        .then(res => res.json())
        .then(data => data.success ? setTelemetryEvents(data.data) : null)
        .catch(err => {
          console.warn("Failed to load activities:", err);
          setTelemetryEvents([]); // Set empty array instead of crashing
        });

      const loadInterventions = fetch("http://localhost:5000/api/teacher-dashboard/interventions?limit=20", { headers })
        .then(res => res.json())
        .then(data => data.success ? setInterventionLogs(data.data) : null)
        .catch(err => console.warn("Failed to load interventions:", err));

      const loadSkillTree = getSkillTree()
        .then(data => setSkillTree(data))
        .catch(err => console.warn("Failed to load skill tree:", err));

      // Wait for all (but don't fail if one fails)
      await Promise.allSettled([
        loadClasses, 
        loadAnalytics, 
        loadStudents, 
        loadActivities, 
        loadInterventions, 
        loadSkillTree
      ]);

    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError(err.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const currentUnit = useMemo(() => {
    if (skillTree.length === 0) return undefined;
    return skillTree.find((unit) => unit.status === "current") ?? skillTree[0];
  }, [skillTree]);

  const activeSkillTitle = currentUnit?.skills.find((skill) => skill.status === "current")?.title ?? "-";

  const handleSendIntervention = async () => {
    if (selectedStudent && interventionType && interventionNote) {
      try {
        const token = localStorage.getItem("token");
        const student = myStudents.find((s) => s.studentId === selectedStudent);
        
        const response = await fetch("http://localhost:5000/api/teacher-dashboard/interventions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId: selectedStudent,
            type: interventionType,
            title:
              interventionType === "remedial"
                ? "Remedial Khusus"
                : interventionType === "tutoring"
                ? "Bimbingan 1-on-1"
                : interventionType === "peer"
                ? "Peer Tutoring"
                : interventionType === "parent"
                ? "Komunikasi Orang Tua"
                : "Lainnya",
            note: interventionNote,
            dueDate: dueDate || undefined,
            priority: "medium",
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          toast.success(`Intervensi berhasil dikirim ke ${student?.name}`);
          // Reload interventions
          await loadDashboardData();
          setSelectedStudent(null);
          setInterventionType("");
          setInterventionNote("");
          setDueDate("");
        } else {
          toast.error(data.message || "Gagal mengirim intervensi");
        }
      } catch (err: any) {
        toast.error(err.message || "Gagal mengirim intervensi");
      }
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
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
                Dashboard Guru
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container px-6 py-8 max-w-7xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Memuat dashboard...</p>
            </div>
          )}

          {error && (
            <Card className="mb-6 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && analytics && (
            <>
              {/* Stats Overview */}
              <div className="grid md:grid-cols-4 gap-4 mb-8 animate-slide-in">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{myStudents.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {myClasses.length} kelas Anda
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Konten</CardTitle>
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totals.totalContent}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.totals.quizzesCreated} kuis, {analytics.totals.lessonsCompleted} lessons
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.averages.completionRate.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Rata-rata kelas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Siswa</CardTitle>
                    <MessageSquare className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.averages.studentEngagement.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Rata-rata engagement</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

        {!loading && analytics && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Teacher Analytics Summary */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        Ringkasan Aktivitas Mengajar
                      </CardTitle>
                      <CardDescription>
                        Statistik konten dan aktivitas pembelajaran
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{analytics.totals.totalContent} Konten</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Content Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-muted-foreground mb-1">Lessons</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {analytics.totals.lessonsCompleted}
                        </div>
                        <div className="text-xs text-muted-foreground">diselesaikan</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-xs text-muted-foreground mb-1">Kuis</div>
                        <div className="text-2xl font-bold text-green-600">
                          {analytics.totals.quizzesCreated}
                        </div>
                        <div className="text-xs text-muted-foreground">dibuat</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="text-xs text-muted-foreground mb-1">Tugas</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {analytics.totals.assignmentsCreated}
                        </div>
                        <div className="text-xs text-muted-foreground">diberikan</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="text-xs text-muted-foreground mb-1">Video</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {analytics.totals.videosUploaded}
                        </div>
                        <div className="text-xs text-muted-foreground">diunggah</div>
                      </div>
                      <div className="bg-pink-50 dark:bg-pink-950/20 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
                        <div className="text-xs text-muted-foreground mb-1">Planned</div>
                        <div className="text-2xl font-bold text-pink-600">
                          {analytics.totals.lessonsPlanned}
                        </div>
                        <div className="text-xs text-muted-foreground">lessons</div>
                      </div>
                      <div className="bg-indigo-50 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="text-xs text-muted-foreground mb-1">Total</div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {analytics.totals.totalContent}
                        </div>
                        <div className="text-xs text-muted-foreground">konten</div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium mb-3">Performa Kelas</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Tingkat Penyelesaian</span>
                          <span className="text-sm font-semibold">
                            {analytics.averages.completionRate.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={analytics.averages.completionRate} className="h-2" />
                      </div>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Engagement Siswa</span>
                          <span className="text-sm font-semibold">
                            {analytics.averages.studentEngagement.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={analytics.averages.studentEngagement} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* My Classes Summary */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" />
                        Kelas Saya
                      </CardTitle>
                      <CardDescription>
                        Ringkasan kelas yang Anda ajar
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{myClasses.length} Kelas</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {myClasses.length > 0 ? (
                  <div className="space-y-3">
                    {myClasses.map((cls) => (
                      <div
                        key={cls.classId}
                        className="p-4 bg-gradient-to-r from-primary/5 to-purple/5 rounded-lg border border-primary/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{cls.className}</h4>
                            <p className="text-sm text-muted-foreground">
                              {cls.grade} {cls.section} • {cls.role}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {cls.students.total}/{cls.students.max} siswa
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cls.subjects.length > 0 ? (
                            cls.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {cls.role}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="text-center p-2 bg-background rounded border">
                            <div className="text-xs text-muted-foreground">Rata-rata XP</div>
                            <div className="text-lg font-bold text-primary">
                              {cls.performance.averageXP.toFixed(0)}
                            </div>
                          </div>
                          <div className="text-center p-2 bg-background rounded border">
                            <div className="text-xs text-muted-foreground">Rata-rata Level</div>
                            <div className="text-lg font-bold text-purple-600">
                              {cls.performance.averageLevel.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Kapasitas Kelas</span>
                            <span className="text-xs font-semibold">{cls.students.percentage}%</span>
                          </div>
                          <Progress value={cls.students.percentage} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada kelas yang diajar</p>
                    <p className="text-xs">Hubungi admin sekolah untuk ditugaskan ke kelas</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Students Performance Table */}
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="w-5 w-5 text-primary" />
                      Daftar Siswa
                    </CardTitle>
                    <CardDescription>
                      Siswa yang Anda ajar dan performanya
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{myStudents.length} Siswa</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {myStudents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead className="text-center">XP</TableHead>
                        <TableHead className="text-center">Lessons</TableHead>
                        <TableHead className="text-center">Rata-rata</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myStudents.slice(0, 10).map((student) => (
                        <TableRow key={student.studentId}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {student.className}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{student.xp.toLocaleString()}</Badge>
                          </TableCell>
                          <TableCell className="text-center">{student.completedLessons}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={student.averageScore >= 80 ? "default" : "outline"}
                              className={
                                student.averageScore >= 80
                                  ? "bg-green-600"
                                  : student.averageScore >= 60
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                              }
                            >
                              {student.averageScore.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {student.averageScore >= 75 ? (
                              <Badge variant="default" className="bg-green-600">
                                Baik
                              </Badge>
                            ) : student.averageScore >= 60 ? (
                              <Badge variant="secondary" className="bg-yellow-600">
                                Cukup
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                Perlu Perhatian
                              </Badge>
                            )}
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada siswa</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Upload Materi Baru
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Broadcast Pengumuman
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Lihat Laporan Detail
                </Button>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Gamifikasi Siswa</CardTitle>
                <CardDescription>XP dan streak terkini untuk pemantauan cepat.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {myStudents.length > 0 ? (
                  myStudents.slice(0, 5).map((student) => (
                    <div key={student.studentId} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{student.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {student.xp.toLocaleString()} XP
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold">📚</span>
                          {student.completedLessons} lessons
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning/20 text-warning text-[11px] font-semibold">📊</span>
                          {student.averageScore.toFixed(0)}% avg
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada data siswa
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Aktivitas Siswa Terbaru</CardTitle>
                <CardDescription>Aktivitas pembelajaran siswa dari kelas Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {telemetryEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada aktivitas terbaru yang terekam.</p>
                ) : (
                  telemetryEvents.slice(0, 8).map((event: any) => (
                    <div key={event.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{event.studentName}</p>
                        <Badge variant="outline" className="text-xs">
                          {event.type === "xp_gained" 
                            ? "XP Didapat" 
                            : event.type === "lesson_completed"
                            ? "Lesson Selesai"
                            : "Aktivitas"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString("id-ID")}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span>Total: {event.totalXP.toLocaleString()} XP</span>
                          {event.xpEarned && (
                            <span className="text-green-600 font-semibold">
                              +{event.xpEarned} XP
                            </span>
                          )}
                        </span>
                        {event.streakDays && (
                          <span className="flex items-center gap-1 text-orange-600">
                            🔥 Streak {event.streakDays} hari
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Level {event.studentLevel}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-fade-in">
              <CardContent className="pt-6">
                <img 
                  src={teacherImage} 
                  alt="Teacher Dashboard" 
                  className="w-full rounded-lg mb-4"
                />
                <h4 className="font-semibold mb-2">💡 Tips Intervensi</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Intervensi dini lebih efektif</li>
                  <li>• Gunakan peer tutoring untuk siswa menengah</li>
                  <li>• Komunikasi rutin dengan orang tua</li>
                  <li>• Pantau progress setelah intervensi</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Log Intervensi</CardTitle>
                <CardDescription>Jejak intervensi terbaru yang dikirimkan guru.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {interventionLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada intervensi tercatat.</p>
                ) : (
                  interventionLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="rounded-lg border border-muted/60 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{log.studentName}</p>
                        <Badge
                          variant="outline"
                          className={log.status === "selesai" ? "border-success/50 text-success" : "border-primary/40 text-primary"}
                        >
                          {log.status === "selesai" ? "Selesai" : "Terkirim"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{log.type}</p>
                      <p className="mt-2 text-sm">{log.note}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Dikirim {new Date(log.createdAt).toLocaleString("id-ID")}</span>
                        {log.dueDate && <span>Target: {new Date(log.dueDate).toLocaleDateString("id-ID")}</span>}
                      </div>
                    </div>
                  ))
                )}
                {interventionLogs.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full">
                    Lihat riwayat lengkap
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
