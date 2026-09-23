"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { EventCountdownCard } from "@/components/ui/event-countdown-card"
import { cn } from "@/lib/utils"
import type { PopupItem } from "@/lib/data-store"

const SLIDE_INTERVAL = 10000 // ms

export default function WelcomePopup({ data }: { data: PopupItem[] }) {
  const items = data ?? []
  const reduceMotion = useReducedMotion()

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const hasMultiple = items.length > 1

  // Popup muncul setiap load/refresh (tanpa cookie)
  useEffect(() => {
    if (items.length === 0) return

    const timer = setTimeout(() => setIsOpen(true), 600)
    return () => clearTimeout(timer)
  }, [items.length])

  // Auto-advance slides while open
  useEffect(() => {
    if (!isOpen || !hasMultiple || reduceMotion) return

    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(interval)
  }, [isOpen, hasMultiple, items.length, reduceMotion])

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)

    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
    }
  }, [isOpen])

  function close() {
    setIsOpen(false)
  }

  function handleCta(href: string) {
    close()
    if (!href || href === "#") return
    if (href.startsWith("http"))
      window.open(href, "_blank", "noopener,noreferrer")
    else window.location.href = href
  }

  if (items.length === 0) return null

  const current = items[activeIndex] ?? items[0]
  const eventDate = current.event_date
    ? new Date(current.event_date)
    : undefined

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden
            className="fixed inset-0 z-[80] bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }
            }
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Welcome popup"
            className="fixed left-1/2 top-1/2 z-[81] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <button
                type="button"
                aria-label="Tutup"
                onClick={close}
                className="absolute right-2 top-2 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm ring-1 ring-slate-200 backdrop-blur transition-colors hover:bg-white hover:text-slate-900"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.98, y: 8 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.98, y: -8 }
                  }
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <EventCountdownCard
                    title={
                      current.title?.trim()
                        ? current.title
                        : current.description?.trim()
                          ? current.description.slice(0, 60)
                          : undefined
                    }
                    date={eventDate}
                    image={current.image || "/images/hero-mobile.webp"}
                    onJoin={
                      current.button_label?.trim() && current.button_href?.trim()
                        ? () => handleCta(current.button_href)
                        : undefined
                    }
                    joinLabel={current.button_label?.trim() || undefined}
                    enableAnimations={!reduceMotion}
                    className="w-[92vw] max-w-[360px] shadow-[0_24px_64px_rgba(0,0,0,0.22)]"
                  />
                </motion.div>
              </AnimatePresence>

              {hasMultiple && (
                <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === activeIndex
                          ? "w-6 bg-white shadow"
                          : "w-1.5 bg-white/60 hover:bg-white/90",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
