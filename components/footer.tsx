"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Hexagon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-auto border-t border-border/50 overflow-hidden">
      {/* Animated gradient line */}
      <motion.div 
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-5"
        style={{
          background: "radial-gradient(circle, #6366f1, transparent)"
        }}
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 lg:px-8 md:flex-row md:justify-between relative z-10">
        <motion.div 
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="group-hover:pause"
          >
            <Hexagon className="h-5 w-5 text-gradient-cyber fill-primary/10 group-hover:fill-primary/20 transition-colors" />
          </motion.div>
          <span className="text-sm font-semibold text-foreground group-hover:text-gradient-cyber transition-colors">
            Data<span className="text-gradient-cyber">Vex</span>
          </span>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <span className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors">
            Prospect Intelligence Engine
          </span>
        </motion.div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <motion.div
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/about"
              className="transition-colors hover:text-gradient-cyber relative group"
            >
              About
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-teal rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>

          <motion.span 
            className="cursor-default hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            Privacy
          </motion.span>

          <motion.span 
            className="cursor-default hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            Terms
          </motion.span>

          <motion.span
            className="font-medium group"
            initial={{ opacity: 0.6 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            &copy; {currentYear} <span className="text-gradient-cyber group-hover:neon-glow-indigo transition-all">DataVex</span>
          </motion.span>
        </div>
      </div>
    </footer>
  )
}
