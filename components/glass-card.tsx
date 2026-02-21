"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { useState, useRef } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  hover = true,
  onClick,
}: GlassCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !hover) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const rotX = ((y - rect.height / 2) / rect.height) * 8
    const rotY = ((x - rect.width / 2) / rect.width) * -8
    
    setRotateX(rotX)
    setRotateY(rotY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      whileHover={hover ? { y: -6, scale: 1.02 } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={onClick}
      style={{
        perspective: "1200px",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "glass rounded-xl p-6 relative overflow-hidden group",
        hover && "cursor-pointer",
        className
      )}
    >
      {/* Shine effect on hover */}
      {hover && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.2 }}
        />
      )}
      <div style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  )
}

export function GlassCardStrong({
  children,
  className,
  hover = true,
  onClick,
}: GlassCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !hover) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const rotX = ((y - rect.height / 2) / rect.height) * 10
    const rotY = ((x - rect.width / 2) / rect.width) * -10
    
    setRotateX(rotX)
    setRotateY(rotY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      whileHover={hover ? { y: -8, scale: 1.03 } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={onClick}
      style={{
        perspective: "1200px",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "glass-strong rounded-xl p-6 relative overflow-hidden group",
        hover && "cursor-pointer",
        className
      )}
    >
      {/* Shine effect on hover */}
      {hover && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.3 }}
        />
      )}
      <div style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  )
}
