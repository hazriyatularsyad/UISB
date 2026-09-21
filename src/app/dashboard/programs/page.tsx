import { adminListPrograms } from "@/lib/data-store"
import ProgramManager from "./ProgramManager"

export default async function ProgramsPage() {
  const items = await adminListPrograms()
  return <ProgramManager initial={items} />
}
