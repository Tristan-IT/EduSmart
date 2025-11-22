import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeacherInsights } from "@/components/TeacherInsights";
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  FileText,
  CheckCircle2,
} from "lucide-react";
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

interface MyClass {
  classId: string;
  className: string;
  grade: string;
  studentCount: number;
  capacity: number;
  subjects: string[];
}

interface MyStudent {
  studentId: string;
  name: string;
  email: string;
  className: string;
  xp: number;
  completedLessons: number;
  averageScore: number;
}

interface Analytics {
  totalLessons: number;
  totalQuizzes: number;
  totalStudents: number;
  averageClassScore: number;
}

interface ActivityLog {
  date: string;
  type: string;
  description: string;
  classId?: string;
}

const EnhancedTeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const [myClasses, setMyClasses] = useState<MyClass[]>([]);
  const [myStudents, setMyStudents] = useState<MyStudent[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedClass !== "all") {
      loadClassStudents(selectedClass);
    } else {
      loadAllStudents();
    }
  }, [selectedClass]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Load teacher dashboard data
      const [classesRes, analyticsRes, logsRes] = await Promise.all([
        fetch("http://localhost:5000/api/teacher-dashboard/my-classes", { headers }),
        fetch("http://localhost:5000/api/teacher-dashboard/analytics", { headers }),
        fetch("http://localhost:5000/api/teacher-dashboard/activity-logs", { headers }),
      ]);

      const classesData = await classesRes.json();
      const analyticsData = await analyticsRes.json();
      const logsData = await logsRes.json();

      if (classesData.success) setMyClasses(classesData.data);
      if (analyticsData.success) setAnalytics(analyticsData.data);
      if (logsData.success) setActivityLogs(logsData.data);

      // Load all students initially
      await loadAllStudents();
    } catch (err: any) {
      setError(err.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadAllStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/teacher-dashboard/my-students", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) setMyStudents(data.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  const loadClassStudents = async (classId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/teacher-dashboard/class-students/${classId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) setMyStudents(data.data);
    } catch (err) {
      console.error("Failed to load class students:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Guru</h1>
            <p className="text-gray-600">Kelola kelas dan pantau perkembangan siswa Anda</p>
          </div>
          <GraduationCap className="h-12 w-12 text-teal-600" />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* AI Teacher Insights */}
        {selectedClass !== "all" && (
          <TeacherInsights classId={selectedClass} />
        )}

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                <Users className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                <p className="text-xs text-gray-600">Di semua kelas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
                <BookOpen className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalLessons}</div>
                <p className="text-xs text-gray-600">Materi yang dibuat</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Kuis</CardTitle>
                <FileText className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalQuizzes}</div>
                <p className="text-xs text-gray-600">Kuis yang dibuat</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.averageClassScore.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600">Performa kelas</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Kelas Saya
            </CardTitle>
            <CardDescription>Kelas yang Anda ajar</CardDescription>
          </CardHeader>
          <CardContent>
            {myClasses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kelas</TableHead>
                    <TableHead>Tingkat</TableHead>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead className="text-center">Jumlah Siswa</TableHead>
                    <TableHead className="text-center">Kapasitas</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myClasses.map((cls) => (
                    <TableRow key={cls.classId}>
                      <TableCell className="font-medium">{cls.className}</TableCell>
                      <TableCell>{cls.grade}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cls.subjects.slice(0, 2).map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {cls.subjects.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{cls.subjects.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{cls.studentCount}</TableCell>
                      <TableCell className="text-center">
                        {cls.studentCount}/{cls.capacity}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedClass(cls.classId)}
                        >
                          Lihat Siswa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Belum ada kelas yang diajar. Hubungi admin sekolah.
              </p>
            )}
          </CardContent>
        </Card>

        {/* My Students */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Siswa Saya
                </CardTitle>
                <CardDescription>Daftar siswa yang Anda ajar</CardDescription>
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {myClasses.map((cls) => (
                    <SelectItem key={cls.classId} value={cls.classId}>
                      {cls.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {myStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead className="text-center">XP</TableHead>
                    <TableHead className="text-center">Lessons</TableHead>
                    <TableHead className="text-center">Rata-rata</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myStudents.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-gray-600">{student.email}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{student.xp.toLocaleString()}</Badge>
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
                              : ""
                          }
                        >
                          {student.averageScore.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada siswa di kelas ini</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        {activityLogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Aktivitas Terakhir
              </CardTitle>
              <CardDescription>Timeline aktivitas mengajar Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activityLogs.slice(0, 10).map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">{log.type}</p>
                        <p className="text-xs text-gray-600">{log.description}</p>
                        <p className="text-xs text-gray-500">{log.date}</p>
                      </div>
                    </div>
                    {log.type === "Lesson Created" && (
                      <Badge variant="outline">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Selesai
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedTeacherDashboard;
