// Motion presets combining variants and transitions for common UISB patterns

import type { Transition } from "motion/react"
import { imageReveal } from "./variants"
import {
  easings,
  durations,
  stagger,
  heroEntrance,
  scrollReveal,
  staggerCard,
  cardHover,
  imageHover,
  ctaHover,
  arrowHover,
  pageTransition,
  navbarEntrance,
  modalEntrance,
  reducedMotionTransition,
} from "./transitions"

export const presets = {
  // Hero section entrance
  hero: {
    container: heroEntrance.container,
    item: heroEntrance.item,
    initial: heroEntrance.initial,
  },

  // Scroll reveal for sections
  sectionReveal: scrollReveal,

  // Staggered card grid
  cardGrid: staggerCard,

  // Individual card
  card: {
    initial: { opacity: 0, y: 25, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.35, ease: easings.easeOut },
    whileHover: cardHover.hover,
  },

  // Image with hover zoom
  image: {
    initial: { scale: 1 },
    whileHover: imageHover.hover,
  },

  // Image reveal with clip-path
  imageReveal: {
    initial: { clipPath: "inset(0 100% 0 0)" },
    animate: { clipPath: "inset(0 0% 0 0)" },
    transition: { duration: 0.9, ease: "easeInOut" },
  },

  // CTA button
  cta: {
    initial: { scale: 1 },
    whileHover: ctaHover.hover,
    whileTap: ctaHover.tap,
    transition: ctaHover.transition,
  },

  // Arrow in CTA
  arrow: {
    initial: { x: 0 },
    whileHover: arrowHover.hover,
    transition: arrowHover.transition,
  },

  // Page transition
  page: pageTransition,

  // Navbar entrance
  navbar: navbarEntrance,

  // Modal/dialog
  modal: modalEntrance,

  // Backdrop
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  // Scroll reveal with direction
  reveal: (direction: "up" | "down" | "left" | "right" = "up") => {
    const directions = {
      up: { y: 40, x: 0 },
      down: { y: -40, x: 0 },
      left: { x: -40, y: 0 },
      right: { x: 40, y: 0 },
    }
    return {
      initial: { opacity: 0, ...directions[direction] },
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: durations.reveal, ease: easings.easeOut },
      viewport: { once: true, amount: 0.2 },
    }
  },

  // Stagger container
  stagger: (staggerValue: number = stagger.normal, delayChildren = 0) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: staggerValue, delayChildren },
    },
  }),

  // Reduced motion fallback
  reducedMotion: reducedMotionTransition,

  // Page transition for Next.js
  pageTransition: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: durations.pageTransition, ease: easings.easeOut },
  },
} as const

// Helper to get transition with reduced motion support
export function getTransition(transition: Transition): Transition {
  // This will be replaced at runtime with reduced motion check
  return transition
}

// Utility to create conditional transitions based on reduced motion
export function createTransition(
  normal: Transition,
  reduced: Transition = { duration: 0.01 }
): Transition {
  // Used with useReducedMotion hook
  return normal // The component will handle the conditional
}

// Common transition combinations
export const transitions = {
  // For entrance animations
  entrance: { duration: durations.hero, ease: easings.easeOut },
  entranceFast: { duration: durations.normal, ease: easings.easeOut },

  // For hover interactions
  hover: easings.spring,
  hoverGentle: easings.springGentle,
  hoverSnappy: easings.springSnappy,

  // For page transitions
  page: { duration: durations.pageTransition, ease: easings.easeOut },

  // For micro interactions
  micro: { duration: durations.fast, ease: easings.easeOut },
  microSpring: easings.springGentle,

  // For stagger
  stagger: (delay = stagger.normal) => ({ staggerChildren: delay }),
} as const