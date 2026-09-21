import { adminListAchievements } from "@/lib/data-store"
import AchievementManager from "./AchievementManager"

export default async function AchievementsPage() {
  const items = await adminListAchievements()
  return <AchievementManager initial={items} />
}