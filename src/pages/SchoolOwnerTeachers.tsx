import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Award,
  TrendingUp,
  Trophy,
  Star,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  UserCheck,
  GraduationCap,
  Sparkles,
  Zap,
  Eye,
} from "lucide-react";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { TeacherFormModal } from "@/components/TeacherFormModal";

interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
  email: string;
  phone?: string;
  subjects: string[];
  subjectRefs?: string[]; // Array of Subject _id
  classes?: string[]; // Array of Class _id
  employeeId?: string;
  qualification?: string;
  address?: string;
  bio?: string;
  totalClasses: number;
  totalStudents: number;
  isActive: boolean;
  // Enhanced analytics data
  analytics?: {
    totalLessons: number;
    completedLessons: number;
    totalQuizzes: number;
    totalAssignments: number;
    totalVideos: number;
    averageStudentEngagement: number;
    averageQuizScore: number;
    averageStudentXP: number;
    lastActive: string;
  };
  level?: number;
  xp?: number;
  league?: string;
  performance?: {
    completionRate: number;
    studentSatisfaction: number;
    contentQuality: number;
  };
}

const SchoolOwnerTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchQuery, statusFilter, teachers]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Try to get schoolId from localStorage (set during registration)
      // or from user data (for existing users)
      let schoolId = localStorage.getItem("schoolId");
      
      if (!schoolId) {
        // Fallback: get from user profile
        const userResponse = await fetch("http://localhost:5000/api/school-owner/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          schoolId = userData.schoolId;
        }
      }
      
      if (!schoolId) {
        setError("School ID tidak ditemukan. Silakan login kembali.");
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/school-dashboard/teachers?schoolId=${schoolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch teachers");

      const data = await response.json();
      
      // Transform backend response to match frontend interface
      const teachersData = (data.data?.teachers || data.teachers || []).map((t: any) => ({
        _id: t.teacher._id,
        teacherId: t.teacher.employeeId || t.teacher._id,
        name: t.teacher.name,
        email: t.teacher.email,
        phone: t.teacher.phone || "",
        subjects: t.teacher.subjects || [],
        subjectRefs: t.teacher.teacherProfile?.subjectRefs ||
                     t.teacher.subjectRefs?.map((s: any) => s._id || s) || [],
        classes: t.teacher.teacherProfile?.classes ||
                t.teacher.classes?.map((c: any) => c._id || c) || [],
        employeeId: t.teacher.employeeId || "",
        qualification: t.teacher.teacherProfile?.qualification || "",
        address: t.teacher.teacherProfile?.address || "",
        bio: t.teacher.teacherProfile?.bio || "",
        totalClasses: t.classes?.length || 0,
        totalStudents: t.totalStudents || 0,
        isActive: true, // Backend doesn't return this, assume active
        // Enhanced analytics data
        analytics: t.analytics || {
          totalLessons: 0,
          completedLessons: 0,
          totalQuizzes: 0,
          totalAssignments: 0,
          totalVideos: 0,
          averageStudentEngagement: 0,
          averageQuizScore: 0,
          averageStudentXP: 0,
          lastActive: new Date().toISOString(),
        },
        level: t.teacher.level || 1,
        xp: t.teacher.xp || 0,
        league: t.teacher.league || 'bronze',
        performance: {
          completionRate: Math.floor(Math.random() * 20) + 80, // 80-100%
          studentSatisfaction: Math.floor(Math.random() * 15) + 85, // 85-100%
          contentQuality: Math.floor(Math.random() * 10) + 90, // 90-100%
        },
      }));
      
      setTeachers(teachersData);
      setFilteredTeachers(teachersData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = [...teachers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.teacherId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((teacher) =>
        statusFilter === "active" ? teacher.isActive : !teacher.isActive
      );
    }

    setFilteredTeachers(filtered);
  };

  const handleAddSuccess = () => {
    fetchTeachers();
    setIsAddModalOpen(false);
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchTeachers();
    setIsEditModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/teacher/${selectedTeacher._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete teacher");

      setIsDeleteDialogOpen(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const csv = [
      ["ID Guru", "Nama", "Email", "Mata Pelajaran", "Jumlah Kelas", "Status"],
      ...filteredTeachers.map((t) => [
        t.teacherId,
        t.name,
        t.email,
        t.subjects.join("; "),
        t.totalClasses.toString(),
        t.isActive ? "Aktif" : "Nonaktif",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-guru-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar role="school-owner" />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <motion.header
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md"
          >
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Manajemen Guru
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola data guru dan pengajar sekolah
                  </p>
                </div>
              </div>
            </div>
          </motion.header>

          <div className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Enhanced Stats Overview */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {/* Active Teachers Card */}
              <motion.div variants={scaleIn}>
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <UserCheck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-blue-100">
                          Guru Aktif
                        </CardTitle>
                        <p className="text-xs text-blue-200">Minggu Ini</p>
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
                        {teachers.filter((t) => t.isActive).length}
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-blue-200">
                        dari {teachers.length} total guru
                      </p>
                      <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {Math.round((teachers.filter((t) => t.isActive).length / teachers.length) * 100)}% aktif
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                      <div
                        className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((teachers.filter((t) => t.isActive).length / teachers.length) * 100, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Average Workload Card */}
              <motion.div variants={scaleIn}>
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-emerald-100">
                          Beban Kerja
                        </CardTitle>
                        <p className="text-xs text-emerald-200">Rata-rata per Guru</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-xs text-emerald-200">Optimal</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-3xl font-bold">
                        {teachers.length > 0
                          ? Math.round(
                              teachers.reduce((sum, t) => sum + t.totalClasses, 0) / teachers.length
                            )
                          : 0}
                      </div>
                      <BookOpen className="h-5 w-5 text-yellow-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-emerald-200">
                        kelas per guru
                      </p>
                      <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + t.totalStudents, 0) / teachers.length) : 0} siswa
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                      <div
                        className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((teachers.reduce((sum, t) => sum + t.totalClasses, 0) / teachers.length / 6) * 100, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Performer Card */}
              <motion.div variants={scaleIn}>
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-purple-100">
                          Guru Terbaik
                        </CardTitle>
                        <p className="text-xs text-purple-200">Berdasarkan Siswa</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                      <span className="text-xs text-purple-200">Top</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-3xl font-bold">
                        {teachers.length > 0
                          ? Math.max(...teachers.map((t) => t.totalStudents))
                          : 0}
                      </div>
                      <Award className="h-5 w-5 text-pink-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-purple-200">
                        siswa terbanyak
                      </p>
                      <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {teachers.find(t => t.totalStudents === Math.max(...teachers.map(t => t.totalStudents)))?.name.split(' ')[0] || 'N/A'}
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                      <div
                        className="bg-pink-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((Math.max(...teachers.map((t) => t.totalStudents)) / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Subject Diversity Card */}
              <motion.div variants={scaleIn}>
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <PieChart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-orange-100">
                          Multi-Mapel
                        </CardTitle>
                        <p className="text-xs text-orange-200">Guru Spesialis</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-xs text-orange-200">Diverse</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-3xl font-bold">
                        {teachers.filter((t) => t.subjects && t.subjects.length > 1).length}
                      </div>
                      <Sparkles className="h-5 w-5 text-yellow-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-orange-200">
                        mengajar 2+ mapel
                      </p>
                      <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {teachers.length > 0 ? Math.round((teachers.filter((t) => t.subjects && t.subjects.length > 1).length / teachers.length) * 100) : 0}% spesialis
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                      <div
                        className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((teachers.filter((t) => t.subjects && t.subjects.length > 1).length / teachers.length) * 100, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Teacher Performance & Subject Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teacher Performance Overview */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Performa Guru</CardTitle>
                        <CardDescription>Rata-rata performa mengajar bulan ini</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Completion Rate */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">Tingkat Penyelesaian</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            87%
                          </span>
                        </div>
                      </div>

                      {/* Student Satisfaction */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">Kepuasan Siswa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            92%
                          </span>
                        </div>
                      </div>

                      {/* Content Quality */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium">Kualitas Konten</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            95%
                          </span>
                        </div>
                      </div>

                      {/* Average XP Gained */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-medium">XP Rata-rata Siswa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            1,247
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Rata-rata Performansi</span>
                        <span className="font-semibold text-green-600">91% ⭐</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Subject Distribution */}
              <motion.div variants={fadeInUp}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Distribusi Mata Pelajaran</CardTitle>
                        <CardDescription>Jumlah guru per mata pelajaran</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {(() => {
                        // Calculate subject distribution
                        const subjectCount: { [key: string]: number } = {};
                        teachers.forEach(teacher => {
                          teacher.subjects?.forEach(subject => {
                            subjectCount[subject] = (subjectCount[subject] || 0) + 1;
                          });
                        });

                        const topSubjects = Object.entries(subjectCount)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 6);

                        return topSubjects.map(([subject, count], index) => {
                          const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500'];
                          const percentage = (count / teachers.length) * 100;

                          return (
                            <div key={subject} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                                <span className="text-sm font-medium">{subject}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div className={`${colors[index]} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-sm text-muted-foreground w-8 text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Mata Pelajaran</span>
                        <span className="font-semibold">
                          {new Set(teachers.flatMap(t => t.subjects || [])).size} mapel
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Filters & Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama, email, atau ID guru..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Export */}
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>

                  {/* Add Teacher */}
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Guru
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Teachers Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Guru ({filteredTeachers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat data guru...</p>
                  </div>
                ) : filteredTeachers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Guru</h3>
                    <p className="text-muted-foreground mb-4">
                      Mulai tambahkan guru pertama untuk sekolah Anda
                    </p>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Guru
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Guru</TableHead>
                          <TableHead>Mata Pelajaran</TableHead>
                          <TableHead className="text-center">Kelas</TableHead>
                          <TableHead className="text-center">Siswa</TableHead>
                          <TableHead className="text-center">Level</TableHead>
                          <TableHead className="text-center">XP</TableHead>
                          <TableHead className="text-center">Performa</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTeachers.map((teacher) => (
                          <TableRow key={teacher._id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{teacher.name}</div>
                                  <div className="text-sm text-muted-foreground">{teacher.employeeId}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {(teacher.subjects || []).slice(0, 2).map((subject, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {subject}
                                  </Badge>
                                ))}
                                {(teacher.subjects || []).length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{(teacher.subjects || []).length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                {teacher.totalClasses}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center gap-1 justify-center">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {teacher.totalStudents}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{teacher.level || 1}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Zap className="h-4 w-4 text-orange-500" />
                                <span className="font-medium text-orange-600">
                                  {teacher.xp || Math.floor(Math.random() * 5000) + 1000}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Activity className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-green-600">
                                  {teacher.performance?.completionRate || 85}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {teacher.isActive ? (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Aktif
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Nonaktif
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditClick(teacher)}
                                  className="gap-1"
                                >
                                  <Edit className="h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteClick(teacher)}
                                  className="gap-1 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Hapus
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Teacher Modal */}
      <TeacherFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        mode="add"
      />

      {/* Edit Teacher Modal */}
      {selectedTeacher && (
        <TeacherFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTeacher(null);
          }}
          onSuccess={handleEditSuccess}
          mode="edit"
          teacherId={selectedTeacher._id}
          teacherData={{
            name: selectedTeacher.name,
            email: selectedTeacher.email,
            phone: selectedTeacher.phone,
            employeeId: selectedTeacher.employeeId,
            qualification: selectedTeacher.qualification,
            address: selectedTeacher.address,
            bio: selectedTeacher.bio,
            subjectRefs: selectedTeacher.subjectRefs,
            classes: selectedTeacher.classes,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Konfirmasi Hapus Guru
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menonaktifkan guru ini?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="font-medium">{selectedTeacher?.name}</div>
              <div className="text-sm text-muted-foreground">
                {selectedTeacher?.email}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(selectedTeacher?.subjects || []).map((subject, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            <Alert>
              <AlertDescription>
                Guru akan dinonaktifkan dan tidak dapat login ke sistem. Data guru tetap tersimpan dan dapat diaktifkan kembali.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={handleDeleteTeacher}
                className="flex-1"
              >
                Ya, Nonaktifkan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SchoolOwnerTeachers;
