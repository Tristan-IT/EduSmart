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
import { mockStudents } from "@/data/mockData";
import { getSkillTree, getTelemetryEvents } from "@/lib/mockApi";
import { allQuizQuestions } from "@/data/quizBank";
import { allLearningModules } from "@/data/learningModules";
import type { SkillTreeUnit } from "@/data/gamifiedLessons";
import type { TelemetryEvent } from "@/data/telemetry";
import teacherImage from "@/assets/teacher-dashboard.jpg";
import { toast } from "sonner";
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  staggerContainer,
  scaleIn 
} from "@/lib/animations";

const TeacherDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [interventionType, setInterventionType] = useState("");
  const [interventionNote, setInterventionNote] = useState("");
  const [dueDate, setDueDate] = useState("");
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
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([]);

  const riskStudents = mockStudents.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium');
  const totalStudents = mockStudents.length;
  const atRiskCount = mockStudents.filter(s => s.riskLevel === 'high').length;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [skillTreeResponse, telemetryResponse] = await Promise.all([
          getSkillTree(),
          getTelemetryEvents(),
        ]);
        if (!mounted) return;
        setSkillTree(skillTreeResponse);
        setTelemetryEvents(telemetryResponse.slice(0, 8));
      } catch (error) {
        // ignore silently
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const currentUnit = useMemo(() => {
    if (skillTree.length === 0) return undefined;
    return skillTree.find((unit) => unit.status === "current") ?? skillTree[0];
  }, [skillTree]);

  const activeSkillTitle = currentUnit?.skills.find((skill) => skill.status === "current")?.title ?? "-";
  const telemetryLabels: Record<TelemetryEvent["type"], string> = {
    lesson_completed: "Lesson selesai",
    lesson_unlocked: "Lesson terbuka",
    skill_unlocked: "Skill baru",
    unit_progressed: "Unit maju",
    reward_claimed: "Reward",
    daily_goal_claimed: "Goal harian",
  };

  const handleSendIntervention = () => {
    if (selectedStudent && interventionType && interventionNote) {
      const student = mockStudents.find((s) => s.id === selectedStudent);
      toast.success(`Intervensi berhasil dikirim ke ${student?.name}`);
      setInterventionLogs((prev) => [
        {
          id: `log-${prev.length + 1}`,
          studentId: selectedStudent,
          studentName: student?.name ?? "-",
          type:
            interventionType === "remedial"
              ? "Remedial Khusus"
              : interventionType === "tutoring"
              ? "Bimbingan 1-on-1"
              : interventionType === "peer"
              ? "Peer Tutoring"
              : "Komunikasi Orang Tua",
          note: interventionNote,
          dueDate,
          createdAt: new Date().toISOString(),
          status: "terkirim",
        },
        ...prev,
      ]);
      setSelectedStudent(null);
      setInterventionType("");
      setInterventionNote("");
      setDueDate("");
    }
  };

  const getOverallMastery = (student: typeof mockStudents[0]) => {
    const values = Object.values(student.masteryPerTopic);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
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
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8 animate-slide-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Kelas 10A & 10B</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Butuh Perhatian</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{atRiskCount}</div>
              <p className="text-xs text-muted-foreground">Risiko tinggi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Kelas</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-muted-foreground">+3% dari minggu lalu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Intervensi Aktif</CardTitle>
              <MessageSquare className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Menunggu tindak lanjut</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* NEW: Quiz Bank Analytics */}
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                      Analitik Bank Soal & Quiz
                    </CardTitle>
                    <CardDescription>
                      Statistik penggunaan dan performa quiz
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{allQuizQuestions.length} Total Soal</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Quiz Stats by Category */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-xs text-muted-foreground mb-1">Algebra</div>
                      <div className="text-2xl font-bold text-blue-600">50</div>
                      <div className="text-xs text-muted-foreground">soal</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-xs text-muted-foreground mb-1">Geometry</div>
                      <div className="text-2xl font-bold text-green-600">45</div>
                      <div className="text-xs text-muted-foreground">soal</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-xs text-muted-foreground mb-1">Calculus</div>
                      <div className="text-2xl font-bold text-purple-600">40</div>
                      <div className="text-xs text-muted-foreground">soal</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="text-xs text-muted-foreground mb-1">Statistics</div>
                      <div className="text-2xl font-bold text-orange-600">35</div>
                      <div className="text-xs text-muted-foreground">soal</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-950/20 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
                      <div className="text-xs text-muted-foreground mb-1">Trigonometry</div>
                      <div className="text-2xl font-bold text-pink-600">38</div>
                      <div className="text-xs text-muted-foreground">soal</div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <div className="text-xs text-muted-foreground mb-1">Logic</div>
                      <div className="text-2xl font-bold text-indigo-600">30</div>
                      <div className="text-xs text-muted-foreground">soal</div>
                    </div>
                  </div>

                  {/* Difficulty Distribution */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Distribusi Kesulitan</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200">
                        <div className="text-xs text-muted-foreground">Mudah</div>
                        <div className="text-xl font-bold text-green-600">~40%</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200">
                        <div className="text-xs text-muted-foreground">Sedang</div>
                        <div className="text-xl font-bold text-yellow-600">~40%</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200">
                        <div className="text-xs text-muted-foreground">Sulit</div>
                        <div className="text-xl font-bold text-red-600">~20%</div>
                      </div>
                    </div>
                  </div>

                  {/* Quiz Performance Stats */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium mb-3">Performa Quiz Kelas</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rata-rata skor</span>
                        <span className="text-sm font-semibold">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completion rate</span>
                        <span className="text-sm font-semibold">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NEW: Learning Modules Analytics */}
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-green-500" />
                      Modul Pembelajaran
                    </CardTitle>
                    <CardDescription>
                      Aktivitas dan progress pembelajaran
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{allLearningModules.length} Modul</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Module Stats by Category */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Algebra</span>
                        <Badge variant="outline" className="text-xs">3 modul</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">185 menit total</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">Geometry</span>
                        <Badge variant="outline" className="text-xs">3 modul</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">165 menit total</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Calculus</span>
                        <Badge variant="outline" className="text-xs">1 modul</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">65 menit total</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Statistics</span>
                        <Badge variant="outline" className="text-xs">2 modul</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">105 menit total</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-950/20 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-pink-700 dark:text-pink-400">Trigonometry</span>
                        <Badge variant="outline" className="text-xs">2 modul</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">130 menit total</div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">Logic</span>
                        <Badge variant="outline" className="text-xs">2 modul</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">105 menit total</div>
                    </div>
                  </div>

                  {/* Module Completion Stats */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium mb-3">Engagement Pembelajaran</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Modul diselesaikan</span>
                            <span className="text-sm font-semibold">67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-blue-500" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Video ditonton</span>
                            <span className="text-sm font-semibold">82%</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-purple-500" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Latihan dikerjakan</span>
                            <span className="text-sm font-semibold">73%</span>
                          </div>
                          <Progress value={73} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Modules */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium mb-3">Modul Terpopuler</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <div className="text-sm font-medium">Persamaan Linear</div>
                          <div className="text-xs text-muted-foreground">45 siswa • 89% completion</div>
                        </div>
                        <Award className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <div className="text-sm font-medium">Segitiga & Pythagoras</div>
                          <div className="text-xs text-muted-foreground">42 siswa • 86% completion</div>
                        </div>
                        <Award className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <div className="text-sm font-medium">Mean/Median/Modus</div>
                          <div className="text-xs text-muted-foreground">38 siswa • 81% completion</div>
                        </div>
                        <Award className="w-4 h-4 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Early Warning System */}
            {/* Early Warning System */}
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Sistem Peringatan Dini
                    </CardTitle>
                    <CardDescription>
                      Siswa yang memerlukan perhatian khusus
                    </CardDescription>
                  </div>
                  <Badge variant="destructive">{riskStudents.length} Siswa</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Penguasaan</TableHead>
                      <TableHead>Fokus Skill</TableHead>
                      <TableHead>Risiko</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riskStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{student.avatar}</span>
                            {student.name}
                          </div>
                        </TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-semibold">
                              {getOverallMastery(student)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {activeSkillTitle}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.riskLevel === 'high' ? 'destructive' : 'default'}>
                            {student.riskLevel === 'high' ? 'Tinggi' : 'Sedang'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedStudent(student.id)}
                              >
                                <Bell className="w-4 h-4 mr-2" />
                                Intervensi
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Kirim Intervensi</DialogTitle>
                                <DialogDescription>
                                  Pilih jenis intervensi untuk {student.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Jenis Intervensi</Label>
                                  <Select value={interventionType} onValueChange={setInterventionType}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih jenis intervensi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="remedial">Remedial Khusus</SelectItem>
                                      <SelectItem value="tutoring">Bimbingan 1-on-1</SelectItem>
                                      <SelectItem value="peer">Peer Tutoring</SelectItem>
                                      <SelectItem value="parent">Komunikasi Orang Tua</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="intervention-date">Tenggat (opsional)</Label>
                                  <div className="relative">
                                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                      id="intervention-date"
                                      type="date"
                                      value={dueDate}
                                      onChange={(event) => setDueDate(event.target.value)}
                                      className="pl-9"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Catatan</Label>
                                  <Textarea
                                    value={interventionNote}
                                    onChange={(e) => setInterventionNote(e.target.value)}
                                    placeholder="Tulis catatan atau instruksi khusus..."
                                    rows={4}
                                  />
                                </div>
                                <Button onClick={handleSendIntervention} className="w-full">
                                  Kirim Intervensi
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* All Students Performance */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Performa Semua Siswa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Aljabar</TableHead>
                      <TableHead>Geometri</TableHead>
                      <TableHead>Statistika</TableHead>
                      <TableHead>Trigonometri</TableHead>
                      <TableHead>Rata-rata</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.avatar} {student.name}
                        </TableCell>
                        <TableCell>{student.masteryPerTopic.algebra}%</TableCell>
                        <TableCell>{student.masteryPerTopic.geometry}%</TableCell>
                        <TableCell>{student.masteryPerTopic.statistics}%</TableCell>
                        <TableCell>{student.masteryPerTopic.trigonometry}%</TableCell>
                        <TableCell>
                          <span className="font-semibold">{getOverallMastery(student)}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                {mockStudents.map((student) => (
                  <div key={student.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{student.avatar} {student.name}</p>
                      <Badge variant="outline" className="text-xs">Level {student.level}</Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold">XP</span>
                        {student.xp}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning/20 text-warning text-[11px] font-semibold">🔥</span>
                        Streak {student.streak} hari
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Insight Aktivitas</CardTitle>
                <CardDescription>Event terbaru dari sistem gamifikasi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {telemetryEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada aktivitas terbaru yang terekam.</p>
                ) : (
                  telemetryEvents.slice(0, 5).map((event) => {
                    const xpEarned = typeof event.metadata.xpEarned === "number" ? event.metadata.xpEarned : undefined;
                    const xpBonus = typeof event.metadata.xpBonus === "number" ? event.metadata.xpBonus : undefined;
                    const streak = typeof event.metadata.streak === "number" ? event.metadata.streak : undefined;
                    const lessonId = typeof event.metadata.lessonId === "string" ? event.metadata.lessonId : undefined;
                    const skillId = typeof event.metadata.skillId === "string" ? event.metadata.skillId : undefined;
                    const unitId = typeof event.metadata.unitId === "string" ? event.metadata.unitId : undefined;
                    const detailLabel = xpEarned != null
                      ? `XP +${xpEarned}`
                      : xpBonus != null
                      ? `Bonus +${xpBonus} XP`
                      : lessonId
                      ? `Lesson ${lessonId}`
                      : skillId
                      ? `Skill ${skillId}`
                      : unitId
                      ? `Unit ${unitId}`
                      : "Aktivitas tercatat";
                    return (
                      <div key={event.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{event.studentName}</p>
                          <Badge variant="outline" className="text-xs">
                            {telemetryLabels[event.type]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString("id-ID")}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {event.type === "reward_claimed" || event.type === "daily_goal_claimed" ? (
                              <Sparkles className="h-3 w-3 text-primary" />
                            ) : (
                              <Zap className="h-3 w-3 text-warning" />
                            )}
                            {detailLabel}
                          </span>
                          {streak != null && (
                            <span>Streak {streak}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
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
        </div>
      </main>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
