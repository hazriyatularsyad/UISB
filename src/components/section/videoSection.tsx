"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { FaPlay, FaXmark } from "react-icons/fa6"
import type { VideoItem } from "@/lib/data-store"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

function extractYoutubeId(urlOrId: string): string {
  const t = urlOrId.trim()
  if (!t.includes("/") && !t.includes("?") && t.length <= 20) return t
  try {
    const u = new URL(t)
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0]
    if (u.searchParams.get("v")) return u.searchParams.get("v")!
    const m = u.pathname.match(/\/embed\/([^/?]+)/)
    if (m) return m[1]
  } catch {}
  return t
}

export default function VideoSection({ items }: { items: VideoItem[] }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const reduce = useReducedMotion()

  const next = useCallback(() => {
    setActive((prev) => (items.length ? (prev + 1) % items.length : 0))
  }, [items.length])

  const prev = useCallback(() => {
    setActive((prev) => (items.length ? (prev - 1 + items.length) % items.length : 0))
  }, [items.length])

  useEffect(() => {
    if (items.length <= 1 || isPaused || selectedVideo) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [items.length, isPaused, selectedVideo, next])

  if (items.length === 0) {
    return (
      <section className="overflow-hidden bg-white px-4 py-16 font-sans sm:px-6 lg:px-8">
        <VideoHeader />
        <p className="text-center text-sm text-slate-500">No videos yet.</p>
      </section>
    )
  }

  return (
    <section
      className="relative overflow-hidden 
       px-4 py-20 font-sans sm:px-6 lg:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative perspective floor */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-[35%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-uisb-purple/10 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl">
        <VideoHeader />

        {/* 3D Perspective Stage */}
        <div
          className="relative mx-auto flex min-h-[420px] items-center justify-center "
          style={{ perspective: "1200px" }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => {
              const id = item.id
              const offset = index - active
              const normalizedOffset =
                offset > items.length / 2
                  ? offset - items.length
                  : offset < -items.length / 2
                    ? offset + items.length
                    : offset

              const isCenter = normalizedOffset === 0
              const isVisible = Math.abs(normalizedOffset) <= 2
              if (!isVisible) return null

              const abs = Math.abs(normalizedOffset)
              const rotateY = normalizedOffset * -28
              const translateX = normalizedOffset * (typeof window !== "undefined" && window.innerWidth < 768 ? 110 : 260)
              const translateZ = -abs * 180
              const scale = 1 - abs * 0.18
              const opacity = 1 - abs * 0.35
              const zIndex = items.length - abs

              return (
                <CarouselCard
                  key={id}
                  item={item}
                  isCenter={isCenter}
                  reduce={reduce}
                  transform={{
                    rotateY,
                    translateX,
                    translateZ,
                    scale,
                    opacity,
                  }}
                  zIndex={zIndex}
                  onClick={() => setSelectedVideo(extractYoutubeId(item.youtube_id))}
                  onPrev={prev}
                  onNext={next}
                />
              )
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className=" flex flex-col items-center gap-5">
          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <CarouselButton onClick={prev} aria-label="Previous video" direction="left" />
            <CarouselButton onClick={next} aria-label="Next video" direction="right" />
          </div>

          {/* Current title */}
          <AnimatePresence mode="wait">
            <motion.p
              key={items[active].id}
              initial={reduce ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-xl text-center text-sm font-medium text-slate-600 md:text-base"
            >
              
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={reduce ? undefined : { scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.96, y: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white/90 transition-colors hover:bg-black/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close video"
              >
                <FaXmark className="h-5 w-5" aria-hidden />
              </button>
              <div className="relative aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube Video Player"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function VideoHeader() {
  return (
    <Reveal direction="up" className="mb-14 text-center">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-uisb-purple">
        Media
      </span>
      <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        UISB Highlights
      </h2>
      <div className="mx-auto mt-4 h-[2px] w-20 bg-amber-500" />
    </Reveal>
  )
}

interface CarouselCardProps {
  item: VideoItem
  isCenter: boolean
  reduce: boolean | null
  transform: {
    rotateY: number
    translateX: number
    translateZ: number
    scale: number
    opacity: number
  }
  zIndex: number
  onClick: () => void
  onPrev: () => void
  onNext: () => void
}

function CarouselCard({ item, isCenter, reduce, transform, zIndex, onClick, onPrev, onNext }: CarouselCardProps) {
  return (
    <motion.button
      layout
      type="button"
      onClick={() => (isCenter ? onClick() : transform.translateX < 0 ? onNext() : onPrev())}
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={{
        opacity: transform.opacity,
        scale: transform.scale,
        x: transform.translateX,
        y: 0,
        rotateY: transform.rotateY,
        z: transform.translateZ,
      }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 22,
        mass: 0.9,
      }}
      style={{
        transformStyle: "preserve-3d",
        zIndex,
      }}
      className={cn(
        "group absolute aspect-[4/3] w-[78vw] max-w-[420px] cursor-pointer overflow-hidden bg-slate-900 shadow-2xl will-change-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uisb-purple focus-visible:ring-offset-4 md:w-[420px]",
        isCenter ? "shadow-uisb-purple/20" : "shadow-black/20",
      )}
    >
      {/* Reflection sheen */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <Image
        src={item.thumbnail}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 80vw, 420px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority={isCenter}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Play button */}
      <span
        className={cn(
          "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-uisb-purple shadow-lg transition-transform duration-300 group-hover:scale-110",
          isCenter ? "h-18 w-18" : "h-14 w-14",
        )}
      >
        <FaPlay className={cn(isCenter ? "ml-1 h-7 w-7" : "ml-0.5 h-5 w-5")} aria-hidden />
      </span>

      {/* Title on center card */}
      <AnimatePresence>
        {isCenter && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="absolute inset-x-0 bottom-0 p-5 text-left"
          >
            <p className="line-clamp-2 text-base font-semibold text-white drop-shadow-md md:text-lg">
              {item.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function CarouselButton({
  onClick,
  direction,
  "aria-label": ariaLabel,
}: {
  onClick: () => void
  direction: "left" | "right"
  "aria-label": string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-uisb-purple hover:text-uisb-purple hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uisb-purple focus-visible:ring-offset-2 active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        {direction === "left" ? (
          <path d="m15 18-6-6 6-6" />
        ) : (
          <path d="m9 18 6-6-6-6" />
        )}
      </svg>
    </button>
  )
}
