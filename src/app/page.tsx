import AboutUs from "@/components/section/aboutUs"
import AcademicsSection from "@/components/section/academics"
import LatestNews from "@/components/section/latestNews"
import PeopleSay from "@/components/section/people-say"
import VideoSection from "@/components/section/videoSection"
import CampusMap from "@/components/section/campusMap"
import { getActivePopups, listVideos, listHeroSlides } from "@/lib/data-store"
import HeroUi from "@/components/ui/heroUi"
import WelcomePopup from "@/components/ui/welcome-popup"
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
