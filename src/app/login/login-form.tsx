"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { FaLock, FaUser } from "react-icons/fa6"
import { loginAction } from "./actions"
import LoadingBars from "./loading-bars"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? "/dashboard"
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("from", from)
    setError(null)
    startTransition(async () => {
      const res = await loginAction(formData)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-uisb-purple px-4 py-16 font-sans">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-uisb-purple-pudar/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-10 flex gap-1">
        <div className="h-3 w-14 -skew-x-[25deg] rounded-full bg-white/20" />
        <div className="h-3 w-10 -skew-x-[25deg] rounded-full bg-uisb-orange/80" />
        <div className="h-3 w-10 -skew-x-[25deg] rounded-full bg-white/40" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl shadow-uisb-purple/40 sm:p-10">
          <div className="mb-8 text-center">
            <Image
              src="/images/uisb-logo@2x.png"
              alt="UISB"
              width={145}
              height={64}
              className="mx-auto mb-4 h-12 w-auto"
            />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Masuk untuk mengelola konten UISB
            </p>
          </div>

          {error && (
            <div
              role="alert"
              tabIndex={-1}
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="login-username"
                className="mb-1.5 block text-[14px] font-medium text-slate-700"
              >
                Username
              </label>
              <div className="relative">
                <FaUser
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-uisb-purple focus:ring-4 focus:ring-uisb-purple/10"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-[14px] font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <FaLock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-uisb-purple focus:ring-4 focus:ring-uisb-purple/10"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-uisb-purple py-3 text-[15px] font-semibold text-white shadow-md shadow-uisb-purple/30 transition-all hover:bg-uisb-purple-pudar active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {pending ? (
                <span className="flex h-7 items-center justify-center" role="status" aria-label="Memproses">
                  <LoadingBars />
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/70">
          &copy; {new Date().getFullYear()} UISB · Toward Campus Business Digital
        </p>
      </div>
    </main>
  )
}