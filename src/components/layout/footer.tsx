"use client"

import Image from "next/image"
import { FaGithub, FaTwitter, FaLinkedinIn, FaArrowRight } from "react-icons/fa6"
import { siteData } from "@/data/site"

const GitHubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <FaGithub size={size} className={className} />
)

const TwitterIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <FaTwitter size={size} className={className} />
)

const LinkedInIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <FaLinkedinIn size={size} className={className} />
)

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-fuchsia-950 from-gray-50 to-gray-100 px-4 py-12 font-sans text-gray-900 dark:border-gray-800 dark:from-gray-900 dark:to-black dark:text-white">
      <div className="container mx-auto grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Image src={siteData.hero.logoSrc} alt="Logo" width={145} height={64} className="h-10 w-auto" />
            <h3 className="text-3xl font-extrabold text-blue-600 dark:text-amber-400">
              UISB
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Innovating for a better tomorrow. We are committed to delivering
            high-quality solutions that empower businesses and individuals.
          </p>
          <div className="flex space-x-5 pt-2">
            <a href="#" className="transform text-gray-500 transition-transform hover:scale-110 hover:text-blue-600 dark:text-gray-400 dark:hover:text-teal-400">
              <GitHubIcon size={28} />
            </a>
            <a href="#" className="transform text-gray-500 transition-transform hover:scale-110 hover:text-blue-600 dark:text-gray-400 dark:hover:text-teal-400">
              <TwitterIcon size={28} />
            </a>
            <a href="#" className="transform text-gray-500 transition-transform hover:scale-110 hover:text-blue-600 dark:text-gray-400 dark:hover:text-teal-400">
              <LinkedInIcon size={28} />
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {siteData.nav.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-teal-400">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Resources
          </h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-teal-400">Support</a></li>
            <li><a href="#" className="text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-teal-400">FAQs</a></li>
            <li><a href="#" className="text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-teal-400">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-teal-400">Terms of Service</a></li>
            <li><a href="#" className="text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-teal-400">Careers</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Contact Us
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            123 Tech Avenue, Innovation City, 98765
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Email: info@yourbrand.com
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Phone: +1 (555) 123-4567
          </p>
            <a
                href="dashboard"
                aria-label="admin dashboard"
                className="group relative ml-auto hidden shrink-0 items-center justify-between gap-4 overflow-hidden rounded-full bg-[#FF5500] py-1.5 pl-5 pr-1.5 font-heading text-sm font-semibold text-white shadow-md motion-safe:transition-colors duration-500 ease-out hover:text-[#FF5500] md:inline-flex"
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
      <div className="mt-10 border-t border-gray-200 pt-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} UISB. All rights reserved.</p>
      </div>
    </footer>
  )
}
