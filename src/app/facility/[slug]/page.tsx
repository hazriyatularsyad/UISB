import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { FaArrowLeft } from "react-icons/fa6"
import { getFacilityBySlug, listFacilities } from "@/lib/data-store"
import { FacilityIcon } from "@/lib/facility-icons"
import InteractiveSelector from "@/components/ui/facility"
import {
  DynamicFrameLayout,
  type Frame,
} from "@/components/ui/dynamic-frame-layout"
import { Reveal } from "@/components/ui/reveal"

const galleryImages = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop",
]

const galleryFrames: Frame[] = galleryImages.map((image, i) => ({
  id: i + 1,
  image,
  defaultPos: {
    x: (i % 3) * 4,
    y: Math.floor(i / 3) * 4,
    w: 4,
    h: 4,
  },
}))

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [facility, facilities] = await Promise.all([
    getFacilityBySlug(slug),
    listFacilities(),
  ])

  if (!facility) return notFound()

  return (
    <main className="min-h-screen bg-[#222] pt-20 font-sans">
      <InteractiveSelector
        facilities={facilities}
        activeSlug={slug}
        title="Fasilitas Kampus"
        description={facility.title}
      />

      <div className="mx-auto max-w-7xl px-6 pb-20">
        <Link
          href="/facility"
          className="mb-8 inline-flex items-center text-sm font-semibold text-gray-300 transition-colors hover:text-white"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Facilities
        </Link>

        <Reveal direction="up" className="relative mb-8 h-64 overflow-hidden rounded-lg md:h-130">
          <Image
            src={facility.image}
            alt={facility.title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#444] bg-[rgba(32,32,32,0.85)]">
              <FacilityIcon
                icon={facility.icon}
                size={22}
                className="text-white"
              />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Facility
            </span>
          </div>
          <h1 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl">
            {facility.title}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-gray-300">
            {facility.description || facility.short_description}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.2} className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold text-white md:text-3xl">
            Galeri Fasilitas
          </h2>
          <div className="h-[300px] w-full md:h-[480px]">
            <DynamicFrameLayout frames={galleryFrames} gapSize={4} />
          </div>
        </Reveal>
      </div>
    </main>
  )
}
