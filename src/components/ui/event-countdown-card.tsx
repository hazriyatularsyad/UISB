"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { buttonVariants } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventCountdownCardProps {
  title?: string
  date?: Date
  image?: string
  onJoin?: () => void
  enableAnimations?: boolean
  className?: string
  joinLabel?: string
}

// Break a total number of seconds into days/hours/minutes/seconds
function getTimeUnits(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

export function EventCountdownCard({
  title,
  date,
  image = "https://cdn.21st.dev/assets/mirror/ff/fffa3cceceff342420fdf8c76cc7bcdd325d8903380c8cd99a340fbed85e3285.jpg",
  onJoin,
  enableAnimations = true,
  className,
  joinLabel,
}: EventCountdownCardProps) {
  const hasTitle = !!title?.trim()
  const hasDate = !!date
  const hasButton = !!joinLabel?.trim() && !!onJoin

  const [secondsLeft, setSecondsLeft] = useState(() =>
    hasDate && date ? Math.max(0, Math.floor((+date - Date.now()) / 1000)) : 0,
  )

  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion

  useEffect(() => {
    if (!hasDate || !date) return
    const interval = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((+date - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(interval)
  }, [date, hasDate])

  const { days, hours, minutes, seconds } = hasDate
    ? getTimeUnits(secondsLeft)
    : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const eventHasStarted = hasDate ? secondsLeft <= 0 : false
  const startsSoon = hasDate ? secondsLeft > 0 && secondsLeft < 86400 : false

  return (
    <motion.div
      data-slot="event-countdown-card"
      initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
      animate={{ opacity: 1, y: 0 }}
      whileHover={shouldAnimate ? { scale: 1.03, y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative w-full h-150 rounded-2xl overflow-hidden cursor-pointer group",
        "border border-border/50 shadow-lg shadow-black/5",
        className,
      )}
    >
      {/* Background image fills the entire card */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Light gradient 10 so image stays visible */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

      {startsSoon && (
        <span className="absolute top-4 right-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
          Starts Soon!
        </span>
      )}

      {/* All content sits above the image/overlay — only show what was input */}
      <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-6 text-white">
        {hasTitle && (
          <h3 className="text-xl font-bold leading-tight tracking-tight">
            {title}
          </h3>
        )}

        {hasDate && !eventHasStarted && (
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-sm font-medium text-white/80">
              <Clock className="h-4 w-4" />
              <span>Ends in:</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: days, label: "Days" },
                { value: hours, label: "Hours" },
                { value: minutes, label: "Min" },
                { value: seconds, label: "Sec" },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-sm"
                >
                  <div className="text-lg font-bold tabular-nums">
                    {unit.value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-white/70 font-medium">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasDate && eventHasStarted && (
          <div className="py-2">
            <div className="text-lg font-bold text-green-400">
              Event Started!
            </div>
            <div className="text-sm text-white/70">Join now to participate</div>
          </div>
        )}

        {hasButton && (
          <button
            onClick={onJoin}
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full h-11 font-medium",
              "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary cursor-pointer",
              "shadow-lg shadow-primary/25 transition-transform active:scale-95",
            )}
          >
            {joinLabel}
          </button>
        )}
      </div>
    </motion.div>
  )
}
