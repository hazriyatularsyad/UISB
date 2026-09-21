"use client"
import { usePathname } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import WhatsappFloat from "@/components/ui/whatsapp-float"
import type { ProgramItem } from "@/lib/data-store"

export default function LayoutShell({
  children,
  programs,
}: {
  children: React.ReactNode
  programs: ProgramItem[]
}) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")
  return (
    <>
      {/* ponytail: fixed strip, no extra component — add when reused >2 places */}
      {!isDashboard && (
        <div className="fixed top-0 left-0 flex h-3 w-full z-[60] pointer-events-none">
          <div className="w-16 bg-uisb-purple -skew-x-[25deg] origin-top-left -ml-2" />
          <div className="w-14 bg-uisb-purple-pudar -skew-x-[25deg] -ml-2" />
          <div className="w-16 bg-uisb-orange -skew-x-[25deg] -ml-2" />
        </div>
      )}
      {!isDashboard && <Navbar programs={programs} />}
      {children}
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsappFloat />}
    </>
  )
}
