"use client"

import { useState } from "react"
import { FaMapMarkerAlt } from "react-icons/fa"
import { maps } from "@/data/site"
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal"

export default function CampusMap() {
  const [active, setActive] = useState(maps[0])

  return (
    <section className="md:w-[150vh] md:mx-auto px-4 py-16 font-sans sm:px-6 lg:px-8">
      <Reveal direction="up" className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Our Campuses</h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <RevealGroup className="flex flex-col gap-3 lg:col-span-4">
          {maps.map((loc, i) => (
            <RevealItem key={loc.id} index={i} direction="left" stagger={0.1}>
              <button
                onClick={() => setActive(loc)}
                className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  active.id === loc.id
                    ? "border-amber-500 bg-amber-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <FaMapMarkerAlt
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    active.id === loc.id ? "text-amber-500" : "text-slate-400"
                  }`}
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{loc.name}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{loc.address}</p>
                </div>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal direction="right" delay={0.15} className="overflow-hidden rounded-xl border border-slate-200 lg:col-span-8">
          <iframe
            title={`Map of ${active.name}`}
            src={active.embedUrl}
            className="h-[400px] w-full border-0 lg:h-[480px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </Reveal>
      </div>
    </section>
  )
}
