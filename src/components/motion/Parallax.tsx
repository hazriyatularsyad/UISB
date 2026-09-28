"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"
import { useRef } from "react"

interface ParallaxProps {
  children: React.ReactNode
  distance?: number
  className?: string
  speed?: number
  target?: React.RefObject<HTMLElement>
}

export function Parallax({
  children,
  distance = 60,
  className,
  speed = 0.5,
  target,
}: ParallaxProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const elementRef = target || ref

  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -distance * speed])

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface ParallaxImageProps {
  src: string
  alt: string
  distance?: number
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export function ParallaxImage({
  src,
  alt,
  distance = 40,
  className,
  fill = true,
  priority = false,
  sizes = "100vw",
}: ParallaxImageProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1])

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y, scale }} className={className}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${fill ? "absolute inset-0" : ""}`}
        loading={priority ? "eager" : "lazy"}
      />
    </motion.div>
  )
}