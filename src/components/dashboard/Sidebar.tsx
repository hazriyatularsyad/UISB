"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type ComponentType } from "react"
import { motion } from "motion/react"
import {
  FaBars,
  FaBuilding,
  FaGear,
  FaComments,
  FaGraduationCap,
  FaImages,
  FaWandMagicSparkles,
  FaNewspaper,
  FaXmark,
  FaTrophy,
  FaUserPlus,
  FaUsers,
  FaVideo,
} from "react-icons/fa6"
import { siteData } from "@/data/site"

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{
    className?: string
    "aria-hidden"?: boolean | "true" | "false"
  }>
}

const links: NavItem[] = [
  { href: "/dashboard/hero", label: "Hero Slides", icon: FaImages },
  { href: "/dashboard/achievements", label: "Achievements", icon: FaTrophy },
  { href: "/dashboard/programs", label: "Programs", icon: FaGraduationCap },
  { href: "/dashboard/facilities", label: "Facilities", icon: FaBuilding },
  { href: "/dashboard/information", label: "Information", icon: FaGear },
  { href: "/dashboard/popups", label: "Popups", icon: FaWandMagicSparkles },
  { href: "/dashboard/news", label: "News", icon: FaNewspaper },
  { href: "/dashboard/dosen", label: "Dosen", icon: FaUsers },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: FaComments },
  { href: "/dashboard/videos", label: "Videos", icon: FaVideo },
  { href: "/dashboard/users", label: "Add Admin", icon: FaUserPlus },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const logoSrc = siteData.hero.logoSrc
  const logoText = "UISB Admin"

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 md:hidden"
      >
        <FaBars className="h-5 w-5" aria-hidden />
      </button>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 md:hidden " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />

      <aside
        aria-label="Dashboard navigation"
        className={
          "fixed inset-y-0 left-0 z-50 flex w-64 transform pt-10 flex-col border-r border-slate-200 bg-slate-50 transition-transform duration-200 ease-out md:static md:z-auto md:w-[200px] md:translate-x-0 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 md:justify-start">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5"
          >
            <motion.span
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
              className="inline-flex"
            >
              {logoSrc ? (
                <img src={logoSrc} alt="Logo" className="h-8 w-auto md:h-17 " />
              ) : (
                <span className="text-l font-bold tracking-wider text-amber-500">
                  {logoText}
                </span>
              )}
            </motion.span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 md:hidden"
          >
            <FaXmark className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <nav className="flex-1 px-2.5 py-4">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            Manage
          </p>
          <ul className="space-y-5">
            {links.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(l.href + "/")
              const Icon = l.icon
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={
                      "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[14px] font-medium transition-colors " +
                      (active
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:bg-white hover:text-slate-900")
                    }
                  >
                    <Icon
                      className={
                        "h-4 w-4 shrink-0 transition-colors " +
                        (active
                          ? "text-slate-900"
                          : "text-slate-400 group-hover:text-slate-600")
                      }
                      aria-hidden
                    />
                    {l.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
