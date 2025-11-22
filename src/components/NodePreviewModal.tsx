import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Clock,
  Star,
  Trophy,
  Lock,
  CheckCircle,
  Target,
  Zap,
  Gem,
  Heart,
  Play,
  Eye,
  Award,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import type { SkillTreeNode } from "./EnhancedSkillTree";

interface NodePreviewModalProps {
  node: SkillTreeNode | null;
  isOpen: boolean;
  onClose: () => void;
  onViewLesson?: () => void;
  onStartQuiz?: () => void;
  userProgress?: {
    status: string;
    progress: number;
    stars: number;
    lessonViewed?: boolean;
    bestScore?: number;
    attempts?: number;
  };
}

export function NodePreviewModal({
  node,
  isOpen,
  onClose,
  onViewLesson,
  onStartQuiz,
  userProgress,
}: NodePreviewModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!node) return null;

  const status = userProgress?.status || node.status || "locked";
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const stars = userProgress?.stars || node.stars || 0;
  const progress = userProgress?.progress || node.progress || 0;

  // @ts-ignore - hasLesson might not be in type yet
  const hasLesson = node.hasLesson || false;
  const lessonViewed = userProgress?.lessonViewed || false;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Sulit":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "available":
        return "text-orange-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{node.name}</DialogTitle>
              <DialogDescription className="text-base">
                {node.description}
              </DialogDescription>
            </div>
            <div className="text-4xl">{node.icon}</div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 pt-3">
            <Badge className={getDifficultyColor(node.difficulty)}>
              {node.difficulty}
            </Badge>
            <Badge variant="outline">
              <GraduationCap className="w-3 h-3 mr-1" />
              {node.gradeLevel} Kelas {node.classNumber}
            </Badge>
            <Badge variant="outline">
              Semester {node.semester}
            </Badge>
            {node.kompetensiDasar && (
              <Badge variant="outline">KD: {node.kompetensiDasar}</Badge>
            )}
            {node.isCheckpoint && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Trophy className="w-3 h-3 mr-1" />
                Checkpoint
              </Badge>
            )}
            {hasLesson && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <BookOpen className="w-3 h-3 mr-1" />
                Ada Materi
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Progress Bar (if in progress or completed) */}
        {!isLocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className={getStatusColor(status)}>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {isCompleted && stars > 0 && (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {stars}/3 bintang
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Learning Objectives */}
            {/* @ts-ignore - learningOutcomes might not be in type */}
            {node.learningOutcomes && node.learningOutcomes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Tujuan Pembelajaran
                </h4>
                <ul className="space-y-1.5 ml-6">
                  {/* @ts-ignore */}
                  {node.learningOutcomes.map((outcome: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Durasi</p>
                  <p className="font-semibold">{node.estimatedMinutes} menit</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Soal Quiz</p>
                  <p className="font-semibold">{node.quizCount} soal</p>
                </div>
              </div>
            </div>

            {/* Lesson Status */}
            {hasLesson && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Materi Pembelajaran Tersedia
                    </h4>
                    <p className="text-sm text-blue-700">
                      {lessonViewed
                        ? "✓ Kamu sudah melihat materi ini"
                        : "Lihat materi pembelajaran sebelum mengerjakan quiz"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {node.prerequisites && node.prerequisites.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  Prerequisites
                </h4>
                <div className="flex flex-wrap gap-2">
                  {node.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4 mt-4">
            <div className="grid gap-3">
              {/* XP Reward */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">XP</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      +{node.rewards.xp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gems Reward */}
              {node.rewards.gems > 0 && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Gem className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gems</p>
                      <p className="text-2xl font-bold text-blue-700">
                        +{node.rewards.gems}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hearts Reward */}
              {node.rewards.hearts && node.rewards.hearts > 0 && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hearts</p>
                      <p className="text-2xl font-bold text-red-700">
                        +{node.rewards.hearts}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Badge Reward */}
              {node.rewards.badge && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Badge</p>
                      <p className="font-semibold text-purple-700">
                        {node.rewards.badge}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Certificate */}
              {node.rewards.certificate && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sertifikat</p>
                      <p className="font-semibold text-green-700">
                        {node.rewards.certificate}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4 mt-4">
            {isLocked ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Node ini masih terkunci</p>
                <p className="text-sm mt-1">
                  Selesaikan prerequisites untuk membuka
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Best Score */}
                {userProgress?.bestScore !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Skor Terbaik</span>
                    <span className="text-lg font-bold text-primary">
                      {userProgress.bestScore}%
                    </span>
                  </div>
                )}

                {/* Attempts */}
                {userProgress?.attempts !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Percobaan</span>
                    <span className="text-lg font-bold">
                      {userProgress.attempts}x
                    </span>
                  </div>
                )}

                {/* Lesson Status */}
                {hasLesson && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Materi</span>
                    <Badge
                      variant={lessonViewed ? "default" : "outline"}
                      className={lessonViewed ? "bg-green-500" : ""}
                    >
                      {lessonViewed ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Sudah Dilihat
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Belum Dilihat
                        </>
                      )}
                    </Badge>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant="outline"
                    className={
                      isCompleted
                        ? "bg-green-100 text-green-800 border-green-200"
                        : status === "in-progress"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-orange-100 text-orange-800 border-orange-200"
                    }
                  >
                    {isCompleted
                      ? "Selesai"
                      : status === "in-progress"
                      ? "Sedang Berjalan"
                      : "Tersedia"}
                  </Badge>
                </div>

                {/* Level */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Level Node</span>
                  <span className="text-lg font-bold">Level {node.level}</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          {isLocked ? (
            <Button disabled className="flex-1" variant="outline">
              <Lock className="w-4 h-4 mr-2" />
              Terkunci
            </Button>
          ) : (
            <>
              {hasLesson && !lessonViewed && onViewLesson && (
                <Button
                  onClick={onViewLesson}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lihat Materi
                </Button>
              )}
              {onStartQuiz && (!hasLesson || lessonViewed) && (
                <Button
                  onClick={onStartQuiz}
                  className="flex-1 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isCompleted ? "Ulangi Quiz" : "Mulai Quiz"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
