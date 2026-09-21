import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { heroSlides } from "@/data/site"
import type { HeroSlideItem } from "@/lib/data-store"

export interface HeroSectionProps {
  imageSrc?: string
  imageSrcMobile?: string
  imageAlt?: string
  className?: string
  slides?: HeroSlideItem[] | { imageSrc: string; imageSrcMobile?: string; alt?: string }[]
  intervalMs?: number
}

const FALLBACK_IMAGE = "/images/Hero1.png"

/**
 * Hero full-bleed dengan auto-slide gambar.
 * - intervalMs: durasi antar slide (default 8s = pelan)
 * - pause on hover: berhenti saat mouse di atas hero
 * - dropdown device: memisahkan gambar desktop dan mobile dari DB
 * - reduced motion: tampilkan slide pertama saja (statis)
 */
export const HeroSection = ({
  imageSrc = "/images/Hero1.png",
  imageSrcMobile = "/images/Hero-Mobile.png",
  imageAlt = "Hero background",
  className,
  slides,
  intervalMs = 8000,
}: HeroSectionProps) => {
  const reduce = useReducedMotion()

  // Normalisasi slides: pisahkan slide desktop dan mobile
  let desktopItems: { image: string; title?: string }[] = []
  let mobileItems: { image: string; title?: string }[] = []

  if (slides && slides.length > 0) {
    const isDbSlide = (s: unknown): s is HeroSlideItem =>
      typeof (s as HeroSlideItem).image === "string" &&
      (s as HeroSlideItem).device_type !== undefined

    const dbSlides = slides.filter(isDbSlide)

    if (dbSlides.length > 0) {
      const desktopFiltered = dbSlides.filter(
        (s) => s.device_type === "desktop" || s.device_type === "all",
      )
      const mobileFiltered = dbSlides.filter(
        (s) => s.device_type === "mobile" || s.device_type === "all",
      )

      desktopItems =
        desktopFiltered.length > 0
          ? desktopFiltered.map((s) => ({ image: s.image, title: s.title }))
          : dbSlides.map((s) => ({ image: s.image, title: s.title }))

      mobileItems =
        mobileFiltered.length > 0
          ? mobileFiltered.map((s) => ({ image: s.image, title: s.title }))
          : desktopItems
    } else {
      const staticSlides = slides as {
        imageSrc: string
        imageSrcMobile?: string
        alt?: string
      }[]
      desktopItems = staticSlides.map((s) => ({
        image: s.imageSrc,
        title: s.alt,
      }))
      mobileItems = staticSlides.map((s) => ({
        image: s.imageSrcMobile || s.imageSrc,
        title: s.alt,
      }))
    }
  } else {
    if (heroSlides.length > 0) {
      desktopItems = heroSlides.map((s) => ({ image: s.imageSrc, title: s.alt }))
      mobileItems = heroSlides.map((s) => ({
        image: s.imageSrcMobile || s.imageSrc,
        title: s.alt,
      }))
    } else {
      desktopItems = [{ image: imageSrc, title: imageAlt }]
      mobileItems = [{ image: imageSrcMobile || imageSrc, title: imageAlt }]
    }
  }

  const totalCount = Math.max(desktopItems.length, mobileItems.length, 1)

  // Slide aktif + status pause (hover)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  // Ganti ke slide berikutnya (loop melingkar)
  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % totalCount)
  }, [totalCount])

  // Timer auto-slide; berhenti jika tab tersembunyi atau sedang di-hover
  useEffect(() => {
    if (reduce || paused || totalCount <= 1) return
    const t = setInterval(() => {
      if (!document.hidden) next()
    }, intervalMs)
    return () => clearInterval(t)
  }, [reduce, paused, intervalMs, next, totalCount])

  // Fallback bila gambar gagal dimuat
  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    target.onerror = null
    target.src = FALLBACK_IMAGE
  }

  const currentDesktop =
    desktopItems[active % desktopItems.length] ?? desktopItems[0]
  const currentMobile =
    mobileItems[active % mobileItems.length] ?? mobileItems[0]

  return (
    <div
      onMouseEnter={() => setPaused(true)} // pause saat hover
      onMouseLeave={() => setPaused(false)} // lanjut auto-slide setelah keluar
      className={cn(
        "relative flex min-h-[100dvh] w-full flex-col items-center justify-between overflow-hidden bg-black font-sans",
        "supports-[height:100dvh]:min-h-[100dvh]",
        className,
      )}
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // crossfade lambat 1.2s
            className="absolute inset-0"
          >
            {/* Gambar desktop */}
            <img
              src={currentDesktop.image}
              alt={currentDesktop.title || imageAlt}
              className="hidden h-full w-full object-cover md:block"
              loading="eager"
              onError={onImgError}
            />
            {/* Gambar mobile (variant khusus) */}
            <img
              src={currentMobile.image}
              alt={currentMobile.title || imageAlt}
              className="block h-full w-full object-cover object-[50%_35%] md:hidden"
              loading="eager"
              onError={onImgError}
            />
          </motion.div>
        </AnimatePresence>
        {/* Vignette bawah untuk kontras navbar & teks */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
    </div>
  )
}
