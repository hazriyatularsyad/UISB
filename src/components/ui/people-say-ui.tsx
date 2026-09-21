"use client"

import React, { useEffect, useRef, useState } from "react"
import Image, { type ImageProps } from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowLeft, ArrowRight, Quote, X } from "lucide-react"
import { cn } from "@/lib/utils"

/** Testimonial data shape */
export interface iTestimonial {
  name: string
  designation: string
  description: string
  profileImage: string
}

interface iCarouselProps {
  items: React.ReactElement<{ testimonial: iTestimonial; index: number; layout?: boolean; onCardClose: () => void }>[]
  initialScroll?: number
}

const CARD_W = { mobile: 230, desktop: 384 }
const GAP = 8

/** Truncate text to maxLength */
function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}...` : text
}

/** Close callback when clicking outside ref */
function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      cb()
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler) }
  }, [ref, cb])
}

/** Horizontal scroll carousel with arrow buttons on the right */
export const Carousel = ({ items, initialScroll = 0 }: iCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [canL, setCanL] = useState(false)
  const [canR, setCanR] = useState(true)
  const reduce = useReducedMotion()

  const check = () => {
    if (!ref.current) return
    setCanL(ref.current.scrollLeft > 0)
    setCanR(ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth)
  }

  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" })

  const closeCard = (i: number) => {
    const w = window.innerWidth < 768 ? CARD_W.mobile : CARD_W.desktop
    ref.current?.scrollTo({ left: (w + GAP) * (i + 1), behavior: "smooth" })
  }

  useEffect(() => { if (ref.current) { ref.current.scrollLeft = initialScroll; check() } }, [initialScroll])

  return (
    <div className="relative mt-10 w-full">
      <div ref={ref} onScroll={check} className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-5 [scrollbar-width:none]">
        <div className="mx-auto flex max-w-5xl flex-row justify-start gap-4 pl-3">
          {items.map((item, i) => (
            <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 20 }} animate={reduce ? undefined : { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 * i, ease: "easeOut" } }} className="rounded-3xl last:pr-[5%] md:last:pr-[33%]">
              {React.cloneElement(item, { onCardClose: () => closeCard(i) })}
            </motion.div>
          ))}
        </div>
      </div>
      {/* Arrow buttons positioned on the right */}
      <div className="mt-4 flex justify-end gap-2 pr-3">
        <button onClick={() => scroll(-1)} disabled={!canL} aria-label="Previous testimonial" className="flex h-10 w-10 items-center justify-center rounded-full bg-uisb-purple text-white transition-colors hover:bg-uisb-purple/80 disabled:opacity-50">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button onClick={() => scroll(1)} disabled={!canR} aria-label="Next testimonial" className="flex h-10 w-10 items-center justify-center rounded-full bg-uisb-purple text-white transition-colors hover:bg-uisb-purple/80 disabled:opacity-50">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

/** Single testimonial card with bg-card.jpeg background */
export const TestimonialCard = ({ testimonial, index, layout = false, onCardClose = () => {}, backgroundImage = "/images/bg-card.jpeg" }: { testimonial: iTestimonial; index: number; layout?: boolean; onCardClose?: () => void; backgroundImage?: string }) => {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const close = () => { setExpanded(false); onCardClose() }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    window.addEventListener("keydown", onKey)
    if (expanded) {
      const y = window.scrollY
      document.body.dataset.scrollY = String(y)
      Object.assign(document.body.style, { position: "fixed", top: `-${y}px`, width: "100%", overflow: "hidden" })
    } else {
      const y = parseInt(document.body.dataset.scrollY || "0", 10)
      Object.assign(document.body.style, { position: "", top: "", width: "", overflow: "" })
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior })
    }
    return () => window.removeEventListener("keydown", onKey)
  }, [expanded])

  useOutsideClick(containerRef, close)
  const fade = reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-50 h-screen overflow-hidden">
            <motion.div {...fade} className="fixed inset-0 h-full w-full bg-uisb-purple/40 backdrop-blur-lg" />
            <motion.div {...fade} ref={containerRef} layoutId={layout ? `card-${testimonial.name}` : undefined} className="relative z-[60] mx-auto h-full max-w-5xl rounded-3xl bg-white p-4 md:mt-10 md:p-10">
              <button className="sticky right-0 top-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-uisb-purple" onClick={close} aria-label="Close"><X className="h-6 w-6 text-white" /></button>
              <p className="mt-2 px-0 text-lg font-bold text-slate-700 md:px-20">{testimonial.designation}</p>
              <p className="mt-4 px-0 text-2xl font-normal text-slate-900 md:px-20 md:text-4xl">{testimonial.name}</p>
              <div className="px-0 py-8 text-2xl font-light leading-snug tracking-wide text-slate-700 md:px-20">
                <Quote className="mb-2 h-6 w-6 text-slate-400" />{testimonial.description}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button layoutId={layout ? `card-${testimonial.name}` : undefined} onClick={() => setExpanded(true)} whileHover={reduce ? undefined : { rotateX: 2, rotateY: 2, rotate: 3, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}>
        <div className="relative z-10 flex h-[500px] w-80 flex-col items-center justify-center overflow-hidden rounded-3xl bg-slate-100 shadow-md md:h-[550px] md:w-96">
          <Image
            src={backgroundImage}
            alt="Card background"
            fill
            sizes="(max-width: 768px) 320px, 384px"
            className="pointer-events-none absolute inset-0 -z-10 object-cover"
          />
          <ProfileImage src={testimonial.profileImage} alt={testimonial.name} />
          <p className="relative z-10 mt-4 px-4 text-center text-xl font-normal text-slate-800">{truncate(testimonial.description, 100)}</p>
          <p className="relative z-10 mt-5 text-center text-lg font-medium text-slate-900 md:text-xl">{testimonial.name}.</p>
          <p className="relative z-10 mt-1 text-center text-sm font-normal text-slate-600 underline decoration-1 underline-offset-8">{truncate(testimonial.designation, 25)}</p>
        </div>
      </motion.button>
    </>
  )
}

/** Profile avatar with loading blur and error fallback */
export const ProfileImage = ({ src, alt, ...rest }: ImageProps) => {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)
  return (
    <div className="relative aspect-square h-[90px] w-[90px] flex-none overflow-hidden rounded-full border-[3px] border-slate-300 md:h-[150px] md:w-[150px]">
      {err ? <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">{alt?.charAt(0) || "?"}</div> : (
        <Image className={cn("absolute inset-0 z-50 object-cover transition duration-300", loading ? "blur-sm" : "blur-0")} onLoad={() => setLoading(false)} onError={() => setErr(true)} src={src || ""} width={150} height={150} loading="lazy" decoding="async" alt={alt || "Profile image"} {...rest} />
      )}
    </div>
  )
}
