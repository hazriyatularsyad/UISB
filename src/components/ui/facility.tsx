"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FacilityIcon } from "@/lib/facility-icons"
import type { FacilityItem } from "@/lib/data-store"

interface InteractiveSelectorProps {
  facilities: FacilityItem[]
  activeSlug?: string
  title?: string
  description?: string
}

export default function InteractiveSelector({
  facilities,
  activeSlug,
  title = "Fasilitas Kampus",
  description = "Jelajahi fasilitas modern yang tersedia untuk menunjang kegiatan belajar mahasiswa.",
}: InteractiveSelectorProps) {
  const initialIndex = Math.max(
    0,
    facilities.findIndex((f) => f.slug === activeSlug),
  )
  const [userIndex, setUserIndex] = useState<number | null>(null)
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([])
  const activeIndex = userIndex ?? initialIndex

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    facilities.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => [...prev, i])
      }, 180 * i)
      timers.push(timer)
    })
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [facilities])

  if (facilities.length === 0) {
    return (
      <p className="py-10 text-center text-s text-slate-500">
        No facilities yet. Add entries from the dashboard.
      </p>
    )
  }

  return (
    <section className="w-full px-4 py-16 font-sans sm:px-6 lg:px-8">
      <div className="md:mx-auto md:w-[150vh]">
        <div className="mb-10 px-6 text-center">
          <h1 className="animate-fadeInTop delay-300 mb-3 text-3xl font-extrabold tracking-tight text-black/85 drop-shadow-lg md:text-5xl">
            {title}
          </h1>
          <p className="animate-fadeInTop delay-600 mx-auto max-w-xl text-base font-medium text-slate/200 md:text-xl">
            {description}
          </p>
        </div>

        <div className="mx-auto flex h-[720px] w-full min-w-0 max-w-[1000px] items-stretch overflow-hidden rounded-xl md:max-w-[1400px] md:h-[720px]">
          {facilities.map((facility, index) => {
            const isActive = activeIndex === index
            return (
              <div
                key={facility.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={facility.title}
                onClick={() => {
                  if (index !== activeIndex) setUserIndex(index)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    if (index !== activeIndex) setUserIndex(index)
                  }
                }}
                className="relative flex min-w-[44px] cursor-pointer flex-col justify-end overflow-hidden border-2 border-solid bg-[#18181b] outline-none transition-all duration-700 ease-in-out focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  backgroundImage: `url('${facility.image}')`,
                  backgroundSize: isActive ? "auto 100%" : "auto 120%",
                  backgroundPosition: "center",
                  backfaceVisibility: "hidden",
                  opacity: animatedOptions.includes(index) ? 1 : 0,
                  transform: animatedOptions.includes(index)
                    ? "translateX(0)"
                    : "translateX(-60px)",
                  borderRadius: 0,
                  borderColor: isActive ? "#fff" : "#292929",
                  boxShadow: isActive
                    ? "0 20px 60px rgba(0,0,0,0.50)"
                    : "0 10px 30px rgba(0,0,0,0.30)",
                  flex: isActive ? "7 1 0%" : "1 1 0%",
                  zIndex: isActive ? 10 : 1,
                  willChange: "flex-grow, box-shadow, background-size",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 transition-all duration-700 ease-in-out"
                  style={{
                    bottom: isActive ? "0" : "-40px",
                    height: "120px",
                    boxShadow: isActive
                      ? "inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000"
                      : "inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000",
                  }}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[2] flex h-12 w-full items-center justify-start gap-3 px-4">
                  <div className="flex h-[44px] min-w-[44px] max-w-[44px] flex-shrink-0 flex-grow-0 items-center justify-center rounded-full border-2 border-[#444] bg-[rgba(32,32,32,0.85)] shadow-[0_1px_4px_rgba(0,0,0,0.18)] backdrop-blur-[10px] transition-all duration-200">
                    <FacilityIcon icon={facility.icon} size={24} className="text-white" />
                  </div>
                  <div className="relative whitespace-pre text-white">
                    <div
                      className="text-base font-bold transition-all duration-700 ease-in-out md:text-lg"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateX(0)"
                          : "translateX(25px)",
                      }}
                    >
                      {isActive ? (
                        <Link
                          href={`/facility/${facility.slug}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {facility.title}
                        </Link>
                      ) : (
                        facility.title
                      )}
                    </div>
                    <div
                      className="text-sm text-gray-300 transition-all duration-700 ease-in-out md:text-base"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateX(0)"
                          : "translateX(25px)",
                      }}
                    >
                      {facility.short_description}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
