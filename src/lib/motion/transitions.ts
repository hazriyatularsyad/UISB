// Motion transition presets for UISB

export const easings = {
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeInOut: [0.42, 0, 0.58, 1] as const,
  easeOutExpo: [0.19, 1, 0.22, 1] as const,
  spring: { type: "spring" as const, stiffness: 300, damping: 24 },
  springGentle: { type: "spring" as const, stiffness: 260, damping: 26 },
  springSnappy: { type: "spring" as const, stiffness: 400, damping: 20 },
} as const

export const durations = {
  fast: 0.15,
  normal: 0.25,
  medium: 0.35,
  slow: 0.5,
  hero: 0.7,
  reveal: 0.7,
  imageReveal: 0.9,
  pageTransition: 0.35,
} as const

export const stagger = {
  tight: 0.05,
  normal: 0.08,
  loose: 0.12,
  section: 0.15,
} as const

export const heroEntrance = {
  container: {
    staggerChildren: stagger.normal,
    delayChildren: stagger.section,
  },
  item: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.hero,
      ease: easings.easeOut,
    },
  },
  initial: {
    opacity: 0,
    y: 30,
  },
} as const

export const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: durations.reveal, ease: easings.easeOut },
  viewport: { once: true, amount: 0.2 },
} as const

export const staggerCard = {
  container: {
    staggerChildren: stagger.normal,
  },
  item: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.medium,
      ease: easings.easeOut,
    },
  },
  initial: {
    opacity: 0,
    y: 25,
    scale: 0.98,
  },
} as const

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.01,
    transition: easings.spring,
  },
} as const

export const imageHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.04,
    transition: { duration: 0.5, ease: easings.easeOut },
  },
} as const

export const ctaHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  transition: easings.springGentle,
} as const

export const arrowHover = {
  rest: { x: 0 },
  hover: { x: 4 },
  transition: easings.springGentle,
} as const

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: {
    duration: durations.pageTransition,
    ease: easings.easeOut,
  },
} as const

export const navbarEntrance = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easings.easeOut },
} as const

export const modalEntrance = {
  initial: { opacity: 0, scale: 0.96, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 10 },
  transition: { duration: 0.22, ease: easings.easeOut },
} as const

export const reducedMotionTransition = {
  duration: 0.01,
  ease: "linear" as const,
} as const