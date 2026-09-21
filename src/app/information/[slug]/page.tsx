import { notFound } from "next/navigation"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { getInformationBySlug, listInformation } from "@/lib/data-store"
import { Reveal } from "@/components/ui/reveal"

export const dynamic = "force-dynamic"

export default async function InformationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [item, items] = await Promise.all([
    getInformationBySlug(slug),
    listInformation(),
  ])

  if (!item) return notFound()

  return (
    <main className="min-h-screen bg-[#fcfbf7] pt-20 font-sans">
      <div className="md:mx-auto md:w-[150vh] px-6 pb-20">
        <Link
          href="/information"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-700 transition-colors hover:text-amber-600"
        >
          <FaArrowLeft className="mr-2 h-4 w-4 text-uisb-orange" />
          Back to Information
        </Link>

        <Reveal direction="up">
          <img
            src={item.image}
            alt={item.title}
            className="mb-6 h-64 w-full rounded-lg object-cover md:h-130"
          />
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <h1 className="mb-4 font-serif text-4xl font-bold text-slate-900 md:text-5xl">
            {item.title}
          </h1>
          {item.description && (
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
              {item.description}
            </p>
          )}
        </Reveal>

        <div className="mt-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-600">
            More Information
          </p>
          <div className="flex flex-wrap gap-3">
            {items
              .filter((s) => s.slug !== slug)
              .map((s) => (
                <Link
                  key={s.id}
                  href={`/information/${s.slug}`}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-amber-500 hover:text-amber-600"
                >
                  {s.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}