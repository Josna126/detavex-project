# Premium Component Usage Guide

Quick reference for using all the new premium components in your application.

---

## 1. Premium 3D Card

**Component:** `premium-card-3d.tsx`

**Features:**
- Mouse-tracking 3D rotation
- Configurable glow colors
- Three intensity levels
- Shine effects

**Example:**
```tsx
import { Premium3DCard } from "@/components/premium-card-3d"

export function MyCards() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Premium3DCard glowColor="indigo" intensity="high">
        <h3 className="text-xl font-bold mb-2">Premium Card</h3>
        <p className="text-sm text-muted-foreground">
          Move your mouse to see the 3D tilt effect
        </p>
      </Premium3DCard>
      
      <Premium3DCard glowColor="teal" intensity="medium">
        <h3 className="text-xl font-bold mb-2">Another Card</h3>
        <p className="text-sm text-muted-foreground">
          With teal glow effect
        </p>
      </Premium3DCard>
    </div>
  )
}
```

**Props:**
```tsx
interface Premium3DCardProps {
  children: ReactNode           // Card content
  className?: string            // Additional CSS classes
  glowColor?: string           // 'indigo' | 'teal' | 'coral'
  intensity?: "low" | "medium" | "high"  // Tilt intensity
}
```

---

## 2. Premium Button

**Component:** `premium-button.tsx`

**Features:**
- Multiple variants and sizes
- Glow effects on hover
- Spring-based animations
- Optional floating animation

**Example:**
```tsx
import { PremiumButton } from "@/components/premium-button"

export function MyButtons() {
  return (
    <div className="flex gap-4 flex-wrap">
      {/* Primary Button */}
      <PremiumButton 
        variant="primary" 
        size="lg"
        glowEffect
      >
        Get Started
      </PremiumButton>
      
      {/* Secondary Button */}
      <PremiumButton 
        variant="secondary" 
        size="md"
      >
        Learn More
      </PremiumButton>
      
      {/* Ghost Button */}
      <PremiumButton 
        variant="ghost" 
        size="sm"
      >
        Dismiss
      </PremiumButton>
    </div>
  )
}
```

**Props:**
```tsx
interface PremiumButtonProps {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  animated?: boolean        // Enable animations
  glowEffect?: boolean      // Enable glow on hover
  className?: string
  // All standard button props...
}
```

---

## 3. Parallax Section

**Component:** `parallax-section.tsx`

**Features:**
- Scroll-based parallax movement
- Background image parallax
- Floating element animations
- Smooth opacity transitions

**Example:**
```tsx
import { ParallaxSection, FloatingElement } from "@/components/parallax-section"

export function HeroSection() {
  return (
    <ParallaxSection 
      speed={0.5}
      backgroundImage="/hero-bg.jpg"
      className="min-h-screen"
    >
      <div className="flex items-center justify-center h-screen">
        <FloatingElement delay={0.2} duration={4}>
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white">
              Parallax Hero
            </h1>
            <p className="text-xl text-gray-200 mt-4">
              Move down to see the parallax effect
            </p>
          </div>
        </FloatingElement>
      </div>
    </ParallaxSection>
  )
}
```

**Props:**
```tsx
interface ParallaxSectionProps {
  children: ReactNode
  speed?: number              // 0-1 parallax speed
  className?: string
  backgroundImage?: string    // URL to background image
}

interface FloatingElementProps {
  children: ReactNode
  delay?: number             // Delay in seconds
  duration?: number          // Animation duration
}
```

---

## 4. Scroll Reveal

**Component:** `scroll-reveal.tsx`

**Features:**
- Direction-based animations
- CountUp number animations
- Intersection observer optimization
- Configurable timing

**Example:**
```tsx
import { ScrollReveal, CountUp } from "@/components/scroll-reveal"

export function StatisticsSection() {
  return (
    <div className="grid grid-cols-4 gap-8 py-20">
      <ScrollReveal direction="up" delay={0}>
        <div className="text-center">
          <div className="text-5xl font-bold text-gradient-cyber mb-2">
            <CountUp to={10000} suffix="+" duration={2} />
          </div>
          <p className="text-muted-foreground">Companies Analyzed</p>
        </div>
      </ScrollReveal>
      
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center">
          <div className="text-5xl font-bold text-gradient-cyber mb-2">
            <CountUp to={99.8} suffix="%" decimals={1} duration={2} />
          </div>
          <p className="text-muted-foreground">Accuracy Rate</p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="left">
        <div className="p-6 glass-morphism rounded-2xl">
          <h3 className="text-lg font-bold">Feature Left</h3>
          <p>Revealed from the left</p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="right">
        <div className="p-6 glass-morphism rounded-2xl">
          <h3 className="text-lg font-bold">Feature Right</h3>
          <p>Revealed from the right</p>
        </div>
      </ScrollReveal>
    </div>
  )
}
```

**Props:**
```tsx
interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
}

interface CountUpProps {
  from?: number
  to: number
  duration?: number      // Seconds
  delay?: number
  suffix?: string       // e.g., "%", "+", "s"
  prefix?: string       // e.g., "$"
  decimals?: number     // Number of decimal places
}
```

---

## 5. Animated Gradient Background

**Component:** `animated-gradient-bg.tsx`

**Features:**
- Multi-color animated gradients
- Morphing shapes
- Customizable colors and duration
- Layered animation effects

**Example:**
```tsx
import { AnimatedGradientBg, MorphingShape } from "@/components/animated-gradient-bg"

export function GradientSection() {
  return (
    <AnimatedGradientBg
      colors={["#6366f1", "#14b8a6", "#f97066"]}
      animationDuration={15}
      className="py-20 overflow-hidden"
    >
      <MorphingShape 
        color="#6366f1" 
        position="top-left" 
        size="w-96 h-96"
        duration={8}
      />
      
      <MorphingShape 
        color="#14b8a6" 
        position="bottom-right"
        size="w-80 h-80"
        duration={10}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-white mb-4">
          Animated Gradient Background
        </h2>
        <p className="text-xl text-white/80">
          Smooth color transitions with morphing shapes
        </p>
      </div>
    </AnimatedGradientBg>
  )
}
```

**Props:**
```tsx
interface AnimatedGradientBgProps {
  children?: React.ReactNode
  colors?: string[]           // Hex colors
  animationDuration?: number  // Seconds
  className?: string
}

interface MorphingShape {
  duration?: number
  size?: string               // Tailwind size class
  color?: string             // Hex color
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  blur?: string              // Tailwind blur class
}
```

---

## 6. Flip Card 3D

**Component:** `flip-card-3d.tsx`

**Features:**
- 3D flip animation
- Front and back content
- Stack card variations
- Click to flip

**Example:**
```tsx
import { FlipCard3D, StackCard } from "@/components/flip-card-3d"

export function FlipCardDemo() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Simple Flip Card */}
      <div className="h-64">
        <FlipCard3D
          front={
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Front Side</h3>
              <p className="text-sm">Click to flip</p>
            </div>
          }
          back={
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Back Side</h3>
              <p className="text-sm">Click to flip back</p>
            </div>
          }
        />
      </div>

      {/* Stack Cards */}
      <div className="relative h-64">
        {[1, 2, 3].map((i) => (
          <StackCard 
            key={i}
            index={i} 
            total={3}
            className="w-48 h-48"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold">Card {i}</h3>
              <p className="text-sm">Stack effect</p>
            </div>
          </StackCard>
        ))}
      </div>
    </div>
  )
}
```

**Props:**
```tsx
interface FlipCard3DProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
  autoFlip?: boolean
  flipDuration?: number
}

interface StackCardProps {
  children: React.ReactNode
  index: number
  total: number
  className?: string
}
```

---

## 7. Mesh Gradient

**Component:** `mesh-gradient.tsx`

**Features:**
- Canvas-based animated gradient mesh
- Interactive mouse tracking
- OrbitingDots effect
- High-performance animation

**Example:**
```tsx
import { MeshGradient, OrbitingDots } from "@/components/mesh-gradient"

export function MeshGradientDemo() {
  return (
    <MeshGradient
      colors={["#6366f1", "#14b8a6", "#f97066", "#f59e0b"]}
      interactive={true}
      className="relative h-screen"
    >
      <div className="flex items-center justify-center h-full">
        <OrbitingDots itemCount={8} duration={20} radius={150}>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Center Element
            </h2>
            <p className="text-white/80">With orbiting dots</p>
          </div>
        </OrbitingDots>
      </div>
    </MeshGradient>
  )
}
```

**Props:**
```tsx
interface MeshGradientProps {
  children?: React.ReactNode
  colors?: [string, string, string, string]  // 4 colors required
  className?: string
  interactive?: boolean  // Track mouse
}

interface OrbitingDotsProps {
  className?: string
  itemCount?: number     // Number of orbiting dots
  duration?: number      // Animation duration
  radius?: number        // Orbit radius
  children?: React.ReactNode
}
```

---

## Component Combinations

### Example 1: Premium Card Grid
```tsx
import { Premium3DCard } from "@/components/premium-card-3d"
import { ScrollReveal } from "@/components/scroll-reveal"

export function CardGrid() {
  return (
    <div className="grid grid-cols-3 gap-6 py-20">
      {[1, 2, 3].map((i) => (
        <ScrollReveal key={i} direction="up" delay={i * 0.1}>
          <Premium3DCard glowColor="indigo" intensity="medium">
            <h3 className="text-lg font-bold mb-2">Card {i}</h3>
            <p className="text-sm text-muted-foreground">
              Scroll to reveal with 3D tilt
            </p>
          </Premium3DCard>
        </ScrollReveal>
      ))}
    </div>
  )
}
```

### Example 2: Gradient Hero
```tsx
import { AnimatedGradientBg, MorphingShape } from "@/components/animated-gradient-bg"
import { PremiumButton } from "@/components/premium-button"

export function GradientHero() {
  return (
    <AnimatedGradientBg className="min-h-screen flex items-center justify-center">
      <MorphingShape color="#6366f1" position="top-left" />
      <MorphingShape color="#14b8a6" position="bottom-right" />
      
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Welcome to Premium UI
        </h1>
        <PremiumButton variant="primary" size="lg">
          Get Started
        </PremiumButton>
      </div>
    </AnimatedGradientBg>
  )
}
```

### Example 3: Scroll Reveal Stats
```tsx
import { ScrollReveal, CountUp } from "@/components/scroll-reveal"
import { Premium3DCard } from "@/components/premium-card-3d"

export function StatsWithReveal() {
  return (
    <div className="grid grid-cols-4 gap-6 py-20">
      {[1, 2, 3, 4].map((i) => (
        <ScrollReveal 
          key={i} 
          direction="up" 
          delay={i * 0.1}
        >
          <Premium3DCard glowColor="teal">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-cyber mb-2">
                <CountUp to={1000 * i} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground">
                Stat {i}
              </p>
            </div>
          </Premium3DCard>
        </ScrollReveal>
      ))}
    </div>
  )
}
```

---

## Animation Timing Reference

**Easing Functions (Built-in):**
```
[0.22, 1, 0.36, 1]  // Default smooth easing
"easeInOut"          // Standard easing
"linear"             // No easing
"circOut"            // Circular easing
"backOut"            // Back easing
```

**Recommended Durations:**
```
0.3-0.4s    // Button clicks, small elements
0.5-0.8s    // Component entrances
1-2s        // Page transitions
2-4s        // Parallax and scroll effects
3-6s        // Background animations
8-20s       // Continuous loop animations
```

---

## Performance Tips

✅ **Best Practices:**
1. Use `transform` and `opacity` for animations
2. Lazy load heavy components
3. Test on mobile devices
4. Use `will-change` sparingly
5. Implement `prefers-reduced-motion`

⚠️ **Avoid:**
- Animating `width`, `height`, or `position`
- Multiple simultaneous complex animations
- High particle counts (60-80 max)
- Unnecessary `blur` effects on mobile

---

## Accessibility

Add accessibility features:
```tsx
<Premium3DCard 
  aria-label="Premium feature card"
  role="region"
>
  Content
</Premium3DCard>

// Respect user preferences
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 3D effects not showing | Check browser supports CSS 3D transforms |
| Animations stuttering | Reduce particle count or animation duration |
| Performance issues | Profile with DevTools, disable some effects |
| Mobile looks different | Test on actual devices, adjust responsive classes |

---

## Quick Start Template

```tsx
import { Premium3DCard } from "@/components/premium-card-3d"
import { PremiumButton } from "@/components/premium-button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedGradientBg } from "@/components/animated-gradient-bg"

export function MyPremiumPage() {
  return (
    <>
      <AnimatedGradientBg className="min-h-screen pt-20">
        <div className="mx-auto max-w-4xl px-4">
          <ScrollReveal direction="up">
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.2}>
            <PremiumButton variant="primary" size="lg">
              Get Started
            </PremiumButton>
          </ScrollReveal>
        </div>
      </AnimatedGradientBg>

      <div className="grid grid-cols-3 gap-6 py-20 px-4">
        {[1, 2, 3].map((i) => (
          <ScrollReveal key={i} direction="up" delay={i * 0.1}>
            <Premium3DCard>
              <h3 className="text-lg font-bold mb-2">Feature {i}</h3>
              <p>Premium content</p>
            </Premium3DCard>
          </ScrollReveal>
        ))}
      </div>
    </>
  )
}
```

---

Happy building! 🚀
