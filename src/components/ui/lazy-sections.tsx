"use client"

import dynamic from "next/dynamic"

/**
 * Komponen non-kritis homepage di-load terpisah dari first-load JS.
 * - CampusMap: below fold (iframe Google Maps)
 * - WelcomePopup: overlay modal, muncul setelah hydrate
 */
export const CampusMap = dynamic(
  () => import("@/components/section/campusMap"),
  { ssr: false },
)

export const WelcomePopup = dynamic(
  () => import("@/components/ui/welcome-popup"),
  { ssr: false, loading: () => null },
)
