import { adminListTestimonials } from "@/lib/data-store"
import TestimonialsManager from "./TestimonialsManager"

export default async function TestimonialsPage() {
  const items = await adminListTestimonials()
  return <TestimonialsManager initial={items} />
}
