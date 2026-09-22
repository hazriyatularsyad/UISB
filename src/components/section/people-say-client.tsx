"use client"

import { Carousel, TestimonialCard, type iTestimonial } from "@/components/ui/people-say-ui"

export default function PeopleSayClient({ items }: { items: iTestimonial[] }) {
  const bgSay = "/images/bg-card.jpeg"
  const cards = items.map((t) => (
    <TestimonialCard key={t.name} testimonial={t} backgroundImage={bgSay} />
  ))

  return <Carousel items={cards} />
}
