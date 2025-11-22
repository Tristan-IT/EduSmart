import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { subjectApi, progressApi } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Award, 
  BarChart3,
  GraduationCap,
  Target,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: string;
  color: string;
  icon?: string;
}

interface SubjectStats {
  subject: Subject;
  totalStudents: number;
  averageScore: number;
  averageMastery: number;
  completionRate: number;
  topPerformers: Array<{ studentName: string; score: number; masteryLevel: string }>;
  strugglingStudents: Array<{ studentName: string; score: number; weakTopics: string[] }>;
}

const SubjectAnalytics = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (subjects.length > 0 && user?.school) {
      loadAllSubjectStats();
    }
  }, [subjects, user]);

  const loadSubjects = async () => {
    try {
      const response = await subjectApi.getAll();
      if (response.success) {
        setSubjects(response.subjects);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadAllSubjectStats = async () => {
    if (!user?.school) return;
    
    try {
      setLoading(true);
      const statsPromises = subjects.map(async (subject) => {
        try {
          const response = await progressApi.getSubjectStatistics(user.school!, subject._id);
          if (response.success) {
            return {
              subject,
              ...response.data,
            };
          }
          return null;
        } catch (error) {
          console.error(`Failed to load stats for ${subject.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(statsPromises);
      const validStats = results.filter((stat): stat is SubjectStats => stat !== null);
      setSubjectStats(validStats);
    } catch (error) {
      console.error('Failed to load subject statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      WAJIB: 'bg-blue-500',
      PEMINATAN: 'bg-purple-500',
      MUATAN_LOKAL: 'bg-green-500',
      EKSTRAKURIKULER: 'bg-orange-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      WAJIB: 'Wajib',
      PEMINATAN: 'Peminatan',
      MUATAN_LOKAL: 'Muatan Lokal',
      EKSTRAKURIKULER: 'Ekstrakurikuler',
    };
    return labels[category] || category;
  };

  // Calculate overview metrics
  const totalSubjects = subjects.length;
  const totalStudentsAcrossSubjects = subjectStats.reduce((sum, stat) => sum + stat.totalStudents, 0);
  const averageCompletionRate = subjectStats.length > 0
    ? Math.round(subjectStats.reduce((sum, stat) => sum + stat.completionRate, 0) / subjectStats.length)
    : 0;
  const mostActiveSubject = subjectStats.length > 0
    ? subjectStats.reduce((max, stat) => stat.completionRate > max.completionRate ? stat : max, subjectStats[0])
    : null;

  // Filter stats by selected subject
  const displayStats = selectedSubject
    ? subjectStats.filter((stat) => stat.subject._id === selectedSubject)
    : subjectStats;

  // Group by category
  const categoryBreakdown = subjects.reduce((acc, subject) => {
    acc[subject.category] = (acc[subject.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analitik Mata Pelajaran
            </h1>
            <p className="text-muted-foreground mt-1">
              Pantau performa dan keterlibatan siswa per mata pelajaran
            </p>
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Semua Mata Pelajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Mata Pelajaran</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject._id} value={subject._id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    {subject.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        {...fadeInUp}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mata Pelajaran</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubjects}</div>
            <p className="text-xs text-muted-foreground">Aktif di sekolah</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paling Aktif</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {mostActiveSubject ? mostActiveSubject.subject.name : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostActiveSubject ? `${mostActiveSubject.completionRate}% partisipasi` : 'Belum ada data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Penyelesaian</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">Dari semua mata pelajaran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partisipasi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudentsAcrossSubjects}</div>
            <p className="text-xs text-muted-foreground">Siswa aktif</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Distribusi Kategori
            </CardTitle>
            <CardDescription>Jumlah mata pelajaran per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryBreakdown).map(([category, count]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(category)}>
                      {getCategoryLabel(category)}
                    </Badge>
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                  <Progress value={(count / totalSubjects) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round((count / totalSubjects) * 100)}% dari total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subject Performance Table */}
      <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Performa Mata Pelajaran
            </CardTitle>
            <CardDescription>
              Ringkasan performa siswa per mata pelajaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Memuat data...
              </div>
            ) : displayStats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada data progress siswa
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Siswa</TableHead>
                    <TableHead className="text-right">Rata-rata Nilai</TableHead>
                    <TableHead className="text-right">Penguasaan</TableHead>
                    <TableHead className="text-right">Tingkat Penyelesaian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayStats.map((stat) => (
                    <TableRow key={stat.subject._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stat.subject.color }}
                          />
                          {stat.subject.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(stat.subject.category)} variant="outline">
                          {getCategoryLabel(stat.subject.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{stat.totalStudents}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold">{stat.averageScore}</span>
                          <Progress value={stat.averageScore} className="w-20 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold">{stat.averageMastery}%</span>
                          <Progress value={stat.averageMastery} className="w-20 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold">{stat.completionRate}%</span>
                          <Progress value={stat.completionRate} className="w-20 h-2" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Performers & Struggling Students */}
      {selectedSubject && displayStats.length > 0 && (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Siswa Berprestasi
              </CardTitle>
              <CardDescription>5 siswa dengan nilai tertinggi</CardDescription>
            </CardHeader>
            <CardContent>
              {displayStats[0]?.topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {displayStats[0].topPerformers.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.studentName}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.masteryLevel}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{student.score}</p>
                        <p className="text-xs text-muted-foreground">Nilai rata-rata</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Belum ada data siswa berprestasi
                </p>
              )}
            </CardContent>
          </Card>

          {/* Struggling Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Siswa Memerlukan Bantuan
              </CardTitle>
              <CardDescription>Siswa dengan nilai di bawah 50</CardDescription>
            </CardHeader>
            <CardContent>
              {displayStats[0]?.strugglingStudents.length > 0 ? (
                <div className="space-y-3">
                  {displayStats[0].strugglingStudents.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{student.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.weakTopics.length} topik lemah
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{student.score}</p>
                        <p className="text-xs text-muted-foreground">Perlu perhatian</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Tidak ada siswa yang memerlukan bantuan khusus
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SubjectAnalytics;
