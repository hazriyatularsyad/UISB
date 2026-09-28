"use client"

import { motion, useReducedMotion } from "motion/react"
import { presets } from "@/lib/motion/presets"

interface ImageRevealProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export function ImageReveal({
  src,
  alt,
  fill = true,
  className,
  priority = false,
  sizes = "100vw",
}: ImageRevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${fill ? "absolute inset-0" : ""}`}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    )
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      animate="visible"
      variants={presets.imageReveal}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${fill ? "absolute inset-0" : ""}`}
        loading={priority ? "eager" : "lazy"}
      />
    </motion.div>
  )
}