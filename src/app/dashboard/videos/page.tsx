import { adminListVideos } from "@/lib/data-store"
import VideoManager from "./VideoManager"

export default async function VideosPage() {
  const items = await adminListVideos()
  return <VideoManager initial={items} />
}
