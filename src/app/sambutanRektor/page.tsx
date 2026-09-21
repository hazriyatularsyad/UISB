import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { Reveal } from "@/components/ui/reveal"

export default function SambutanRektor() {
  return (
    <main className="min-h-screen bg-white pt-24 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-semibold text-slate-600 transition-colors hover:text-amber-600"
        >
          <FaArrowLeft className="mr-2 h-4 w-4 text-uisb-orange" />
          Kembali ke Beranda
        </Link>

        <Reveal direction="up" delay={0.05}>
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600">
            About Us · Sambutan Rektor
          </span>
          <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Sambutan Rektor
          </h1>
          <div className="mb-8 h-1 w-12 rounded-full bg-amber-500" />
        </Reveal>

        <Reveal direction="up" className="mb-10 overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80"
            alt="Rektor UISB"
            className="h-64 w-full object-cover md:h-[450px]"
          />
        </Reveal>

        <Reveal direction="up" delay={0.15} className="space-y-6">
          <div className="max-w-4xl space-y-4 text-base leading-relaxed text-slate-600 md:text-lg">
            <p className="font-semibold text-slate-900">
              Assalamu’alaikum Warahmatullahi Wabarakatuh,
            </p>
            <p>
              Selamat datang di portal resmi Universitas Islam Sumatera Barat (UISB).
              Sebagai institusi pendidikan tinggi yang mengusung visi{" "}
              <span className="font-semibold text-uisb-purple">
                “Towards Campus Business Digital”
              </span>
              , kami berkomitmen mencetak generasi unggul yang mengintegrasikan nilai-nilai
              keislaman, integritas moral, dan keahlian teknologi bisnis digital.
            </p>
            <p>
              Di era transformasi digital yang bergerak cepat, UISB terus berinovasi dalam kurikulum,
              fasilitas riset, dan kolaborasi industri untuk memastikan setiap mahasiswa mendapatkan
              pengalaman belajar yang adaptif, aplikatif, dan berdaya saing global.
            </p>
            <p>
              Mari bersama-sama melangkah dan berkontribusi nyata bagi kemajuan bangsa dan peradaban.
            </p>
            <p className="pt-4 font-semibold text-slate-900">
              Wassalamu’alaikum Warahmatullahi Wabarakatuh,
              <br />
              <span className="text-uisb-purple">Rektor Universitas Islam Sumatera Barat</span>
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
