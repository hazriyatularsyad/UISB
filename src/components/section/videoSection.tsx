"use client"

import { useState, useEffect } from "react"
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
  const reduce = useReducedMotion()

  useEffect(() => {
    if (items.length <= 1) return
    const id = setInterval(() => {
      if (selectedVideo) return
      setActive((prev) => (prev + 1) % items.length)
    }, 3000)
    return () => clearInterval(id)
  }, [items.length, selectedVideo])

  if (items.length === 0) {
    return (
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 md:w-[150vh] md:mx-auto font-sans overflow-hidden">
        <VideoHeader />
        <p className="text-center text-sm text-slate-500">No videos yet.</p>
      </section>
    )
  }

  const getItem = (offset: number) => items[(active + offset + items.length) % items.length]
  const left = getItem(-1)
  const center = getItem(0)
  const right = getItem(1)

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 md:w-[150vh] md:mx-auto font-sans overflow-hidden">
      <VideoHeader />

      <div className="relative flex items-center justify-center gap-2 md:gap-4 min-h-[320px] md:min-h-[440px] [perspective:1400px]">
        <CoverCard
          item={left}
          rotateY={18}
          size="side"
          onClick={() => setSelectedVideo(extractYoutubeId(left.youtube_id))}
        />
        <CoverCard
          item={center}
          rotateY={0}
          size="center"
          label
          onClick={() => setSelectedVideo(extractYoutubeId(center.youtube_id))}
        />
        <CoverCard
          item={right}
          rotateY={-18}
          size="side"
          onClick={() => setSelectedVideo(extractYoutubeId(right.youtube_id))}
        />
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-500 ease-out",
              i === active ? "w-6 bg-uisb-purple" : "w-2 bg-slate-300 hover:bg-slate-400",
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={reduce ? undefined : { scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduce ? undefined : { scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/90 transition-colors hover:bg-black/80 hover:text-white"
                aria-label="Close Modal"
              >
                <FaXmark className="h-4 w-4" aria-hidden />
              </button>
              <div className="relative aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube Video Player"
                  className="w-full h-full"
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
    <Reveal direction="up" className="mb-12">
      <span className="block text-xs font-bold uppercase tracking-[0.18em] text-uisb-purple mb-2">
        Media
      </span>
      <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        Video Kegiatan UISB
      </h2>
      <div className="mt-4 h-[2px] w-8 bg-amber-500" />
    </Reveal>
  )
}

function CoverCard({
  item,
  rotateY,
  size,
  label,
  onClick,
}: {
  item: VideoItem
  rotateY: number
  size: "center" | "side"
  label?: boolean
  onClick: () => void
}) {
  const reduce = useReducedMotion()
  const isCenter = size === "center"

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduce ? false : { opacity: 0, y: 16, scale: isCenter ? 0.96 : 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 20, mass: 0.8 }}
      whileHover={reduce ? undefined : { rotateY: 0, scale: 1.03 }}
      style={{
        transformStyle: "preserve-3d",
        transform: `rotateY(${isCenter ? 0 : rotateY}deg)`,
      }}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-4xl bg-slate-900 shadow-xl will-change-transform",
        "ring-1 ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uisb-purple",
        isCenter
          ? "z-20 w-full max-w-[460px] aspect-[4/3] md:w-5/12"
          : "hidden w-1/3 max-w-[300px] aspect-[4/3] md:block",
      )}
    >
      <Image
        src={item.thumbnail}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 90vw, 460px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <span
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-white text-uisb-purple shadow-lg transition-transform duration-300 group-hover:scale-110",
          isCenter ? "h-16 w-16" : "h-11 w-11",
        )}
      >
        <FaPlay className={cn(isCenter ? "ml-1 h-6 w-6" : "ml-0.5 h-4 w-4")} aria-hidden />
      </span>

      {label && isCenter && (
        <div className="absolute inset-x-0 bottom-0 p-5 text-left">
          <p className="line-clamp-1 text-base font-semibold text-white drop-shadow-sm">
            {item.title}
          </p>
        </div>
      )}
    </motion.button>
  )
}