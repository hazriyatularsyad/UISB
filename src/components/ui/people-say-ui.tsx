"use client"

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react"
import Image, { type ImageProps } from "next/image"
import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

/** Testimonial data shape */
export interface iTestimonial {
  name: string
  designation: string
  description: string
  profileImage: string
}

interface iCarouselProps {
  items: ReactElement<{ testimonial: iTestimonial }>[]
}

/** Truncate text to maxLength */
const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max)}...` : text

/**
 * Horizontal scroll carousel with dot navigation.
 * Swipeable on mobile via native overflow-x scroll + CSS scroll-snap.
 * touch-action "manipulation": browser handles vertical page scroll and
 * pinch, while the container's native overflow-x still captures horizontal
 * swipe (pan-x alone can suppress vertical scrolling on touch).
 */
export const Carousel = ({ items }: iCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  const getCards = () =>
    Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-card]") ?? [])

  // Find whichever card is closest to the container's horizontal center.
  const check = useCallback(() => {
    const el = ref.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closest = 0
    let min = Infinity
    getCards().forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
      if (dist < min) {
        min = dist
        closest = i
      }
    })
    setActive(closest)
  }, [])

  const goto = (i: number) => {
    const el = ref.current
    const card = getCards()[i]
    if (!el || !card) return
    // scroll horizontal murni pada container carousel — tidak menyentuh halaman
    const rect = card.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const left =
      rect.left - elRect.left + el.scrollLeft - (el.clientWidth - rect.width) / 2
    el.scrollTo({ left, behavior: reduce ? "auto" : "smooth" })
  }

  // Auto-slide: maju ke card berikutnya tiap 6 detik; pause saat sentuh/hover.
  useEffect(() => {
    if (reduce || paused) return
    const t = setInterval(() => {
      const next = (active + 1) % items.length
      goto(next)
    }, 6000)
    return () => clearInterval(t)
  }, [active, items.length, paused, reduce])

  useEffect(check, [check])

  return (
    <div className="relative mt-10 w-full">
      <div
        ref={ref}
        onScroll={check}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        style={{ touchAction: "manipulation", WebkitOverflowScrolling: "touch" }}
        className="flex w-full snap-x snap-mandatory overflow-x-scroll overscroll-x-contain py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="mx-auto flex max-w-5xl flex-row justify-start gap-4 px-3 md:px-0">
          {items.map((item, i) => (
            <div key={i} data-card className="shrink-0 snap-center rounded-3xl">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Dot navigation */}
      <div className="mt-4 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goto(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === active
                ? "w-6 bg-uisb-purple"
                : "w-2 bg-slate-300 hover:bg-slate-400",
            )}
          />
        ))}
      </div>
    </div>
  )
}

/** Swipe-only testimonial card */
export const TestimonialCard = ({
  testimonial,
  backgroundImage = "/images/bg-card.jpeg",
}: {
  testimonial: iTestimonial
  backgroundImage?: string
}) => (
  <div className="select-none touch-pan-x">
    <div className="relative z-10 flex h-[500px] w-80 shrink-0 select-none flex-col items-center justify-center overflow-hidden rounded-3xl bg-slate-100 shadow-md md:h-[550px] md:w-96">
      <Image
        src={backgroundImage}
        alt="Card background"
        fill
        sizes="(max-width: 768px) 320px, 384px"
        className="pointer-events-none absolute inset-0 -z-10 object-cover"
      />
      <ProfileImage src={testimonial.profileImage} alt={testimonial.name} />
      <p className="relative z-10 mt-4 px-4 text-center text-xl font-normal text-slate-800">
        {truncate(testimonial.description, 100)}
      </p>
      <p className="relative z-10 mt-5 text-center text-lg font-medium text-slate-900 md:text-xl">
        {testimonial.name}.
      </p>
      <p className="relative z-10 mt-1 text-center text-sm font-normal text-slate-600 underline decoration-1 underline-offset-8">
        {truncate(testimonial.designation, 25)}
      </p>
    </div>
  </div>
)

/** Profile avatar with loading blur and error fallback */
export const ProfileImage = ({ src, alt, ...rest }: ImageProps) => {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)
  return (
    <div className="relative aspect-square h-[90px] w-[90px] flex-none overflow-hidden rounded-full border-[3px] border-slate-300 md:h-[150px] md:w-[150px]">
      {err ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
          {alt?.charAt(0) || "?"}
        </div>
      ) : (
        <Image
          className={cn(
            "absolute inset-0 z-50 object-cover transition duration-300",
            loading ? "blur-sm" : "blur-0",
          )}
          onLoad={() => setLoading(false)}
          onError={() => setErr(true)}
          src={src || ""}
          width={150}
          height={150}
          loading="lazy"
          decoding="async"
          alt={alt || "Profile image"}
          {...rest}
        />
      )}
    </div>
  )
}