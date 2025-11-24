import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  TrendingDown,
  BookOpen,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
  GraduationCap,
  FileText,
  MessageSquare,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

interface ClassAnalytics {
  classId: string;
  className: string;
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  activeStudents: number;
  atRiskStudents: number;
}

interface StudentPerformance {
  studentId: string;
  studentName: string;
  avatar: string;
  averageScore: number;
  completedLessons: number;
  totalLessons: number;
  lastActive: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SubjectStats {
  subject: string;
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  studentCount: number;
}

interface AnalyticsData {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completionRate: number;
  totalClasses: number;
  totalLessons: number;
  totalQuizzes: number;
  averageEngagement: number;
  classes: ClassAnalytics[];
  topStudents: StudentPerformance[];
  strugglingStudents: StudentPerformance[];
  subjectStats: SubjectStats[];
}

export default function TeacherAnalyticsAdvanced() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    completionRate: 0,
    totalClasses: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    averageEngagement: 0,
    classes: [],
    topStudents: [],
    strugglingStudents: [],
    subjectStats: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, [selectedClass, selectedSubject]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load main analytics
      const response: any = await apiClient.get('/teacher-dashboard/my-analytics');
      
      if (response?.success && response?.data) {
        setAnalytics({
          totalStudents: response.data.totalStudents || 0,
          activeStudents: response.data.activeStudents || 0,
          averageProgress: response.data.averageProgress || 0,
          completionRate: response.data.completionRate || 0,
          totalClasses: response.data.totalClasses || 0,
          totalLessons: response.data.totalLessons || 0,
          totalQuizzes: response.data.totalQuizzes || 0,
          averageEngagement: response.data.averageEngagement || 0,
          classes: response.data.classes || [],
          topStudents: response.data.topStudents || [],
          strugglingStudents: response.data.strugglingStudents || [],
          subjectStats: response.data.subjectStats || [],
        });
      }

      // Load students data
      const studentsRes: any = await apiClient.get('/teacher-dashboard/my-students');
      if (studentsRes?.success && studentsRes?.data) {
        // Process student performance data
        const students = Array.isArray(studentsRes.data) ? studentsRes.data : (Array.isArray(studentsRes.data.students) ? studentsRes.data.students : []);
        
        // Top 5 students
        const topPerformers = students
          .sort((a: any, b: any) => (b.averageScore || 0) - (a.averageScore || 0))
          .slice(0, 5)
          .map((s: any) => ({
            studentId: s.id || s._id,
            studentName: s.name,
            avatar: s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`,
            averageScore: s.averageScore || 0,
            completedLessons: s.completedLessons || 0,
            totalLessons: s.totalLessons || 0,
            lastActive: s.lastActive || new Date().toISOString(),
            riskLevel: 'low' as const,
          }));

        // Struggling students (at risk)
        const atRisk = students
          .filter((s: any) => (s.averageScore || 0) < 60 || (s.riskLevel === 'high' || s.riskLevel === 'medium'))
          .slice(0, 5)
          .map((s: any) => ({
            studentId: s.id || s._id,
            studentName: s.name,
            avatar: s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`,
            averageScore: s.averageScore || 0,
            completedLessons: s.completedLessons || 0,
            totalLessons: s.totalLessons || 0,
            lastActive: s.lastActive || new Date().toISOString(),
            riskLevel: s.riskLevel || 'medium' as const,
          }));

        setAnalytics(prev => ({
          ...prev,
          topStudents: topPerformers,
          strugglingStudents: atRisk,
        }));
      }

    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(err.message || 'Gagal memuat data analytics');
      toast.error('Gagal memuat data analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAnalytics();
    toast.success('Data diperbarui');
  };

  const handleExport = () => {
    toast.info('Fitur export akan segera tersedia');
  };

  const getRiskBadgeColor = (level: string): "destructive" | "secondary" | "default" | "outline" => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high': return 'Perlu Perhatian';
      case 'medium': return 'Pantau';
      default: return 'Baik';
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
      <main className="flex-1 w-full">
        {/* Header */}
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard Guru
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kelas</SelectItem>
                        {analytics.classes.map(cls => (
                          <SelectItem key={cls.classId} value={cls.classId}>
                            {cls.className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Mata Pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Pelajaran</SelectItem>
                        {analytics.subjectStats.map(subj => (
                          <SelectItem key={subj.subject} value={subj.subject}>
                            {subj.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari siswa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                <TabsTrigger value="classes">Kelas</TabsTrigger>
                <TabsTrigger value="students">Siswa</TabsTrigger>
                <TabsTrigger value="subjects">Mata Pelajaran</TabsTrigger>
                <TabsTrigger value="performance">Performa</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {loading ? (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                          <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-32" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-8 w-24" />
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                          <p className="text-xs text-muted-foreground">
                            {analytics.activeStudents} aktif minggu ini
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Rata-rata Progress</CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analytics.averageProgress.toFixed(1)}%</div>
                          <Progress value={analytics.averageProgress} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
                          <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</div>
                          <p className="text-xs text-muted-foreground">
                            Materi diselesaikan
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analytics.totalClasses}</div>
                          <p className="text-xs text-muted-foreground">
                            Kelas yang diampu
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Total Materi</CardTitle>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analytics.totalLessons}</div>
                          <p className="text-xs text-muted-foreground">
                            Lesson & content
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Total Kuis</CardTitle>
                          <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analytics.totalQuizzes}</div>
                          <p className="text-xs text-muted-foreground">
                            Quiz & assessment
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                          <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analytics.averageEngagement.toFixed(1)}%</div>
                          <Progress value={analytics.averageEngagement} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Siswa Berisiko</CardTitle>
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-destructive">
                            {analytics.strugglingStudents.length}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Perlu perhatian khusus
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Top & Struggling Students */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Top Students */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        Top 5 Siswa Terbaik
                      </CardTitle>
                      <CardDescription>Siswa dengan performa tertinggi</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.topStudents.map((student, index) => (
                          <div key={student.studentId} className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-600 font-bold">
                              {index + 1}
                            </div>
                            <img 
                              src={student.avatar} 
                              alt={student.studentName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{student.studentName}</div>
                              <div className="text-sm text-muted-foreground">
                                {student.completedLessons}/{student.totalLessons} materi
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {student.averageScore.toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Struggling Students */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Siswa Perlu Perhatian
                      </CardTitle>
                      <CardDescription>Siswa dengan skor rendah atau tidak aktif</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.strugglingStudents.map((student) => (
                          <div key={student.studentId} className="flex items-center gap-4">
                            <img 
                              src={student.avatar} 
                              alt={student.studentName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{student.studentName}</div>
                              <div className="text-sm text-muted-foreground">
                                {student.completedLessons}/{student.totalLessons} materi
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-destructive">
                                {student.averageScore.toFixed(0)}%
                              </div>
                              <Badge variant={getRiskBadgeColor(student.riskLevel)} className="mt-1">
                                {getRiskText(student.riskLevel)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Classes Tab */}
              <TabsContent value="classes">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Per Kelas</CardTitle>
                    <CardDescription>Performa setiap kelas yang diampu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.classes.map((cls) => (
                        <Card key={cls.classId}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{cls.className}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {cls.totalStudents} siswa • {cls.activeStudents} aktif
                                </p>
                              </div>
                              <Badge variant={cls.atRiskStudents > 5 ? "destructive" : "secondary"}>
                                {cls.atRiskStudents} berisiko
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Rata-rata Skor</div>
                                <div className="text-2xl font-bold">{cls.averageScore.toFixed(1)}%</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Completion Rate</div>
                                <div className="text-2xl font-bold">{cls.completionRate.toFixed(1)}%</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Siswa Aktif</div>
                                <div className="text-2xl font-bold">{cls.activeStudents}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Students Tab */}
              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Siswa Detail</CardTitle>
                    <CardDescription>Informasi lengkap performa siswa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Fitur detail siswa akan segera tersedia dengan grafik individu dan rekomendasi intervensi
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subjects Tab */}
              <TabsContent value="subjects">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Per Mata Pelajaran</CardTitle>
                    <CardDescription>Performa berdasarkan subject yang diajar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.subjectStats.map((subj) => (
                        <Card key={subj.subject}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <GraduationCap className="h-8 w-8 text-primary" />
                                <div>
                                  <h3 className="font-semibold text-lg">{subj.subject}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {subj.studentCount} siswa
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Total Materi</div>
                                <div className="text-2xl font-bold">{subj.totalLessons}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Selesai</div>
                                <div className="text-2xl font-bold">{subj.completedLessons}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Rata-rata Skor</div>
                                <div className="text-2xl font-bold">{subj.averageScore.toFixed(1)}%</div>
                              </div>
                            </div>
                            <Progress 
                              value={(subj.completedLessons / subj.totalLessons) * 100} 
                              className="mt-4" 
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Analisis Performa Mendalam</CardTitle>
                    <CardDescription>Grafik dan chart performa detail</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Fitur grafik performa akan segera tersedia dengan visualisasi trend, comparison, dan predictive analytics
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
