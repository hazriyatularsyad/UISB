import { listTestimonials } from "@/lib/data-store"
import PeopleSayClient from "./people-say-client"
import { Reveal } from "@/components/ui/reveal"

export default async function PeopleSay() {
  const items = await listTestimonials()

  if (items.length === 0) {
    return (
      <section className="max-w-full overflow-x-hidden py-20 px-4 sm:px-6 lg:px-8 font-body">
        <div className="md:w-[150vh] md:mx-auto">
          <Reveal direction="up">
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-amber-600 mb-3">
              VOICES
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-slate-900 mb-3 tracking-tight">
              What people say
            </h2>
            <div className="mb-6 h-[2px] w-8 bg-amber-600"></div>
            <p className="max-w-2xl text-sm md:text-base leading-relaxed text-slate-600">
              Honest words from people who use our tools and services every day.
            </p>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-slate-500">
              No testimonials yet. Add entries from the dashboard.
            </p>
          </Reveal>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-full overflow-x-hidden py-20 px-4 sm:px-6 lg:px-8 font-body">
      <div className="md:w-[150vh] md:mx-auto">
        <Reveal direction="up">
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-amber-600 mb-3">
            VOICES
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-slate-900 mb-3 tracking-tight">
            What people say
          </h2>
          <div className="mb-6 h-[2px] w-8 bg-amber-600"></div>
          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-slate-600">
            Honest words from people who use our tools and services every day.
          </p>
        </Reveal>

        <Reveal direction="none" once>
          <PeopleSayClient
            items={items.map((t) => ({
              name: t.name,
              designation: t.designation,
              description: t.description,
              profileImage: t.profile_image,
            }))}
          />
        </Reveal>
      </div>
    </section>
  )
}
