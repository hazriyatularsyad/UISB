import { adminListNews } from "@/lib/data-store"
import NewsManager from "./NewsManager"

export default async function NewsPage() {
  const items = await adminListNews()
  return <NewsManager initial={items} />
}
