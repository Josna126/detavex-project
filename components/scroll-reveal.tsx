"use client"

import { motion, useInView } from "framer-motion"
import { useRef, ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const directionMap = {
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
  }

  const initial = directionMap[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface CountUpProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export function CountUp({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div ref={ref}>
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay }}
        >
          <CountUpValue
            from={from}
            to={to}
            duration={duration}
            delay={delay}
            suffix={suffix}
            prefix={prefix}
            decimals={decimals}
          />
        </motion.span>
      ) : (
        <span>
          {prefix}
          {from}
          {suffix}
        </span>
      )}
    </motion.div>
  )
}

function CountUpValue({
  from,
  to,
  duration,
  delay,
  suffix,
  prefix,
  decimals,
}: Omit<CountUpProps, "from"> & { from: number }) {
  const count = useRef(from)
  const displayValue = useRef(from)

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {(() => {
        const increment = (to - from) / (duration * 60)
        count.current += increment

        if (count.current >= to) {
          displayValue.current = to
        } else {
          displayValue.current = Math.floor(count.current * Math.pow(10, decimals)) / Math.pow(10, decimals)
        }

        return `${prefix}${displayValue.current}${suffix}`
      })()}
    </motion.span>
  )
}
