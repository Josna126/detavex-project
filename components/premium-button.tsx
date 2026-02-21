"use client"

import { motion } from "framer-motion"
import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  animated?: boolean
  glowEffect?: boolean
}

export function PremiumButton({
  variant = "primary",
  size = "md",
  children,
  animated = true,
  glowEffect = true,
  className,
  ...props
}: PremiumButtonProps) {
  const baseClasses = "relative font-semibold transition-all duration-300 overflow-hidden rounded-xl"

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const variantClasses = {
    primary: "bg-gradient-to-r from-indigo to-teal text-white hover:shadow-lg hover:shadow-indigo/50",
    secondary: "glass-morphism border border-indigo/30 text-foreground hover:bg-indigo/10",
    ghost: "text-foreground hover:bg-indigo/10",
  }

  return (
    <motion.button
      whileHover={animated ? { scale: 1.05, y: -2 } : undefined}
      whileTap={animated ? { scale: 0.98 } : undefined}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        glowEffect && "group",
        className
      )}
      {...props}
    >
      {glowEffect && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.2 }}
        />
      )}

      <motion.span
        className="relative z-10 flex items-center gap-2"
        animate={animated ? { y: [0, -2, 0] } : undefined}
        transition={animated ? { duration: 2, repeat: Infinity } : undefined}
      >
        {children}
      </motion.span>

      {/* Background glow effect on hover */}
      {glowEffect && (
        <motion.div
          className="absolute -inset-1 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500 pointer-events-none"
          style={{
            background: variant === "primary" ? "linear-gradient(135deg, #6366f1, #14b8a6)" : "transparent",
          }}
        />
      )}
    </motion.button>
  )
}
