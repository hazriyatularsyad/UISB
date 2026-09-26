"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PopupItem } from "@/lib/data-store"

export const AUTO_SLIDE_INTERVAL_MS = 5000
const RESUME_DELAY_MS = 3000

export default function PmbHeroCard({ items }: { items: PopupItem[] }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = items.length
  const hasMultiple = total > 1

  useEffect(() => {
    return () => {
      if (resumeRef.current) clearTimeout(resumeRef.current)
    }
  }, [])

  useEffect(() => {
    if (!hasMultiple || paused || reduce) return
    const t = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % total)
    }, AUTO_SLIDE_INTERVAL_MS)
    return () => clearInterval(t)
  }, [hasMultiple, paused, reduce, total])

  if (total === 0) return null

  const hold = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current)
    setPaused(true)
  }

  const release = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current)
    resumeRef.current = setTimeout(() => setPaused(false), RESUME_DELAY_MS)
  }

  const current = items[Math.min(active, total - 1)] ?? items[0]
  const hasTitle = !!current.title?.trim()
  const hasDesc = !!current.description?.trim()
  const hasDate = !!current.event_date
  const hasButton = !!current.button_label?.trim() && !!current.button_href?.trim()

  const dateLabel = hasDate && current.event_date
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(current.event_date))
    : undefined

  const handleClick = () => {
    if (!hasButton || !current.button_href) return
    const href = current.button_href.trim()
    if (href === "#") return
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer")
    } else {
      window.location.href = href
    }
  }

  return (
    <motion.aside
      aria-roledescription="carousel"
      aria-label="Informasi penerimaan mahasiswa baru"
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
      initial={reduce ? false : { opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-1 top-1/2 z-40 hidden w-97 -translate-y-1/2 md:block mr-15"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          data-slot="pmb-hero-card"
          initial={reduce ? false : { opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, scale: 0.98, y: -8 }}
          whileHover={reduce ? undefined : { scale: 1.03, y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "relative w-full h-150 rounded-2xl overflow-hidden cursor-pointer group",
            "border border-border/50 shadow-lg shadow-black/5",
          )}
        >
          {/* Background image fills the entire card */}
          <Image
            src={current.image || "/images/hero-mobile.webp"}
            alt={current.title || "Informasi PMB"}
            fill
            sizes="360px"
            className="absolute inset-0 z-0 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Light gradient so image stays visible */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

          {/* All content sits above the image/overlay — only show what was input */}
          <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-6 text-white">
            {hasTitle && (
              <h3 className="text-xl font-bold leading-tight tracking-tight">
                {current.title}
              </h3>
            )}

            {hasDesc && (
              <p className="text-sm leading-relaxed text-white/90">
                {current.description}
              </p>
            )}

            {hasDate && (
              <p className="text-xs font-medium text-white/80">{dateLabel}</p>
            )}

            {hasButton && (
              <button
                type="button"
                onClick={handleClick}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full h-11 font-medium",
                  "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary cursor-pointer",
                  "shadow-lg shadow-primary/25 transition-transform active:scale-95",
                )}
              >
                {current.button_label}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {hasMultiple && (
        <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Tampilkan info ${i + 1} dari ${total}`}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active
                  ? "w-6 bg-white shadow"
                  : "w-1.5 bg-white/60 hover:bg-white/90",
              )}
            />
          ))}
        </div>
      )}
    </motion.aside>
  )
}
