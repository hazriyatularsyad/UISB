"use client"

import { useState } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"
import { FaArrowRight, FaChevronDown } from "react-icons/fa"
import Link from "next/link"
import type { ProgramItem } from "@/lib/data-store"

type DropdownId = "FACULTY" | "ABOUT_US"

interface NavItem {
  label: string
  href: string
  dropdownId?: DropdownId
}

interface NavbarProps {
  logoSrc?: string
  logoText?: string
  navItems?: NavItem[]
  programs?: ProgramItem[]
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "FACILITY", href: "/facility" },
  { label: "FACULTY", href: "#", dropdownId: "FACULTY" },
  { label: "ABOUT US", href: "#", dropdownId: "ABOUT_US" },
  { label: "INFORMATION", href: "/information" },
]

const ABOUT_US_LINKS = [
  // { label: "Our Campus", href: "https://uisb.ac.id/about-us/" },
  { label: "Sambutan Rektor", href: "/sambutanRektor" },
  { label: "Board of Foundation", href: "/founder" },
  // { label: "Campus Life", href: "https://uisb.ac.id/campus-life/" },
]

export default function Navbar({
  logoSrc = "/images/uisbLogo.png",
  logoText = "UISB",
  navItems = DEFAULT_NAV_ITEMS,
  programs = [],
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null)
  const reduceMotion = useReducedMotion()

  // Navbar shrinks slightly as the page scrolls
  const { scrollY } = useScroll()
  const paddingX = useTransform(scrollY, [0, 80], [32, 20])
  const paddingY = useTransform(scrollY, [0, 80], [12, 8])
  const navOpacity = useTransform(scrollY, [0, 80], [1, 0.92])
  const navScale = useTransform(scrollY, [0, 80], [1, 0.97])

  return (
    <motion.div
      initial={reduceMotion ? false : { scale: 0.9, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] -translate-x-1/2 md:w-[150vh]"
    >
      <motion.nav
        style={{
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          opacity: navOpacity,
          scale: navScale,
        }}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-fuchsia-800 shadow-lg shadow-uisb-purple/50 backdrop-blur-xl transition-shadow duration-500 hover:shadow-uisb-purple/50"
      >
        <Logo logoSrc={logoSrc} logoText={logoText} />

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center space-x-1 md:flex">
          {navItems.map((item, i) => (
            <DesktopNavItem
              key={item.label}
              item={item}
              index={i}
              isOpen={item.dropdownId === openDropdown}
              onOpen={() => setOpenDropdown(item.dropdownId ?? null)}
              onClose={() => setOpenDropdown(null)}
              programs={programs}
            />
          ))}
        </div>

        <PmbButton />

        <MobileMenuButton
          isOpen={mobileOpen}
          onToggle={() => setMobileOpen((v) => !v)}
        />

        {mobileOpen && (
          <MobileMenu
            navItems={navItems}
            programs={programs}
            openDropdown={openDropdown}
            onToggleDropdown={(id) =>
              setOpenDropdown((cur) => (cur === id ? null : id))
            }
            onNavigate={() => setMobileOpen(false)}
          />
        )}
      </motion.nav>
    </motion.div>
  )
}

function Logo({ logoSrc, logoText }: { logoSrc?: string; logoText?: string }) {
  return (
    <a
      href="#"
      className="group relative z-10 flex shrink-0 items-center gap-2"
      aria-label="Home"
    >
      <motion.span
        whileHover={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.5 }}
        className="inline-flex"
      >
        {logoSrc ? (
          <img src={logoSrc} alt="Logo" className="h-8 w-auto md:h-10" />
        ) : (
          <span className="text-sm font-bold tracking-wider text-amber-500">
            {logoText}
          </span>
        )}
      </motion.span>
    </a>
  )
}

function PmbButton() {
  return (
    <a
      href="https://pmb.uisb.ac.id/"
      aria-label="PMB - Penerimaan Mahasiswa Baru"
      className="group relative ml-auto hidden shrink-0 items-center justify-between gap-4 overflow-hidden rounded-full bg-[#FF5500] py-1.5 pl-5 pr-1.5 font-heading text-sm font-semibold text-white shadow-md motion-safe:transition-colors duration-500 ease-out hover:text-[#FF5500] md:inline-flex"
    >
      <span className="pointer-events-none absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[10]" />
      <span className="relative z-10 motion-safe:transition-colors duration-500 group-hover:text-[#FF5500]">
        PMB
      </span>
      <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white motion-safe:transition-transform duration-300 group-hover:translate-x-0.5">
        <FaArrowRight className="h-3.5 w-3.5 text-[#FF5500]" />
      </span>
    </a>
  )
}

// The content shown inside a dropdown — same data used for both desktop popover and mobile panel
function DropdownContent({
  dropdownId,
  programs,
}: {
  dropdownId: DropdownId
  programs: ProgramItem[]
}) {
  if (dropdownId === "FACULTY") {
    if (programs.length === 0) {
      return <p className="py-2 text-xs text-zinc-500">Belum ada program</p>
    }
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {programs.map((program) => (
          <Link
            key={program.slug}
            href={`/academics/${program.slug}`}
            className="block py-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            {program.title}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {ABOUT_US_LINKS.map((link) =>
        link.href.startsWith("/") ? (
          <Link
            key={link.label}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            {link.label}
          </Link>
        ) : (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            {link.label}
          </a>
        ),
      )}
    </div>
  )
}

function DesktopNavItem({
  item,
  index,
  isOpen,
  onOpen,
  onClose,
  programs,
}: {
  item: NavItem
  index: number
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  programs: ProgramItem[]
}) {
  const linkClasses =
    "group relative flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-widest text-amber-500 transition-colors duration-300 hover:text-white"

  if (!item.dropdownId) {
    return (
      <motion.a
        href={item.href}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
        whileHover={{ y: -2 }}
        className={linkClasses}
      >
        {item.label}
        <NavUnderline />
      </motion.a>
    )
  }

  return (
    <div onMouseEnter={onOpen} onMouseLeave={onClose} className="relative">
      <motion.a
        href={item.href}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
        whileHover={{ y: -2 }}
        className={linkClasses}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {item.label}
        <ChevronIcon open={isOpen} />
        <NavUnderline />
      </motion.a>

      {isOpen && (
        <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-md"
          >
            <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-zinc-800 bg-zinc-900" />
            <div
              className={
                item.dropdownId === "FACULTY" ? "w-[360px]" : "w-[280px]"
              }
            >
              {item.dropdownId === "FACULTY" && (
                <h4 className="mb-3 text-xs font-semibold tracking-widest text-white">
                  Programs
                </h4>
              )}
              <DropdownContent
                dropdownId={item.dropdownId}
                programs={programs}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function NavUnderline() {
  return (
    <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-amber-400 transition-all duration-500 ease-out group-hover:w-3/4" />
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <FaChevronDown
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    />
  )
}

function MobileMenuButton({
  isOpen,
  onToggle,
}: {
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="group relative flex h-10 w-10 items-center justify-center md:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className="relative h-4 w-6">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 top-0 block h-0.5 w-6 origin-center bg-white"
        />
        <motion.span
          animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-white"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 block h-0.5 w-5 origin-center bg-white"
        />
      </div>
    </button>
  )
}

function MobileMenu({
  navItems,
  programs,
  openDropdown,
  onToggleDropdown,
  onNavigate,
}: {
  navItems: NavItem[]
  programs: ProgramItem[]
  openDropdown: DropdownId | null
  onToggleDropdown: (id: DropdownId) => void
  onNavigate: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 top-full mt-4 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-uisb-purple/20 backdrop-blur-xl md:hidden"
    >
      <div className="grid gap-y-1">
        {/* PMB Button in Mobile Menu */}
        <Link
          href="https://pmb.uisb.ac.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-full inline-flex items-center justify-between gap-4 overflow-hidden rounded-full bg-[#FF5500] py-3 pl-5 pr-3 font-heading text-sm font-semibold text-white shadow-md motion-safe:transition-colors duration-500 ease-out hover:bg-[#FF5500]/90 hover:text-white active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>PMB</span>
            <FaArrowRight className="h-4 w-4" />
          </span>
          <span className="pointer-events-none absolute right-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white/20 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[10]" />
        </Link>

        {navItems.map((item, i) => {
          if (!item.dropdownId) {
            return (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-lg px-3 py-3 text-sm font-medium tracking-widest text-amber-600 transition-colors hover:bg-uisb-purple/10 hover:text-uisb-purple"
              >
                {item.label}
              </motion.a>
            )
          }

          const isOpen = item.dropdownId === openDropdown
          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => onToggleDropdown(item.dropdownId!)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium tracking-widest text-amber-600 transition-colors hover:bg-uisb-purple/10 hover:text-uisb-purple"
                aria-expanded={isOpen}
              >
                {item.label}
                <ChevronIcon open={isOpen} />
              </button>
              {isOpen && (
                <div className="ml-3 mt-1 space-y-0 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  {item.dropdownId === "FACULTY" ? (
                    programs.length === 0 ? (
                      <p className="py-1.5 text-xs text-zinc-500">
                        Belum ada program
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-1">
                        {programs.map((program) => (
                          <Link
                            key={program.slug}
                            href={`/academics/${program.slug}`}
                            onClick={onNavigate}
                            className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-uisb-purple"
                          >
                            {program.title}
                          </Link>
                        ))}
                      </div>
                    )
                  ) : (
                    ABOUT_US_LINKS.map((link) =>
                      link.href.startsWith("/") ? (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={onNavigate}
                          className="block py-1.5 text-xs text-zinc-600 hover:text-indigo-600"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block py-1.5 text-xs text-zinc-600 hover:text-indigo-600"
                        >
                          {link.label}
                        </a>
                      ),
                    )
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
