"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import { useRef } from "react"
import { presets } from "@/lib/motion/presets"

interface RevealProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
  className?: string
  as?: "div" | "section" | "span" | "article" | "li"
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration,
  once = true,
  amount = 0.2,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion()
  const animation = presets.reveal(direction)
  const transition = duration ? { ...animation.transition, duration } : animation.transition

  if (reduce) {
    const Component = as
    return <Component className={className}>{children}</Component>
  }

  if (as === "div") {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once, amount })
    return (
      <motion.div
        ref={ref}
        initial={animation.initial}
        animate={inView ? animation.animate : animation.initial}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    )
  }
  if (as === "section") {
    const ref = useRef<HTMLElement>(null)
    const inView = useInView(ref, { once, amount })
    return (
      <motion.section
        ref={ref}
        initial={animation.initial}
        animate={inView ? animation.animate : animation.initial}
        transition={transition}
        className={className}
      >
        {children}
      </motion.section>
    )
  }
  if (as === "span") {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once, amount })
    return (
      <motion.span
        ref={ref}
        initial={animation.initial}
        animate={inView ? animation.animate : animation.initial}
        transition={transition}
        className={className}
      >
        {children}
      </motion.span>
    )
  }
  if (as === "article") {
    const ref = useRef<HTMLElement>(null)
    const inView = useInView(ref, { once, amount })
    return (
      <motion.article
        ref={ref}
        initial={animation.initial}
        animate={inView ? animation.animate : animation.initial}
        transition={transition}
        className={className}
      >
        {children}
      </motion.article>
    )
  }
  if (as === "li") {
    const ref = useRef<HTMLLIElement>(null)
    const inView = useInView(ref, { once, amount })
    return (
      <motion.li
        ref={ref}
        initial={animation.initial}
        animate={inView ? animation.animate : animation.initial}
        transition={transition}
        className={className}
      >
        {children}
      </motion.li>
    )
  }
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.initial}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RevealGroupProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
}: RevealGroupProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={presets.stagger(stagger, delayChildren)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RevealItemProps {
  children: React.ReactNode
  className?: string
  index?: number
  custom?: string
}

export function RevealItem({
  children,
  className,
  index = 0,
}: RevealItemProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      custom={index}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: index * 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}