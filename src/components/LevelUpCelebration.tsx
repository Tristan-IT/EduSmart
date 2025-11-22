import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Trophy, Star, Sparkles, Zap, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import soundManager from "@/lib/soundManager";

interface LevelUpCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  xpToNextLevel: number;
  currentXPInLevel: number;
}

export function LevelUpCelebration({
  isOpen,
  onClose,
  newLevel,
  xpToNextLevel,
  currentXPInLevel,
}: LevelUpCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      
      // Play level up sound
      soundManager.play("level-up");
      
      // Animate progress bar
      setTimeout(() => {
        setAnimateProgress((currentXPInLevel / xpToNextLevel) * 100);
      }, 500);
      
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentXPInLevel, xpToNextLevel]);

  const getLevelRewards = (level: number) => {
    // Define rewards per level
    if (level % 10 === 0) return { gems: 100, description: "Bonus Besar!" };
    if (level % 5 === 0) return { gems: 50, description: "Milestone!" };
    return { gems: 25, description: "Terus Belajar!" };
  };

  const rewards = getLevelRewards(newLevel);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
          gravity={0.3}
        />
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold">
              Level Up! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Selamat! Kamu naik level!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl border-4 border-white">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white/80">Level</p>
                    <p className="text-5xl font-bold text-white">{newLevel}</p>
                  </div>
                </div>
              </div>

              {/* Sparkles around badge */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${50 + Math.cos((i * Math.PI * 2) / 6) * 80}px`,
                    top: `${50 + Math.sin((i * Math.PI * 2) / 6) * 80}px`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </motion.div>
              ))}
            </motion.div>

            {/* Rewards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Reward:</span>
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  {rewards.description}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">
                  +{rewards.gems} Gems
                </span>
              </div>
            </motion.div>

            {/* XP Progress to Next Level */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress ke Level {newLevel + 1}</span>
                <span className="text-muted-foreground">
                  {currentXPInLevel} / {xpToNextLevel} XP
                </span>
              </div>
              <Progress value={animateProgress} className="h-3" />
            </div>

            {/* Motivational Stats */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 text-center"
              >
                <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Terus</p>
                <p className="text-sm font-bold text-green-600">Berkembang!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-200 text-center"
              >
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Kamu</p>
                <p className="text-sm font-bold text-yellow-600">Luar Biasa!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 text-center"
              >
                <Zap className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Tetap</p>
                <p className="text-sm font-bold text-purple-600">Semangat!</p>
              </motion.div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Lanjutkan Belajar!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
