import { adminListPopups } from "@/lib/data-store"
import PopupManager from "./PopupManager"

export default async function PopupsPage() {
  const items = await adminListPopups()
  return <PopupManager initial={items} />
}
