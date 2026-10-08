import Link from "next/link"
import Image from "next/image"
import { siteData } from "@/data/site"
import { listPrograms } from "@/lib/data-store"
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal"

export const dynamic = 'force-dynamic'

export default async function AcademicsPage() {
  const { academics } = siteData
  const programs = await listPrograms()
  const [first, ...rest] = programs

  return (
    <main className="min-h-screen bg-uisb-purple px-4 py-24 font-sans sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up" className="mb-10 text-center sm:mb-12">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600">
            {academics.kicker}
          </span>
          <h1 className="mb-4 font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {academics.title}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {academics.description}
          </p>
        </Reveal>

        {/* MOBILE — same pattern as latestNews */}
        <div className="sm:hidden">
          {first && (
            <Reveal direction="up" duration={0.6}>
              <Link href={`/academics/${first.slug}`} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={first.image}
                    alt={first.title}
                    fill
                    sizes="(max-width: 640px) 100vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 text-xl font-bold leading-snug text-white">
                  {first.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 line-clamp-4">
                  {first.description}
                </p>
              </Link>
            </Reveal>
          )}

          <RevealGroup className="mt-6 space-y-4">
            {rest.map((program, i) => (
              <RevealItem key={program.slug} index={i} direction="up" stagger={0.1}>
                <Link
                  href={`/academics/${program.slug}`}
                  className="group flex gap-3"
                >
                  <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      sizes="112px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-snug text-white line-clamp-3">
                      {program.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70 line-clamp-2">
                      {program.description}
                    </p>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* DESKTOP */}
        <RevealGroup className="hidden grid-cols-1 gap-6 sm:grid md:grid-cols-2 lg:grid-cols-3">
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
                    sizes="(max-width: 1024px) 50vw, 33vw"
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
