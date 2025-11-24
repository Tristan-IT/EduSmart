import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Trophy,
  Award,
  GraduationCap,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface ClassInfo {
  class: {
    classId: string;
    className: string;
    grade: string;
    section: string;
    academicYear: string;
    maxStudents: number;
    currentStudents: number;
  };
  school: {
    schoolId: string;
    schoolName: string;
  };
  homeRoomTeacher?: {
    name: string;
    email: string;
  };
  subjectTeachers: Array<{ name: string; email: string; subjects: string[] }>;
}

interface Classmate {
  studentId: string;
  name: string;
  xp: number;
  completedLessons: number;
  rank: number;
}

interface ClassLeaderboard {
  studentId: string;
  name: string;
  isMe: boolean;
  xp: number;
  completedLessons: number;
  averageScore: number;
  rank: number;
}

interface SchoolRank {
  myRank: number;
  totalStudents: number;
  myXP: number;
  topStudentXP: number;
}

interface RecentActivity {
  date: string;
  type: string;
  description: string;
  xpGained?: number;
}

const EnhancedStudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [leaderboard, setLeaderboard] = useState<ClassLeaderboard[]>([]);
  const [schoolRank, setSchoolRank] = useState<SchoolRank | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

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

      // Load student dashboard data
      const [classRes, classmatesRes, leaderboardRes, rankRes] =
        await Promise.all([
          fetch("http://localhost:5000/api/student-class/my-class", { headers }),
          fetch("http://localhost:5000/api/student-class/my-classmates", { headers }),
          fetch("http://localhost:5000/api/student-class/class-leaderboard", { headers }),
          fetch("http://localhost:5000/api/student-class/my-rank", { headers }),
        ]);

      const classData = await classRes.json();
      const classmatesData = await classmatesRes.json();
      const leaderboardData = await leaderboardRes.json();
      const rankData = await rankRes.json();

      if (classData.success) setClassInfo(classData.data);
      if (classmatesData.success) setClassmates(classmatesData.data);
      if (leaderboardData.success) setLeaderboard(leaderboardData.data);
      if (rankData.success) setSchoolRank(rankData.data);
      
      // Recent activities: TODO - implement backend endpoint
      setRecentActivities([]);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Siswa</h1>
            <p className="text-gray-600">Pantau perkembangan belajar dan ranking Anda</p>
          </div>
          <GraduationCap className="h-12 w-12 text-indigo-600" />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Class Information */}
        {classInfo && (
          <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Kelas Saya
              </CardTitle>
              <CardDescription>Informasi kelas dan guru pengajar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Kelas</p>
                  <p className="text-xl font-bold">{classInfo.class.className}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tingkat</p>
                  <p className="text-xl font-bold">{classInfo.class.grade} {classInfo.class.section}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wali Kelas</p>
                  <p className="text-lg font-medium">{classInfo.homeRoomTeacher?.name || "Belum ditentukan"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jumlah Siswa</p>
                  <p className="text-lg font-medium">
                    {classInfo.class.currentStudents}/{classInfo.class.maxStudents}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">Guru Mata Pelajaran</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(classInfo.subjectTeachers || []).map((teacher, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg">
                      <GraduationCap className="h-4 w-4 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{teacher.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(teacher.subjects || []).map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ranking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Ranking */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Peringkat Kelas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.length > 0 && (
                <div className="space-y-3">
                  {leaderboard.find((s) => s.isMe) && (
                    <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Peringkat Anda</p>
                      <p className="text-3xl font-bold text-indigo-600">
                        #{leaderboard.find((s) => s.isMe)?.rank}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        dari {leaderboard.length} siswa
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* School Ranking */}
          {schoolRank && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-purple-600" />
                  Peringkat Sekolah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Peringkat Anda</p>
                    <p className="text-3xl font-bold text-purple-600">#{schoolRank.myRank}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      dari {schoolRank.totalStudents} siswa
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600 mb-2">Progres menuju Top 1</p>
                    <Progress
                      value={(schoolRank.myXP / schoolRank.topStudentXP) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {schoolRank.myXP.toLocaleString()} / {schoolRank.topStudentXP.toLocaleString()}{" "}
                      XP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Class Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Leaderboard Kelas
            </CardTitle>
            <CardDescription>Top 10 siswa di kelas Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead className="text-center">XP</TableHead>
                    <TableHead className="text-center">Lessons</TableHead>
                    <TableHead className="text-center">Rata-rata</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.slice(0, 10).map((student) => (
                    <TableRow
                      key={student.studentId}
                      className={student.isMe ? "bg-indigo-50" : ""}
                    >
                      <TableCell className="font-bold">
                        {student.rank <= 3 ? (
                          <span className="text-xl">
                            {student.rank === 1
                              ? "🥇"
                              : student.rank === 2
                              ? "🥈"
                              : "🥉"}
                          </span>
                        ) : (
                          student.rank
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.name}
                        {student.isMe && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Anda
                          </Badge>
                        )}
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
              <p className="text-center text-gray-500 py-4">Belum ada data leaderboard</p>
            )}
          </CardContent>
        </Card>

        {/* Classmates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Teman Sekelas
            </CardTitle>
            <CardDescription>Siswa lain di kelas Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {classmates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(classmates || []).map((classmate) => (
                  <div
                    key={classmate.studentId}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{classmate.name}</p>
                      <Badge variant="outline" className="text-xs">
                        #{classmate.rank}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>XP: {classmate.xp.toLocaleString()}</p>
                      <p>Lessons: {classmate.completedLessons}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada teman sekelas</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {recentActivities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Aktivitas Terakhir
              </CardTitle>
              <CardDescription>Histori pembelajaran Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivities.slice(0, 10).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">{activity.type}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    {activity.xpGained && (
                      <Badge variant="secondary">+{activity.xpGained} XP</Badge>
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

export default EnhancedStudentDashboard;
