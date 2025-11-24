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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  Activity,
  GraduationCap,
  FileText,
  RefreshCw,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  Database
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface BackendAnalytics {
  teacher: {
    _id: string;
    name: string;
    email: string;
    employeeId?: string;
  };
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
  recentActivity: Array<{
    date: Date;
    lessons: number;
    quizzes: number;
    assignments: number;
    videos: number;
  }>;
}

interface ClassData {
  _id: string;
  classId: string;
  className: string;
  grade: string;
  section: string;
  role: string;
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

interface StudentData {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  rollNumber?: number;
  class: {
    className: string;
    grade: string;
  };
  xp: number;
  level: number;
  streak: number;
}

export default function TeacherAnalyticsComplete() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Backend data
  const [analytics, setAnalytics] = useState<BackendAnalytics | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  
  // Filters
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load analytics
      const analyticsRes: any = await apiClient.get('/teacher-dashboard/my-analytics');
      if (analyticsRes?.success && analyticsRes?.data) {
        setAnalytics(analyticsRes.data);
      }

      // Load classes
      const classesRes: any = await apiClient.get('/teacher-dashboard/my-classes');
      if (classesRes?.success && classesRes?.data?.classes) {
        setClasses(classesRes.data.classes);
      }

      // Load students
      const studentsRes: any = await apiClient.get('/teacher-dashboard/my-students');
      if (studentsRes?.success && studentsRes?.data) {
        const studentData = Array.isArray(studentsRes.data) 
          ? studentsRes.data 
          : (Array.isArray(studentsRes.data.students) ? studentsRes.data.students : []);
        setStudents(studentData);
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
    loadAllData();
    toast.success('Data berhasil dimuat ulang');
  };

  const handleExportCSV = () => {
    try {
      if (classes.length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      const headers = ['Kelas', 'Total Siswa', 'Max Siswa', 'Rata-rata XP', 'Rata-rata Level'];
      const rows = classes.map(c => [
        c.className,
        c.students.total,
        c.students.max,
        c.performance.averageXP,
        c.performance.averageLevel,
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();

      toast.success('Data berhasil diekspor');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Gagal mengekspor data');
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    if (selectedClass !== 'all') {
      const classData = classes.find(c => c._id === selectedClass);
      if (!classData) return false;
      if (!student.class) return false;
      // Match by class name since student.class is an object
      if (student.class.className !== classData.className) return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return student.name.toLowerCase().includes(query) ||
             student.email.toLowerCase().includes(query) ||
             (student.studentId && student.studentId.toLowerCase().includes(query));
    }
    return true;
  });

  // Calculate top students (by XP)
  const topStudents = [...filteredStudents]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5);

  // Calculate struggling students (low XP or level)
  const strugglingStudents = [...filteredStudents]
    .filter(s => s.xp < 500 || s.level < 3)
    .slice(0, 5);

  // Process performance history from recentActivity
  const performanceHistory = analytics?.recentActivity?.map(activity => ({
    date: format(new Date(activity.date), 'dd/MM'),
    lessons: activity.lessons,
    quizzes: activity.quizzes,
    videos: activity.videos,
    total: activity.lessons + activity.quizzes + activity.videos,
  })) || [];

  // Calculate class distribution for pie chart
  const classDistribution = classes.map(c => ({
    name: c.className,
    value: c.students.total,
  })).filter(c => c.value > 0);

  // Calculate total students
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.streak > 0).length;

  // Empty State Component
  const EmptyState = ({ title, message, icon: Icon }: { title: string; message: string; icon: any }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{message}</p>
    </div>
  );

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar role="teacher" />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar role="teacher" />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Halo, {analytics?.teacher.name || 'Guru'} 👋
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-white"
            >
              <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kelas</label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kelas</SelectItem>
                        {classes.map(c => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.className} ({c.students.total} siswa)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cari Siswa</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nama, email, atau student ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="container mx-auto p-6 space-y-6">
          {/* Info Banner */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Catatan:</strong> Data analytics diambil langsung dari database. Jika ada data yang kosong, berarti belum ada aktivitas yang tercatat di database.
            </AlertDescription>
          </Alert>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeStudents} siswa aktif (streak &gt; 0)
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                  <GraduationCap className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Kelas yang Anda ajar
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Konten</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totals.totalContent || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Lessons, quiz, video, assignment
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.averages.completionRate.toFixed(1) || 0}%</div>
                  <Progress value={analytics?.averages.completionRate || 0} className="mt-2" />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Ringkasan</TabsTrigger>
              <TabsTrigger value="students">Siswa</TabsTrigger>
              <TabsTrigger value="classes">Kelas</TabsTrigger>
              <TabsTrigger value="content">Konten</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Aktivitas Konten (7 Hari Terakhir)</CardTitle>
                    <CardDescription>Lessons, quiz, dan video yang dibuat</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {performanceHistory.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="lessons" stroke="#8884d8" name="Lessons" />
                          <Line type="monotone" dataKey="quizzes" stroke="#82ca9d" name="Quiz" />
                          <Line type="monotone" dataKey="videos" stroke="#ffc658" name="Video" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState
                        title="Belum Ada Data Aktivitas"
                        message="Belum ada data aktivitas konten dalam 7 hari terakhir. Mulai buat lessons, quiz, atau video untuk melihat grafik di sini."
                        icon={BarChart3}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Class Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribusi Siswa per Kelas</CardTitle>
                    <CardDescription>Total siswa di setiap kelas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {classDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={classDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {classDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState
                        title="Belum Ada Siswa di Kelas"
                        message="Belum ada siswa yang terdaftar di kelas Anda. Hubungi admin untuk menambahkan siswa."
                        icon={Users}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Content Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ringkasan Konten</CardTitle>
                    <CardDescription>Total konten yang telah dibuat</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics && analytics.totals.totalContent > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Lessons Planned</span>
                          </div>
                          <span className="font-bold">{analytics.totals.lessonsPlanned}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Lessons Completed</span>
                          </div>
                          <span className="font-bold">{analytics.totals.lessonsCompleted}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">Quizzes Created</span>
                          </div>
                          <span className="font-bold">{analytics.totals.quizzesCreated}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">Assignments Created</span>
                          </div>
                          <span className="font-bold">{analytics.totals.assignmentsCreated}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-red-600" />
                            <span className="text-sm">Videos Uploaded</span>
                          </div>
                          <span className="font-bold">{analytics.totals.videosUploaded}</span>
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        title="Belum Ada Konten"
                        message="Anda belum membuat konten apapun. Mulai buat lessons, quiz, video, atau assignment untuk siswa Anda."
                        icon={Database}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Engagement */}
                <Card>
                  <CardHeader>
                    <CardTitle>Student Engagement</CardTitle>
                    <CardDescription>Rata-rata engagement siswa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">Engagement Rate</span>
                          <span className="text-sm font-medium">{analytics?.averages.studentEngagement.toFixed(1) || 0}%</span>
                        </div>
                        <Progress value={analytics?.averages.studentEngagement || 0} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">Completion Rate</span>
                          <span className="text-sm font-medium">{analytics?.averages.completionRate.toFixed(1) || 0}%</span>
                        </div>
                        <Progress value={analytics?.averages.completionRate || 0} />
                      </div>
                      <Alert className="bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-sm text-blue-800">
                          Engagement rate akan meningkat seiring dengan aktivitas siswa di platform.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Students */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Top 5 Siswa (by XP)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topStudents.length > 0 ? (
                      <div className="space-y-4">
                        {topStudents.map((student, index) => (
                          <div key={student._id} className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-500">
                                {student.class?.className || 'No class'} • Level {student.level}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">{student.xp} XP</div>
                              <div className="text-xs text-gray-500">{student.streak} day streak</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="Belum Ada Data Siswa"
                        message="Belum ada siswa yang terdaftar atau belum ada aktivitas siswa yang tercatat."
                        icon={Users}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Struggling Students */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      Siswa Perlu Perhatian
                    </CardTitle>
                    <CardDescription>Siswa dengan XP rendah (&lt;500) atau level rendah (&lt;3)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {strugglingStudents.length > 0 ? (
                      <div className="space-y-4">
                        {strugglingStudents.map((student) => (
                          <div key={student._id} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-500">
                                {student.class?.className || 'No class'} • Level {student.level}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={student.xp < 200 ? 'destructive' : 'default'}>
                                {student.xp < 200 ? 'Tinggi' : 'Sedang'}
                              </Badge>
                              <div className="text-sm text-red-600 mt-1">{student.xp} XP</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="Tidak Ada Siswa yang Perlu Perhatian"
                        message="Bagus! Semua siswa memiliki performa yang baik."
                        icon={CheckCircle}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* All Students List */}
              <Card>
                <CardHeader>
                  <CardTitle>Semua Siswa ({filteredStudents.length})</CardTitle>
                  <CardDescription>
                    {selectedClass !== 'all' && `Filter: ${classes.find(c => c._id === selectedClass)?.className}`}
                    {searchQuery && ` • Search: "${searchQuery}"`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredStudents.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredStudents.map((student) => (
                        <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-500">
                                {student.class?.className || 'No class'} • {student.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">Level {student.level}</div>
                              <div className="text-xs text-gray-500">{student.xp} XP</div>
                            </div>
                            <Badge variant={student.streak > 0 ? 'default' : 'secondary'}>
                              {student.streak} streak
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Tidak Ada Siswa"
                      message="Tidak ada siswa yang sesuai dengan filter. Coba ubah filter atau hapus pencarian."
                      icon={Search}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Classes Tab */}
            <TabsContent value="classes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kelas yang Anda Ajar</CardTitle>
                </CardHeader>
                <CardContent>
                  {classes.length > 0 ? (
                    <div className="space-y-4">
                      {classes.map((classData) => (
                        <Card key={classData._id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{classData.className}</CardTitle>
                                <CardDescription>{classData.grade} - {classData.section}</CardDescription>
                              </div>
                              <Badge>{classData.role}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">Total Siswa</div>
                                <div className="text-2xl font-bold">{classData.students.total}/{classData.students.max}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Kapasitas</div>
                                <div className="text-2xl font-bold">{classData.students.percentage}%</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Rata-rata XP</div>
                                <div className="text-2xl font-bold text-blue-600">{classData.performance.averageXP}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Rata-rata Level</div>
                                <div className="text-2xl font-bold text-purple-600">{classData.performance.averageLevel}</div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Kapasitas Kelas</span>
                                <span className="text-sm font-medium">{classData.students.total}/{classData.students.max}</span>
                              </div>
                              <Progress value={classData.students.percentage} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Belum Ada Kelas"
                      message="Anda belum ditugaskan ke kelas manapun. Hubungi admin untuk mendapatkan penugasan kelas."
                      icon={GraduationCap}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistik Konten</CardTitle>
                  <CardDescription>Konten yang telah Anda buat</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics && analytics.totals.totalContent > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-900">Lessons</span>
                          </div>
                          <div className="text-3xl font-bold text-blue-600">{analytics.totals.lessonsCompleted}</div>
                          <div className="text-sm text-blue-700">{analytics.totals.lessonsPlanned} planned</div>
                        </div>
                        
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="h-5 w-5 text-purple-600" />
                            <span className="font-medium text-purple-900">Quizzes</span>
                          </div>
                          <div className="text-3xl font-bold text-purple-600">{analytics.totals.quizzesCreated}</div>
                          <div className="text-sm text-purple-700">Total created</div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-900">Videos</span>
                          </div>
                          <div className="text-3xl font-bold text-green-600">{analytics.totals.videosUploaded}</div>
                          <div className="text-sm text-green-700">Total uploaded</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Completion Rate</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Lessons Completion</span>
                              <span className="text-sm font-medium">{analytics.averages.completionRate.toFixed(1)}%</span>
                            </div>
                            <Progress value={analytics.averages.completionRate} />
                          </div>
                        </div>
                      </div>

                      {performanceHistory.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">Aktivitas Konten (Bar Chart)</h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={performanceHistory}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="lessons" fill="#8884d8" name="Lessons" />
                              <Bar dataKey="quizzes" fill="#82ca9d" name="Quizzes" />
                              <Bar dataKey="videos" fill="#ffc658" name="Videos" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      title="Belum Ada Konten"
                      message="Anda belum membuat konten apapun. Mulai buat lessons, quiz, atau upload video untuk siswa Anda. Data akan muncul di sini setelah Anda membuat konten pertama."
                      icon={BookOpen}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarProvider>
  );
}
