"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface MeshGradientProps {
  children?: React.ReactNode
  colors?: [string, string, string, string]
  className?: string
  interactive?: boolean
}

export function MeshGradient({
  children,
  colors = ["#6366f1", "#14b8a6", "#f97066", "#f59e0b"],
  className = "",
  interactive = true,
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    let time = 0
    const animate = () => {
      time += 0.005
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      // Create gradient points
      const points = [
        {
          x: w * 0.2 + Math.sin(time * 0.5) * 50,
          y: h * 0.2 + Math.cos(time * 0.7) * 50,
          color: colors[0],
        },
        {
          x: w * 0.8 + Math.sin(time * 0.3) * 50,
          y: h * 0.2 + Math.cos(time * 0.5) * 50,
          color: colors[1],
        },
        {
          x: w * 0.5 + Math.sin(time * 0.4) * 50,
          y: h * 0.8 + Math.cos(time * 0.6) * 50,
          color: colors[2],
        },
        {
          x: interactive ? mousePos.x : w * 0.3,
          y: interactive ? mousePos.y : h * 0.7,
          color: colors[3],
        },
      ]

      // Draw gradient mesh
      const radius = 300
      points.forEach((point, i) => {
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius)
        gradient.addColorStop(0, point.color + "40")
        gradient.addColorStop(1, point.color + "00")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [colors, mousePos, interactive])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMouseMove}
        style={{ opacity: 0.6 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

interface OrbitingDotsProps {
  className?: string
  itemCount?: number
  duration?: number
  radius?: number
  children?: React.ReactNode
}

export function OrbitingDots({
  className = "",
  itemCount = 6,
  duration = 20,
  radius = 120,
  children,
}: OrbitingDotsProps) {
  return (
    <div className={`relative ${className}`} style={{ width: radius * 2, height: radius * 2 }}>
      {/* Center item */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {children}
      </div>

      {/* Orbiting dots */}
      {Array.from({ length: itemCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-indigo rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            top: "50%",
            left: "50%",
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
          }}
        >
          <motion.div
            style={{
              x: Math.cos((i / itemCount) * Math.PI * 2) * radius,
              y: Math.sin((i / itemCount) * Math.PI * 2) * radius,
            }}
            animate={{
              x: [
                Math.cos((i / itemCount) * Math.PI * 2) * radius,
                Math.cos(((i + 0.25) / itemCount) * Math.PI * 2) * radius,
                Math.cos(((i + 0.5) / itemCount) * Math.PI * 2) * radius,
              ],
              y: [
                Math.sin((i / itemCount) * Math.PI * 2) * radius,
                Math.sin(((i + 0.25) / itemCount) * Math.PI * 2) * radius,
                Math.sin(((i + 0.5) / itemCount) * Math.PI * 2) * radius,
              ],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="rounded-full bg-gradient-to-r from-indigo to-teal w-2 h-2"
          />
        </motion.div>
      ))}
    </div>
  )
}
