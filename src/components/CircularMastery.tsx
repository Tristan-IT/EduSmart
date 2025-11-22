import { cn } from "@/lib/utils";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface CircularMasteryProps {
  percent: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CircularMastery = ({ 
  percent, 
  label, 
  size = 'md',
  className 
}: CircularMasteryProps) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const springPercent = useSpring(0, { stiffness: 75, damping: 15 });

  useEffect(() => {
    springPercent.set(percent);
    setAnimatedPercent(percent);
  }, [percent, springPercent]);

  const sizes = {
    sm: { container: 'w-20 h-20', stroke: 6, text: 'text-xs' },
    md: { container: 'w-32 h-32', stroke: 8, text: 'text-lg' },
    lg: { container: 'w-40 h-40', stroke: 10, text: 'text-2xl' },
  };

  const config = sizes[size];
  const radius = size === 'sm' ? 30 : size === 'md' ? 56 : 70;
  const circumference = 2 * Math.PI * radius;
  
  const offset = useTransform(
    springPercent,
    [0, 100],
    [circumference, 0]
  );

  const getColor = (percent: number) => {
    if (percent >= 80) return { stroke: 'stroke-accent', gradient: ['#10b981', '#14b8a6'] };
    if (percent >= 60) return { stroke: 'stroke-primary', gradient: ['#3b82f6', '#8b5cf6'] };
    if (percent >= 40) return { stroke: 'stroke-warning', gradient: ['#f59e0b', '#eab308'] };
    return { stroke: 'stroke-destructive', gradient: ['#ef4444', '#f97316'] };
  };

  const colorConfig = getColor(percent);
  const gradientId = `gradient-${label.replace(/\s/g, '-')}`;

  return (
    <motion.div 
      className={cn("flex flex-col items-center gap-2", className)}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.div 
        className={cn("relative", config.container)}
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.05 }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          variants={{
            rest: { 
              boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
            },
            hover: { 
              boxShadow: "0 0 20px 8px rgba(59, 130, 246, 0.4)",
            }
          }}
          transition={{ duration: 0.3 }}
        />
        
        <svg className="transform -rotate-90" width="100%" height="100%">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorConfig.gradient[0]} />
              <stop offset="100%" stopColor={colorConfig.gradient[1]} />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-muted/30"
            strokeWidth={config.stroke}
            fill="none"
          />
          
          {/* Animated progress circle with gradient */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={config.stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={cn("font-bold text-foreground", config.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {Math.round(springPercent.get())}%
          </motion.span>
        </div>
      </motion.div>
      
      <motion.span 
        className="text-sm text-muted-foreground font-medium text-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};
