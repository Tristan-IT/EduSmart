import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  GraduationCap,
  Grid3x3,
  List,
  CheckCircle2,
  Target
} from "lucide-react";
import { useSubject } from "@/context/SubjectContext";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/animations";
import { useState } from "react";

interface SubjectSelectorProps {
  compact?: boolean;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({ compact = false }) => {
  const { subjects, selectedSubject, selectSubject, subjectProgress, loadingSubjects } = useSubject();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'WAJIB':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'PEMINATAN':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'MUATAN_LOKAL':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'EKSTRAKURIKULER':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'WAJIB':
        return 'Wajib';
      case 'PEMINATAN':
        return 'Peminatan';
      case 'MUATAN_LOKAL':
        return 'Muatan Lokal';
      case 'EKSTRAKURIKULER':
        return 'Ekstrakurikuler';
      default:
        return category;
    }
  };

  if (loadingSubjects) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-sm text-muted-foreground">Memuat mata pelajaran...</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Belum ada mata pelajaran tersedia</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedSubject === null ? "default" : "outline"}
          size="sm"
          onClick={() => selectSubject(null)}
        >
          Semua Mata Pelajaran
        </Button>
        {subjects.map((subject) => (
          <Button
            key={subject._id}
            variant={selectedSubject === subject._id ? "default" : "outline"}
            size="sm"
            onClick={() => selectSubject(subject._id)}
          >
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: subject.color }}
            />
            {subject.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Mata Pelajaran Saya
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pilih mata pelajaran untuk melihat konten dan progres
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* All Subjects Option */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedSubject === null
              ? 'ring-2 ring-primary shadow-lg'
              : 'hover:border-primary/50'
          }`}
          onClick={() => selectSubject(null)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-purple-600">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Semua Mata Pelajaran</h3>
                  <p className="text-sm text-muted-foreground">
                    Lihat semua konten dari {subjects.length} mata pelajaran
                  </p>
                </div>
              </div>
              {selectedSubject === null && (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subject Cards */}
      <motion.div
        className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {subjects.map((subject) => {
          const progress = subjectProgress[subject._id];
          const isSelected = selectedSubject === subject._id;

          if (viewMode === 'list') {
            return (
              <motion.div key={subject._id} variants={fadeInUp}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => selectSubject(subject._id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-4 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${subject.color}20` }}
                      >
                        <div
                          className="h-8 w-8 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{subject.name}</h3>
                          <Badge className={getCategoryBadgeColor(subject.category)}>
                            {getCategoryLabel(subject.category)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Kode: {subject.code}
                        </p>
                        {progress && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Progress</p>
                              <p className="font-semibold">{progress.masteryPercentage}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Rata-rata</p>
                              <p className="font-semibold">{progress.averageScore}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">XP</p>
                              <p className="font-semibold">{progress.totalXPEarned}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          }

          return (
            <motion.div key={subject._id} variants={scaleIn}>
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg h-full ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => selectSubject(subject._id)}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{subject.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {subject.code}
                      </Badge>
                      <Badge className={`text-xs ${getCategoryBadgeColor(subject.category)}`}>
                        {getCategoryLabel(subject.category)}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress */}
                  {progress && (
                    <>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{progress.masteryPercentage}%</span>
                        </div>
                        <Progress value={progress.masteryPercentage} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Target className="h-3 w-3 text-blue-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">Lessons</p>
                          <p className="text-sm font-semibold">{progress.totalLessonsCompleted}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className="text-sm font-semibold">{progress.averageScore}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">XP</p>
                          <p className="text-sm font-semibold">{progress.totalXPEarned}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
