import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Heart, Gem, Zap, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";

interface HeartsData {
  current: number;
  max: number;
  lastLost: string | null; // ISO date when last heart was lost
  refillStarted: string | null; // ISO date when refill timer started
  unlimitedUntil: string | null; // ISO date when unlimited hearts expires
}

interface HeartsProps {
  userId: string;
  currentGems: number;
  onSpendGems: (amount: number, reason: string) => void;
  onHeartsChange?: (hearts: number) => void;
  compact?: boolean;
}

export interface HeartsHandle {
  loseHeart: () => boolean;
  getCurrentHearts: () => number;
  hasUnlimitedHearts: () => boolean;
}

const MAX_HEARTS = 5;
const REFILL_TIME_MINUTES = 300; // 5 hours = 300 minutes
const UNLIMITED_HEARTS_COST = 350;
const UNLIMITED_HEARTS_DURATION = 30; // 30 minutes

export const Hearts = forwardRef<HeartsHandle, HeartsProps>(({
  userId,
  currentGems,
  onSpendGems,
  onHeartsChange,
  compact = false,
}, ref) => {
  const [heartsData, setHeartsData] = useState<HeartsData>({
    current: MAX_HEARTS,
    max: MAX_HEARTS,
    lastLost: null,
    refillStarted: null,
    unlimitedUntil: null,
  });

  const [showUnlimitedDialog, setShowUnlimitedDialog] = useState(false);
  const [refillProgress, setRefillProgress] = useState(0);
  const [timeUntilRefill, setTimeUntilRefill] = useState("");
  const [unlimitedTimeLeft, setUnlimitedTimeLeft] = useState("");

  // Load hearts data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`hearts_data_${userId}`);
    if (savedData) {
      const data: HeartsData = JSON.parse(savedData);
      setHeartsData(data);
      onHeartsChange?.(data.current);
    }
  }, [userId, onHeartsChange]);

  // Auto-refill logic
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartsData((prev) => {
        const now = new Date();

        // Check if unlimited hearts is active
        if (prev.unlimitedUntil) {
          const unlimitedExpires = new Date(prev.unlimitedUntil);
          if (now >= unlimitedExpires) {
            // Unlimited expired
            toast.info("Unlimited hearts sudah habis");
            return { ...prev, unlimitedUntil: null };
          }
          // Update countdown
          const msLeft = unlimitedExpires.getTime() - now.getTime();
          const minutesLeft = Math.floor(msLeft / 60000);
          const secondsLeft = Math.floor((msLeft % 60000) / 1000);
          setUnlimitedTimeLeft(`${minutesLeft}m ${secondsLeft}s`);
          return prev;
        }

        // If hearts are full, no need to refill
        if (prev.current >= prev.max) {
          setRefillProgress(0);
          setTimeUntilRefill("");
          return prev;
        }

        // If no refill started, start it now
        if (!prev.refillStarted) {
          const newData = { ...prev, refillStarted: now.toISOString() };
          localStorage.setItem(`hearts_data_${userId}`, JSON.stringify(newData));
          return newData;
        }

        const refillStart = new Date(prev.refillStarted);
        const elapsedMs = now.getTime() - refillStart.getTime();
        const elapsedMinutes = elapsedMs / 60000;

        // Calculate progress (0-100%)
        const progress = Math.min((elapsedMinutes / REFILL_TIME_MINUTES) * 100, 100);
        setRefillProgress(progress);

        // Calculate time remaining
        const minutesLeft = Math.max(0, REFILL_TIME_MINUTES - elapsedMinutes);
        const hours = Math.floor(minutesLeft / 60);
        const minutes = Math.floor(minutesLeft % 60);
        setTimeUntilRefill(`${hours}h ${minutes}m`);

        // Refill 1 heart every 5 hours
        if (elapsedMinutes >= REFILL_TIME_MINUTES) {
          const newCurrent = Math.min(prev.current + 1, prev.max);
          const newData: HeartsData = {
            ...prev,
            current: newCurrent,
            refillStarted: newCurrent < prev.max ? now.toISOString() : null,
          };
          localStorage.setItem(`hearts_data_${userId}`, JSON.stringify(newData));
          onHeartsChange?.(newCurrent);
          
          if (newCurrent < prev.max) {
            toast.success("❤️ 1 heart telah terisi!");
          } else {
            toast.success("❤️ Semua hearts sudah penuh!");
          }
          
          return newData;
        }

        return prev;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [userId, onHeartsChange]);

  // Define loseHeart function
  const loseHeart = () => {
    if (heartsData.unlimitedUntil) {
      // Unlimited hearts active, don't lose any
      return true; // Can continue
    }

    if (heartsData.current <= 0) {
      return false; // No hearts left
    }

    const now = new Date();
    const newData: HeartsData = {
      ...heartsData,
      current: heartsData.current - 1,
      lastLost: now.toISOString(),
      refillStarted: heartsData.refillStarted || now.toISOString(),
    };

    setHeartsData(newData);
    localStorage.setItem(`hearts_data_${userId}`, JSON.stringify(newData));
    onHeartsChange?.(newData.current);

    if (newData.current === 0) {
      toast.error("💔 Hearts habis! Tunggu refill atau beli unlimited hearts");
    } else {
      toast.warning(`💔 -1 heart (${newData.current} tersisa)`);
    }

    return newData.current > 0;
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    loseHeart,
    getCurrentHearts: () => heartsData.current,
    hasUnlimitedHearts: () => !!heartsData.unlimitedUntil,
  }));

  const handleBuyUnlimitedHearts = () => {
    if (currentGems < UNLIMITED_HEARTS_COST) {
      toast.error("Gems tidak cukup! Butuh 350 gems");
      return;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + UNLIMITED_HEARTS_DURATION * 60000);

    const newData: HeartsData = {
      ...heartsData,
      unlimitedUntil: expiresAt.toISOString(),
    };

    setHeartsData(newData);
    localStorage.setItem(`hearts_data_${userId}`, JSON.stringify(newData));

    onSpendGems(UNLIMITED_HEARTS_COST, "Unlimited Hearts");
    setShowUnlimitedDialog(false);

    toast.success(`⚡ Unlimited hearts aktif selama ${UNLIMITED_HEARTS_DURATION} menit!`, {
      duration: 5000,
    });
  };

  const hasUnlimitedHearts = !!heartsData.unlimitedUntil;

  // Compact mode - just show hearts count with icon
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {hasUnlimitedHearts ? (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
            <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-yellow-600">
              {unlimitedTimeLeft}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                className={`h-4 w-4 ${
                  i < heartsData.current
                    ? "text-red-500 fill-red-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            Hearts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hearts Display */}
          <div className="flex items-center justify-center gap-2">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: i * 0.05,
                  }}
                >
                  <Heart
                    className={`h-6 w-6 transition-all duration-300 ${
                      hasUnlimitedHearts
                        ? "text-yellow-500 fill-yellow-500 animate-pulse"
                        : i < heartsData.current
                        ? "text-red-500 fill-red-500"
                        : "text-gray-300"
                    }`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Unlimited Hearts Badge */}
          {hasUnlimitedHearts && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30"
            >
              <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <div>
                <p className="text-xs font-semibold text-yellow-600">
                  Unlimited Hearts
                </p>
                <p className="text-xs text-yellow-600/70">{unlimitedTimeLeft}</p>
              </div>
            </motion.div>
          )}

          {/* Refill Progress */}
          {!hasUnlimitedHearts && heartsData.current < MAX_HEARTS && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Refill berikutnya
                </span>
                <span className="font-medium">{timeUntilRefill}</span>
              </div>
              <Progress value={refillProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                1 heart setiap 5 jam
              </p>
            </div>
          )}

          {/* Full Hearts Message */}
          {!hasUnlimitedHearts && heartsData.current === MAX_HEARTS && (
            <p className="text-xs text-muted-foreground text-center">
              Hearts penuh! 🎉
            </p>
          )}

          {/* Buy Unlimited Button */}
          {!hasUnlimitedHearts && (
            <Button
              onClick={() => setShowUnlimitedDialog(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Unlimited Hearts
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                {UNLIMITED_HEARTS_COST} <Gem className="inline h-3 w-3" />
              </span>
            </Button>
          )}

          {/* Out of Hearts Warning */}
          {!hasUnlimitedHearts && heartsData.current === 0 && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-200">
              <p className="text-xs text-red-600 text-center font-medium">
                💔 Tidak ada hearts! Tunggu refill atau beli unlimited.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unlimited Hearts Dialog */}
      <Dialog open={showUnlimitedDialog} onOpenChange={setShowUnlimitedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Unlimited Hearts
            </DialogTitle>
            <DialogDescription>
              Dapatkan unlimited hearts selama {UNLIMITED_HEARTS_DURATION} menit!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Benefits */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Keuntungan:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Tidak perlu khawatir salah jawab
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Belajar tanpa batas selama 30 menit
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Sempurna untuk sprint belajar intensif
                </li>
              </ul>
            </div>

            {/* Cost */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Harga:</span>
                <div className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-blue-500" />
                  <span className="text-lg font-bold">{UNLIMITED_HEARTS_COST}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Gems kamu:</span>
                <span
                  className={`text-sm font-medium ${
                    currentGems >= UNLIMITED_HEARTS_COST
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {currentGems}
                </span>
              </div>
            </div>

            {/* Warning if not enough gems */}
            {currentGems < UNLIMITED_HEARTS_COST && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-200">
                <p className="text-xs text-red-600 text-center">
                  Gems tidak cukup! Butuh {UNLIMITED_HEARTS_COST - currentGems}{" "}
                  gems lagi
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnlimitedDialog(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleBuyUnlimitedHearts}
              disabled={currentGems < UNLIMITED_HEARTS_COST}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Aktifkan Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

Hearts.displayName = "Hearts";

// Export the types
export type { HeartsData };

