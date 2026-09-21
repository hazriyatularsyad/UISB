import { adminListInformation } from "@/lib/data-store"
import InformationManager from "./InformationManager"

export default async function InformationPage() {
  const items = await adminListInformation()
  return <InformationManager initial={items} />
}