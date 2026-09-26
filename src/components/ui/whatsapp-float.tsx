"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { FaWhatsapp } from "react-icons/fa6"

const WA_NUMBER = "628116655515"

export default function WhatsappFloat() {
  const [open, setOpen] = useState(false)
  const [nama, setNama] = useState("")
  const [pesan, setPesan] = useState("")
  const namaRef = useRef<HTMLInputElement>(null)

  const canSend = nama.trim().length > 0 && pesan.trim().length > 0

  useEffect(() => {
    if (!open) return
    namaRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    // prevent background scroll on mobile when popover open
    if (window.innerWidth < 768) document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  function handleSend() {
    if (!canSend) return
    const text = encodeURIComponent(
      `Halo Admin UISB,\n\nNama: ${nama.trim()}\nPesan: ${pesan.trim()}`
    )
    const url = `https://wa.me/${WA_NUMBER}?text=${text}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      {/* backdrop - click outside to close */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={
          "fixed inset-0 z-[69] bg-slate-900/20 backdrop-blur-[1px] transition-opacity duration-200 " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />

      <div
        className="fixed z-[70] flex flex-col items-end gap-3"
        style={{
          right: "max(1rem, env(safe-area-inset-right))",
          bottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Popover */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chat WhatsApp"
          aria-hidden={!open}
          className={
            "w-[92vw] max-w-[360px] origin-bottom-right rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.16),0_4px_16px_rgba(15,23,42,0.08)] transition-all duration-200 " +
            (open
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-[0.98] opacity-0")
          }
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-heading text-[15px] font-bold tracking-tight text-slate-900">
                Halo Admin UISB
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">
                Isi nama dan pesan, kami langsung hubungkan ke WhatsApp.
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="wa-nama"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500"
              >
                Nama
              </label>
              <input
                ref={namaRef}
                id="wa-nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Pengunjung"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-uisb-purple/40 focus:ring-4 focus:ring-uisb-purple/10"
                autoComplete="name"
              />
            </div>

            <div>
              <label
                htmlFor="wa-pesan"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500"
              >
                Pesan
              </label>
              <textarea
                id="wa-pesan"
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Tulis pesan Anda..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-uisb-purple/40 focus:ring-4 focus:ring-uisb-purple/10"
              />
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(37,211,102,0.35)] transition-all hover:bg-[#20bd5a] hover:shadow-[0_6px_16px_rgba(37,211,102,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              <FaWhatsapp className="h-4 w-4 shrink-0" aria-hidden />
              Kirim via WhatsApp
            </button>

            <p className="text-center text-[11px] leading-relaxed text-slate-400">
              Akan membuka aplikasi WhatsApp
            </p>
          </div>
        </div>

        {/* Floating Mascot - always visible */}
        <button
          type="button"
          aria-label="Chat via WhatsApp"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="group relative inline-flex h-24 w-24 items-center justify-center transition-all hover:scale-105 hover:-translate-y-1 active:translate-y-0 active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uisb-purple/30"
        >
          <Image
            src="/images/cs-logo.png"
            alt="Customer Service"
            width={96}
            height={96}
            className="h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            priority
          />
        </button>
      </div>
    </>
  )
}
