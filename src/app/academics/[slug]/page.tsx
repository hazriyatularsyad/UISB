import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { FaArrowLeft } from "react-icons/fa6"
import { siteData } from "@/data/site"
import { getProgramBySlug } from "@/lib/data-store"
import Dosen from "@/components/section/dosen"
import { Reveal } from "@/components/ui/reveal"

export default async function AcademicDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)

  if (!program) return notFound()

  return (
    <div className="min-h-screen bg-[#fcfbf9] px-6 py-24 font-sans md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/#all-programs"
          className="mb-8 inline-flex items-center text-sm font-semibold text-slate-900 transition-colors hover:text-amber-600"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Programs
        </Link>

        <Reveal direction="up" className="relative mb-8 h-64 overflow-hidden rounded-lg md:h-130">
          <Image
            src={program.image}
            alt={program.title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600">
            {siteData.academics.kicker}
          </span>
          <h1 className="mb-6 font-serif text-4xl font-bold text-slate-900 md:text-5xl">
            {program.title}
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            {program.description}
          </p>
        </Reveal>
      </div>

      <div className="mt-16">
        <Dosen programTitle={program.label} />
      </div>
    </div>
  )
}
