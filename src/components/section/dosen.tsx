

import { listDosen, listDosenByTitle } from "@/lib/data-store"
import DosenAccordion from "@/components/ui/dosen-accordion"
import { Reveal } from "@/components/ui/reveal"

export default async function Dosen({ programTitle }: { programTitle?: string }) {
  const items = programTitle
    ? await listDosenByTitle(programTitle)
    : await listDosen()

  if (items.length === 0) return null

  return (
    <section className="bg-[#fcfbf9] py-10 px-4 sm:px-6 lg:px-8 font-body">
      <div className="w-full md:mx-auto md:w-[150vh]">
        <Reveal direction="up" className="mb-10">
          <h2 className="font-heading text-3xl md:text-4xl text-slate-900 tracking-tight">
            {programTitle ? `Lecturers — ${programTitle}` : "Our Lecturers"}
          </h2>
          <div className="mt-3 h-[2px] w-8 bg-amber-600"></div>
        </Reveal>
        <DosenAccordion items={items} />
      </div>
    </section>
  )
}
