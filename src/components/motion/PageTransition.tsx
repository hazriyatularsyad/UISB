"use client"

import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { usePathname } from "next/navigation"
import { presets } from "@/lib/motion/presets"

interface PageTransitionProps {
  children: React.ReactNode
  exitDelay?: number
}

export function PageTransition({ children, exitDelay = 0 }: PageTransitionProps) {
  const reduce = useReducedMotion()
  const pathname = usePathname()

  if (reduce) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={presets.pageTransition.initial}
        animate={presets.pageTransition.animate}
        exit={presets.pageTransition.exit}
        transition={{
          ...presets.pageTransition.transition,
          delay: exitDelay,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function PageLoader() {
  const reduce = useReducedMotion()

  if (reduce) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <motion.div
        className="w-12 h-12 border-4 border-uisb-purple border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}