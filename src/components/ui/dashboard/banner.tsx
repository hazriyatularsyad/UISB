import type { ReactNode } from "react"

type Tone = "info" | "success" | "error"

export function Banner({
  tone,
  children,
  onDismiss,
}: {
  tone: Tone
  children: ReactNode
  onDismiss?: () => void
}) {
  const styles = bannerTone[tone]
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={
        "mb-4 flex items-center gap-3 rounded-md border px-4 py-3 text-[14.5px] leading-6 " +
        styles.box
      }
    >
      <span className="flex-1 min-w-0">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={
            "shrink-0 rounded p-0.5 transition-colors " + styles.dismiss
          }
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M3 3l8 8M11 3l-8 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

const bannerTone: Record<Tone, { box: string; dismiss: string }> = {
  info: {
    box: "border-slate-200 bg-slate-100 text-slate-700",
    dismiss: "text-slate-400 hover:text-slate-700",
  },
  success: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dismiss: "text-emerald-500 hover:text-emerald-800",
  },
  error: {
    box: "border-red-200 bg-red-50 text-red-700",
    dismiss: "text-red-500 hover:text-red-800",
  },
}
