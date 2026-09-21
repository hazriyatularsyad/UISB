import { adminListFacilities } from "@/lib/data-store"
import FacilityManager from "./FacilityManager"

export default async function FacilitiesPage() {
  const items = await adminListFacilities()
  return <FacilityManager initial={items} />
}
