import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Star, Sparkles, Zap, Trophy, ArrowRight } from "lucide-react";
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
import { useEffect, useState } from "react";

interface LevelUpProps {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
  totalXP: number;
  xpForNextLevel: number;
  rewards?: {
    gems?: number;
    unlocks?: string[];
  };
}

export function LevelUp({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  totalXP,
  xpForNextLevel,
  rewards,
}: LevelUpProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateXP, setAnimateXP] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Animate XP bar
      setTimeout(() => setAnimateXP((totalXP % xpForNextLevel) / xpForNextLevel * 100), 100);
      
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, totalXP, xpForNextLevel]);

  const getLevelRewards = (level: number) => {
    // Define rewards for each level
    const rewardMap: Record<number, { gems: number; unlocks: string[] }> = {
      2: { gems: 10, unlocks: ["Daily Goals"] },
      3: { gems: 15, unlocks: ["Streak Freeze"] },
      5: { gems: 25, unlocks: ["Hearts System"] },
      7: { gems: 50, unlocks: ["League System"] },
      10: { gems: 100, unlocks: ["Power-Ups Shop"] },
    };
    return rewardMap[level] || { gems: level * 5, unlocks: [] };
  };

  const levelRewards = rewards || getLevelRewards(newLevel);

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
        <DialogContent className="max-w-md overflow-hidden">
          {/* Background gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20" />
          
          {/* Floating sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -60],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </motion.div>
            ))}
          </div>

          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl font-bold">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex items-center justify-center gap-2 mb-2"
                >
                  <Trophy className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Level Up!
                  </span>
                  <Trophy className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                </motion.div>
              </DialogTitle>
              <DialogDescription className="text-center text-lg">
                Selamat! Kamu naik level!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {/* Level Display */}
              <div className="flex items-center justify-center gap-8">
                {/* Old Level */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {oldLevel}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Level Lama</p>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="h-8 w-8 text-yellow-500" />
                </motion.div>

                {/* New Level */}
                <motion.div
                  initial={{ x: 50, opacity: 0, scale: 0 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-center relative"
                >
                  {/* Pulsing glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-yellow-500/50 blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                    {newLevel}
                  </div>
                  <p className="text-xs font-semibold text-yellow-600 mt-2">Level Baru!</p>
                </motion.div>
              </div>

              {/* XP Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress ke Level {newLevel + 1}</span>
                  <span className="font-medium">
                    {totalXP % xpForNextLevel} / {xpForNextLevel} XP
                  </span>
                </div>
                <Progress value={animateXP} className="h-3" />
              </div>

              {/* Rewards */}
              {(levelRewards.gems > 0 || levelRewards.unlocks.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">Hadiah Level {newLevel}:</span>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Gems reward */}
                    {levelRewards.gems > 0 && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          <strong>+{levelRewards.gems} Gems</strong>
                        </span>
                      </div>
                    )}
                    
                    {/* Unlocks */}
                    {levelRewards.unlocks.map((unlock, i) => (
                      <motion.div
                        key={unlock}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">
                          <strong>{unlock}</strong> terbuka!
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Motivational Message */}
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground italic">
                  "Terus belajar untuk unlock lebih banyak fitur! 🚀"
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                Lanjutkan Belajar
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
