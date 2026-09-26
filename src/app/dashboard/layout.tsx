import DashboardSidebar from "@/components/dashboard/Sidebar"
import ProfileMenu from "@/components/dashboard/ProfileMenu"
import { getSessionUser } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased">
      <DashboardSidebar />
      <ProfileMenu user={user} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
