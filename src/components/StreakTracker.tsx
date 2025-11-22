import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Snowflake, Shield, AlertCircle, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface StreakData {
  current: number;
  longest: number;
  lastUpdated: string; // ISO date
  freezeUsed: boolean;
  freezeExpiresAt: string | null; // ISO date when freeze protection expires
  brokenAt: string | null; // ISO date when streak was broken (for repair)
}

interface StreakTrackerProps {
  userId: string;
  currentGems?: number;
  onSpendGems?: (amount: number, reason: string) => void;
  onStreakUpdate?: (streakData: StreakData) => void;
  compact?: boolean;
}

const FREEZE_COST = 10; // gems
const REPAIR_COST = 50; // gems
const REPAIR_WINDOW_HOURS = 24;

// Flame intensity levels based on streak length
const getFlameIntensity = (streak: number): { level: number; color: string; description: string } => {
  if (streak === 0) return { level: 0, color: "text-gray-400", description: "Mulai streak!" };
  if (streak < 3) return { level: 1, color: "text-orange-400", description: "Pemanasan" };
  if (streak < 7) return { level: 2, color: "text-orange-500", description: "Semangat!" };
  if (streak < 14) return { level: 3, color: "text-red-500", description: "Konsisten!" };
  if (streak < 30) return { level: 4, color: "text-red-600", description: "Luar biasa!" };
  if (streak < 100) return { level: 5, color: "text-yellow-500", description: "Legendaris!" };
  return { level: 6, color: "text-purple-500", description: "Unstoppable!" };
};

export function StreakTracker({ 
  userId, 
  currentGems = 0, 
  onSpendGems,
  onStreakUpdate,
  compact = false 
}: StreakTrackerProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    current: 7, // Initialize with default streak
    longest: 9, // Initialize with best streak
    lastUpdated: new Date().toISOString(),
    freezeUsed: false,
    freezeExpiresAt: null,
    brokenAt: null,
  });

  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [showRepairDialog, setShowRepairDialog] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`streak_data_${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Check if freeze has expired
      if (parsed.freezeExpiresAt) {
        const freezeExpiry = new Date(parsed.freezeExpiresAt);
        if (new Date() > freezeExpiry) {
          parsed.freezeExpiresAt = null;
          parsed.freezeUsed = false;
        }
      }

      setStreakData(parsed);
    } else {
      // Initialize with default values if no saved data
      const initialData: StreakData = {
        current: 7,
        longest: 9,
        lastUpdated: new Date().toISOString(),
        freezeUsed: false,
        freezeExpiresAt: null,
        brokenAt: null,
      };
      saveStreakData(initialData);
    }
  }, [userId]);

  const saveStreakData = (data: StreakData) => {
    localStorage.setItem(`streak_data_${userId}`, JSON.stringify(data));
    setStreakData(data);
    onStreakUpdate?.(data);
  };

  const intensity = getFlameIntensity(streakData.current);
  const isFrozen = streakData.freezeExpiresAt && new Date(streakData.freezeExpiresAt) > new Date();
  const canRepair = streakData.brokenAt && 
    (new Date().getTime() - new Date(streakData.brokenAt).getTime()) < REPAIR_WINDOW_HOURS * 60 * 60 * 1000;

  // Handle freeze purchase
  const handleFreeze = () => {
    if (currentGems < FREEZE_COST) {
      toast.error(`Gems tidak cukup! Butuh ${FREEZE_COST} gems.`);
      return;
    }

    if (isFrozen) {
      toast.info("Streak sudah terlindungi!");
      return;
    }

    const freezeExpiry = new Date();
    freezeExpiry.setHours(freezeExpiry.getHours() + 24);

    const updated: StreakData = {
      ...streakData,
      freezeUsed: true,
      freezeExpiresAt: freezeExpiry.toISOString(),
    };

    saveStreakData(updated);
    onSpendGems?.(FREEZE_COST, "Streak Freeze");
    setShowFreezeDialog(false);
    toast.success("Streak freeze aktif selama 24 jam! ❄️");
  };

  // Handle repair purchase
  const handleRepair = () => {
    if (currentGems < REPAIR_COST) {
      toast.error(`Gems tidak cukup! Butuh ${REPAIR_COST} gems.`);
      return;
    }

    if (!canRepair) {
      toast.error("Waktu repair sudah habis (24 jam setelah streak putus).");
      return;
    }

    // Get the streak before it was broken
    const repairedStreak = streakData.current > 0 ? streakData.current : 1;

    const updated: StreakData = {
      ...streakData,
      current: repairedStreak,
      brokenAt: null,
      lastUpdated: new Date().toISOString(),
    };

    saveStreakData(updated);
    onSpendGems?.(REPAIR_COST, "Streak Repair");
    setShowRepairDialog(false);
    toast.success(`Streak diperbaiki! Kembali ke ${repairedStreak} hari 🔥`);
  };

  // Increment streak (called from parent when daily goal is completed)
  const incrementStreak = () => {
    const today = new Date().toDateString();
    const lastUpdatedDate = new Date(streakData.lastUpdated).toDateString();

    // Only increment once per day
    if (today === lastUpdatedDate) {
      return;
    }

    const newStreak = streakData.current + 1;
    const updated: StreakData = {
      ...streakData,
      current: newStreak,
      longest: Math.max(newStreak, streakData.longest),
      lastUpdated: new Date().toISOString(),
      freezeUsed: false, // Reset freeze flag
    };

    saveStreakData(updated);
    
    // Check for milestone achievements
    if (newStreak === 7) toast.success("🏆 7 hari berturut-turut!");
    if (newStreak === 14) toast.success("🏆 2 minggu streak! Luar biasa!");
    if (newStreak === 30) toast.success("🏆 1 bulan streak! Kamu luar biasa!");
    if (newStreak === 100) toast.success("🏆 100 hari! Kamu legend!");
  };

  // Break streak (called when daily goal is missed)
  const breakStreak = () => {
    // If frozen, protect the streak
    if (isFrozen) {
      toast.info("Streak terlindungi oleh freeze! ❄️");
      const updated: StreakData = {
        ...streakData,
        freezeExpiresAt: null,
        freezeUsed: false,
        lastUpdated: new Date().toISOString(),
      };
      saveStreakData(updated);
      return;
    }

    // Break the streak
    const updated: StreakData = {
      ...streakData,
      current: 0,
      brokenAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    saveStreakData(updated);
    toast.error("Streak terputus! 💔 Gunakan repair dalam 24 jam.", { duration: 5000 });
  };

  // Calculate remaining time for repair
  const getRepairTimeRemaining = (): string => {
    if (!streakData.brokenAt) return "";
    
    const brokenTime = new Date(streakData.brokenAt).getTime();
    const now = new Date().getTime();
    const elapsed = now - brokenTime;
    const remaining = (REPAIR_WINDOW_HOURS * 60 * 60 * 1000) - elapsed;

    if (remaining <= 0) return "Habis";

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    return `${hours}j ${minutes}m`;
  };

  if (compact) {
    return (
      <Card className={cn(
        "border-2 transition-all",
        isFrozen ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-orange-200 bg-gradient-to-br from-orange-500/10 to-red-500/10"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-full",
              isFrozen ? "bg-blue-500" : "bg-gradient-to-br from-orange-500 to-red-500"
            )}>
              {isFrozen ? (
                <Snowflake className="h-6 w-6 text-white" />
              ) : (
                <Flame className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold">{streakData.current}</p>
              <p className="text-xs text-muted-foreground">
                {isFrozen ? "Terlindungi ❄️" : "hari beruntun"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn(
        "border-2 transition-all overflow-hidden",
        isFrozen ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-orange-200 bg-gradient-to-br from-orange-500/10 to-red-500/10"
      )}>
        {/* Freeze overlay effect */}
        {isFrozen && (
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        )}

        <CardHeader className="pb-3 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-lg relative",
                isFrozen ? "bg-blue-500" : "bg-gradient-to-br from-orange-500 to-red-500"
              )}>
                <AnimatePresence mode="wait">
                  {isFrozen ? (
                    <motion.div
                      key="frozen"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                    >
                      <Snowflake className="h-5 w-5 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="flame"
                      animate={{
                        scale: intensity.level > 0 ? [1, 1.1, 1] : 1,
                        rotate: intensity.level > 0 ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    >
                      <Flame className={cn("h-5 w-5 text-white", intensity.color)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <CardTitle className="text-lg">Streak</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {isFrozen ? "Terlindungi selama 24 jam" : intensity.description}
                </CardDescription>
              </div>
            </div>
            {streakData.longest > 0 && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                🏆 Terbaik: {streakData.longest}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          {/* Streak counter */}
          <div className="text-center py-4">
            <motion.div
              className="inline-block"
              animate={{
                scale: intensity.level > 3 ? [1, 1.05, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className={cn("text-6xl font-bold", intensity.color)}>
                {streakData.current}
              </p>
              <p className="text-sm text-muted-foreground mt-1">hari beruntun</p>
            </motion.div>
          </div>

          {/* Milestone progress */}
          {streakData.current > 0 && streakData.current < 100 && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Milestone berikutnya</span>
                {streakData.current < 7 && <span>7 hari 🎯</span>}
                {streakData.current >= 7 && streakData.current < 14 && <span>14 hari 🎯</span>}
                {streakData.current >= 14 && streakData.current < 30 && <span>30 hari 🎯</span>}
                {streakData.current >= 30 && <span>100 hari 🎯</span>}
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                {streakData.current < 7 && (
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${(streakData.current / 7) * 100}%` }} />
                )}
                {streakData.current >= 7 && streakData.current < 14 && (
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${((streakData.current - 7) / 7) * 100}%` }} />
                )}
                {streakData.current >= 14 && streakData.current < 30 && (
                  <div className="h-full bg-gradient-to-r from-red-500 to-yellow-500" style={{ width: `${((streakData.current - 14) / 16) * 100}%` }} />
                )}
                {streakData.current >= 30 && (
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-purple-500" style={{ width: `${((streakData.current - 30) / 70) * 100}%` }} />
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2">
            {!isFrozen && streakData.current > 0 && (
              <Button
                onClick={() => setShowFreezeDialog(true)}
                variant="outline"
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                size="sm"
              >
                <Snowflake className="h-4 w-4 mr-2" />
                Freeze Streak ({FREEZE_COST} gems)
              </Button>
            )}

            {canRepair && (
              <Button
                onClick={() => setShowRepairDialog(true)}
                variant="outline"
                className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                size="sm"
              >
                <Shield className="h-4 w-4 mr-2" />
                Repair Streak ({REPAIR_COST} gems)
                <Clock className="h-3 w-3 ml-2" />
                <span className="text-xs ml-1">{getRepairTimeRemaining()}</span>
              </Button>
            )}

            {isFrozen && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm">
                <Shield className="h-4 w-4" />
                <span>Streak terlindungi untuk hari ini</span>
              </div>
            )}
          </div>

          {/* Info text */}
          <p className="text-xs text-center text-muted-foreground">
            Selesaikan daily goal setiap hari untuk pertahankan streak! 🔥
          </p>
        </CardContent>
      </Card>

      {/* Freeze Confirmation Dialog */}
      <Dialog open={showFreezeDialog} onOpenChange={setShowFreezeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-blue-500" />
              Freeze Streak
            </DialogTitle>
            <DialogDescription>
              Lindungi streak kamu selama 24 jam dengan freeze. Jika kamu melewatkan daily goal besok, streak tidak akan hilang.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div>
                <p className="font-semibold">Biaya Freeze</p>
                <p className="text-sm text-muted-foreground">Proteksi 24 jam</p>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{FREEZE_COST}</span>
                <span className="text-sm text-muted-foreground">gems</span>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Gems kamu saat ini: <strong>{currentGems}</strong></p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFreezeDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleFreeze}
              disabled={currentGems < FREEZE_COST}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Snowflake className="h-4 w-4 mr-2" />
              Aktifkan Freeze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Repair Confirmation Dialog */}
      <Dialog open={showRepairDialog} onOpenChange={setShowRepairDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              Repair Streak
            </DialogTitle>
            <DialogDescription>
              Pulihkan streak yang baru saja putus. Kamu punya {getRepairTimeRemaining()} untuk repair.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div>
                <p className="font-semibold">Biaya Repair</p>
                <p className="text-sm text-muted-foreground">Pulihkan streak sebelumnya</p>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{REPAIR_COST}</span>
                <span className="text-sm text-muted-foreground">gems</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 rounded bg-yellow-50 dark:bg-yellow-950/20">
                <span className="text-muted-foreground">Gems kamu:</span>
                <strong>{currentGems}</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-yellow-50 dark:bg-yellow-950/20">
                <span className="text-muted-foreground">Waktu tersisa:</span>
                <strong className="text-yellow-600">{getRepairTimeRemaining()}</strong>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRepairDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleRepair}
              disabled={currentGems < REPAIR_COST || !canRepair}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <Shield className="h-4 w-4 mr-2" />
              Repair Streak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
