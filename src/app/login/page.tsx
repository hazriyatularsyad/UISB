"use client"

import { Suspense } from "react"
import LoginForm from "./login-form"
import LoadingBars from "./loading-bars"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[100dvh] items-center justify-center bg-uisb-purple px-4 font-sans">
          <div className="flex flex-col items-center gap-3">
            <LoadingBars />
            <p className="text-xs text-white/70">Memuat...</p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}