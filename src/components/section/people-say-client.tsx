"use client"

import { Carousel, TestimonialCard, type iTestimonial } from "@/components/ui/people-say-ui"

export default function PeopleSayClient({ items }: { items: iTestimonial[] }) {
  const bgSay = "/images/bg-card.jpeg"
  const cards = items.map((t, index) => (
    <TestimonialCard
      key={index}
      testimonial={t}
      index={index}
      backgroundImage={bgSay}
    />
  ))

  return <Carousel items={cards} />
}
