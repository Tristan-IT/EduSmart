import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import soundManager from "@/lib/soundManager";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  gemsReward?: number;
  category?: string;
}

interface AchievementUnlockProps {
  achievements: Achievement[];
  onClose: (id: string) => void;
}

export function AchievementUnlock({
  achievements,
  onClose,
}: AchievementUnlockProps) {
  useEffect(() => {
    // Play sound when new achievement appears
    if (achievements.length > 0) {
      soundManager.play("achievement");
    }
  }, [achievements.length]);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            index={index}
            onClose={() => onClose(achievement.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
  onClose: () => void;
}

function AchievementCard({ achievement, index, onClose }: AchievementCardProps) {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 25,
        delay: index * 0.1 
      }}
      className="w-80"
    >
      <div className="relative overflow-hidden rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 shadow-2xl">
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Sparkle Effects */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 10}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </motion.div>
            ))}

            <div className="relative p-4">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="p-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-3 mb-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="text-5xl"
                >
                  {achievement.icon}
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-bold text-base mb-1">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Rewards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20"
              >
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="text-blue-500">⚡</span>
                  <span>+{achievement.xpReward} XP</span>
                </div>
                {achievement.gemsReward && (
                  <>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <span className="text-blue-500">💎</span>
                      <span>+{achievement.gemsReward} Gems</span>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
    </motion.div>
  );
}

/**
 * Show achievement unlock notification with toast (alternative to full component)
 */
export function showAchievementToast(achievement: Achievement) {
  soundManager.play("achievement");
  
  toast.success(
    <div className="flex items-center gap-3">
      <span className="text-3xl">{achievement.icon}</span>
      <div>
        <p className="font-bold">{achievement.title}</p>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
      </div>
    </div>,
    {
      duration: 5000,
    }
  );
}
