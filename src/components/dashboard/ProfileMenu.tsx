"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FaChevronDown, FaRightFromBracket, FaUpRightFromSquare, FaUserPlus } from "react-icons/fa6"
import { logoutAction } from "@/app/login/actions"

export default function ProfileMenu({ user }: { user: string | null }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const name = user ?? "Admin"
  const initial = name.charAt(0).toUpperCase()

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="fixed right-3 top-3 z-30">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[14px] font-semibold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate text-[14px] font-medium text-slate-700 sm:inline">
          {name}
        </span>
        <FaChevronDown
          className={
            "h-3 w-3 text-slate-400 transition-transform duration-200 " +
            (open ? "rotate-180" : "")
          }
          aria-hidden
        />
      </button>

      <div
        role="menu"
        aria-label="Account menu"
        className={
          "absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg transition-all duration-150 " +
          (open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0")
        }
      >
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="truncate text-[14px] font-semibold text-slate-900">{name}</p>
          <p className="truncate text-[13px] text-slate-500">@{name}</p>
        </div>
        <div className="py-1">
          <Link
            href="/dashboard/users"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <FaUserPlus className="h-3.5 w-3.5" aria-hidden />
            Sign Up
          </Link>
          <Link
            href="/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <FaUpRightFromSquare className="h-3.5 w-3.5" aria-hidden />
            Back to site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <FaRightFromBracket className="h-3.5 w-3.5" aria-hidden />
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
