"use client"

import { motion, useReducedMotion } from "motion/react"

interface SlideUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
  as?: "div" | "section" | "article"
}

const defaultEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function SlideUp({
  children,
  delay = 0,
  duration,
  distance = 30,
  className,
  as = "div",
}: SlideUpProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    const Component = as
    return <Component className={className}>{children}</Component>
  }

  const transition = {
    duration: duration ?? 0.6,
    ease: defaultEase,
    delay,
  }

  if (as === "div") {
    return (
      <motion.div
        initial={{ opacity: 0, y: distance }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    )
  }
  if (as === "section") {
    return (
      <motion.section
        initial={{ opacity: 0, y: distance }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={className}
      >
        {children}
      </motion.section>
    )
  }
  if (as === "article") {
    return (
      <motion.article
        initial={{ opacity: 0, y: distance }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={className}
      >
        {children}
      </motion.article>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}