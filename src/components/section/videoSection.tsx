"use client"

import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "motion/react"
import type { VideoItem } from "@/lib/data-store"
import { Reveal, RevealItem } from "@/components/ui/reveal"

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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-[#0B1E48]">Videos</h2>
        </div>
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
      <Reveal direction="up" className=" mb-12">
        <h2 className="text-3xl font-extrabold text-[#0B1E48]">Videos</h2>
        <div className=" h-px w-10 bg-amber-500 mt-2" />
      </Reveal>

      <div className="relative flex items-center justify-center gap-2 md:gap-6 min-h-[320px] md:min-h-[420px] [perspective:1200px]">
        <motion.div
          key={`left-${left.id}`}
          initial={reduce ? false : { opacity: 0, x: -40, rotateY: 30 }}
          animate={{ opacity: 0.92, x: 0, rotateY: 22 }}
          transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
          whileHover={reduce ? undefined : { rotateY: 12, scale: 1.02, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
          className="hidden md:block w-1/3 max-w-[340px] aspect-[4/3] rounded-xl overflow-hidden border-4 border-black shadow-2xl will-change-transform cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setSelectedVideo(extractYoutubeId(left.youtube_id))}
        >
          <div className="relative w-full h-full bg-slate-900 group">
            <img src={left.thumbnail} alt={left.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          key={`center-${center.id}`}
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1.04, y: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.7 }}
          whileHover={reduce ? undefined : { scale: 1.07, transition: { duration: 0.4 } }}
          className="w-full md:w-5/12 max-w-[460px] aspect-[4/3] rounded-2xl overflow-hidden border-4 border-black shadow-2xl z-20 will-change-transform cursor-pointer"
          onClick={() => setSelectedVideo(extractYoutubeId(center.youtube_id))}
        >
          <div className="relative w-full h-full bg-slate-900 group">
            <img src={center.thumbnail} alt={center.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/90 flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          key={`right-${right.id}`}
          initial={reduce ? false : { opacity: 0, x: 40, rotateY: -30 }}
          animate={{ opacity: 0.92, x: 0, rotateY: -22 }}
          transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
          whileHover={reduce ? undefined : { rotateY: -12, scale: 1.02, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
          className="hidden md:block w-1/3 max-w-[340px] aspect-[4/3] rounded-xl overflow-hidden border-4 border-black shadow-2xl will-change-transform cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setSelectedVideo(extractYoutubeId(right.youtube_id))}
        >
          <div className="relative w-full h-full bg-slate-900 group">
            <img src={right.thumbnail} alt={right.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              i === active ? "w-6 bg-slate-800" : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/50 p-2 rounded-full z-10 transition-colors"
              aria-label="Close Modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
          </div>
        </div>
      )}
    </section>
  )
}
