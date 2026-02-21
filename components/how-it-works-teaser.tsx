"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { AgentIcon } from "@/components/agent-icon"
import { FadeIn } from "@/components/page-transition"
import { agents } from "@/lib/mock-data"

export function HowItWorksTeaser() {
  return (
    <section className="relative px-4 py-24 lg:px-8 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, #6366f1, transparent 60%)"
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-4xl text-center relative z-10">
        <FadeIn>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
              Powered by{" "}
              <span className="text-gradient-cyber">eight intelligent agents</span>
            </h2>
            <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
              Each agent brings a unique perspective to every analysis, creating a
              comprehensive intelligence picture.
            </p>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div 
            className="mb-10 flex flex-wrap items-center justify-center gap-4 p-6 rounded-2xl glass-morphism backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.15, y: -4 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  whileHover={{ 
                    rotate: 0,
                    scale: 1.1,
                    boxShadow: `0 0 20px ${agent.color}80`
                  }}
                >
                  <AgentIcon
                    icon={agent.icon}
                    color={agent.color}
                    size="md"
                  />
                </motion.div>
                <motion.span 
                  className="text-xs font-medium text-muted-foreground group-hover:text-gradient-cyber transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {agent.name}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/how-it-works"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-primary/10 to-teal/10 hover:from-primary/20 hover:to-teal/20 text-gradient-cyber transition-all duration-300 border border-primary/20 hover:border-primary/40"
            >
              Explore the agent minds
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  )
}
