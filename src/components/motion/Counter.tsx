"use client"

import { useEffect, useState } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { useRef } from "react"

interface CounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  decimals?: number
  separator?: string
}

export function Counter({
  value,
  duration = 2,
  suffix = "",
  prefix = "",
  className,
  decimals = 0,
  separator = ",",
}: CounterProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || reduce) {
      setCount(value)
      return
    }

    let frame: number
    const startTime = Date.now()

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOut cubic
      setCount(Math.floor(value * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, value, duration])

  const formatted = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  })

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}

interface CounterCardProps {
  label: string
  value: number
  suffix?: string
  prefix?: string
  icon?: React.ReactNode
  className?: string
}

export function CounterCard({
  label,
  value,
  suffix = "",
  prefix = "",
  icon,
  className,
}: CounterCardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {icon && <div className="mb-3 text-uisb-purple">{icon}</div>}
      <Counter value={value} suffix={suffix} prefix={prefix} className="text-3xl font-bold text-slate-900 tabular-nums" />
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}

export function StatsGrid({
  items,
  className,
}: {
  items: Array<{ label: string; value: number; suffix?: string; prefix?: string; icon?: React.ReactNode }>
  className?: string
}) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item, i) => (
        <CounterCard key={i} {...item} />
      ))}
    </div>
  )
}