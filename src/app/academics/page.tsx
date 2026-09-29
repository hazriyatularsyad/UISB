import Link from "next/link"
import Image from "next/image"
import { siteData } from "@/data/site"
import { listPrograms } from "@/lib/data-store"
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal"

export default async function AcademicsPage() {
  const { academics } = siteData
  const programs = await listPrograms()

  return (
    <main className="min-h-screen bg-uisb-purple px-6 py-24 font-sans md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up" className="mb-12 text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600">
            {academics.kicker}
          </span>
          <h1 className="mb-4 font-serif text-4xl font-bold text-white md:text-5xl">
            {academics.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80">
            {academics.description}
          </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <RevealItem key={program.slug} index={i} direction="up" stagger={0.1}>
              <Link
                href={`/academics/${program.slug}`}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-md border border-amber-700 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-center justify-center bg-amber-600 p-4">
                  <h3 className="text-center font-serif text-base text-white transition-colors group-hover:text-slate-100">
                    {program.title}
                  </h3>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </main>
  )
}
