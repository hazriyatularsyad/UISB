"use client"

import Image from "next/image"
import { FaArrowRight, FaInstagram, FaTiktok, FaWhatsapp, FaYoutube } from "react-icons/fa6"
import { siteData } from "@/data/site"

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/@uisb.ac.id", Icon: FaInstagram },
  { name: "TikTok", href: "https://www.tiktok.com/@uisb.ac.id", Icon: FaTiktok },
  { name: "YouTube", href: "https://www.youtube.com/watch?v=6tlPiuF-Cko&t=89s", Icon: FaYoutube },
  { name: "WhatsApp", href: `https://wa.me/${siteData.contact.whatsapp}`, Icon: FaWhatsapp },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-fuchsia-950 px-4 py-10 font-sans text-gray-300 sm:py-12">
      <div className="container mx-auto grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Image src={siteData.hero.logoSrc} alt="Logo" width={145} height={64} className="h-10 w-auto" />
            <h3 className="text-3xl font-extrabold text-blue-600">
              UISB
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            Innovating for a better tomorrow. We are committed to delivering
            high-quality solutions that empower businesses and individuals.
          </p>
          <div className="flex flex-wrap gap-1 pt-2">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="inline-flex h-11 w-11 items-center justify-center text-gray-400 transition-colors hover:text-blue-600"
              >
                <Icon size={26} />
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {siteData.nav.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-gray-300 transition-colors duration-300 hover:text-blue-600">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Resources
          </h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-300 transition-colors duration-300 hover:text-blue-600">Support</a></li>
            <li><a href="#" className="text-gray-300 transition-colors duration-300 hover:text-blue-600">FAQs</a></li>
            <li><a href="#" className="text-gray-300 transition-colors duration-300 hover:text-blue-600">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-300 transition-colors duration-300 hover:text-blue-600">Terms of Service</a></li>
            <li><a href="#" className="text-gray-300 transition-colors duration-300 hover:text-blue-600">Careers</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Contact Us
          </h3>
          <p className="text-gray-300">
            123 Tech Avenue, Innovation City, 98765
          </p>
          <p className="text-gray-300">
            Email: info@yourbrand.com
          </p>
          <p className="text-gray-300">
            Phone: +1 (555) 123-4567
          </p>
            <a
                href="/dashboard"
                aria-label="admin dashboard"
                className="group relative inline-flex shrink-0 items-center justify-between gap-4 overflow-hidden rounded-full bg-[#FF5500] py-1.5 pl-5 pr-1.5 font-heading text-sm font-semibold text-white shadow-md motion-safe:transition-colors duration-500 ease-out hover:text-[#FF5500]"
              >
                <span className="pointer-events-none absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[10]" />
                <span className="relative z-10 motion-safe:transition-colors duration-500 group-hover:text-[#FF5500]">
                  Admin Dashboard
                </span>
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white motion-safe:transition-transform duration-300 group-hover:translate-x-0.5">
                  <FaArrowRight className="h-3.5 w-3.5 text-[#FF5500]" />
                </span>
              </a>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-400 sm:mt-10 sm:pt-10">
        <p>&copy; {new Date().getFullYear()} UISB. All rights reserved.</p>
      </div>
    </footer>
  )
}
