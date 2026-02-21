"use client"

import { motion } from "framer-motion"
import { Brain, Shield, MessageSquareText, Lightbulb } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { StaggerContainer, StaggerItem } from "@/components/page-transition"

const features = [
  {
    icon: Brain,
    title: "Multi-Agent Research",
    description:
      "Eight specialized AI agents collaboratively research, analyze, and assess every prospect from multiple angles.",
    color: "#6366f1",
  },
  {
    icon: Shield,
    title: "Reject-First Logic",
    description:
      "A dedicated Risk Agent actively argues against pursuing — ensuring only high-value leads pass through.",
    color: "#ef4444",
  },
  {
    icon: MessageSquareText,
    title: "Personalized Outreach",
    description:
      "AI-generated outreach messages tailored to each prospect's specific situation, signals, and pain points.",
    color: "#14b8a6",
  },
  {
    icon: Lightbulb,
    title: "Thought Leadership",
    description:
      "Bonus content ideas generated from each analysis to fuel your team's marketing and consulting positioning.",
    color: "#f59e0b",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative px-4 py-24 lg:px-8 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Powerful <span className="text-gradient-cyber">AI Capabilities</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature powered by advanced multi-agent intelligence
          </p>
        </motion.div>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <StaggerItem key={feature.title} delay={index * 0.1}>
              <motion.div
                className="h-full"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <GlassCard className="tilt-card flex h-full flex-col gap-4 overflow-hidden group relative">
                  {/* Animated gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}, transparent)`,
                    }}
                  />

                  {/* Icon container with pulse effect */}
                  <motion.div
                    className="relative flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${feature.color}15`,
                      border: `1px solid ${feature.color}30`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-xl"
                      style={{
                        border: `2px solid ${feature.color}20`,
                      }}
                    />
                    <feature.icon
                      className="h-6 w-6 relative z-10"
                      style={{ color: feature.color }}
                    />
                  </motion.div>

                  {/* Title with gradient on hover */}
                  <motion.h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground flex-grow">
                    {feature.description}
                  </p>

                  {/* Bottom accent line */}
                  <motion.div
                    className="mt-auto pt-3 border-t border-border/50"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    style={{ transformOrigin: "left" }}
                  >
                    <motion.div
                      className="h-0.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                      }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>
                </GlassCard>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
