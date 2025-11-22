import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { progressApi } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { 
  Trophy,
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SubjectProgressData {
  _id: string;
  subject: {
    _id: string;
    name: string;
    code: string;
    color: string;
    category: string;
  };
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  totalExercisesCompleted: number;
  totalAssignmentsCompleted: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalXPEarned: number;
  totalTimeSpent: number;
  weakTopics: string[];
  strongTopics: string[];
  recentScores: number[];
  masteryLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTER';
  masteryPercentage: number;
  streakDays: number;
  lastActivityAt: string;
}

const SubjectProgress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<SubjectProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await progressApi.getStudentProgress(user.id);
      if (response.success) {
        setProgressData(response.data);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      WAJIB: 'Wajib',
      PEMINATAN: 'Peminatan',
      MUATAN_LOKAL: 'Muatan Lokal',
      EKSTRAKURIKULER: 'Ekstrakurikuler',
    };
    return labels[category] || category;
  };

  // Sort subjects by mastery percentage
  const sortedByMastery = [...progressData].sort(
    (a, b) => b.masteryPercentage - a.masteryPercentage
  );

  // Calculate total stats
  const totalXP = progressData.reduce((sum, p) => sum + p.totalXPEarned, 0);
  const averageScore = progressData.length > 0
    ? Math.round(progressData.reduce((sum, p) => sum + p.averageScore, 0) / progressData.length)
    : 0;
  const totalActivities = progressData.reduce(
    (sum, p) =>
      sum +
      p.totalLessonsCompleted +
      p.totalQuizzesCompleted +
      p.totalExercisesCompleted +
      p.totalAssignmentsCompleted,
    0
  );

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Progress Belajarku
        </h1>
        <p className="text-muted-foreground mt-1">
          Pantau perkembangan dan pencapaianmu di setiap mata pelajaran
        </p>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        {...fadeInUp}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXP.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Dari semua mata pelajaran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}</div>
            <Progress value={averageScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aktivitas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">Pelajaran, kuis & tugas</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="detailed">Detail per Mapel</TabsTrigger>
          <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Memuat data progress...
              </CardContent>
            </Card>
          ) : progressData.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Belum ada progress. Mulai belajar untuk melihat statistik!
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedByMastery.map((progress) => (
                <motion.div
                  key={progress._id}
                  {...fadeInUp}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: progress.subject.color }}
                            />
                            <CardTitle className="text-lg">{progress.subject.name}</CardTitle>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(progress.subject.category)}
                            </Badge>
                            <Badge className={getMasteryColor(progress.masteryLevel)}>
                              {getMasteryLabel(progress.masteryLevel)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Mastery Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Penguasaan</span>
                          <span className="font-semibold">{progress.masteryPercentage}%</span>
                        </div>
                        <Progress value={progress.masteryPercentage} className="h-2" />
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Pelajaran
                          </p>
                          <p className="font-bold">{progress.totalLessonsCompleted}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Kuis
                          </p>
                          <p className="font-bold">{progress.totalQuizzesCompleted}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Nilai Rata-rata
                          </p>
                          <p className="font-bold">{Math.round(progress.averageScore)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            XP
                          </p>
                          <p className="font-bold">{progress.totalXPEarned}</p>
                        </div>
                      </div>

                      {/* Streak */}
                      {progress.streakDays > 0 && (
                        <div className="flex items-center gap-2 text-sm bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-md p-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold">{progress.streakDays} hari beruntun!</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Detailed Tab */}
        <TabsContent value="detailed" className="space-y-4">
          {progressData.map((progress) => (
            <motion.div key={progress._id} {...fadeInUp}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: progress.subject.color }}
                      />
                      <div>
                        <CardTitle>{progress.subject.name}</CardTitle>
                        <CardDescription>{progress.subject.code}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getMasteryColor(progress.masteryLevel)}>
                      {getMasteryLabel(progress.masteryLevel)} - {progress.masteryPercentage}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Activity Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Pelajaran Selesai</p>
                      <p className="text-2xl font-bold">{progress.totalLessonsCompleted}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Kuis Dikerjakan</p>
                      <p className="text-2xl font-bold">{progress.totalQuizzesCompleted}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Latihan</p>
                      <p className="text-2xl font-bold">{progress.totalExercisesCompleted}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Tugas</p>
                      <p className="text-2xl font-bold">{progress.totalAssignmentsCompleted}</p>
                    </div>
                  </div>

                  {/* Score Range */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Rentang Nilai</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Terendah: {progress.lowestScore || 0}</span>
                          <span>Tertinggi: {progress.highestScore || 0}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Topik Dikuasai ({progress.strongTopics.length})
                      </p>
                      <div className="space-y-1">
                        {progress.strongTopics.length > 0 ? (
                          progress.strongTopics.slice(0, 5).map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="mr-1 mb-1">
                              {topic}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Kerjakan lebih banyak kuis untuk melihat topik yang dikuasai
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Perlu Ditingkatkan ({progress.weakTopics.length})
                      </p>
                      <div className="space-y-1">
                        {progress.weakTopics.length > 0 ? (
                          progress.weakTopics.slice(0, 5).map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="mr-1 mb-1 border-orange-500 text-orange-700">
                              {topic}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Bagus! Tidak ada topik yang perlu ditingkatkan
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Scores Trend */}
                  {progress.recentScores.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tren Nilai (10 Terakhir)</p>
                      <div className="flex items-end gap-1 h-20">
                        {progress.recentScores.map((score, idx) => (
                          <div
                            key={idx}
                            className="flex-1 bg-primary/20 rounded-t relative group cursor-pointer hover:bg-primary/40 transition-colors"
                            style={{ height: `${score}%` }}
                          >
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {score}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Terlama</span>
                        <span>Terbaru</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Rekomendasi Belajar
              </CardTitle>
              <CardDescription>
                Saran untuk meningkatkan performa belajarmu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressData
                .filter((p) => p.weakTopics.length > 0 || p.averageScore < 70)
                .map((progress) => (
                  <div key={progress._id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-4 h-4 rounded-full mt-1"
                        style={{ backgroundColor: progress.subject.color }}
                      />
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold">{progress.subject.name}</h4>
                        <div className="space-y-2 text-sm">
                          {progress.averageScore < 70 && (
                            <p className="text-muted-foreground">
                              • Tingkatkan nilai rata-rata dari {Math.round(progress.averageScore)} ke minimal 70
                            </p>
                          )}
                          {progress.weakTopics.length > 0 && (
                            <p className="text-muted-foreground">
                              • Fokus pada topik: {progress.weakTopics.slice(0, 3).join(', ')}
                              {progress.weakTopics.length > 3 && ` dan ${progress.weakTopics.length - 3} lainnya`}
                            </p>
                          )}
                          {progress.totalQuizzesCompleted < 5 && (
                            <p className="text-muted-foreground">
                              • Kerjakan lebih banyak kuis untuk meningkatkan pemahaman
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {progressData.filter((p) => p.weakTopics.length > 0 || p.averageScore < 70).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Hebat! Performa kamu sudah bagus di semua mata pelajaran. Terus pertahankan!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectProgress;
