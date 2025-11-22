import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Achievement } from "@/data/gamificationData";
import { motion } from "framer-motion";
import { hoverLift, scaleIn } from "@/lib/animations";

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
  className?: string;
  rarity?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const AchievementCard = ({ 
  achievement, 
  onClick, 
  className,
  rarity = achievement.xpReward >= 500 ? 'gold' : achievement.xpReward >= 300 ? 'silver' : 'bronze'
}: AchievementCardProps) => {
  const hasProgress = achievement.progress !== undefined && achievement.total !== undefined;
  const progressPercent = hasProgress 
    ? (achievement.progress! / achievement.total!) * 100 
    : 0;

  const rarityConfig = {
    bronze: {
      gradient: 'from-amber-700 via-amber-500 to-amber-700',
      glow: 'shadow-amber-500/50',
      border: 'border-amber-500/50',
      icon: 'text-amber-600',
    },
    silver: {
      gradient: 'from-gray-400 via-gray-200 to-gray-400',
      glow: 'shadow-gray-400/50',
      border: 'border-gray-400/50',
      icon: 'text-gray-500',
    },
    gold: {
      gradient: 'from-yellow-600 via-yellow-400 to-yellow-600',
      glow: 'shadow-yellow-500/50',
      border: 'border-yellow-500/50',
      icon: 'text-yellow-500',
    },
    platinum: {
      gradient: 'from-cyan-400 via-blue-400 to-purple-500',
      glow: 'shadow-blue-500/50',
      border: 'border-blue-500/50',
      icon: 'text-blue-400',
    },
  };

  const config = rarityConfig[rarity];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      whileHover="hover"
      whileTap="tap"
    >
      <Card 
        className={cn(
          "group relative overflow-hidden transition-all duration-300 cursor-pointer",
          achievement.unlocked 
            ? cn("hover:shadow-xl border-2", config.border, config.glow, "bg-gradient-to-br from-primary/5 to-accent/5") 
            : "opacity-60 hover:opacity-80 border-dashed",
          className
        )}
        onClick={onClick}
      >
        {/* Rarity indicator strip */}
        {achievement.unlocked && (
          <motion.div 
            className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", config.gradient)}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        )}
        
        {/* Animated sparkles for unlocked achievements */}
        {achievement.unlocked && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <div className={cn("absolute top-2 right-2 w-2 h-2 rounded-full", config.gradient)} />
            <div className={cn("absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full", config.gradient)} />
            <div className={cn("absolute top-1/2 right-1/4 w-1 h-1 rounded-full", config.gradient)} />
          </motion.div>
        )}

        {!achievement.unlocked && (
          <motion.div 
            className="absolute top-3 right-3"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            <Lock className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        )}
        
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <motion.div 
              className={cn(
                "text-4xl transition-all duration-300 relative",
                achievement.unlocked ? "" : "grayscale"
              )}
              variants={{
                hover: { scale: 1.2, rotate: [0, -5, 5, -5, 0] }
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {achievement.icon}
              {achievement.unlocked && (
                <motion.div
                  className={cn("absolute -top-1 -right-1")}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <Award className={cn("w-4 h-4", config.icon)} />
                </motion.div>
              )}
            </motion.div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold flex items-center gap-2">
                {achievement.title}
                {achievement.unlocked && rarity === 'gold' && (
                  <Badge variant="secondary" className={cn("text-xs", config.gradient, "text-white")}>
                    Langka
                  </Badge>
                )}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {achievement.description}
              </p>
            </div>
          </div>

        {hasProgress && !achievement.unlocked && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{achievement.progress}/{achievement.total}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
          >
            <Badge 
              variant={achievement.unlocked ? "default" : "secondary"}
              className={cn(
                "flex items-center gap-1",
                achievement.unlocked && cn("bg-gradient-to-r", config.gradient, "text-white")
              )}
            >
              <Zap className="w-3 h-3" />
              +{achievement.xpReward} XP
            </Badge>
          </motion.div>
          {achievement.unlocked && achievement.unlockedAt && (
            <motion.span 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {new Date(achievement.unlockedAt).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </motion.span>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};
