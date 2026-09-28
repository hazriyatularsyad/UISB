"use client"

import { useState } from "react"
import { maps } from "@/data/site"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"



export default function CampusMap() {
  const [active, setActive] = useState(maps[0])

  return (
    <section className="md:w-[150vh] md:mx-auto px-4 py-16 font-sans sm:px-6 lg:px-8">
      <Reveal direction="up">
        <div className="space-y-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-uisb-purple">
            Lokasi
          </p>
          <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Fakultas & Rektorat
          </h2>
          <div className="mx-auto h-px w-8 bg-amber-500" />
          <p className="mx-auto max-w-2xl text-sm text-slate-600 mb-6">
            Built on 30 years of academic excellence, delivering quality
            education that empowers students to succeed in a rapidly evolving
            world.
          </p>
        </div>
      </Reveal>

      {/* Horizontal tab navigation */}
      <div className="mb-6  overflow-x-auto sm:mx-0 flex justify-center">
        <div
          role="tablist"
          aria-orientation="horizontal"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm mx-auto"
        >
          {maps.map((loc) => {
            const isActive = active.id === loc.id
            return (
              <button
                key={loc.id}
                type="button"
                role="tab"
                id={`map-tab-${loc.id}`}
                aria-selected={isActive}
                aria-controls={`map-panel-${loc.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(loc)}
                className={cn(
                  "relative rounded-lg border-b-2 border-transparent px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200",
                  "text-slate-600 hover:text-slate-800 hover:bg-slate-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer",
                  "focus-visible:ring-uisb-purple/50",
                  isActive
                    ? "text-amber-700 border-b-amber-600 shadow-sm"
                    : "hover:border-b-slate-300",
                )}
              >
                {loc.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Map panel synchronized with active tab */}
      <Reveal direction="up" delay={0.1}>
     
        <div
          id={`map-panel-${active.id}`}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`map-tab-${active.id}`}
          className="overflow-hidden rounded-xl border border-slate-200 shadow"
        >
          <iframe
            title={`Peta lokasi ${active.name}`}
            src={active.embedUrl}
            className="block h-[400px] w-full border-0 lg:h-[480px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </Reveal>
    </section>
  )
}
