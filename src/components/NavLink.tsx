import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, children, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        {...props}
      >
        {({ isActive, isPending, isTransitioning }) => {
          // Handle function children
          const content = typeof children === 'function' ? children({ isActive, isPending, isTransitioning }) : children;
          
          return (
            <motion.div
              className={cn(
                "relative",
                className,
                isActive && activeClassName,
                isPending && pendingClassName
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <span className="relative z-10">{content}</span>
              
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                whileHover={{
                  scaleX: 1,
                  opacity: 0.8,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0.5 }}
              />
              
              {/* Glow effect on active */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        }}
      </RouterNavLink>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
