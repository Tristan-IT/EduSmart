/**
 * Shared Animation Utilities
 * Framer Motion variants and configurations for consistent animations
 */

import { Variants, Transition } from "framer-motion";

// ========================================
// Timing Constants
// ========================================
export const TIMING = {
  fast: 0.15,
  medium: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// ========================================
// Easing Functions
// ========================================
export const EASING = {
  spring: { type: "spring", stiffness: 400, damping: 30 },
  springLight: { type: "spring", stiffness: 300, damping: 25 },
  springBouncy: { type: "spring", stiffness: 500, damping: 20 },
  easeOut: [0.4, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.6, 1],
  anticipate: [0.36, 0, 0.66, -0.56],
} as const;

// ========================================
// Fade Animations
// ========================================
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
};

// ========================================
// Scale Animations
// ========================================
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: EASING.springBouncy
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: EASING.spring
  },
};

// ========================================
// Hover Effects
// ========================================
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -8, 
    scale: 1.02,
    transition: { duration: TIMING.fast, ease: EASING.easeOut }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: TIMING.fast }
  }
};

export const hoverScale = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: TIMING.fast, ease: EASING.easeOut }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: TIMING.fast }
  }
};

export const hoverGlow = {
  rest: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
  hover: { 
    boxShadow: "0 0 20px 4px rgba(59, 130, 246, 0.3)",
    transition: { duration: TIMING.medium }
  }
};

// ========================================
// Pulse Animations
// ========================================
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0.7)",
      "0 0 0 10px rgba(59, 130, 246, 0)",
      "0 0 0 0 rgba(59, 130, 246, 0.7)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ========================================
// Loading Animations
// ========================================
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ========================================
// Shake Animation (for errors)
// ========================================
export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

// ========================================
// Slide Animations
// ========================================
export const slideInFromLeft: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
  exit: { 
    x: "-100%", 
    opacity: 0,
    transition: { duration: TIMING.fast }
  }
};

export const slideInFromRight: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
  exit: { 
    x: "100%", 
    opacity: 0,
    transition: { duration: TIMING.fast }
  }
};

export const slideInFromTop: Variants = {
  hidden: { y: "-100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
  exit: { 
    y: "-100%", 
    opacity: 0,
    transition: { duration: TIMING.fast }
  }
};

export const slideInFromBottom: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  },
  exit: { 
    y: "100%", 
    opacity: 0,
    transition: { duration: TIMING.fast }
  }
};

// ========================================
// Stagger Configurations
// ========================================
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  }
};

export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    }
  }
};

// ========================================
// Card Flip Animation
// ========================================
export const cardFlip: Variants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 }
};

// ========================================
// Expand/Collapse
// ========================================
export const expand: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { 
    height: "auto", 
    opacity: 1,
    transition: { duration: TIMING.medium, ease: EASING.easeOut }
  }
};

// ========================================
// Number Counter Animation Config
// ========================================
export const counterSpring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1
};

// ========================================
// Progress Bar Animation
// ========================================
export const progressBar: Variants = {
  hidden: { scaleX: 0, transformOrigin: "left" },
  visible: (width: number) => ({
    scaleX: 1,
    transition: { 
      duration: TIMING.slow, 
      ease: EASING.easeOut,
      delay: 0.2 
    }
  })
};

// ========================================
// Attention Seeking
// ========================================
export const wiggle: Variants = {
  animate: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

export const heartbeat: Variants = {
  animate: {
    scale: [1, 1.3, 1, 1.3, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ========================================
// Page Transitions
// ========================================
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: TIMING.medium, 
      ease: EASING.easeOut 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: TIMING.fast }
  }
};

// ========================================
// Modal/Dialog Animations
// ========================================
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: TIMING.fast }
  },
  exit: { 
    opacity: 0,
    transition: { duration: TIMING.fast }
  }
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: TIMING.medium, 
      ease: EASING.easeOut 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: TIMING.fast }
  }
};

// ========================================
// Notification Toast
// ========================================
export const toast: Variants = {
  hidden: { opacity: 0, y: -100, scale: 0.3 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: EASING.springBouncy
  },
  exit: { 
    opacity: 0, 
    scale: 0.5,
    transition: { duration: TIMING.fast }
  }
};

// ========================================
// Floating Animation (for decorative elements)
// ========================================
export const floating: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ========================================
// Gradient Animation
// ========================================
export const gradientShift: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};
