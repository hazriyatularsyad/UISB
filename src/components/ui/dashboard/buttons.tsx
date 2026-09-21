import type { ReactNode } from "react"

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 pt-14 md:flex-row md:items-end md:justify-between md:gap-6 md:pt-0">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-[-0.01em] text-slate-900 leading-none">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[14.5px] leading-6 text-slate-500 max-w-prose">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  )
}

export function PrimaryButton({
  children,
  type = "button",
  pending = false,
  onClick,
  disabled,
}: {
  children: ReactNode
  type?: "button" | "submit"
  pending?: boolean
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || pending}
      className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-[14.5px] font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Spinner /> Saving...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center rounded-md px-4 text-[14.5px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

export function DangerButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 items-center justify-center rounded-md px-3 text-[14px] font-medium text-red-600/80 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

function Spinner() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
