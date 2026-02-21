"use client"

import { motion } from "framer-motion"

interface AnimatedGradientBgProps {
  children?: React.ReactNode
  colors?: string[]
  animationDuration?: number
  className?: string
}

export function AnimatedGradientBg({
  children,
  colors = ["#6366f1", "#14b8a6", "#f97066"],
  animationDuration = 15,
  className = "",
}: AnimatedGradientBgProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `linear-gradient(135deg, ${colors[0]}20 0%, ${colors[1]}20 100%)`,
            `linear-gradient(135deg, ${colors[1]}20 0%, ${colors[2]}20 100%)`,
            `linear-gradient(135deg, ${colors[2]}20 0%, ${colors[0]}20 100%)`,
            `linear-gradient(135deg, ${colors[0]}20 0%, ${colors[1]}20 100%)`,
          ],
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors[0]}40 0%, transparent 70%)` }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: animationDuration * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors[1]}40 0%, transparent 70%)` }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: animationDuration * 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: animationDuration * 0.5,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

interface MorphingShape {
  duration?: number
  size?: string
  color?: string
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  blur?: string
}

export function MorphingShape({
  duration = 8,
  size = "w-96 h-96",
  color = "#6366f1",
  position = "center",
  blur = "blur-3xl",
}: MorphingShape) {
  const positionClasses = {
    "top-left": "-top-1/3 -left-1/3",
    "top-right": "-top-1/3 -right-1/3",
    "bottom-left": "-bottom-1/3 -left-1/3",
    "bottom-right": "-bottom-1/3 -right-1/3",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  }

  return (
    <motion.div
      className={`absolute ${size} ${positionClasses[position]} ${blur} opacity-40 pointer-events-none rounded-full`}
      style={{
        background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}
