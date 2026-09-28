"use client"

import { motion, useReducedMotion } from "motion/react"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  as?: "div" | "span" | "section" | "article"
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLElement>
  id?: string
}

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const defaultEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function FadeIn({
  children,
  delay = 0,
  duration,
  className,
  as = "div",
  style,
  onClick,
  id,
}: FadeInProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    const Component = as
    return <Component className={className} style={style} onClick={onClick} id={id}>{children}</Component>
  }

  const transition = {
    duration: duration ?? 0.5,
    ease: [0.22, 1, 0.36, 1] as const,
    delay,
  }

  if (as === "div") {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
        transition={transition}
        className={className}
        style={style}
        onClick={onClick}
        id={id}
      >
        {children}
      </motion.div>
    )
  }
  if (as === "span") {
    return (
      <motion.span
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
        transition={transition}
        className={className}
      >
        {children}
      </motion.span>
    )
  }
  if (as === "section") {
    return (
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
        transition={transition}
        className={className}
        style={style}
        onClick={onClick}
        id={id}
      >
        {children}
      </motion.section>
    )
  }
  if (as === "article") {
    return (
      <motion.article
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
        transition={transition}
        className={className}
        style={style}
        onClick={onClick}
        id={id}
      >
        {children}
      </motion.article>
    )
  }
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      transition={transition}
      className={className}
      style={style}
      onClick={onClick}
      id={id}
    >
      {children}
    </motion.div>
  )
}