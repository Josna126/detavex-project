"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface FlipCard3DProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
  autoFlip?: boolean
  flipDuration?: number
}

export function FlipCard3D({
  front,
  back,
  className = "",
  autoFlip = false,
  flipDuration = 6,
}: FlipCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className={`relative w-full h-full cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      animate={autoFlip ? { rotateY: isFlipped ? 180 : 0 } : undefined}
      transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Front side */}
      <motion.div
        className="absolute inset-0 rounded-2xl glass-morphism p-6 flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
      >
        {front}
      </motion.div>

      {/* Back side */}
      <motion.div
        className="absolute inset-0 rounded-2xl glass-strong p-6 flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
          rotateY: 180,
        }}
        animate={{
          rotateY: isFlipped ? 360 : 180,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
      >
        {back}
      </motion.div>
    </motion.div>
  )
}

interface StackCardProps {
  children: React.ReactNode
  index: number
  total: number
  className?: string
}

export function StackCard({
  children,
  index,
  total,
  className = "",
}: StackCardProps) {
  const rotation = (index - Math.floor(total / 2)) * 8
  const yOffset = index * 8
  const zIndex = total - index

  return (
    <motion.div
      className={`absolute rounded-2xl glass-morphism p-6 w-full h-full ${className}`}
      style={{
        perspective: "1200px",
        zIndex,
      }}
      initial={{
        rotateZ: rotation,
        y: yOffset,
        opacity: 0,
      }}
      whileInView={{
        rotateZ: rotation,
        y: yOffset,
        opacity: 1,
      }}
      whileHover={{
        rotateZ: 0,
        y: -10,
        scale: 1.05,
        zIndex: total + 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}
