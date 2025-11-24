import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  GraduationCap,
  School,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Activity,
  BookOpen,
  Download,
  AlertCircle,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    activeStudents: number;
    activeStudentsPercentage: number;
    avgXP: number;
    avgLevel: number;
  };
  classDistribution: Array<{
    grade: string;
    count: number;
    totalStudents: number;
    avgStudents: number;
  }>;
  teacherWorkload: Array<{
    name: string;
    classes: number;
    students: number;
  }>;
  performanceTrends: Array<{
    date: string;
    activeStudents: number;
    avgXP: number;
    quizzesTaken: number;
  }>;
  topStudents: Array<{
    name: string;
    email: string;
    xp: number;
    level: number;
    streak: number;
  }>;
  dateRange: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

interface Class {
  _id: string;
  classId: string;
  displayName: string;
  className: string;
  grade: number;
  section?: string;
  specialization?: string;
  majorCode?: string;
  majorName?: string;
  maxStudents: number;
  currentStudents: number;
  academicYear: string;
}

interface ClassAnalyticsData {
  totalClasses: number;
  totalStudents: number;
  totalCapacity: number;
  averageUtilization: number;
  byGrade: {
    grade: number;
    classes: number;
    students: number;
    capacity: number;
    utilization: number;
  }[];
  bySpecialization?: {
    specialization: string;
    classes: number;
    students: number;
    capacity: number;
    utilization: number;
  }[];
  byMajor?: {
    majorCode: string;
    majorName: string;
    classes: number;
    students: number;
    capacity: number;
    utilization: number;
  }[];
  utilizationDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const SchoolOwnerAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState("30");
  
  // Class analytics state
  const [classes, setClasses] = useState<Class[]>([]);
  const [classAnalytics, setClassAnalytics] = useState<ClassAnalyticsData | null>(null);
  const [schoolConfig, setSchoolConfig] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAnalytics();
    fetchClasses();
    fetchSchoolConfig();
  }, [dateRange]);

  useEffect(() => {
    if (classes.length > 0) {
      calculateClassAnalytics();
    }
  }, [classes, selectedYear]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("schoolId");
      
      if (!token) {
        setError("Anda belum login. Silakan login terlebih dahulu.");
        return;
      }

      if (!schoolId) {
        setError("SchoolId tidak ditemukan. Silakan logout dan login kembali.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/school-owner/analytics/${schoolId}?dateRange=${dateRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to load analytics");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("schoolId");

      if (!schoolId) {
        console.error("SchoolId tidak ditemukan");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/school-dashboard/classes?schoolId=${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setClasses(data.classes || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch classes:", err);
    }
  };

  const fetchSchoolConfig = async () => {
    try {
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("schoolId");

      if (!schoolId) {
        console.error("SchoolId tidak ditemukan");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/school-owner/school/${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.schoolConfig) {
        setSchoolConfig(data.schoolConfig);
      }
    } catch (err: any) {
      console.error("Failed to fetch school config:", err);
    }
  };

  const calculateClassAnalytics = () => {
    let filteredClasses = classes;

    if (selectedYear !== "all") {
      filteredClasses = classes.filter((cls) => cls.academicYear === selectedYear);
    }

    const totalClasses = filteredClasses.length;
    const totalStudents = filteredClasses.reduce(
      (sum, cls) => sum + (cls.currentStudents || 0),
      0
    );
    const totalCapacity = filteredClasses.reduce(
      (sum, cls) => sum + (cls.maxStudents || 0),
      0
    );
    const averageUtilization =
      totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;

    const gradeMap = new Map<number, any>();
    filteredClasses.forEach((cls) => {
      if (!gradeMap.has(cls.grade)) {
        gradeMap.set(cls.grade, {
          grade: cls.grade,
          classes: 0,
          students: 0,
          capacity: 0,
        });
      }
      const gradeData = gradeMap.get(cls.grade);
      gradeData.classes++;
      gradeData.students += cls.currentStudents || 0;
      gradeData.capacity += cls.maxStudents || 0;
    });

    const byGrade = Array.from(gradeMap.values())
      .map((item) => ({
        ...item,
        utilization: item.capacity > 0 ? (item.students / item.capacity) * 100 : 0,
      }))
      .sort((a, b) => a.grade - b.grade);

    let bySpecialization: any[] | undefined;
    if (schoolConfig?.schoolType === "SMA") {
      const specMap = new Map<string, any>();
      filteredClasses.forEach((cls) => {
        if (cls.specialization) {
          if (!specMap.has(cls.specialization)) {
            specMap.set(cls.specialization, {
              specialization: cls.specialization,
              classes: 0,
              students: 0,
              capacity: 0,
            });
          }
          const specData = specMap.get(cls.specialization);
          specData.classes++;
          specData.students += cls.currentStudents || 0;
          specData.capacity += cls.maxStudents || 0;
        }
      });

      bySpecialization = Array.from(specMap.values()).map((item) => ({
        ...item,
        utilization: item.capacity > 0 ? (item.students / item.capacity) * 100 : 0,
      }));
    }

    let byMajor: any[] | undefined;
    if (schoolConfig?.schoolType === "SMK") {
      const majorMap = new Map<string, any>();
      filteredClasses.forEach((cls) => {
        if (cls.majorCode) {
          if (!majorMap.has(cls.majorCode)) {
            majorMap.set(cls.majorCode, {
              majorCode: cls.majorCode,
              majorName: cls.majorName || cls.majorCode,
              classes: 0,
              students: 0,
              capacity: 0,
            });
          }
          const majorData = majorMap.get(cls.majorCode);
          majorData.classes++;
          majorData.students += cls.currentStudents || 0;
          majorData.capacity += cls.maxStudents || 0;
        }
      });

      byMajor = Array.from(majorMap.values()).map((item) => ({
        ...item,
        utilization: item.capacity > 0 ? (item.students / item.capacity) * 100 : 0,
      }));
    }

    const ranges = [
      { min: 0, max: 25, label: "0-25%" },
      { min: 25, max: 50, label: "25-50%" },
      { min: 50, max: 75, label: "50-75%" },
      { min: 75, max: 90, label: "75-90%" },
      { min: 90, max: 100, label: "90-100%" },
      { min: 100, max: Infinity, label: "Over 100%" },
    ];

    const utilizationDistribution = ranges.map((range) => {
      const count = filteredClasses.filter((cls) => {
        const utilization =
          cls.maxStudents > 0 ? (cls.currentStudents / cls.maxStudents) * 100 : 0;
        return utilization >= range.min && utilization < range.max;
      }).length;

      return {
        range: range.label,
        count,
        percentage: totalClasses > 0 ? (count / totalClasses) * 100 : 0,
      };
    });

    setClassAnalytics({
      totalClasses,
      totalStudents,
      totalCapacity,
      averageUtilization,
      byGrade,
      bySpecialization,
      byMajor,
      utilizationDistribution,
    });
  };

  const getAvailableYears = () => {
    const years = new Set(classes.map((cls) => cls.academicYear));
    return Array.from(years).sort();
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600";
    if (utilization >= 75) return "text-orange-600";
    if (utilization >= 50) return "text-green-600";
    return "text-blue-600";
  };

  const getUtilizationBadge = (utilization: number) => {
    if (utilization >= 90)
      return (
        <Badge variant="destructive" className="ml-2">
          Penuh
        </Badge>
      );
    if (utilization >= 75)
      return (
        <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
          Hampir Penuh
        </Badge>
      );
    if (utilization >= 50)
      return (
        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
          Optimal
        </Badge>
      );
    return (
      <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
        Tersedia
      </Badge>
    );
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <AppSidebar role="school-owner" />
        
        <main className="flex-1 overflow-y-auto">
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md"
          >
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor kinerja sekolah dan siswa
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Hari Terakhir</SelectItem>
                    <SelectItem value="30">30 Hari Terakhir</SelectItem>
                    <SelectItem value="90">3 Bulan Terakhir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.header>

          <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Memuat analytics...</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="overview">Overview Sekolah</TabsTrigger>
                  <TabsTrigger value="classes">Analytics Kelas</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {data ? (
              <>
                {/* Overview Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    icon={Users}
                    title="Total Siswa"
                    value={data.overview?.totalStudents || 0}
                    subtitle={`${data.overview?.activeStudentsPercentage || 0}% aktif`}
                    color="bg-blue-500"
                  />
                  <StatCard
                    icon={GraduationCap}
                    title="Total Guru"
                    value={data.overview?.totalTeachers || 0}
                    color="bg-green-500"
                  />
                  <StatCard
                    icon={School}
                    title="Total Kelas"
                    value={data.overview?.totalClasses || 0}
                    color="bg-purple-500"
                  />
                  <StatCard
                    icon={TrendingUp}
                    title="Rata-rata XP"
                    value={(data.overview?.avgXP || 0).toLocaleString()}
                    subtitle={`Level ${data.overview?.avgLevel || 1}`}
                    color="bg-orange-500"
                  />
                </div>

                {/* Charts Row 1 */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Performance Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Tren Aktivitas Siswa
                      </CardTitle>
                      <CardDescription>
                        Aktivitas siswa dalam {dateRange} hari terakhir
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.performanceTrends || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="activeStudents"
                            stroke="#0088FE"
                            name="Siswa Aktif"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="quizzesTaken"
                            stroke="#00C49F"
                            name="Kuis Dikerjakan"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Class Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <School className="h-5 w-5" />
                        Distribusi Kelas
                      </CardTitle>
                      <CardDescription>
                        Jumlah siswa per tingkat
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={data.classDistribution || []}
                            dataKey="totalStudents"
                            nameKey="grade"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={(entry) => `${entry.grade}: ${entry.totalStudents}`}
                          >
                            {(data.classDistribution || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Teacher Workload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Beban Kerja Guru
                      </CardTitle>
                      <CardDescription>
                        Jumlah siswa yang diajar per guru
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.teacherWorkload || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="students" fill="#8884d8" name="Jumlah Siswa" />
                          <Bar dataKey="classes" fill="#82ca9d" name="Jumlah Kelas" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Top Students */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Siswa Terbaik
                      </CardTitle>
                      <CardDescription>
                        5 siswa dengan XP tertinggi
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {data.topStudents && data.topStudents.length > 0 ? (
                          data.topStudents.map((student, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-blue-50 to-cyan-50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-semibold">{student?.name || "Unknown"}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Level {student?.level || 1} • {student?.streak || 0} days streak
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-cyan-600">
                                  {(student?.xp || 0).toLocaleString()} XP
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground py-8">
                            Belum ada data siswa
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Ringkasan Kelas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                      {(data.classDistribution || []).map((cls, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border bg-white"
                        >
                          <p className="text-sm font-medium text-muted-foreground">
                            {cls?.grade || `Kelas ${index + 1}`}
                          </p>
                          <p className="text-2xl font-bold mt-1">{cls?.totalStudents || 0}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {cls?.count || 0} kelas • ~{cls?.avgStudents || 0} siswa/kelas
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Tidak ada data tersedia</p>
              </div>
            )}
                </TabsContent>

                {/* Classes Tab */}
                <TabsContent value="classes" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Analytics Kelas</h2>
                      <p className="text-sm text-muted-foreground">
                        Analisis kapasitas dan utilisasi kelas
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Pilih tahun ajaran" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Tahun</SelectItem>
                          {getAvailableYears().map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {classAnalytics ? (
                    <>
                      {/* Class Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{classAnalytics.totalClasses}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Kelas aktif {selectedYear !== "all" ? `di ${selectedYear}` : ""}
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{classAnalytics.totalStudents}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Siswa terdaftar di semua kelas
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Kapasitas Total</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{classAnalytics.totalCapacity}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Maksimal siswa yang dapat ditampung
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Utilisasi Rata-rata</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className={`text-2xl font-bold ${getUtilizationColor(classAnalytics.averageUtilization)}`}>
                              {classAnalytics.averageUtilization.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Persentase kapasitas terisi
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* By Grade Analysis */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <School className="h-5 w-5" />
                            Analisis Per Tingkat
                          </CardTitle>
                          <CardDescription>
                            Distribusi kelas dan siswa berdasarkan tingkat kelas
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {classAnalytics.byGrade.map((grade) => (
                              <div key={grade.grade} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">Kelas {grade.grade}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {grade.classes} kelas • {grade.students}/{grade.capacity} siswa
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-semibold ${getUtilizationColor(grade.utilization)}`}>
                                      {grade.utilization.toFixed(1)}%
                                    </span>
                                    {getUtilizationBadge(grade.utilization)}
                                  </div>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2.5">
                                  <div
                                    className={`h-2.5 rounded-full transition-all ${
                                      grade.utilization >= 90
                                        ? "bg-red-600"
                                        : grade.utilization >= 75
                                        ? "bg-orange-600"
                                        : grade.utilization >= 50
                                        ? "bg-green-600"
                                        : "bg-blue-600"
                                    }`}
                                    style={{ width: `${Math.min(grade.utilization, 100)}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* By Specialization (SMA) */}
                      {classAnalytics.bySpecialization && classAnalytics.bySpecialization.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="h-5 w-5" />
                              Analisis Per Peminatan
                            </CardTitle>
                            <CardDescription>
                              Distribusi kelas dan siswa berdasarkan peminatan (SMA)
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {classAnalytics.bySpecialization.map((spec) => (
                                <div key={spec.specialization} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary">{spec.specialization}</Badge>
                                      <span className="text-sm text-muted-foreground">
                                        {spec.classes} kelas • {spec.students}/{spec.capacity} siswa
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm font-semibold ${getUtilizationColor(spec.utilization)}`}>
                                        {spec.utilization.toFixed(1)}%
                                      </span>
                                      {getUtilizationBadge(spec.utilization)}
                                    </div>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-2.5">
                                    <div
                                      className={`h-2.5 rounded-full transition-all ${
                                        spec.utilization >= 90
                                          ? "bg-red-600"
                                          : spec.utilization >= 75
                                          ? "bg-orange-600"
                                          : spec.utilization >= 50
                                          ? "bg-green-600"
                                          : "bg-blue-600"
                                      }`}
                                      style={{ width: `${Math.min(spec.utilization, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* By Major (SMK) */}
                      {classAnalytics.byMajor && classAnalytics.byMajor.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="h-5 w-5" />
                              Analisis Per Jurusan
                            </CardTitle>
                            <CardDescription>
                              Distribusi kelas dan siswa berdasarkan jurusan (SMK)
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {classAnalytics.byMajor.map((major) => (
                                <div key={major.majorCode} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary">{major.majorCode}</Badge>
                                      <span className="text-sm font-medium">{major.majorName}</span>
                                      <span className="text-sm text-muted-foreground">
                                        • {major.classes} kelas • {major.students}/{major.capacity} siswa
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm font-semibold ${getUtilizationColor(major.utilization)}`}>
                                        {major.utilization.toFixed(1)}%
                                      </span>
                                      {getUtilizationBadge(major.utilization)}
                                    </div>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-2.5">
                                    <div
                                      className={`h-2.5 rounded-full transition-all ${
                                        major.utilization >= 90
                                          ? "bg-red-600"
                                          : major.utilization >= 75
                                          ? "bg-orange-600"
                                          : major.utilization >= 50
                                          ? "bg-green-600"
                                          : "bg-blue-600"
                                      }`}
                                      style={{ width: `${Math.min(major.utilization, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Utilization Distribution */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Distribusi Utilisasi Kelas
                          </CardTitle>
                          <CardDescription>
                            Jumlah kelas berdasarkan persentase kapasitas terisi
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {classAnalytics.utilizationDistribution.map((dist) => (
                              <div key={dist.range} className="flex items-center gap-4">
                                <div className="w-24 text-sm font-medium">{dist.range}</div>
                                <div className="flex-1">
                                  <div className="w-full bg-secondary rounded-full h-8 relative overflow-hidden">
                                    <div
                                      className="h-8 bg-gradient-to-r from-purple-600 to-pink-600 transition-all flex items-center justify-end pr-2"
                                      style={{ width: `${dist.percentage}%` }}
                                    >
                                      {dist.percentage > 10 && (
                                        <span className="text-xs font-semibold text-white">
                                          {dist.count} kelas
                                        </span>
                                      )}
                                    </div>
                                    {dist.percentage <= 10 && dist.count > 0 && (
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                                        {dist.count} kelas
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="w-16 text-sm text-muted-foreground text-right">
                                  {dist.percentage.toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Belum ada data kelas</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchoolOwnerAnalytics;
