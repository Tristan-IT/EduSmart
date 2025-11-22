import { motion } from "framer-motion";
import { Shield, Award, Trophy, Gem, Crown, Sparkles, LucideIcon } from "lucide-react";
import { LeagueTier, getLeague } from "@/data/leagueSystem";
import { cn } from "@/lib/utils";

interface LeagueIconProps {
  tier: LeagueTier;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  showGlow?: boolean;
  className?: string;
}

const iconMap: Record<LeagueTier, LucideIcon> = {
  bronze: Shield,
  silver: Award,
  gold: Trophy,
  diamond: Gem,
  platinum: Crown,
  quantum: Sparkles,
};

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const iconSizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const LeagueIcon = ({
  tier,
  size = 'md',
  animate = false,
  showGlow = false,
  className,
}: LeagueIconProps) => {
  const league = getLeague(tier);
  const Icon = iconMap[tier];

  return (
    <div className={cn("relative", className)}>
      {/* Glow effect */}
      {showGlow && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-50",
            league.color.bg
          )}
          animate={
            animate
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* League badge */}
      <motion.div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          league.color.bg,
          "shadow-lg border-2",
          league.color.border,
          sizeMap[size]
        )}
        animate={
          animate
            ? {
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      >
        <Icon className={cn("text-white", iconSizeMap[size])} />
      </motion.div>

      {/* Sparkle effect for Quantum */}
      {tier === 'quantum' && animate && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 30}%`,
                top: `-${10 + i * 5}px`,
              }}
              animate={{
                y: [-5, 5, -5],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};
