import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LeagueIcon } from "@/components/LeagueIcon";
import { 
  LeagueTier, 
  getLeague, 
  getNextLeague, 
  getLeagueProgress,
  getXPForNextLeague,
  getTimeRemainingInWeek,
  LeagueUser
} from "@/data/leagueSystem";
import { Clock, TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface LeagueProgressProps {
  user: LeagueUser;
  totalXP: number;
  showWeeklyTimer?: boolean;
  compact?: boolean;
}

export const LeagueProgress = ({ 
  user, 
  totalXP,
  showWeeklyTimer = true,
  compact = false 
}: LeagueProgressProps) => {
  const currentLeague = getLeague(user.currentLeague);
  const nextLeague = getNextLeague(user.currentLeague);
  const progress = getLeagueProgress(user.currentLeague, totalXP);
  const xpNeeded = nextLeague ? getXPForNextLeague(user.currentLeague, totalXP) : 0;
  const timeRemaining = getTimeRemainingInWeek();

  // Determine rank zone (promotion, safe, demotion)
  const getRankZone = (rank: number): 'promotion' | 'safe' | 'demotion' => {
    if (rank <= 10) return 'promotion';
    if (rank <= 20) return 'safe';
    return 'demotion';
  };

  const rankZone = getRankZone(user.rank);
  const zoneColors = {
    promotion: 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200',
    safe: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200',
    demotion: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200',
  };

  const zoneIcons = {
    promotion: <TrendingUp className="w-4 h-4" />,
    safe: <Minus className="w-4 h-4" />,
    demotion: <TrendingDown className="w-4 h-4" />,
  };

  const zoneLabels = {
    promotion: 'Zona Promosi',
    safe: 'Zona Aman',
    demotion: 'Zona Degradasi',
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <LeagueIcon tier={user.currentLeague} size="sm" showGlow animate />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">{currentLeague.displayName}</span>
            <Badge variant="outline" className="text-xs">
              #{user.rank}
            </Badge>
          </div>
          {nextLeague && (
            <div className="space-y-1">
              <Progress value={progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {xpNeeded.toLocaleString()} XP ke {getLeague(nextLeague).displayName}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className={cn("h-2", currentLeague.color.bg)} />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LeagueIcon tier={user.currentLeague} size="lg" showGlow animate />
            <div>
              <CardTitle className="text-xl">{currentLeague.displayName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Peringkat #{user.rank} Minggu Ini
              </p>
            </div>
          </div>

          {/* Rank trend */}
          {user.previousRank && (
            <Badge variant="outline" className="gap-1">
              {user.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-600" />}
              {user.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-600" />}
              {user.trend === 'same' && <Minus className="w-3 h-3 text-gray-600" />}
              {user.previousRank > user.rank && `+${user.previousRank - user.rank}`}
              {user.previousRank < user.rank && `-${user.rank - user.previousRank}`}
              {user.previousRank === user.rank && 'Sama'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Weekly XP */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">XP Minggu Ini</span>
          <span className="text-lg font-bold">
            <AnimatedCounter value={user.weeklyXP} /> XP
          </span>
        </div>

        {/* Rank Zone Indicator */}
        <div className={cn(
          "p-3 rounded-lg border flex items-center gap-2",
          zoneColors[rankZone]
        )}>
          {zoneIcons[rankZone]}
          <div className="flex-1">
            <p className="text-sm font-semibold">{zoneLabels[rankZone]}</p>
            <p className="text-xs">
              {rankZone === 'promotion' && `Top 10 naik ke ${nextLeague ? getLeague(nextLeague).displayName : 'liga tertinggi'}`}
              {rankZone === 'safe' && 'Tetap di liga saat ini'}
              {rankZone === 'demotion' && 'Rank 21+ turun liga'}
            </p>
          </div>
        </div>

        {/* Progress to next league (based on total XP) */}
        {nextLeague && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress ke {getLeague(nextLeague).displayName}</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Butuh <span className="font-semibold">{xpNeeded.toLocaleString()} XP</span> lagi
            </p>
          </div>
        )}

        {/* Weekly timer */}
        {showWeeklyTimer && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                Reset liga: {timeRemaining.days}h {timeRemaining.hours}j {timeRemaining.minutes}m
              </span>
            </div>
          </div>
        )}

        {/* League info */}
        <div className="pt-3 border-t grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Reward Mingguan</p>
            <p className="text-sm font-semibold">+{currentLeague.rewards.weekly} XP</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bonus Promosi</p>
            <p className="text-sm font-semibold">
              {nextLeague ? `+${getLeague(nextLeague).rewards.promotion} XP` : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
