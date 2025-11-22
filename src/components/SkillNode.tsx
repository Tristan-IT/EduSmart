/**
 * SkillNode Component - Individual node in the skill tree
 * Duolingo-style animated nodes with 4 states
 */

import { motion } from "framer-motion";
import { Lock, Star, CheckCircle2, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NodeStatus } from "@/data/skillTree";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillNodeProps {
  id: string;
  title: string;
  categoryName: string;
  status: NodeStatus;
  stars: number;
  xpReward: number;
  isCheckpoint: boolean;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  onClick?: () => void;
  position: { x: number; y: number };
  description?: string;
}

export function SkillNode({
  title,
  categoryName,
  status,
  stars,
  xpReward,
  isCheckpoint,
  difficulty,
  onClick,
  description,
}: SkillNodeProps) {
  
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isInProgress = status === 'in-progress';
  const isCompleted = status === 'completed';

  // Category colors
  const categoryColors = {
    'Aljabar': { bg: 'from-blue-500 to-blue-700', border: 'border-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-100 dark:bg-blue-950/20' },
    'Geometri': { bg: 'from-green-500 to-green-700', border: 'border-green-500', text: 'text-green-600', bgLight: 'bg-green-100 dark:bg-green-950/20' },
    'Kalkulus': { bg: 'from-purple-500 to-purple-700', border: 'border-purple-500', text: 'text-purple-600', bgLight: 'bg-purple-100 dark:bg-purple-950/20' },
    'Statistika': { bg: 'from-orange-500 to-orange-700', border: 'border-orange-500', text: 'text-orange-600', bgLight: 'bg-orange-100 dark:bg-orange-950/20' },
    'Trigonometri': { bg: 'from-pink-500 to-pink-700', border: 'border-pink-500', text: 'text-pink-600', bgLight: 'bg-pink-100 dark:bg-pink-950/20' },
    'Logika': { bg: 'from-indigo-500 to-indigo-700', border: 'border-indigo-500', text: 'text-indigo-600', bgLight: 'bg-indigo-100 dark:bg-indigo-950/20' },
  };

  const colors = categoryColors[categoryName as keyof typeof categoryColors] || categoryColors['Aljabar'];

  // Node size based on checkpoint status
  const nodeSize = isCheckpoint ? 'w-28 h-28' : 'w-20 h-20';
  const iconSize = isCheckpoint ? 'w-10 h-10' : 'w-7 h-7';

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={!isLocked ? onClick : undefined}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            whileHover={!isLocked ? { scale: 1.05 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
          >
            {/* Main Node Circle */}
            <div className="relative">
              {/* Glow effect for checkpoint */}
              {isCheckpoint && !isLocked && (
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-full blur-xl opacity-50",
                    `bg-gradient-to-br ${colors.bg}`
                  )}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Node Circle */}
              <motion.div
                className={cn(
                  nodeSize,
                  "rounded-full relative z-10 flex items-center justify-center border-4",
                  "transition-all duration-300",
                  {
                    // Locked state
                    'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600': isLocked,
                    // Current state
                    [`bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg`]: isCurrent,
                    // In Progress state
                    [`bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ring-4 ring-yellow-400`]: isInProgress,
                    // Completed state
                    'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-500 shadow-xl': isCompleted,
                  }
                )}
                animate={
                  isCurrent || isInProgress
                    ? { scale: [1, 1.05, 1] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Icon based on status */}
                {isLocked && <Lock className={cn(iconSize, "text-gray-500")} />}
                {isCurrent && <Play className={cn(iconSize, "text-white fill-white")} />}
                {isInProgress && <Sparkles className={cn(iconSize, "text-white")} />}
                {isCompleted && <CheckCircle2 className={cn(iconSize, "text-white fill-white")} />}

                {/* Checkpoint crown */}
                {isCheckpoint && !isLocked && (
                  <motion.div
                    className="absolute -top-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold shadow-md"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    👑
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Node Info */}
            <motion.div
              className="mt-2 text-center max-w-[140px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3
                className={cn(
                  "font-bold text-xs leading-tight mb-1",
                  {
                    'text-gray-500 dark:text-gray-400': isLocked,
                    'text-foreground': !isLocked,
                  }
                )}
              >
                {title}
              </h3>

              {/* Stars display - centered below title */}
              {isCompleted && stars > 0 && (
                <motion.div
                  className="flex gap-0.5 justify-center mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < stars
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      )}
                    />
                  ))}
                </motion.div>
              )}

              {/* Category badge */}
              <div
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full inline-block",
                  {
                    'bg-gray-200 dark:bg-gray-700 text-gray-500': isLocked,
                    [colors.bgLight + ' ' + colors.text]: !isLocked,
                  }
                )}
              >
                {categoryName}
              </div>

              {/* XP Reward - only show for non-locked */}
              {!isLocked && (
                <div className="text-[10px] font-bold text-primary flex items-center justify-center gap-1 mt-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {xpReward} XP
                </div>
              )}
            </motion.div>

            {/* Click hint animation for current node */}
            {isCurrent && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          className="max-w-xs p-4 bg-card border-2"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">{title}</h4>
              {isCheckpoint && <span className="text-xs">👑</span>}
            </div>
            
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            
            <div className="flex items-center gap-3 text-xs">
              <div className={cn("px-2 py-0.5 rounded-full", colors.bgLight, colors.text)}>
                {categoryName}
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded-full",
                {
                  'bg-green-100 dark:bg-green-950/20 text-green-700': difficulty === 'Mudah',
                  'bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700': difficulty === 'Sedang',
                  'bg-red-100 dark:bg-red-950/20 text-red-700': difficulty === 'Sulit',
                }
              )}>
                {difficulty}
              </div>
            </div>

            {!isLocked && (
              <div className="flex items-center gap-1 text-xs text-primary font-bold">
                <Sparkles className="w-3 h-3" />
                Reward: {xpReward} XP
              </div>
            )}

            {isCompleted && stars > 0 && (
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < stars
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            )}

            <p className="text-xs border-t pt-2">
              {isLocked && "🔒 Selesaikan node sebelumnya untuk unlock"}
              {isCurrent && "✨ Siap dimulai! Klik untuk belajar"}
              {isInProgress && "🎯 Lanjutkan pembelajaran!"}
              {isCompleted && "✅ Selesai! Kamu hebat!"}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
