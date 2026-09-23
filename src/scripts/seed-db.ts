import { loadEnvConfig } from "@next/env"

const projectDir = process.cwd()
loadEnvConfig(projectDir)

import { getPool } from "../lib/db.js"

const newsSeed = [
  {
    title: "School Basketball Team Wins Regional Championship",
    date: "2026-02-25",
    description:
      "The varsity basketball team secured a thrilling victory in the regional finals after an intense match.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop",
    link: "#",
  },
  {
    title: "Cultural Festival Highlights Diversity and Talent",
    date: "2026-01-30",
    description:
      "The annual cultural festival featured performances, food stalls, and exhibitions from various student groups.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop",
    link: "#",
  },
  {
    title: "Environmental Club Leads School Clean-Up Drive",
    date: "2026-03-05",
    description:
      "Members of the environmental club organized a successful clean-up campaign around the school.",
    image:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop",
    link: "#",
  },
  {
    title: "New Library Wing Officially Opened",
    date: "2026-02-10",
    description:
      "The school inaugurated a modern library wing equipped with digital resources and collaborative spaces.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop",
    link: "#",
  },
]

const testimonialsSeed = [
  {
    name: "Sarah Chen",
    designation: "Senior Frontend Developer",
    description:
      "The component library has revolutionized our development workflow. The pre-built components are not only beautiful but also highly customizable. It saved us countless hours of development time.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/d7/d7a92cde5e050f20718f6d5c958b346e0cabdcafc0086b3c5b2c28c4a0a3987e.jpg",
  },
  {
    name: "Michael Rodriguez",
    designation: "Founder, TechStart",
    description:
      "As a startup founder, I needed a quick way to build a professional-looking product. This component library was exactly what I needed. The documentation is clear, and the components are production-ready.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/d7/d7a92cde5e050f20718f6d5c958b346e0cabdcafc0086b3c5b2c28c4a0a3987e.jpg",
  },
  {
    name: "David Kim",
    designation: "UI/UX Lead",
    description:
      "The attention to detail in these components is impressive. From accessibility features to responsive design, everything is well thought out. It has become an essential part of our tech stack.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/d3/d3c0c88a6b46b95e1ba5bece168874b2063c8eccac9f4448f3a72b79a60a33f7.jpg",
  },
  {
    name: "Emily Thompson",
    designation: "Product Designer",
    description:
      "What sets this component library apart is its flexibility. We have been able to maintain consistency across our applications while still customizing components to match our brand identity perfectly.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/74/74c2ea4152c18408d17f866411dd8c4bbfbd6a47a3c6a21b7250a8c8dc173822.jpg",
  },
  {
    name: "James Wilson",
    designation: "Performance Engineer",
    description:
      "The performance optimization in these components is outstanding. We have seen significant improvements in our application load times and overall user experience since implementing them.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/fa/fa3de508ebf4c18449c02f261ced600030f1a4e1ead6f8b008c66433bef4b948.jpg",
  },
  {
    name: "Sophia Martinez",
    designation: "Full Stack Developer",
    description:
      "The community support and regular updates make this component library a reliable choice for our projects. It is clear that the team behind it is committed to maintaining high quality and adding new features.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/63/63fd3f80a880af51479f7deecfa513b055f06d42f90a5fa887af9af99ab145da.jpg",
  },
]

const dosenSeed = [
  {
    name: "Dr. Rina Astuti, M.Kom",
    title: "Information Systems",
    campus: "Universitas Indonesia Salemba",
    description:
      "Lecturer specializing in enterprise information systems, data architecture, and digital business strategy. Active researcher in the field of information systems governance.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop",
  },
  {
    name: "Andi Pratama, M.T",
    title: "Informatics Engineering",
    campus: "Universitas Indonesia Salemba",
    description:
      "Lecturer focused on software engineering, cloud computing, and scalable distributed systems. Mentor for student-led software projects.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop",
  },
  {
    name: "Dr. Sari Wahyuni, S.H., M.H.",
    title: "Law",
    campus: "Universitas Indonesia Salemba",
    description:
      "Lecturer in commercial law, business contracts, and corporate governance. Provides legal mentorship for business simulation programs.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop",
  },
  {
    name: "Budi Santosa, M.Psi",
    title: "Psychology",
    campus: "Universitas Indonesia Salemba",
    description:
      "Lecturer in organizational psychology, leadership, and consumer behavior. Supports student development through coaching and mentoring programs.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop",
  },
  {
    name: "Dr. Lina Marlina, M.Kes",
    title: "Public Health",
    campus: "Universitas Indonesia Salemba",
    description:
      "Lecturer in public health, epidemiology, and health policy. Guides students in community health research and field studies.",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop",
  },
]

const facilitiesSeed = [
  {
    title: "Perpustakaan",
    short_description: "Koleksi 50.000+ buku & ruang baca",
    description:
      "Perpustakaan kampus dengan koleksi lengkap buku teks, jurnal ilmiah, dan sumber digital. Tersedia ruang baca individual, area diskusi, serta akses e-journal nasional dan internasional.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop",
    icon: "FaBook",
  },
  {
    title: "Lab Komputer",
    short_description: "PC multimedia & akses 24 jam",
    description:
      "Laboratorium komputer dengan perangkat mutakhir untuk praktikum pemrograman, analisis data, dan simulasi bisnis. Dilengkapi software terbaru dan akses internet kampus 24 jam.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
    icon: "FaDesktop",
  },
  {
    title: "Lapangan Olahraga",
    short_description: "Basket, futsal & lapangan terbuka",
    description:
      "Kompleks olahraga kampus mencakup lapangan basket, futsal, dan area outdoor untuk kegiatan mahasiswa. Menjadi pusat kegiatan unit kegiatan mahasiswa olahraga dan kompetisi antar fakultas.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop",
    icon: "FaFutbol",
  },
  {
    title: "Auditorium",
    short_description: "Seminar, wisuda & 800 kursi",
    description:
      "Auditorium utama berkapasitas 800 kursi dengan sistem audio dan pencahayaan profesional. Digunakan untuk kegiatan akademik, seminar nasional, wisuda, dan acara kemahasiswaan.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop",
    icon: "FaUsers",
  },
  {
    title: "Student Lounge",
    short_description: "Wi-Fi gratis & area santai",
    description:
      "Ruang santai mahasiswa dengan Wi-Fi kampus gratis, colokan listrik di setiap meja, dan area kerja kelompok. Tempat ideal untuk belajar informal dan bersosialisasi antar program studi.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop",
    icon: "FaWifi",
  },
]

const informationSeed = [
  {
    title: "FRONTEND DEV",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
    description:
      "Pengembangan antarmuka pengguna menggunakan React, Next.js, dan Tailwind CSS. Fokus pada performa, aksesibilitas, dan pengalaman pengguna yang mulus.",
  },
  {
    title: "BACKEND DEV",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop",
    description:
      "Pengembangan server dan API dengan Node.js, PostgreSQL, dan serverless architecture. Menyediakan infrastruktur yang stabil dan scalable.",
  },
  {
    title: "UI UX DESIGN",
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop",
    description:
      "Desain antarmuka dan pengalaman pengguna yang menarik. Proses desain mulai dari riset pengguna hingga prototipe interaktif.",
  },
  {
    title: "VIDEO EDITING",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop",
    description:
      "Editing video profesional dengan Adobe Premiere Pro, After Effects, dan DaVinci Resolve. Membuat konten yang menarik untuk media sosial dan iklan.",
  },
  {
    title: "SEO OPTIMIZATION",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop",
    description:
      "Optimasi mesin pencari untuk meningkatkan visibilitas website. Termasuk analisis kata kunci, struktur URL, dan kecepatan halaman.",
  },
]

const achievementsSeed = [
  {
    title: "Programming & Technology",
    description:
      "Learning software engineering, data science, and emerging technologies through hands-on projects and industry mentorship.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
    link_url: "/academics",
  },
  {
    title: "Global Education Network",
    description:
      "Strategic partnerships with 50+ international universities for exchange programs, research collaborations, and global career paths.",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop",
    link_url: "/facility",
  },
  {
    title: "Collaborative Community",
    description:
      "Over 10,000 students and 500+ lecturers building the future together through innovation and shared knowledge.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop",
    link_url: "/information",
  },
]

const heroSlidesSeed = [
  {
    title: "Hero Campus 1",
    image: "/images/hero1.webp",
    device_type: "desktop",
  },
  {
    title: "Hero Campus 2",
    image: "/images/hero2.webp",
    device_type: "desktop",
  },
  {
    title: "Hero Campus 3",
    image: "/images/hero3.webp",
    device_type: "desktop",
  },
  {
    title: "Hero Campus Mobile",
    image: "/images/hero-mobile.webp",
    device_type: "mobile",
  },
]

async function main() {
  const pool = getPool()
  if (!pool) {
    throw new Error("DATABASE_URL is not configured.")
  }

  const { rows: newsCount } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM news",
  )
  if (Number(newsCount[0].count) === 0) {
    for (let i = 0; i < newsSeed.length; i++) {
      const n = newsSeed[i]
      await pool.query(
        "INSERT INTO news (title, date, description, image, link, sort_order) VALUES ($1, $2, $3, $4, $5, $6)",
        [n.title, n.date, n.description, n.image, n.link, i],
      )
    }
    console.log(`seeded ${newsSeed.length} news`)
  } else {
    console.log("news already seeded, skipping")
  }

  const { rows: testiCount } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM testimonials",
  )
  if (Number(testiCount[0].count) === 0) {
    for (let i = 0; i < testimonialsSeed.length; i++) {
      const t = testimonialsSeed[i]
      await pool.query(
        "INSERT INTO testimonials (name, designation, description, profile_image, sort_order) VALUES ($1, $2, $3, $4, $5)",
        [t.name, t.designation, t.description, t.profileImage, i],
      )
    }
    console.log(`seeded ${testimonialsSeed.length} testimonials`)
  } else {
    console.log("testimonials already seeded, skipping")
  }

  const { rows: dosenCount } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM dosen",
  )
  if (Number(dosenCount[0].count) === 0) {
    for (let i = 0; i < dosenSeed.length; i++) {
      const d = dosenSeed[i]
      await pool.query(
        "INSERT INTO dosen (name, title, campus, description, image, sort_order) VALUES ($1, $2, $3, $4, $5, $6)",
        [d.name, d.title, d.campus, d.description, d.image, i],
      )
    }
    console.log(`seeded ${dosenSeed.length} dosen`)
  } else {
    console.log("dosen already seeded, skipping")
  }

  const { rows: facCount } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM facilities",
  )
  if (Number(facCount[0].count) === 0) {
    for (let i = 0; i < facilitiesSeed.length; i++) {
      const f = facilitiesSeed[i]
      await pool.query(
        "INSERT INTO facilities (slug, title, short_description, description, image, icon, is_active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, true, $7)",
        [f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), f.title, f.short_description, f.description, f.image, f.icon, i],
      )
    }
    console.log(`seeded ${facilitiesSeed.length} facilities`)
  } else {
    console.log("facilities already seeded, skipping")
  }

  const { rows: infoCount } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM information",
  )
  if (Number(infoCount[0].count) === 0) {
    for (let i = 0; i < informationSeed.length; i++) {
      const s = informationSeed[i]
      await pool.query(
        "INSERT INTO information (slug, title, description, image, is_active, sort_order) VALUES ($1, $2, $3, $4, true, $5)",
        [s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), s.title, s.description, s.image, i],
      )
    }
    console.log(`seeded ${informationSeed.length} information`)
  } else {
    console.log("information already seeded, skipping")
  }

  const { rows: achCount } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM achievements",
  )
  if (Number(achCount[0].count) === 0) {
    for (let i = 0; i < achievementsSeed.length; i++) {
      const a = achievementsSeed[i]
      await pool.query(
        "INSERT INTO achievements (slug, title, description, image, link_url, is_active, sort_order) VALUES ($1, $2, $3, $4, $5, true, $6)",
        [a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), a.title, a.description, a.image, a.link_url, i],
      )
    }
    console.log(`seeded ${achievementsSeed.length} achievements`)
  } else {
    console.log("achievements already seeded, skipping")
  }

  const { rows: heroCount } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM hero_slides",
  )
  if (Number(heroCount[0].count) === 0) {
    for (let i = 0; i < heroSlidesSeed.length; i++) {
      const h = heroSlidesSeed[i]
      await pool.query(
        "INSERT INTO hero_slides (title, image, device_type, is_active, sort_order) VALUES ($1, $2, $3, true, $4)",
        [h.title, h.image, h.device_type, i],
      )
    }
    console.log(`seeded ${heroSlidesSeed.length} hero slides`)
  } else {
    console.log("hero slides already seeded, skipping")
  }

  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
