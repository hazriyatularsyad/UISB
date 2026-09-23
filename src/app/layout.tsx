import type { Metadata } from "next"
import { Montserrat, Roboto } from "next/font/google"
import "@/styles/globals.css"
import LayoutShell from "./layout-shell"
import { listPrograms } from "@/lib/data-store"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "UISB",
  description: "Toward Campus Business Digital",
  icons: { icon: "/images/favicon.png" },
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const programs = await listPrograms()
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${roboto.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip font-body">
        <LayoutShell programs={programs}>{children}</LayoutShell>
      </body>
    </html>
  )
}
