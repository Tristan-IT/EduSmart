import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Star, Trophy, Sparkles, Gem, Zap, ArrowRight, Lock, Unlock } from "lucide-react";
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
import { toast } from "sonner";

interface ModuleCompletionProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  score: number; // Percentage (0-100)
  stars: number; // 0-3
  xpEarned: number;
  gemsEarned: number;
  unlockedNodes?: string[]; // Node IDs that were unlocked
  isNewBestScore?: boolean;
  previousBestScore?: number;
}

export function ModuleCompletion({
  isOpen,
  onClose,
  moduleTitle,
  score,
  stars,
  xpEarned,
  gemsEarned,
  unlockedNodes = [],
  isNewBestScore = false,
  previousBestScore = 0,
}: ModuleCompletionProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(0);

  useEffect(() => {
    if (isOpen && stars > 0) {
      setShowConfetti(true);
      // Animate progress bar
      setTimeout(() => setAnimateProgress(score), 100);
      
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, stars, score]);

  const getStarColor = (starIndex: number) => {
    if (starIndex < stars) {
      return "text-yellow-500 fill-yellow-500";
    }
    return "text-gray-300";
  };

  const getPerformanceMessage = () => {
    if (score >= 95) return { text: "Sempurna! 🏆", color: "text-yellow-500" };
    if (score >= 90) return { text: "Luar Biasa! 🌟", color: "text-yellow-500" };
    if (score >= 75) return { text: "Bagus Sekali! 👏", color: "text-green-500" };
    if (score >= 60) return { text: "Cukup Baik! 👍", color: "text-blue-500" };
    return { text: "Tetap Semangat! 💪", color: "text-orange-500" };
  };

  const performanceMsg = getPerformanceMessage();

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={stars >= 3 ? 500 : stars >= 2 ? 300 : 150}
          gravity={0.3}
        />
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              {stars > 0 ? "Modul Selesai! 🎉" : "Belum Berhasil"}
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              {moduleTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Stars Display */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center justify-center gap-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: i * 0.15,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <Star className={`h-12 w-12 ${getStarColor(i)}`} />
                </motion.div>
              ))}
            </motion.div>

            {/* Performance Message */}
            <div className="text-center">
              <p className={`text-xl font-bold ${performanceMsg.color}`}>
                {performanceMsg.text}
              </p>
              <p className="text-3xl font-bold mt-2">{score}%</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Score</span>
                <span>{animateProgress.toFixed(0)}%</span>
              </div>
              <Progress value={animateProgress} className="h-3" />
              {isNewBestScore && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-sm text-green-600"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Best Score Baru! (sebelumnya: {previousBestScore}%)</span>
                </motion.div>
              )}
            </div>

            {/* Rewards */}
            <div className="grid grid-cols-2 gap-3">
              {/* XP Earned */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">XP</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">+{xpEarned}</p>
              </motion.div>

              {/* Gems Earned */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Gem className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Gems</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">+{gemsEarned}</p>
              </motion.div>
            </div>

            {/* Unlocked Nodes */}
            {unlockedNodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-700">
                    Modul Baru Terbuka!
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unlockedNodes.map((nodeId, i) => (
                    <motion.div
                      key={nodeId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <Badge variant="outline" className="bg-green-50">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {nodeId}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Failed Message */}
            {stars === 0 && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold text-orange-700">
                    Belum Mencapai Target
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Minimal score 60% untuk mendapat bintang. Coba lagi untuk unlock
                  modul berikutnya!
                </p>
              </div>
            )}

            {/* Star Requirements */}
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium mb-2">Syarat Bintang:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> 1 Bintang
                  </span>
                  <span>60% - 74%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <Star className="h-3 w-3" /> 2 Bintang
                  </span>
                  <span>75% - 89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <Star className="h-3 w-3" />
                    <Star className="h-3 w-3" /> 3 Bintang
                  </span>
                  <span>90% - 100%</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {stars > 0 ? (
                <>
                  Lanjutkan Belajar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Coba Lagi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
