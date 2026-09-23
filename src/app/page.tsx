import AboutUs from "@/components/section/aboutUs"
import AcademicsSection from "@/components/section/academics"
import LatestNews from "@/components/section/latestNews"
import PeopleSay from "@/components/section/people-say"
import VideoSection from "@/components/section/videoSection"
import { CampusMap, WelcomePopup } from "@/components/ui/lazy-sections"
import { getActivePopups, listVideos, listHeroSlides } from "@/lib/data-store"
import HeroUi from "@/components/ui/heroUi"
import Achievement from "@/components/section/achievement"

export default async function Home() {
  const [videos, popups, heroSlides] = await Promise.all([
    listVideos(),
    getActivePopups(),
    listHeroSlides(),
  ])
  return (
    <>
      <HeroUi slides={heroSlides} />
      <AboutUs />
      <AcademicsSection />
      <LatestNews />
      <Achievement />
      <PeopleSay />
      <VideoSection items={videos} />
      <CampusMap />
      <WelcomePopup data={popups} />
    </>
  )
}
