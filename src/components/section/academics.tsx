import Link from "next/link"
import Image from "next/image"
import { siteData } from "@/data/site"
import { listPrograms } from "@/lib/data-store"
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal"

export default async function AcademicsSection() {
  const { academics } = siteData
  const programs = await listPrograms()

  return (
    <section className="w-full bg-uisb-purple px-6 py-10 font-sans md:px-12 lg:px-16">
      <div className="grid w-full grid-cols-1 items-stretch gap-8 md:mx-auto md:w-[150vh] lg:grid-cols-12 py-10">
        <Reveal direction="up" className="flex flex-col justify-between pr-4 lg:col-span-3 ">
          <div className="">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600 ">
              {academics.kicker}
            </span>
            <h2 className="mb-3 font-serif text-3xl lg:text-4xl text-white">
              {academics.title}
            </h2>
            <div className="mb-6 h-[2px] w-8 bg-amber-600 "></div>
            <p className="mb-8 text-s leading-relaxed text-white">
              {academics.description}
            </p>
          </div>
          <a
            href={academics.ctaHref}
            className="group mt-auto inline-flex items-center text-sm font-semibold text-white transition-colors duration-200 hover:text-white"
          >
            {academics.ctaText}
            <svg
              className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:col-span-9 lg:grid-cols-5">
          {programs.map((program, i) => (
            <RevealItem
              key={program.slug}
              index={i}
              direction="up"
              stagger={0.1}
            >
              <Link
                href={`/academics/${program.slug}`}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-md border border-amber-700 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-center justify-center bg-amber-600 p-4">
                  <h3 className="text-center font-serif text-s text-white transition-colors group-hover:text-slate-200">
                    {program.title}
                  </h3>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
