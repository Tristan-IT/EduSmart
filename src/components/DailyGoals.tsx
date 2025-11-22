import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Flame, Sparkles, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";

export interface DailyGoal {
  target: number;
  current: number;
  lastUpdated: string; // ISO date string
  claimed: boolean;
  streak: number;
}

interface DailyGoalsProps {
  userId: string;
  currentXP?: number;
  onClaim?: (reward: { xp: number; gems: number }) => void;
  onTargetChange?: (newTarget: number) => void;
  compact?: boolean;
}

const TARGET_OPTIONS = [
  { value: 10, label: "Casual", desc: "10 XP", color: "bg-green-500" },
  { value: 20, label: "Regular", desc: "20 XP", color: "bg-blue-500" },
  { value: 50, label: "Serious", desc: "50 XP", color: "bg-purple-500" },
  { value: 100, label: "Intense", desc: "100 XP", color: "bg-red-500" },
];

const REWARDS = {
  10: { xp: 5, gems: 1 },
  20: { xp: 10, gems: 2 },
  50: { xp: 25, gems: 5 },
  100: { xp: 50, gems: 10 },
};

export function DailyGoals({ 
  userId, 
  currentXP = 0, 
  onClaim, 
  onTargetChange,
  compact = false 
}: DailyGoalsProps) {
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({
    target: 50,
    current: 0,
    lastUpdated: new Date().toISOString(),
    claimed: false,
    streak: 0,
  });

  const [showTargetSelector, setShowTargetSelector] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`daily_goal_${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Check if it's a new day
      const lastDate = new Date(parsed.lastUpdated);
      const today = new Date();
      const isNewDay = lastDate.toDateString() !== today.toDateString();

      if (isNewDay) {
        // Reset for new day
        setDailyGoal({
          target: parsed.target,
          current: 0,
          lastUpdated: today.toISOString(),
          claimed: false,
          streak: parsed.claimed ? parsed.streak : Math.max(0, parsed.streak - 1), // Lose streak if not claimed
        });
      } else {
        setDailyGoal(parsed);
      }
    }
  }, [userId]);

  // Update current XP from parent
  useEffect(() => {
    if (currentXP > 0) {
      setDailyGoal(prev => {
        const newCurrent = Math.min(prev.current + currentXP, prev.target);
        const updated = { ...prev, current: newCurrent };
        localStorage.setItem(`daily_goal_${userId}`, JSON.stringify(updated));
        return updated;
      });
    }
  }, [currentXP, userId]);

  // Window size for confetti
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const progressPercent = (dailyGoal.current / dailyGoal.target) * 100;
  const isComplete = dailyGoal.current >= dailyGoal.target;
  const canClaim = isComplete && !dailyGoal.claimed;

  const handleTargetChange = (newTarget: number) => {
    // Can only change if goal not started
    if (dailyGoal.current === 0 || dailyGoal.current >= dailyGoal.target) {
      const updated = { ...dailyGoal, target: newTarget, current: 0, claimed: false };
      setDailyGoal(updated);
      localStorage.setItem(`daily_goal_${userId}`, JSON.stringify(updated));
      setShowTargetSelector(false);
      onTargetChange?.(newTarget);
    }
  };

  const handleClaim = () => {
    if (!canClaim) return;

    const reward = REWARDS[dailyGoal.target as keyof typeof REWARDS] || REWARDS[50];
    const newStreak = dailyGoal.streak + 1;

    const updated = {
      ...dailyGoal,
      claimed: true,
      streak: newStreak,
    };

    setDailyGoal(updated);
    localStorage.setItem(`daily_goal_${userId}`, JSON.stringify(updated));
    
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);

    onClaim?.(reward);
  };

  if (compact) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Target Harian</span>
            </div>
            {isComplete && (
              <Badge variant="default" className="bg-green-500">
                <Check className="h-3 w-3 mr-1" />
                Selesai
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progres</span>
              <span>{dailyGoal.current}/{dailyGoal.target} XP</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn(
        "border-2 transition-all",
        isComplete ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-primary/20"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-lg",
                isComplete ? "bg-green-500" : "bg-primary/10"
              )}>
                <Target className={cn(
                  "h-5 w-5",
                  isComplete ? "text-white" : "text-primary"
                )} />
              </div>
              <div>
                <CardTitle className="text-lg">Target Harian</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Raih XP untuk pertahankan streak! 🔥
                </CardDescription>
              </div>
            </div>
            {dailyGoal.streak > 0 && (
              <Badge variant="outline" className="border-orange-500 text-orange-500">
                <Flame className="h-3 w-3 mr-1" />
                {dailyGoal.streak} hari
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Target Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Target XP Hari Ini</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTargetSelector(!showTargetSelector)}
                disabled={dailyGoal.current > 0 && dailyGoal.current < dailyGoal.target}
                className="h-7 text-xs"
              >
                {dailyGoal.target} XP
                <ChevronDown className={cn(
                  "h-3 w-3 ml-1 transition-transform",
                  showTargetSelector && "rotate-180"
                )} />
              </Button>
            </div>

            <AnimatePresence>
              {showTargetSelector && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {TARGET_OPTIONS.map(option => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleTargetChange(option.value)}
                        className={cn(
                          "p-3 rounded-lg border-2 text-left transition-all",
                          dailyGoal.target === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={cn("w-2 h-2 rounded-full", option.color)} />
                          <span className="text-sm font-semibold">{option.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{option.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progres Hari Ini</span>
              <span className="font-semibold">
                {dailyGoal.current}/{dailyGoal.target} XP
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={progressPercent} 
                className={cn(
                  "h-3",
                  isComplete && "bg-green-200"
                )}
              />
              {isComplete && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Rewards Info */}
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reward:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold">
                    +{REWARDS[dailyGoal.target as keyof typeof REWARDS]?.xp || 25} XP
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                  <span className="font-semibold">
                    +{REWARDS[dailyGoal.target as keyof typeof REWARDS]?.gems || 5} Gems
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <Button
            onClick={handleClaim}
            disabled={!canClaim}
            className={cn(
              "w-full",
              canClaim && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            )}
            size="lg"
          >
            {dailyGoal.claimed ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Sudah Diklaim Hari Ini
              </>
            ) : canClaim ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Klaim Reward!
              </>
            ) : (
              <>
                Selesaikan {dailyGoal.target - dailyGoal.current} XP lagi
              </>
            )}
          </Button>

          {/* Streak Info */}
          {dailyGoal.streak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-xs text-muted-foreground">
                Pertahankan streak dengan raih target setiap hari! 🔥
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Celebration Confetti */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
