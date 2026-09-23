"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { InformationItem } from "@/lib/data-store"
import { Reveal } from "@/components/ui/reveal"

interface InformationProps {
  services: InformationItem[]
  initialSlug?: string
}

export default function Information({
  services,
  initialSlug,
}: InformationProps) {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (initialSlug) {
      return services.findIndex((s) => s.slug === initialSlug) ?? 0
    }
    return 0
  })

  if (services.length === 0) {
    return (
      <section className="bg-[#fcfbf7] min-h-screen flex items-center justify-center p-6 font-sans">
        <p className="text-center text-s text-slate-500 ">
          No services available. Add entries from the dashboard.
        </p>
      </section>
    )
  }

  const activeService = services[activeIndex]

  return (
    <section className="bg-[#fcfbf7] min-h-screen flex items-center justify-center p-6 font-sans">
      <Reveal direction="up" className="w-full">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-30">
          <div className=" md:col-span-7">
            <p className="text-red-500 font-medium text-base tracking-wide mb-8 md:mb-14 md:text-xl">
              / Latest Information
            </p>

            <div className="space-y-4">
              {services.map((service, index) => {
                const isActive = activeIndex === index
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveIndex(index)}
                    className={`block text-left text-3xl font-black tracking-tight transition-all duration-300 sm:text-4xl lg:text-5xl ${
                      isActive
                        ? "text-slate-900 scale-105 origin-left"
                        : "text-slate-300 hover:text-slate-500"
                    }`}
                  >
                    {service.title}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex w-full justify-center md:col-span-5">
            <div className="relative aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-md bg-zinc-200 shadow-lg md:h-[650px] md:aspect-auto">
              <Image
                src={activeService.image}
                alt={activeService.title}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover transition-all duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
