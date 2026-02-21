"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useShow3DHero } from "@/hooks/use-webgl"

const HeroGlobeCanvas = dynamic(
  () => import("@/components/3d/HeroGlobeCanvas").then((m) => m.HeroGlobeCanvas),
  { ssr: false }
)

// Temporarily disabled to prevent client-side errors
const DisabledHeroGlobeCanvas = () => null

const headlines = [
  "Turn companies into opportunities.",
  "Turn data into decisions.",
  "Turn insights into action.",
]

function ParticleField() {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number; type: 'indigo' | 'teal' | 'coral' }>
  >([])

  useEffect(() => {
    setMounted(true)
    const generated = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
      type: ['indigo', 'teal', 'coral'][Math.floor(Math.random() * 3)] as 'indigo' | 'teal' | 'coral'
    }))
    setParticles(generated)
  }, [])

  if (!mounted) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 particle-field" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 neural-grid opacity-40" />
      <div className="absolute inset-0 particle-field" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full blur-sm ${
            p.type === 'indigo' ? 'bg-indigo/30' : 
            p.type === 'teal' ? 'bg-teal/30' : 
            'bg-coral/30'
          }`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            filter: `blur(${p.size * 0.3}px)`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.05, 0.8, 0.05],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-indigo/15 via-teal/5 to-background"
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute inset-0 bg-radial-gradient"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export function AnimatedHero() {
  const router = useRouter()
  const show3D = useShow3DHero()
  const [mounted, setMounted] = useState(false)
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [domain, setDomain] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [mounted])

  const handleAnalyze = useCallback(() => {
    if (domain.trim()) {
      router.push(`/results/${encodeURIComponent(domain.trim())}`)
    }
  }, [domain, router])

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 overflow-hidden">
      {show3D ? (
        <HeroGlobeCanvas />
      ) : (
        <ParticleField />
      )}

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center" style={{ perspective: "1200px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="mb-8 flex items-center gap-3 rounded-full border border-indigo/40 bg-gradient-to-r from-indigo/10 to-teal/10 px-6 py-3 glass-morphism backdrop-blur-xl"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="h-5 w-5 text-indigo glow-indigo" />
          </motion.div>
          <span className="text-sm font-semibold text-gradient-cyber">
            Multi-Agent AI Intelligence
          </span>
        </motion.div>

        <div className="mb-8 h-[5rem] sm:h-[6rem] md:h-[7rem] flex items-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={headlineIndex}
              initial={{ opacity: 0, y: 40, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -40, rotateX: -90 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl text-foreground drop-shadow-lg"
            >
              <span className="text-gradient-cyber">{headlines[headlineIndex]}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          Our multi-agent AI researches any company and tells you if
          they&apos;re worth pursuing &mdash; and why.
        </motion.p>

        <SearchFormComponent domain={domain} setDomain={setDomain} isFocused={isFocused} setIsFocused={setIsFocused} handleAnalyze={handleAnalyze} />

        <StatsCardGrid />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-12 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
          <motion.div 
            className="h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-indigo to-transparent"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

function SearchFormComponent({ domain, setDomain, isFocused, setIsFocused, handleAnalyze }: any) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleAnalyze()
        }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <motion.div 
          className="relative flex-1"
          whileHover={{ scale: 1.02 }}
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter company domain..."
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`h-14 premium-card pr-4 pl-4 text-base transition-all duration-300 ${
              isFocused
                ? "glow-indigo scale-[1.02]"
                : ""
            }`}
            aria-label="Company domain to analyze"
          />
          {isFocused && (
            <motion.div
              layoutId="focus-ring"
              className="absolute inset-0 rounded-lg border-2 border-indigo/50 glow-indigo"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.div>
        <Button
          type="submit"
          size="lg"
          className="group h-14 gap-3 px-8 text-base font-semibold magnetic-button premium-card relative overflow-hidden"
          disabled={!domain.trim()}
        >
          <motion.span 
            className="relative z-10"
            whileHover={{ scale: 1.1 }}
          >
            Analyze
          </motion.span>
          <motion.div
            className="relative z-10 transition-transform"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo to-teal opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          />
        </Button>
      </form>
    </motion.div>
  )
}

function StatsCardGrid() {
  const cards = [
    { value: "10M+", label: "Companies Analyzed" },
    { value: "99.8%", label: "Accuracy Rate" },
    { value: "2.3s", label: "Avg. Analysis Time" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center"
    >
      {cards.map((stat, index) => (
        <Tilt3DCard key={index} delay={2 + index * 0.1}>
          <div className="glass-morphism rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-3xl font-bold text-gradient-cyber mb-2">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        </Tilt3DCard>
      ))}
    </motion.div>
  )
}

function Tilt3DCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const rotX = ((y - rect.height / 2) / rect.height) * 15
    const rotY = ((x - rect.width / 2) / rect.width) * -15
    
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 } as any}
    >
      {children}
    </motion.div>
  )
}
}
