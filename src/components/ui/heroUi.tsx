"use client"

import { HeroSection } from "@/components/section/hero-section"
import PmbHeroCard from "@/components/ui/pmb-hero-card"
import type { HeroSlideItem, PopupItem } from "@/lib/data-store"

export default function HeroUi({
  slides,
  popups,
}: {
  slides?: HeroSlideItem[]
  popups?: PopupItem[]
}) {
  return (
    <HeroSection slides={slides}>
      {popups && popups.length > 0 ? <PmbHeroCard items={popups} /> : null}
    </HeroSection>
  )
}
