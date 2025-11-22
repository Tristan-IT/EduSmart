/**
 * Celebration Component
 * Confetti and success animations for achievements
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Trophy, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CelebrationProps {
  show: boolean;
  title?: string;
  message?: string;
  xpGained?: number;
  onComplete?: () => void;
  duration?: number;
}

export function Celebration({
  show,
  title = "Selamat! 🎉",
  message = "Kamu berhasil menyelesaikan tantangan!",
  xpGained = 0,
  onComplete,
  duration = 5000,
}: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Confetti */}
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />

          {/* Success Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsVisible(false);
              onComplete?.();
            }}
          >
            <motion.div
              className="relative max-w-md w-full mx-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Floating icons */}
              <motion.div
                className="absolute -top-10 -left-10"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Trophy className="w-12 h-12 text-warning" />
              </motion.div>

              <motion.div
                className="absolute -top-10 -right-10"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, -360],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Star className="w-10 h-10 text-accent fill-accent" />
              </motion.div>

              <motion.div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2"
                animate={{
                  y: [0, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              >
                <Zap className="w-10 h-10 text-primary fill-primary" />
              </motion.div>

              {/* Main Card */}
              <div className="bg-card border-4 border-primary rounded-2xl shadow-2xl p-8 text-center space-y-6">
                {/* Trophy animation */}
                <motion.div
                  className="inline-flex"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-warning via-yellow-400 to-warning flex items-center justify-center shadow-xl">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {title}
                </motion.h2>

                {/* Message */}
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {message}
                </motion.p>

                {/* XP Gained */}
                {xpGained > 0 && (
                  <motion.div
                    className="inline-flex items-center gap-2 bg-warning/20 text-warning border-2 border-warning rounded-full px-6 py-3 font-bold text-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.4 }}
                  >
                    <Zap className="w-6 h-6 fill-current" />
                    +{xpGained} XP
                  </motion.div>
                )}

                {/* Stars decoration */}
                <motion.div
                  className="flex justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        delay: 0.6 + i * 0.1,
                      }}
                    >
                      <Star className="w-6 h-6 text-warning fill-warning" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Tap to continue */}
                <motion.p
                  className="text-xs text-muted-foreground"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Tap anywhere to continue
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
