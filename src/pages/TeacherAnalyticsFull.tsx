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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
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
  Calendar as CalendarIcon,
  RefreshCw,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface AnalyticsData {
  overview: {
    totalStudents: number;
    activeStudents: number;
    averageProgress: number;
    completionRate: number;
    totalClasses: number;
    totalLessons: number;
    totalQuizzes: number;
    averageEngagement: number;
    strugglingStudents: number;
  };
  classAnalytics: Array<{
    classId: string;
    className: string;
    totalStudents: number;
    activeStudents: number;
    averageScore: number;
    completionRate: number;
    atRiskStudents: number;
  }>;
  subjectAnalytics: Array<{
    subjectId: string;
    subjectName: string;
    totalStudents: number;
    averageProgress: number;
    completionRate: number;
    totalLessons: number;
    completedLessons: number;
  }>;
  topStudents: Array<{
    studentId: string;
    studentName: string;
    avatar: string;
    averageScore: number;
    completedLessons: number;
    totalLessons: number;
    lastActive: string;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  strugglingStudents: Array<{
    studentId: string;
    studentName: string;
    avatar: string;
    averageScore: number;
    completedLessons: number;
    totalLessons: number;
    lastActive: string;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  performanceHistory: Array<{
    date: string;
    averageScore: number;
    completionRate: number;
    engagement: number;
  }>;
  engagementData: Array<{
    day: string;
    active: number;
    inactive: number;
  }>;
  subjectDistribution: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function TeacherAnalyticsFull() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    overview: {
      totalStudents: 0,
      activeStudents: 0,
      averageProgress: 0,
      completionRate: 0,
      totalClasses: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      averageEngagement: 0,
      strugglingStudents: 0,
    },
    classAnalytics: [],
    subjectAnalytics: [],
    topStudents: [],
    strugglingStudents: [],
    performanceHistory: [],
    engagementData: [],
    subjectDistribution: [],
  });

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [selectedClass, selectedSubject, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (selectedClass !== 'all') params.append('classId', selectedClass);
      if (selectedSubject !== 'all') params.append('subjectId', selectedSubject);
      params.append('startDate', dateRange.from.toISOString());
      params.append('endDate', dateRange.to.toISOString());

      const response: any = await apiClient.get(`/teacher-dashboard/my-analytics?${params.toString()}`);
      
      if (response?.success && response?.data) {
        const data = response.data;
        
        // Generate performance history (last 30 days)
        const performanceHistory = [];
        for (let i = 29; i >= 0; i--) {
          const date = subDays(new Date(), i);
          performanceHistory.push({
            date: format(date, 'dd/MM'),
            averageScore: Math.floor(Math.random() * 30) + 60, // Mock data
            completionRate: Math.floor(Math.random() * 40) + 50,
            engagement: Math.floor(Math.random() * 50) + 40,
          });
        }

        // Generate engagement data (last 7 days)
        const engagementData = [];
        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          engagementData.push({
            day: days[date.getDay()],
            active: Math.floor(Math.random() * 50) + 30,
            inactive: Math.floor(Math.random() * 20) + 5,
          });
        }

        // Subject distribution
        const subjectDistribution = (data.subjectAnalytics || []).map((s: any) => ({
          name: s.subjectName,
          value: s.totalStudents,
        }));

        setAnalytics({
          overview: {
            totalStudents: data.totalStudents || 0,
            activeStudents: data.activeStudents || 0,
            averageProgress: data.averageProgress || 0,
            completionRate: data.completionRate || 0,
            totalClasses: data.totalClasses || 0,
            totalLessons: data.totalLessons || 0,
            totalQuizzes: data.totalQuizzes || 0,
            averageEngagement: data.averageEngagement || 0,
            strugglingStudents: data.strugglingStudents || 0,
          },
          classAnalytics: data.classAnalytics || [],
          subjectAnalytics: data.subjectAnalytics || [],
          topStudents: [],
          strugglingStudents: [],
          performanceHistory,
          engagementData,
          subjectDistribution,
        });
      }

      // Load students data
      const studentsRes: any = await apiClient.get('/teacher-dashboard/my-students');
      if (studentsRes?.success && studentsRes?.data) {
        const students = Array.isArray(studentsRes.data) 
          ? studentsRes.data 
          : (Array.isArray(studentsRes.data.students) ? studentsRes.data.students : []);
        
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

        // Struggling students
        const atRisk = students
          .filter((s: any) => (s.averageScore || 0) < 60 || s.riskLevel === 'high' || s.riskLevel === 'medium')
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
    toast.success('Data berhasil dimuat ulang');
  };

  const handleExportCSV = () => {
    try {
      // Prepare CSV data
      const headers = ['Kelas', 'Total Siswa', 'Siswa Aktif', 'Rata-rata Nilai', 'Completion Rate', 'At Risk'];
      const rows = analytics.classAnalytics.map(c => [
        c.className,
        c.totalStudents,
        c.activeStudents,
        c.averageScore.toFixed(1),
        `${c.completionRate.toFixed(1)}%`,
        c.atRiskStudents,
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Download CSV
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

  const handleExportJSON = () => {
    try {
      const json = JSON.stringify(analytics, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analytics_${format(new Date(), 'yyyy-MM-dd')}.json`;
      link.click();

      toast.success('Data berhasil diekspor');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Gagal mengekspor data');
    }
  };

  if (loading && !analytics.overview.totalStudents) {
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
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Data periode: {format(dateRange.from, 'dd MMM yyyy', { locale: localeId })} - {format(dateRange.to, 'dd MMM yyyy', { locale: localeId })}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleExportCSV}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleExportJSON}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-white"
            >
              <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Kelas</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kelas</SelectItem>
                        {analytics.classAnalytics.map(c => (
                          <SelectItem key={c.classId} value={c.classId}>
                            {c.className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mata Pelajaran</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Mata Pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                        {analytics.subjectAnalytics.map(s => (
                          <SelectItem key={s.subjectId} value={s.subjectId}>
                            {s.subjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Mulai</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(dateRange.from, 'dd MMM yyyy', { locale: localeId })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Akhir</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(dateRange.to, 'dd MMM yyyy', { locale: localeId })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="container mx-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.overview.activeStudents} siswa aktif
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Progress</CardTitle>
                  <Target className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.averageProgress.toFixed(1)}%</div>
                  <Progress value={analytics.overview.averageProgress} className="mt-2" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.completionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.overview.totalLessons} total pelajaran
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                  <Activity className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.averageEngagement.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.overview.strugglingStudents} siswa butuh perhatian
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Ringkasan</TabsTrigger>
              <TabsTrigger value="performance">Performa</TabsTrigger>
              <TabsTrigger value="students">Siswa</TabsTrigger>
              <TabsTrigger value="classes">Kelas</TabsTrigger>
              <TabsTrigger value="subjects">Mata Pelajaran</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance History Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tren Performa (30 Hari Terakhir)</CardTitle>
                    <CardDescription>Rata-rata nilai, completion rate, dan engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.performanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="averageScore" stroke="#8884d8" name="Rata-rata Nilai" />
                        <Line type="monotone" dataKey="completionRate" stroke="#82ca9d" name="Completion Rate" />
                        <Line type="monotone" dataKey="engagement" stroke="#ffc658" name="Engagement" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Engagement Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement (7 Hari Terakhir)</CardTitle>
                    <CardDescription>Siswa aktif vs tidak aktif</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="active" fill="#82ca9d" name="Aktif" />
                        <Bar dataKey="inactive" fill="#ff8042" name="Tidak Aktif" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Subject Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribusi Siswa per Mata Pelajaran</CardTitle>
                    <CardDescription>Total siswa di setiap mata pelajaran</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.subjectDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.subjectDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistik Cepat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Total Kelas</span>
                      </div>
                      <span className="font-bold">{analytics.overview.totalClasses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Total Pelajaran</span>
                      </div>
                      <span className="font-bold">{analytics.overview.totalLessons}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Total Quiz</span>
                      </div>
                      <span className="font-bold">{analytics.overview.totalQuizzes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Siswa Butuh Perhatian</span>
                      </div>
                      <Badge variant="destructive">{analytics.overview.strugglingStudents}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Performa Detail</CardTitle>
                  <CardDescription>Analisis performa siswa dalam 30 hari terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={analytics.performanceHistory}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="averageScore" stroke="#8884d8" fillOpacity={1} fill="url(#colorScore)" name="Rata-rata Nilai" />
                      <Area type="monotone" dataKey="completionRate" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCompletion)" name="Completion Rate" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Students */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Top 5 Siswa Terbaik
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topStudents.map((student, index) => (
                        <div key={student.studentId} className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                          </div>
                          <img src={student.avatar} alt={student.studentName} className="w-10 h-10 rounded-full" />
                          <div className="flex-1">
                            <div className="font-medium">{student.studentName}</div>
                            <div className="text-sm text-gray-500">
                              {student.completedLessons}/{student.totalLessons} pelajaran
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{student.averageScore.toFixed(1)}</div>
                            <div className="text-xs text-gray-500">rata-rata</div>
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
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      Siswa Butuh Perhatian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.strugglingStudents.map((student) => (
                        <div key={student.studentId} className="flex items-center gap-4">
                          <img src={student.avatar} alt={student.studentName} className="w-10 h-10 rounded-full" />
                          <div className="flex-1">
                            <div className="font-medium">{student.studentName}</div>
                            <div className="text-sm text-gray-500">
                              {student.completedLessons}/{student.totalLessons} pelajaran
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              student.riskLevel === 'high' ? 'destructive' :
                              student.riskLevel === 'medium' ? 'default' : 'secondary'
                            }>
                              {student.riskLevel === 'high' ? 'Tinggi' :
                               student.riskLevel === 'medium' ? 'Sedang' : 'Rendah'}
                            </Badge>
                            <div className="text-sm font-bold text-red-600 mt-1">
                              {student.averageScore.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Classes Tab */}
            <TabsContent value="classes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analisis Per Kelas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.classAnalytics.map((classData) => (
                      <Card key={classData.classId}>
                        <CardHeader>
                          <CardTitle className="text-lg">{classData.className}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Total Siswa</div>
                              <div className="text-2xl font-bold">{classData.totalStudents}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Siswa Aktif</div>
                              <div className="text-2xl font-bold text-green-600">{classData.activeStudents}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Rata-rata Nilai</div>
                              <div className="text-2xl font-bold text-blue-600">{classData.averageScore.toFixed(1)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Completion Rate</div>
                              <div className="text-2xl font-bold text-purple-600">{classData.completionRate.toFixed(1)}%</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">At Risk</div>
                              <div className="text-2xl font-bold text-red-600">{classData.atRiskStudents}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analisis Per Mata Pelajaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.subjectAnalytics.map((subject) => (
                      <Card key={subject.subjectId}>
                        <CardHeader>
                          <CardTitle className="text-lg">{subject.subjectName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">Total Siswa</div>
                                <div className="text-2xl font-bold">{subject.totalStudents}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Total Pelajaran</div>
                                <div className="text-2xl font-bold">{subject.totalLessons}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Pelajaran Selesai</div>
                                <div className="text-2xl font-bold text-green-600">{subject.completedLessons}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Completion Rate</div>
                                <div className="text-2xl font-bold text-purple-600">{subject.completionRate.toFixed(1)}%</div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Progress</span>
                                <span className="text-sm font-medium">{subject.averageProgress.toFixed(1)}%</span>
                              </div>
                              <Progress value={subject.averageProgress} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarProvider>
  );
}
