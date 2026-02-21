"use client"

import { AnimatedHero } from "@/components/animated-hero"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksTeaser } from "@/components/how-it-works-teaser"
import { StatsBar } from "@/components/stats-bar"
import { PageTransition } from "@/components/page-transition"

export default function HomePage() {
  return (
    <PageTransition>
      <AnimatedHero />
      <FeaturesSection />
      <StatsBar />
      <HowItWorksTeaser />
    </PageTransition>
  )
}
