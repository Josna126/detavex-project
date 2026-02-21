"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/page-transition"

const stats = [
  { value: 12, suffix: "+", label: "Companies Analyzed" },
  { value: 8, suffix: "", label: "AI Agents" },
  { value: 94, suffix: "%", label: "Confidence Rate" },
  { value: 3, suffix: "s", label: "Avg. Analysis Time" },
]

function Counter({
  end,
  suffix,
  label,
  index,
}: {
  end: number
  suffix: string
  label: string
  index: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1200
          const steps = 30
          const increment = end / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  return (
    <motion.div 
      ref={ref} 
      className="flex flex-col items-center gap-2 group relative p-4 rounded-lg hover:bg-muted/50 transition-colors"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, type: "spring", bounce: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <motion.span 
        className="text-3xl font-bold tracking-tight text-gradient-cyber sm:text-4xl group-hover:scale-110 transition-transform"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
      >
        {count}
        {suffix}
      </motion.span>
      <motion.span 
        className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors"
        whileHover={{ scale: 1.05 }}
      >
        {label}
      </motion.span>

      {/* Animated bottom accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId={`stat-accent-${index}`}
      />
    </motion.div>
  )
}

export function StatsBar() {
  return (
    <section className="relative border-y border-border/50 bg-muted/30 px-4 py-16 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 20% 50%, #6366f1, transparent 50%), radial-gradient(circle at 80% 80%, #14b8a6, transparent 50%)"
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <FadeIn>
        <motion.div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 relative z-10">
          {stats.map((stat, index) => (
            <Counter
              key={stat.label}
              end={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={index}
            />
          ))}
        </motion.div>
      </FadeIn>
    </section>
  )
}
