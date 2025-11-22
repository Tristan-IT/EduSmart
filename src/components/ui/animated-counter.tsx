/**
 * AnimatedCounter - Animated number counter with spring physics
 */

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function AnimatedCounter({ 
  value, 
  duration = 1, 
  className = "",
  suffix = "",
  prefix = "",
  decimals = 0
}: AnimatedCounterProps) {
  const spring = useSpring(0, { 
    stiffness: 100, 
    damping: 30,
    duration: duration * 1000 
  });
  
  const display = useTransform(spring, (current) => {
    return prefix + current.toFixed(decimals) + suffix;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}

export default AnimatedCounter;
