import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subjectApi, progressApi, contentApi } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  BarChart3,
  GraduationCap,
  FileText,
  Target,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: string;
  color: string;
}

interface ClassProgress {
  student: {
    _id: string;
    name: string;
    email: string;
  };
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  averageScore: number;
  totalXPEarned: number;
  masteryPercentage: number;
  masteryLevel: string;
}

const TeacherSubjectAnalytics = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [classProgress, setClassProgress] = useState<ClassProgress[]>([]);
  const [contentStats, setContentStats] = useState({
    modules: 0,
    quizQuestions: 0,
    contentItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject && user?.className) {
      loadSubjectData();
    }
  }, [selectedSubject, user]);

  const loadSubjects = async () => {
    try {
      const response = await subjectApi.getAll();
      if (response.success) {
        setSubjects(response.subjects);
        if (response.subjects.length > 0) {
          setSelectedSubject(response.subjects[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadSubjectData = async () => {
    if (!selectedSubject) return;

    try {
      setLoading(true);

      // Load class progress for selected subject
      // Note: This requires classId. If teacher teaches multiple classes,
      // you'd need to select a class first. For now, using a placeholder.
      try {
        const progressResponse = await progressApi.getClassProgress(
          user?.className || '',
          selectedSubject
        );
        if (progressResponse.success) {
          setClassProgress(progressResponse.data);
        }
      } catch (error) {
        console.error('Failed to load class progress:', error);
        setClassProgress([]);
      }

      // Load content stats (modules, items, questions created by teacher)
      try {
        const [modulesRes, itemsRes, questionsRes] = await Promise.all([
          contentApi.getModules({ subjectId: selectedSubject }),
          contentApi.getItems({ subjectId: selectedSubject }),
          contentApi.getQuestions({ subjectId: selectedSubject }),
        ]);

        setContentStats({
          modules: modulesRes.success ? modulesRes.modules.length : 0,
          quizQuestions: questionsRes.success ? questionsRes.questions.length : 0,
          contentItems: itemsRes.success ? itemsRes.items.length : 0,
        });
      } catch (error) {
        console.error('Failed to load content stats:', error);
      }
    } catch (error) {
      console.error('Failed to load subject data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMasteryColor = (level: string) => {
    const colors: Record<string, string> = {
      BEGINNER: 'bg-gray-500',
      INTERMEDIATE: 'bg-blue-500',
      ADVANCED: 'bg-purple-500',
      MASTER: 'bg-yellow-500',
    };
    return colors[level] || 'bg-gray-500';
  };

  const getMasteryLabel = (level: string) => {
    const labels: Record<string, string> = {
      BEGINNER: 'Pemula',
      INTERMEDIATE: 'Menengah',
      ADVANCED: 'Mahir',
      MASTER: 'Ahli',
    };
    return labels[level] || level;
  };

  // Calculate class statistics
  const classAverageScore = classProgress.length > 0
    ? Math.round(classProgress.reduce((sum, p) => sum + p.averageScore, 0) / classProgress.length)
    : 0;
  const totalStudents = classProgress.length;
  const activeStudents = classProgress.filter(
    (p) => p.totalLessonsCompleted > 0 || p.totalQuizzesCompleted > 0
  ).length;

  const selectedSubjectData = subjects.find((s) => s._id === selectedSubject);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeInUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analitik Mata Pelajaran
          </h2>
          <p className="text-muted-foreground mt-1">
            Pantau performa siswa dan konten pembelajaran per mata pelajaran
          </p>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Pilih Mata Pelajaran" />
          </SelectTrigger>
          <SelectContent>
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
      </motion.div>

      {!selectedSubject ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Pilih mata pelajaran untuk melihat analitik
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Performa Siswa</TabsTrigger>
            <TabsTrigger value="content">Konten Pembelajaran</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            {/* Overview Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              {...fadeInUp}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeStudents} aktif belajar
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nilai Rata-rata Kelas</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classAverageScore}</div>
                  <Progress value={classAverageScore} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tingkat Partisipasi</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Siswa yang aktif</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mata Pelajaran</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold truncate">
                    {selectedSubjectData?.name || '-'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedSubjectData?.code}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Student Progress Table */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Performa Siswa</CardTitle>
                  <CardDescription>
                    Detail progress siswa di mata pelajaran {selectedSubjectData?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Memuat data...
                    </div>
                  ) : classProgress.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Belum ada data progress siswa
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Siswa</TableHead>
                          <TableHead className="text-right">Pelajaran</TableHead>
                          <TableHead className="text-right">Kuis</TableHead>
                          <TableHead className="text-right">Nilai Rata-rata</TableHead>
                          <TableHead className="text-right">Penguasaan</TableHead>
                          <TableHead>Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classProgress
                          .sort((a, b) => b.averageScore - a.averageScore)
                          .map((progress) => (
                            <TableRow key={progress.student._id}>
                              <TableCell className="font-medium">
                                {progress.student.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {progress.totalLessonsCompleted}
                              </TableCell>
                              <TableCell className="text-right">
                                {progress.totalQuizzesCompleted}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="font-semibold">
                                    {Math.round(progress.averageScore)}
                                  </span>
                                  <Progress
                                    value={progress.averageScore}
                                    className="w-16 h-2"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="font-semibold">
                                    {progress.masteryPercentage}%
                                  </span>
                                  <Progress
                                    value={progress.masteryPercentage}
                                    className="w-16 h-2"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getMasteryColor(progress.masteryLevel)}>
                                  {getMasteryLabel(progress.masteryLevel)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              {...fadeInUp}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Modul Pembelajaran</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contentStats.modules}</div>
                  <p className="text-xs text-muted-foreground">
                    Modul yang sudah dibuat
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Soal Kuis</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contentStats.quizQuestions}</div>
                  <p className="text-xs text-muted-foreground">
                    Soal dalam bank soal
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Konten Tambahan</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contentStats.contentItems}</div>
                  <p className="text-xs text-muted-foreground">
                    Materi & latihan
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Konten</CardTitle>
                  <CardDescription>
                    Konten pembelajaran yang telah dibuat untuk {selectedSubjectData?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedSubjectData?.color }}
                      />
                      <div>
                        <p className="font-medium">{selectedSubjectData?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Total {contentStats.modules + contentStats.quizQuestions + contentStats.contentItems} item konten
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm text-muted-foreground">Tingkat Kelengkapan</p>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(
                            ((contentStats.modules + contentStats.quizQuestions) / 20) * 100,
                            100
                          )}
                          className="w-24 h-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.min(
                            Math.round(((contentStats.modules + contentStats.quizQuestions) / 20) * 100),
                            100
                          )}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {contentStats.modules < 5 && (
                    <div className="p-4 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400">
                      <p className="text-sm">
                        💡 Tambahkan lebih banyak modul pembelajaran untuk meningkatkan kelengkapan materi
                      </p>
                    </div>
                  )}
                  {contentStats.quizQuestions < 10 && (
                    <div className="p-4 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400">
                      <p className="text-sm">
                        💡 Buat lebih banyak soal kuis untuk membantu siswa berlatih
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TeacherSubjectAnalytics;
