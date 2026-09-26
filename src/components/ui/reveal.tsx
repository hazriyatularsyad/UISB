"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right" | "none"

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
  none: { x: 0, y: 0 },
}

interface RevealProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  amount?: number
  once?: boolean
  className?: string
  as?: "div" | "section" | "span" | "li"
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  amount = 0.2,
  once = true,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as]

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  const { x, y } = offsets[direction]

  return (
    <Comp
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  )
}

interface RevealGroupProps {
  children: ReactNode
  className?: string
}

export function RevealGroup({ children, className }: RevealGroupProps) {
  return <div className={className}>{children}</div>
}

interface RevealItemProps {
  children: ReactNode
  index?: number
  direction?: Direction
  stagger?: number
  baseDelay?: number
  duration?: number
  amount?: number
  once?: boolean
  className?: string
}

export function RevealItem({
  children,
  index = 0,
  direction = "up",
  stagger = 0.08,
  baseDelay = 0,
  duration = 0.55,
  amount = 0.2,
  once = true,
  className,
}: RevealItemProps) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  const { x, y } = offsets[direction]

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay: baseDelay + index * stagger,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface CountUpProps {
  to: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function CountUp({
  to,
  duration = 1.6,
  suffix = "",
  prefix = "",
  className,
}: CountUpProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 20 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    mv.set(inView ? to : 0)
  }, [inView, to, mv])

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)))
    return unsub
  }, [spring])

  if (reduce) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {to}
        {suffix}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
