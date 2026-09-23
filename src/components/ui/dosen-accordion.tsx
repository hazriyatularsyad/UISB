"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export type DosenItem = {
  id: number
  name: string
  title: string
  campus: string
  description: string
  image: string
  sort_order: number
}

export default function DosenAccordion({ items }: { items: DosenItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduce = useReducedMotion()
  const active = items[activeIndex]

  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <div className="lg:col-span-5 flex flex-col justify-center min-h-[280px]">
        <motion.h3
          key={active.id + "-title"}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-2xl md:text-3xl text-slate-900 leading-tight tracking-tight mb-2"
        >
          {active.name}
        </motion.h3>

        <motion.p
          key={active.id + "-desc"}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-slate-600 text-sm md:text-base leading-relaxed"
        >
          <span className="text-uisb-purple text-xl font-semibold mb-2">
            {active.title}
          </span>
          <br />
          <span className="text-xl text-uisb-orange mb-3">
            {" "}
            {active.campus}
          </span>
          <br />
          <br />
          {active.description}
        </motion.p>
      </div>

      <div className="lg:col-span-7 flex gap-2 sm:gap-3 h-[320px] md:h-[420px] w-full">
        {items.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={item.name}
              aria-pressed={isActive}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setActiveIndex(index)
                }
              }}
              className={cn(
                "relative rounded-4xl overflow-hidden cursor-pointer",
                "transition-[flex-grow] duration-500 ease-out outline-none",
                "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
                isActive ? "flex-[5]" : "flex-[0.6] hover:flex-[0.9]",
              )}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-black transition-opacity duration-300",
                  isActive ? "opacity-20" : "opacity-60",
                )}
              />
              <div className="absolute inset-0 p-4 flex items-end justify-center">
                {isActive ? (
                  <motion.span
                    key={item.id + "-active-label"}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-white text-sm font-semibold tracking-wide text-center drop-shadow-md"
                  >
                    {item.name}
                  </motion.span>
                ) : (
                  <span className="sr-only">{item.name}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
