import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Zap, 
  Gift, 
  Heart, 
  Award, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

interface Rewards {
  xp: number;
  gems: number;
  hearts?: number;
  badge?: string;
  certificate?: string;
  stars: number;
  levelUp?: boolean;
  newLevel?: number;
}

interface UserStats {
  totalXP: number;
  level: number;
  gems: number;
  hearts: number;
  badges: string[];
  certificates: string[];
}

interface NextNode {
  nodeId: string;
  name: string;
  subject: string;
  level: number;
  difficulty: string;
}

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: Rewards;
  userStats: UserStats;
  nextRecommendations?: NextNode[];
  onContinue?: () => void;
  nodeName?: string;
}

export default function RewardsModal({
  isOpen,
  onClose,
  rewards,
  userStats,
  nextRecommendations = [],
  onContinue,
  nodeName = "Quiz"
}: RewardsModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStarColor = (index: number) => {
    if (index < rewards.stars) return "text-yellow-500";
    return "text-gray-300";
  };

  const xpToNextLevel = (userStats.level + 1) * 1000;
  const xpProgress = (userStats.totalXP % 1000) / 1000 * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            {rewards.levelUp ? "Level Up! 🎉" : "Selamat! 🎊"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Completion Message */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              Kamu telah menyelesaikan <span className="font-semibold text-foreground">{nodeName}</span>
            </p>
          </div>

          {/* Stars Display */}
          <div className="flex justify-center items-center gap-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
              >
                <Star
                  className={`w-16 h-16 ${getStarColor(index)}`}
                  fill={index < rewards.stars ? "currentColor" : "none"}
                />
              </motion.div>
            ))}
          </div>

          {/* Level Up Banner */}
          {rewards.levelUp && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg text-center"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-2xl font-bold mb-1">Level Naik!</h3>
              <p className="text-lg">Kamu sekarang Level {rewards.newLevel}</p>
            </motion.div>
          )}

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* XP Reward */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">+{rewards.xp}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">XP</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Gems Reward */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
                <CardContent className="p-4 text-center">
                  <Gift className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">+{rewards.gems}</p>
                  <p className="text-sm text-purple-600 dark:text-purple-300">Gems</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hearts Reward (if checkpoint) */}
            {rewards.hearts && rewards.hearts > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" fill="currentColor" />
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">+{rewards.hearts}</p>
                    <p className="text-sm text-red-600 dark:text-red-300">Hearts</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Badge Reward (if checkpoint) */}
            {rewards.badge && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 line-clamp-2">
                      {rewards.badge}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-300">Badge Unlocked!</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Certificate Notification */}
          {rewards.certificate && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 p-4 rounded-lg border-2 border-green-300"
            >
              <div className="flex items-center gap-3">
                <Award className="w-10 h-10 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-400">Sertifikat Diperoleh!</p>
                  <p className="text-sm text-green-600 dark:text-green-300">{rewards.certificate}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Level Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Level {userStats.level}
              </span>
              <span className="text-muted-foreground">
                {userStats.totalXP % 1000} / 1000 XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
              />
            </div>
          </div>

          {/* Current Stats Summary */}
          <div className="grid grid-cols-4 gap-3 pt-4 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="text-lg font-bold">{userStats.level}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total XP</p>
              <p className="text-lg font-bold">{userStats.totalXP.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Gems</p>
              <p className="text-lg font-bold text-purple-600">{userStats.gems}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Hearts</p>
              <p className="text-lg font-bold text-red-600">{userStats.hearts}</p>
            </div>
          </div>

          {/* Next Recommendations */}
          {nextRecommendations.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Lanjutkan Belajar
              </h3>
              <div className="space-y-2">
                {nextRecommendations.slice(0, 3).map((node, idx) => (
                  <motion.div
                    key={node.nodeId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <div>
                            <p className="font-medium text-sm">{node.name}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                Level {node.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {node.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={onContinue || onClose} className="flex items-center gap-2">
            Lanjut Belajar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
