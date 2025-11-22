/**
 * League Promotion/Demotion Modals
 */

import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeagueIcon } from "@/components/LeagueIcon";
import { getLeague, LeagueTier } from "@/data/leagueSystem";
import { TrendingUp, TrendingDown, Award, Trophy, Gem, Coins, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

interface LeaguePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromLeague: LeagueTier;
  toLeague: LeagueTier;
  rank: number;
  weeklyXP: number;
  rewards: {
    xp: number;
    gems?: number;
    title?: string;
  };
}

export function LeaguePromotionModal({
  isOpen,
  onClose,
  fromLeague,
  toLeague,
  rank,
  weeklyXP,
  rewards,
}: LeaguePromotionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const fromLeagueData = getLeague(fromLeague);
  const toLeagueData = getLeague(toLeague);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}

        <DialogHeader>
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Trophy className="w-24 h-24 text-yellow-500 relative z-10" />
            </div>
          </motion.div>

          <DialogTitle className="text-center text-2xl font-bold">
            🎉 Selamat! Naik Liga! 🎉
          </DialogTitle>
          <DialogDescription className="text-center">
            Kamu berhasil masuk Top {rank} minggu ini!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* League Transition */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <LeagueIcon tier={fromLeague} size="lg" animate />
              <p className="text-sm font-semibold mt-2">{fromLeagueData.displayName}</p>
            </div>

            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-8 h-8 text-primary" />
            </motion.div>

            <div className="text-center">
              <LeagueIcon tier={toLeague} size="lg" animate showGlow />
              <p className="text-sm font-semibold mt-2 text-primary">{toLeagueData.displayName}</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg p-4 space-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peringkat Minggu Ini</span>
              <Badge variant="default" className="font-bold">
                <TrendingUp className="w-3 h-3 mr-1" />
                #{rank}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total XP Mingguan</span>
              <span className="font-bold text-primary">{weeklyXP.toLocaleString()} XP</span>
            </div>
          </motion.div>

          {/* Rewards */}
          <motion.div
            className="border-2 border-dashed border-yellow-500/50 rounded-lg p-4 bg-yellow-500/5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-700">Hadiah Promosi</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bonus XP</span>
                <Badge variant="secondary" className="font-bold">
                  +{rewards.xp.toLocaleString()} XP
                </Badge>
              </div>

              {rewards.gems && rewards.gems > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bonus Gems</span>
                  <Badge variant="secondary" className="font-bold">
                    <Gem className="w-3 h-3 mr-1" />
                    +{rewards.gems}
                  </Badge>
                </div>
              )}

              {rewards.title && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gelar Spesial</span>
                  <Badge variant="default" className="font-bold bg-gradient-to-r from-yellow-500 to-orange-500">
                    {rewards.title}
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Button onClick={onClose} className="w-full" size="lg">
              Lanjutkan Belajar! 🚀
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface LeagueDemotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromLeague: LeagueTier;
  toLeague: LeagueTier;
  rank: number;
  weeklyXP: number;
}

export function LeagueDemotionModal({
  isOpen,
  onClose,
  fromLeague,
  toLeague,
  rank,
  weeklyXP,
}: LeagueDemotionModalProps) {
  const fromLeagueData = getLeague(fromLeague);
  const toLeagueData = getLeague(toLeague);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center">
              <TrendingDown className="w-12 h-12 text-red-600" />
            </div>
          </motion.div>

          <DialogTitle className="text-center text-xl font-bold text-red-600">
            Turun Liga
          </DialogTitle>
          <DialogDescription className="text-center">
            Kamu berada di peringkat #{rank} minggu ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* League Transition */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <LeagueIcon tier={fromLeague} size="lg" />
              <p className="text-sm font-semibold mt-2">{fromLeagueData.displayName}</p>
            </div>

            <motion.div
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-8 h-8 text-red-600 rotate-180" />
            </motion.div>

            <div className="text-center opacity-60">
              <LeagueIcon tier={toLeague} size="lg" />
              <p className="text-sm font-semibold mt-2">{toLeagueData.displayName}</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="bg-red-50 dark:bg-red-950/10 rounded-lg p-4 space-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peringkat Minggu Ini</span>
              <Badge variant="destructive" className="font-bold">#{rank}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total XP Mingguan</span>
              <span className="font-bold">{weeklyXP.toLocaleString()} XP</span>
            </div>
          </motion.div>

          {/* Motivation */}
          <motion.div
            className="border-2 border-dashed border-primary/50 rounded-lg p-4 bg-primary/5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-semibold mb-2 text-primary">💪 Jangan Menyerah!</h3>
            <p className="text-sm text-muted-foreground">
              Minggu depan adalah kesempatan baru untuk naik kembali. Tetap konsisten belajar dan kamu pasti bisa!
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-2"
          >
            <Button onClick={onClose} className="w-full" size="lg">
              Bangkit Lebih Kuat! 💪
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Top 10 minggu depan = Naik liga lagi
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface LeagueStayModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: LeagueTier;
  rank: number;
  weeklyXP: number;
  rewards: {
    xp: number;
    gems?: number;
  };
}

export function LeagueStayModal({
  isOpen,
  onClose,
  league,
  rank,
  weeklyXP,
  rewards,
}: LeagueStayModalProps) {
  const leagueData = getLeague(league);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <LeagueIcon tier={league} size="xl" animate showGlow />
          </motion.div>

          <DialogTitle className="text-center text-xl font-bold">
            Bertahan di {leagueData.displayName}
          </DialogTitle>
          <DialogDescription className="text-center">
            Kinerja bagus minggu ini!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stats */}
          <motion.div
            className={`${leagueData.color.bg} rounded-lg p-4 space-y-2`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peringkat Minggu Ini</span>
              <Badge variant="outline" className="font-bold">#{rank}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total XP Mingguan</span>
              <span className="font-bold">{weeklyXP.toLocaleString()} XP</span>
            </div>
          </motion.div>

          {/* Rewards */}
          <motion.div
            className="border-2 border-dashed border-primary/50 rounded-lg p-4 bg-primary/5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Hadiah Mingguan</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bonus XP</span>
                <Badge variant="secondary" className="font-bold">
                  +{rewards.xp.toLocaleString()} XP
                </Badge>
              </div>

              {rewards.gems && rewards.gems > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bonus Gems</span>
                  <Badge variant="secondary" className="font-bold">
                    <Gem className="w-3 h-3 mr-1" />
                    +{rewards.gems}
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>

          {/* Next week goal */}
          <motion.div
            className="bg-muted rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-semibold mb-2">🎯 Target Minggu Depan</h3>
            <p className="text-sm text-muted-foreground">
              {rank <= 10 
                ? "Kamu sudah di zona promosi! Pertahankan untuk naik liga!" 
                : "Tingkatkan ke Top 10 untuk promosi ke liga berikutnya!"}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Button onClick={onClose} className="w-full" size="lg">
              Lanjutkan! 🔥
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
