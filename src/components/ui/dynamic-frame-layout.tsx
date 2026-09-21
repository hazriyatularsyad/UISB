"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface Frame {
  id: number
  image: string
  defaultPos: { x: number; y: number; w: number; h: number }
}

interface FrameComponentProps {
  image: string
  width: number | string
  height: number | string
  className?: string
  isHovered: boolean
}

function FrameComponent({
  image,
  width,
  height,
  className = "",
  isHovered,
}: FrameComponentProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full scale-105 object-cover transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: isHovered ? "scale(1.08)" : "scale(1.05)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%)",
            opacity: isHovered ? 0 : 0.5,
          }}
        />
      </div>
    </div>
  )
}

interface DynamicFrameLayoutProps {
  frames: Frame[]
  className?: string
  hoverSize?: number
  gapSize?: number
}

export function DynamicFrameLayout({
  frames,
  className,
  hoverSize = 6,
  gapSize = 4,
}: DynamicFrameLayoutProps) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(
    null,
  )

  const getRowSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const { row } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2]
      .map((r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
      .join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const { col } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2]
      .map((c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
      .join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom"
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right"
    return `${vertical} ${horizontal}`
  }

  return (
    <div
      className={cn("relative h-full w-full", className)}
      style={{
        display: "grid",
        gridTemplateRows: getRowSizes(),
        gridTemplateColumns: getColSizes(),
        gap: `${gapSize}px`,
        transition:
          "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
      }}
    >
      {frames.map((frame) => {
        const row = Math.floor(frame.defaultPos.y / 4)
        const col = Math.floor(frame.defaultPos.x / 4)
        const transformOrigin = getTransformOrigin(
          frame.defaultPos.x,
          frame.defaultPos.y,
        )

        return (
          <motion.div
            key={frame.id}
            className="relative"
            style={{
              transformOrigin,
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={() => setHovered({ row, col })}
            onMouseLeave={() => setHovered(null)}
          >
            <FrameComponent
              image={frame.image}
              width="100%"
              height="100%"
              className="absolute inset-0"
              isHovered={hovered?.row === row && hovered?.col === col}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
