"use client"

import { HeroSection } from "@/components/section/hero-section"
import type { HeroSlideItem } from "@/lib/data-store"

export default function HeroUi({ slides }: { slides?: HeroSlideItem[] }) {
  return <HeroSection slides={slides} />
}
