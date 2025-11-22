import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, Lock, CheckCircle, Zap } from "lucide-react";
import type { SkillTreeNode } from "./EnhancedSkillTree";

interface NodeTooltipProps {
  node: SkillTreeNode;
  userProgress?: {
    status: string;
    progress: number;
    stars: number;
    lessonViewed?: boolean;
  };
  children: React.ReactNode;
}

export function NodeTooltip({ node, userProgress, children }: NodeTooltipProps) {
  const status = userProgress?.status || node.status || "locked";
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const stars = userProgress?.stars || node.stars || 0;

  // @ts-ignore - hasLesson might not be in type yet
  const hasLesson = node.hasLesson || false;
  const lessonViewed = userProgress?.lessonViewed || false;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="w-80 p-4 bg-white shadow-xl border-2"
          sideOffset={10}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="text-3xl">{node.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-base mb-1">{node.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {node.description}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            {isCompleted && stars > 0 && (
              <div className="flex items-center gap-1 p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= stars
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-green-700 ml-1">
                  Selesai
                </span>
              </div>
            )}

            {isLocked && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">
                  Terkunci
                </span>
              </div>
            )}

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{node.estimatedMinutes} min</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{node.quizCount} soal</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span className="font-semibold text-yellow-700">
                  +{node.rewards.xp} XP
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge
                  variant="outline"
                  className={
                    node.difficulty === "Mudah"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : node.difficulty === "Sedang"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {node.difficulty}
                </Badge>
              </div>
            </div>

            {/* Lesson Status */}
            {hasLesson && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs text-blue-700">
                  {lessonViewed ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Materi sudah dilihat
                    </span>
                  ) : (
                    "Ada materi pembelajaran"
                  )}
                </span>
              </div>
            )}

            {/* Learning Objectives Preview */}
            {/* @ts-ignore */}
            {node.learningOutcomes && node.learningOutcomes.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                  Tujuan Pembelajaran:
                </p>
                <ul className="space-y-1">
                  {/* @ts-ignore */}
                  {node.learningOutcomes.slice(0, 2).map((outcome: string, index: number) => (
                    <li key={index} className="flex items-start gap-1.5 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{outcome}</span>
                    </li>
                  ))}
                  {/* @ts-ignore */}
                  {node.learningOutcomes.length > 2 && (
                    <li className="text-xs text-muted-foreground ml-4">
                      {/* @ts-ignore */}
                      +{node.learningOutcomes.length - 2} lainnya...
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Klik untuk melihat detail lengkap
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
