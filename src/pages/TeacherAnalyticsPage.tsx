import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  BookOpen,
  Award,
  Clock,
  AlertCircle
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface AnalyticsStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completionRate: number;
  totalClasses: number;
  avgClassSize: number;
}

export default function TeacherAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AnalyticsStats>({
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    completionRate: 0,
    totalClasses: 0,
    avgClassSize: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: any = await apiClient.get('/teacher-dashboard/my-analytics');
      
      if (response?.success && response?.data) {
        setStats({
          totalStudents: response.data.totalStudents || 0,
          activeStudents: response.data.activeStudents || 0,
          averageProgress: response.data.averageProgress || 0,
          completionRate: response.data.completionRate || 0,
          totalClasses: response.data.totalClasses || 0,
          avgClassSize: response.data.avgClassSize || 0,
        });
      }
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(err.message || 'Gagal memuat data analytics');
    } finally {
      setLoading(false);
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
                Analitik & Laporan
              </h1>
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

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                <TabsTrigger value="students">Siswa</TabsTrigger>
                <TabsTrigger value="performance">Performa</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    <>
                      {[...Array(6)].map((_, i) => (
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
                          <div className="text-2xl font-bold">{stats.totalStudents}</div>
                          <p className="text-xs text-muted-foreground">
                            {stats.activeStudents} aktif minggu ini
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Rata-rata Progress</CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.averageProgress.toFixed(1)}%</div>
                          <p className="text-xs text-muted-foreground">
                            Progres pembelajaran
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
                          <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
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
                          <div className="text-2xl font-bold">{stats.totalClasses}</div>
                          <p className="text-xs text-muted-foreground">
                            Kelas yang diampu
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Rata-rata Ukuran Kelas</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.avgClassSize.toFixed(0)}</div>
                          <p className="text-xs text-muted-foreground">
                            Siswa per kelas
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Waktu Rata-rata</CardTitle>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">-</div>
                          <p className="text-xs text-muted-foreground">
                            Segera hadir
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Aksi Cepat</CardTitle>
                    <CardDescription>
                      Akses fitur analytics lainnya
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors">
                      <Award className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Pencapaian Siswa</div>
                        <div className="text-sm text-muted-foreground">Lihat badge dan prestasi</div>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Laporan Detail</div>
                        <div className="text-sm text-muted-foreground">Analisis mendalam</div>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Siswa</CardTitle>
                    <CardDescription>Fitur ini sedang dalam pengembangan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Segera hadir - Detail analytics per siswa</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Analisis Performa</CardTitle>
                    <CardDescription>Fitur ini sedang dalam pengembangan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Segera hadir - Grafik dan chart performa</p>
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
