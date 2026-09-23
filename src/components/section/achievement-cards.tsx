"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { cn } from "@/lib/utils"
import type { AchievementItem } from "@/lib/data-store"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return isMobile
}

export default function AchievementCards({
  items,
}: {
  items: AchievementItem[]
}) {
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-s text-slate-500">
        No achievements yet. Add entries from the dashboard.
      </p>
    )
  }

  return isMobile ? (
    <MobileStack items={items} reduce={reduce} />
  ) : (
    <DesktopRow items={items} reduce={reduce} />
  )
}

/* ---------- Mobile: 1 card, swipeable stack ---------- */
function MobileStack({
  items,
  reduce,
}: {
  items: AchievementItem[]
  reduce: boolean | null
}) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = (d: number) => {
    setDir(d)
    setIndex((i) => (i + d + items.length) % items.length)
  }

  // Auto-swipe: maju tiap 5 detik; pause saat disentuh; reset saat manual navigate (arrow/drag)
  useEffect(() => {
    if (reduce || paused) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => go(1), 7000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [index, reduce, paused])

  const current = items[index]
  const behind = items[(index + 1) % items.length]

  return (
    <div className="relative flex flex-col items-center justify-center overflow-x-hidden py-6 md:hidden">
      <div className="relative h-[520px] w-full max-w-md select-none overflow-hidden sm:h-[560px]">
        <div
          aria-hidden
          className="absolute inset-0 translate-y-3 scale-[0.94] overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-70 shadow-sm"
        >
          <div className="h-[290px] w-full overflow-hidden">
            <Image src={behind.image} alt="" fill sizes="(max-width: 768px) 90vw, 400px" className="object-cover" draggable={false} />
          </div>
        </div>

        <AnimatePresence custom={dir} mode="popLayout">
          <motion.article
            key={current.id}
            custom={dir}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: -240, right: 240 }}
            dragSnapToOrigin
            dragElastic={0.6}
            onDragStart={() => setPaused(true)}
            onDragEnd={(_, info) => {
              if (info.offset.x < -90 || info.velocity.x < -450) go(1)
              else if (info.offset.x > 90 || info.velocity.x > 450) go(-1)
              setPaused(false)
            }}
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerCancel={() => setPaused(false)}
            initial={reduce ? false : { opacity: 0, x: dir * 300, rotate: dir * 8 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, x: dir * -320, rotate: dir * -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-lg cursor-grab active:cursor-grabbing"
            style={{ touchAction: "pan-y" }}
          >
            <div className="relative h-[290px] w-full overflow-hidden rounded-xl">
              <Image src={current.image} alt={current.title} fill sizes="(max-width: 768px) 90vw, 400px" className="object-cover" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-900">{current.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{current.description}</p>
            {current.link_url && (
              <div className="mt-auto border-t border-slate-200 pt-4">
                <a href={current.link_url} className="inline-flex items-center gap-1.5 text-sm font-medium text-uisb-purple transition-colors hover:text-amber-600">
                  Learn More <span aria-hidden>→</span>
                </a>
              </div>
            )}
          </motion.article>
        </AnimatePresence>
      </div>

      <Dots index={index} total={items.length} onSelect={go} />
    </div>
  )
}

function Dots({
  index,
  total,
  onSelect,
}: {
  index: number
  total: number
  onSelect: (d: number) => void
}) {
  return (
    <div className="mt-6 flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i - index)}
          aria-label={`Go to achievement ${i + 1}`}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i === index ? "w-6 bg-uisb-purple" : "w-2 bg-slate-300 hover:bg-slate-400",
          )}
        />
      ))}
    </div>
  )
}

/* ---------- Desktop: 3 cards per view, scroll row ---------- */
function DesktopRow({
  items,
  reduce,
}: {
  items: AchievementItem[]
  reduce: boolean | null
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActive = () => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-card]")
    const step = (card?.offsetWidth ?? 340) + 24
    setActiveIndex(Math.min(items.length - 1, Math.max(0, Math.round(el.scrollLeft / step))))
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener("scroll", updateActive, { passive: true })
    window.addEventListener("resize", updateActive)
    return () => {
      el.removeEventListener("scroll", updateActive)
      window.removeEventListener("resize", updateActive)
    }
  }, [])

  const move = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const total = items.length
    const nextIndex = (activeIndex + dir + total) % total
    const card = el.querySelector<HTMLElement>("[data-card]")
    const step = (card?.offsetWidth ?? el.clientWidth) + 24
    el.scrollTo({ left: step * nextIndex, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <div className="hidden md:block">
      <div
        ref={trackRef}
        className="flex scroll-smooth gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div key={item.id} data-card className="w-[calc(33.333%-1rem)] shrink-0">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-500/60 hover:-translate-y-0.5">
              <div className="relative mb-4 h-80 w-full overflow-hidden rounded-xl">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <h3 className="text-lg font-semibold leading-snug text-slate-800">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              {item.link_url && (
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <a href={item.link_url} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-uisb-purple">
                    Learn More <span aria-hidden>→</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Arrows index={activeIndex} total={items.length} onPrev={() => move(-1)} onNext={() => move(1)} />
    </div>
  )
}

function Arrows({
  index,
  total,
  onPrev,
  onNext,
}: {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous achievement"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all hover:border-uisb-purple hover:text-uisb-purple active:scale-95"
      >
        <FaChevronLeft className="h-4 w-4" aria-hidden />
      </button>
      <span className="text-xs font-medium tabular-nums text-slate-500">
        {index + 1} / {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next achievement"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all hover:border-uisb-purple hover:text-uisb-purple active:scale-95"
      >
        <FaChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}