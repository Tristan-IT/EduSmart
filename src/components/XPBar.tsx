import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Zap, Star, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SubjectXP {
  subjectId: string;
  subjectName: string;
  color: string;
  xp: number;
  percentage: number;
}

interface XPBarProps {
  currentXP: number;
  xpForNextLevel: number;
  level: number;
  title: string;
  showLabel?: boolean;
  className?: string;
  subjectBreakdown?: SubjectXP[]; // Optional subject breakdown
}

export const XPBar = ({ 
  currentXP, 
  xpForNextLevel, 
  level, 
  title,
  showLabel = true,
  className,
  subjectBreakdown
}: XPBarProps) => {
  const progress = (currentXP / xpForNextLevel) * 100;
  const [animatedXP, setAnimatedXP] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // Animated counter
  const springXP = useSpring(animatedXP, { stiffness: 100, damping: 30 });
  
  useEffect(() => {
    setAnimatedXP(currentXP);
  }, [currentXP]);

  // Milestone markers (25%, 50%, 75%)
  const milestones = [25, 50, 75];

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {level}
            </motion.div>
            <span className="font-semibold">{title}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Zap className="w-4 h-4 text-warning fill-warning" />
            </motion.div>
            <motion.span 
              className="font-mono font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Math.floor(springXP.get())}/{xpForNextLevel} XP
            </motion.span>
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* Shimmering progress bar */}
        <div className="relative h-4 rounded-full bg-muted overflow-hidden">
          {/* Background shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Progress fill with gradient */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Milestone markers */}
          {milestones.map((milestone) => (
            <div
              key={milestone}
              className="absolute top-0 bottom-0 w-0.5 bg-background/50"
              style={{ left: `${milestone}%` }}
            >
              {progress >= milestone && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -top-1 left-1/2 -translate-x-1/2"
                >
                  <Star className="w-3 h-3 text-warning fill-warning" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subject Breakdown (optional) */}
      {subjectBreakdown && subjectBreakdown.length > 0 && (
        <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs h-7 mt-2"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="h-3 w-3" />
                XP per Mata Pelajaran
              </span>
              {showBreakdown ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {subjectBreakdown
              .sort((a, b) => b.xp - a.xp)
              .map((subject) => (
                <motion.div
                  key={subject.subjectId}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="font-medium">{subject.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {subject.xp} XP
                    </Badge>
                    <span className="text-muted-foreground">
                      {subject.percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
