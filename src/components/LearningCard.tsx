import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, TrendingUp, Play, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { hoverLift, scaleIn } from "@/lib/animations";

interface LearningCardProps {
  title: string;
  topicId: string;
  estimatedMinutes: number;
  progressPercent: number;
  lastActivity?: string;
  description?: string;
  variant?: 'compact' | 'detail';
  onStart?: () => void;
  className?: string;
  isLocked?: boolean;
  isCompleted?: boolean;
}

export const LearningCard = ({
  title,
  estimatedMinutes,
  progressPercent,
  lastActivity,
  description,
  variant = 'compact',
  onStart,
  className,
  isLocked = false,
  isCompleted = false,
}: LearningCardProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      whileHover={!isLocked ? "hover" : undefined}
      whileTap={!isLocked ? "tap" : undefined}
    >
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300 border-2",
        !isLocked && "hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 cursor-pointer",
        isLocked && "opacity-60 cursor-not-allowed",
        isCompleted && "border-green-500/50 bg-gradient-to-br from-green-500/5 to-transparent",
        className
      )}>
        {/* Gradient overlay on hover */}
        {!isLocked && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/15 via-purple-500/10 to-pink-500/5 opacity-0"
            variants={{
              hover: { opacity: 1 }
            }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="flex flex-col items-center gap-2"
            >
              <div className="p-3 rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Terkunci</span>
            </motion.div>
          </div>
        )}
        
        {/* Completion badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="p-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg"
            >
              <CheckCircle2 className="h-5 w-5 text-white" />
            </motion.div>
          </div>
        )}
        
        {/* Progress indicator */}
        {progressPercent > 0 && !isCompleted && (
          <div className="absolute top-3 right-3 z-10">
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-4 ring-background">
                {Math.round(progressPercent)}%
              </div>
            </motion.div>
          </div>
        )}
        
        <CardHeader className="relative z-10 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <motion.div
              className="p-2 rounded-lg bg-primary/10"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <BookOpen className="h-5 w-5 text-primary" />
            </motion.div>
            <span className={cn(
              "font-semibold",
              isCompleted && "text-green-600 dark:text-green-400"
            )}>
              {title}
            </span>
          </CardTitle>
          {variant === 'detail' && description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          {/* Progress Bar with Glow */}
          <div className="relative">
            <Progress 
              value={progressPercent} 
              className={cn(
                "h-2.5",
                isCompleted && "bg-green-100 dark:bg-green-950"
              )} 
            />
            {progressPercent > 0 && (
              <motion.div
                className={cn(
                  "absolute top-0 left-0 h-full rounded-full",
                  isCompleted 
                    ? "bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-green-600/50"
                    : "bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ filter: "blur(6px)", opacity: 0.6 }}
              />
            )}
          </div>
          
          {/* Info Row */}
          <div className="flex items-center justify-between text-sm">
            <motion.div 
              className="flex items-center gap-1.5 text-muted-foreground"
              whileHover={{ scale: 1.05, x: 3 }}
            >
              <Clock className="w-4 h-4" />
              <span className="font-medium">{estimatedMinutes} menit</span>
            </motion.div>
            {lastActivity && (
              <motion.div 
                className="flex items-center gap-1.5 text-muted-foreground"
                whileHover={{ scale: 1.05, x: -3 }}
              >
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-xs">{lastActivity}</span>
              </motion.div>
            )}
          </div>

          {/* Action Button */}
          {!isLocked && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={onStart}
                className={cn(
                  "w-full shadow-lg group-hover:shadow-xl transition-all",
                  isCompleted 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : progressPercent > 0
                    ? "bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90"
                    : ""
                )}
                variant={progressPercent > 0 || isCompleted ? "default" : "default"}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Ulangi Lesson
                  </>
                ) : progressPercent > 0 ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Lanjutkan Belajar
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Mulai Belajar
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
