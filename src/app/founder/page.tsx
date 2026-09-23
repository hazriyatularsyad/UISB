"use client"

import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa6"
import { Reveal } from "@/components/ui/reveal"
import { CalendlyCarousel, type CarouselItem } from "@/components/ui/founder-ui"

const FOUNDER_DATA: CarouselItem[] = [
  {
    id: "founder-1",
    stat: "Visi Pendidikan Islam & Digital Modern",
    quote:
      "Membangun generasi unggul yang memadukan kedalaman akhlak islami dengan penguasaan teknologi digital terdepan untuk kemaslahatan umat.",
    author: "Prof. Dr. H. Syamsul Bahri, M.A.",
    role: "Ketua Dewan Pembina Yayasan UISB",
    defaultImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop",
    selectedImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop",
    alt: "Ketua Dewan Pembina Yayasan UISB",
  },
  {
    id: "founder-2",
    stat: "30+ Tahun Pengabdian Pendidikan",
    quote:
      "Komitmen kami adalah menghadirkan ekosistem akademik yang adaptif, berintegritas tinggi, dan relevan dengan dinamika industri global.",
    author: "Dr. H. Ahmad Fauzi, S.E., M.M.",
    role: "Anggota Dewan Pembina / Tokoh Pendidikan",
    defaultImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop",
    selectedImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop",
    alt: "Anggota Dewan Pembina UISB",
  },
  {
    id: "founder-3",
    stat: "Transformasi Kampus Technopreneur",
    quote:
      "Kemitraan strategis dengan dunia usaha dan industri teknologi menjadi pondasi utama dalam mempersiapkan lulusan siap kerja dan berjiwa wirausaha.",
    author: "Hj. Nurhayati Subakat, Apt.",
    role: "Dewan Kehormatan & Penasihat Kewirausahaan",
    defaultImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop",
    selectedImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop",
    alt: "Dewan Kehormatan UISB",
  },
  {
    id: "founder-4",
    stat: "Jaringan Kolaborasi Internasional",
    quote:
      "Menghubungkan civitas akademika UISB dengan universitas global demi memperluas wawasan dan daya saing internasional mahasiswa kita.",
    author: "Ir. H. Muhammad Ridwan, M.Sc.",
    role: "Dewan Pembina Bidang Pengembangan Global",
    defaultImage:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop",
    selectedImage:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop",
    alt: "Dewan Pembina Bidang Pengembangan Global",
  },
]

export default function FounderPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-semibold text-slate-600 transition-colors hover:text-amber-600"
        >
          <FaArrowLeft className="mr-2 h-4 w-4 text-uisb-orange" />
          Kembali ke Beranda
        </Link>

        <Reveal direction="up" delay={0.05} className="mb-10 text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600">
            About Us · Board of Foundation
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Dewan Pembina & Pendiri UISB
          </h1>
          <div className="mx-auto my-4 h-1 w-12 rounded-full bg-amber-500" />
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Mengenal tokoh dan dewan pembina yang berdedikasi membangun Universitas Islam Sumatera Barat menuju kampus bisnis digital terkemuka.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <CalendlyCarousel
            items={FOUNDER_DATA}
            autoPlayInterval={6000}
            pauseOnHover={true}
          />
        </Reveal>
      </div>
    </main>
  )
}
