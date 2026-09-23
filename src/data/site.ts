export const siteData = {
  nav: [
    { label: "HOME", href: "#" },
    { label: "PRODUCT", href: "#" },
    { label: "STORE", href: "#" },
    { label: "ABOUT US", href: "#" },
  ],
  contact: {
    whatsapp: "628116655515",
    whatsappDisplay: "+62 811-6655-515",
  },
  hero: {
    imageSrc: "/images/hero1.webp",
    imageAlt: "Hero background",
    logoSrc: "/images/uisb-logo@2x.png",
    socialLinks: [
      { name: "Instagram", href: "#", icon: "FaInstagram" },
      { name: "Facebook", href: "#", icon: "FaFacebook" },
      { name: "Twitter", href: "#", icon: "FaTwitter" },
      { name: "YouTube", href: "#", icon: "FaYoutube" },
    ],
    location: "Padang, Sumatera Barat",
  },

  academics: {
    kicker: "ACADEMICS",
    title: "Find Your Path",
    description:
      "Discover programs designed to challenge you, support you, and set you up for success.",
    ctaText: "View All Programs",
    ctaHref: "#all-programs",
    programs: [
      {
        slug: "Sistem-Informasi",
        title: "Sistem Informasi",
        label: "Information Systems",
        image:
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop",
        description:
          "Explore the richness of human culture, history, literature, and philosophy. Our Arts & Humanities program develops critical thinking, creativity, and communication skills through deep engagement with texts, ideas, and artistic expression.",
        shortDescription:
          "Study how people, process, and data come together to support decisions across modern organizations.",
      },
      {
        slug: "Teknik-Informatika",
        title: "Teknik Informatika",
        label: "Informatics Engineering",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop",
        description:
          "Build the skills to lead, innovate, and compete in global markets. The Business program covers management, finance, marketing, and entrepreneurship with real-world case studies and hands-on projects.",
        shortDescription:
          "Design and ship software systems grounded in computer science fundamentals and current practice.",
      },
      {
        slug: "Hukum",
        title: "Hukum",
        label: "Law",
        image:
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop",
        description:
          "Design and build solutions for real-world problems. Our Engineering program combines theory with practice across civil, mechanical, electrical, and software disciplines using modern labs and tools.",
        shortDescription:
          "Read legal texts closely, argue clearly, and apply doctrine to the cases that reach a working lawyer.",
      },
      {
        slug: "Psikology",
        title: "Psikology",
        label: "Psychology",
        image:
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop",
        description:
          "Investigate the natural world through rigorous research and experimentation. The Sciences program spans biology, chemistry, physics, and mathematics with access to advanced laboratory facilities.",
        shortDescription:
          "Learn how people think, feel, and behave, and how that knowledge is built through careful research.",
      },
      {
        slug: "Kesehatan-Masyarakat",
        title: "Kesehatan Masyarakat",
        label: "Public Health",
        image:
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop",
        description:
          "Shape the future by learning how to teach effectively. The Education program prepares you with pedagogy, curriculum design, and classroom management skills for diverse learning environments.",
        shortDescription:
          "Work on the health of populations through epidemiology, policy, and community programs.",
      },
    ],
  },
}

export const heroSlides = [
  { imageSrc: "/images/hero1.webp", imageSrcMobile: "/images/hero-mobile.webp", alt: "Hero 1" },
  { imageSrc: "/images/hero2.webp", imageSrcMobile: "/images/hero-mobile.webp", alt: "Hero 2" },
  { imageSrc: "/images/hero3.webp", imageSrcMobile: "/images/hero-mobile.webp", alt: "Hero 3" },
] as const

export const maps = [
  {
    id: 1,
    name: "Rektorat",
    address: "UISB - Universitas Islam Sumatera Barat Rektorat",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4976.356606312756!2d100.33965887587142!3d-0.8331329991587771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2b330fb8c54faf%3A0xa981428fcd1a41f5!2sUISB%20-%20Universitas%20Islam%20Sumatera%20Barat%20Rektorat!5e1!3m2!1sen!2sid!4v1788858864456!5m2!1sen!2sid",
  },
  {
    id: 2,
    name: "Gedung A",
    address: "UISB - Universitas Islam Sumatera Barat Gedung A",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4976.3225791848345!2d100.37023337587152!3d-0.8596519991320165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4c715e4745a3b%3A0x2b47cb403ee11b0!2sUISB%20-%20Universitas%20Islam%20Sumatera%20Barat%20Gedung%20A!5e1!3m2!1sen!2sid!4v1788858952019!5m2!1sen!2sid",
  },
  {
    id: 3,
    name: "Gedung B",
    address: "UISB - Universitas Islam Sumatera Barat Gedung B",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4976.373210659457!2d100.33007677587148!3d-0.8198810991721562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4c1247f94a639%3A0xba2c7c7a05da8a30!2sUISB%20-%20Universitas%20Islam%20Sumatera%20Barat%20Gedung%20B!5e1!3m2!1sen!2sid!4v1788859000945!5m2!1sen!2sid",
  },
]

export const testimonial = [
  {
    description:
      "The component library has revolutionized our development workflow. The pre-built components are not only beautiful but also highly customizable. It saved us countless hours of development time.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/d7/d7a92cde5e050f20718f6d5c958b346e0cabdcafc0086b3c5b2c28c4a0a3987e.jpg",
    name: "Sarah Chen",
    designation: "Senior Frontend Developer",
  },
  {
    description:
      "As a startup founder, I needed a quick way to build a professional-looking product. This component library was exactly what I needed. The documentation is clear, and the components are production-ready.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/d7/d7a92cde5e050f20718f6d5c958b346e0cabdcafc0086b3c5b2c28c4a0a3987e.jpg",
    name: "Michael Rodriguez",
    designation: "Founder, TechStart",
  },
  {
    description:
      "The attention to detail in these components is impressive. From accessibility features to responsive design, everything is well thought out. It has become an essential part of our tech stack.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/d3/d3c0c88a6b46b95e1ba5bece168874b2063c8eccac9f4448f3a72b79a60a33f7.jpg",
    name: "David Kim",
    designation: "UI/UX Lead",
  },
  {
    description:
      "What sets this component library apart is its flexibility. We have been able to maintain consistency across our applications while still customizing components to match our brand identity perfectly.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/74/74c2ea4152c18408d17f866411dd8c4bbfbd6a47a3c6a21b7250a8c8dc173822.jpg",
    name: "Emily Thompson",
    designation: "Product Designer",
  },
  {
    description:
      "The performance optimization in these components is outstanding. We have seen significant improvements in our application load times and overall user experience since implementing them.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/fa/fa3de508ebf4c18449c02f261ced600030f1a4e1ead6f8b008c66433bef4b948.jpg",
    name: "James Wilson",
    designation: "Performance Engineer",
  },
  {
    description:
      "The community support and regular updates make this component library a reliable choice for our projects. It is clear that the team behind it is committed to maintaining high quality and adding new features.",
    profileImage:
      "https://cdn.21st.dev/assets/mirror/63/63fd3f80a880af51479f7deecfa513b055f06d42f90a5fa887af9af99ab145da.jpg",
    name: "Sophia Martinez",
    designation: "Full Stack Developer",
  },
]
