"use client"

import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface Premium3DCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: "low" | "medium" | "high"
}

export function Premium3DCard({
  children,
  className,
  glowColor = "indigo",
  intensity = "medium",
}: Premium3DCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const intensityMap = {
    low: 5,
    medium: 10,
    high: 15,
  }

  const maxRotate = intensityMap[intensity]

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const rotX = ((y - rect.height / 2) / rect.height) * maxRotate
    const rotY = ((x - rect.width / 2) / rect.width) * -maxRotate

    setRotateX(rotX)
    setRotateY(rotY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  const glowClasses = {
    indigo: "glow-indigo",
    teal: "glow-teal",
    coral: "glow-coral",
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.03,
        y: -12,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      style={{
        perspective: "1200px",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        className
      )}
    >
      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 pointer-events-none ${glowClasses[glowColor as keyof typeof glowClasses]}`}
        style={{
          background: `radial-gradient(circle at center, var(--${glowColor})/20 0%, transparent 70%)`,
        }}
      />

      {/* Main card background */}
      <div className="absolute inset-0 glass-strong" />

      {/* Shine overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
