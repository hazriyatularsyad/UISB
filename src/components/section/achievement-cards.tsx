"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { cn } from "@/lib/utils"
import type { AchievementItem } from "@/lib/data-store"

export default function AchievementCards({
  items,
}: {
  items: AchievementItem[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateEdgeState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanPrev(scrollLeft > 8)
    setCanNext(scrollLeft < scrollWidth - clientWidth - 8)

    const card = el.querySelector<HTMLElement>("[data-card]")
    const step = (card?.offsetWidth ?? 340) + 24
    setActiveIndex(
      Math.min(items.length - 1, Math.max(0, Math.round(scrollLeft / step))),
    )
  }, [items.length])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateEdgeState()
    el.addEventListener("scroll", updateEdgeState, { passive: true })
    window.addEventListener("resize", updateEdgeState)
    return () => {
      el.removeEventListener("scroll", updateEdgeState)
      window.removeEventListener("resize", updateEdgeState)
    }
  }, [updateEdgeState])

  const scrollDir = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-card]")
    const step = (card?.offsetWidth ?? 340) + 24
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" })
  }

  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-s text-slate-500">
        No achievements yet. Add entries from the dashboard.
      </p>
    )
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={item.id}
              data-card
              className="h-full shrink-0 snap-start w-[78%] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)]"
            >
              <motion.div
                whileHover={{
                  y: isActive ? -6 : -3,
                  scale: 1.02,
                  boxShadow: isActive
                    ? "0 25px 50px -12px rgba(104, 30, 145, 0.25)"
                    : "0 10px 25px -5px rgba(104, 30, 145, 0.12)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition-all duration-300",
                  isActive
                    ? "border-uisb-purple shadow-amber-500/20 ring-1 ring-uisb-purple/20"
                    : "border-slate-200 hover:border-amber-500/60",
                )}
              >
                <div className="relative h-95 w-full overflow-hidden rounded-xl sm:h-80 mb-7">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                <h3
                  className={cn(
                    "text-lg font-semibold leading-snug transition-colors",
                    isActive
                      ? "text-slate-900"
                      : "text-slate-800 hover:text-uisb-purple",
                  )}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>

                {item.link_url && (
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <a
                      href={item.link_url}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                        isActive
                          ? "text-uisb-purple hover:text-amber-600"
                          : "text-slate-600 hover:text-uisb-purple",
                      )}
                    >
                      Learn More
                      <motion.span
                        className="inline-block"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollDir(-1)}
          disabled={!canPrev}
          aria-label="Previous achievement"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all hover:border-uisb-purple hover:text-uisb-purple active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-700"
        >
          <FaChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <span className="text-xs font-medium tabular-nums text-slate-500">
          {activeIndex + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={() => scrollDir(1)}
          disabled={!canNext}
          aria-label="Next achievement"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all hover:border-uisb-purple hover:text-uisb-purple active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-700"
        >
          <FaChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
