import { listFacilities } from "@/lib/data-store"
import InteractiveSelector from "@/components/ui/interactive-selector"

export default async function FacilityIndexPage() {
  const facilities = await listFacilities()

  return (
    <main className="min-h-screen bg-[#fffcfc] pt-14">
      <InteractiveSelector facilities={facilities} />
    </main>
  )
}
