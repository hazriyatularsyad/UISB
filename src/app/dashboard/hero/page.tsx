import { adminListHeroSlides } from "@/lib/data-store"
import HeroManager from "./HeroManager"

export const dynamic = "force-dynamic"

export default async function HeroDashboardPage() {
  const items = await adminListHeroSlides()
  return <HeroManager initial={items} />
}
