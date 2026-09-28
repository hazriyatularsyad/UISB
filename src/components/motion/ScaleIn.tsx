"use client"

import { motion, useReducedMotion } from "motion/react"

interface ScaleInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  as?: "div" | "span" | "button"
}

const defaultEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function ScaleIn({
  children,
  delay = 0,
  duration,
  className,
  as = "div",
}: ScaleInProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    const Component = as
    return <Component className={className}>{children}</Component>
  }

  const transition = {
    duration: duration ?? 0.4,
    ease: defaultEase,
    delay,
  }

  if (as === "div") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    )
  }
  if (as === "span") {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition}
        className={className}
      >
        {children}
      </motion.span>
    )
  }
  if (as === "button") {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition}
        className={className}
      >
        {children}
      </motion.button>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}