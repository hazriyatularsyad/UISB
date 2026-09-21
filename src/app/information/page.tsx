import Information from "@/components/section/information"
import { listInformation } from "@/lib/data-store"

export const dynamic = "force-dynamic"

export default async function InformationPage() {
  const information = await listInformation()
  return <Information services={information} />
}