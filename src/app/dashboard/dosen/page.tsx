import { adminListDosen, listPrograms } from "@/lib/data-store"
import DosenManager from "./DosenManager"

export default async function DosenPage() {
  const [items, programs] = await Promise.all([adminListDosen(), listPrograms()])
  return <DosenManager initial={items} programs={programs} />
}
