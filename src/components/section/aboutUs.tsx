import { FaBookOpen, FaGlobe, FaLightbulb, FaPhoneAlt } from "react-icons/fa"
import { CountUp, Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal"

export default function AboutUs() {
  const features = [
    {
      title: "Edukation Services",
      description: "It is a long established fact that reader will to using content.",
      icon: <FaBookOpen className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "International Hubs",
      description: "It is a long established fact that reader will to using content.",
      icon: <FaGlobe className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "International Hub",
      description: "It is a long established fact that reader will to using content.",
      icon: <FaGlobe className="h-6 w-6 text-amber-500" />,
    },
  ]

  return (
    <section className="md:w-[150vh] md:mx-auto bg-white px-4 py-16 font-sans sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <Reveal direction="left" className="grid grid-cols-2 items-start gap-4 lg:col-span-6">
          <div className="space-y-4">
            <div className="h-[320px] overflow-hidden rounded-[80px_80px_0_80px] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                alt="Woman reading book"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center space-x-3 rounded-2xl bg-amber-500 p-4 text-white shadow-md">
              <div className="flex-shrink-0 rounded-full bg-white/20 p-2.5">
                <FaLightbulb className="h-6 w-6 text-white" />
              </div>
              <p className="text-m font-semibold leading-tight">
                <CountUp to={30} className="tabular-nums" /> Years Of <br />
                Quality Service
              </p>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="h-[200px] overflow-hidden rounded-[80px_80px_0_80px] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                alt="Students studying"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-[260px] overflow-hidden rounded-[0_80px_80px_80px] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
                alt="Teacher helping student"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="space-y-6 lg:col-span-6">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-800 sm:text-5xl">
            TOWARDS <span className="text-amber-500"> CAMPUS</span> BUSINESS DIGITAL
          </h2>
          <h2 className="text-3xl font-extrabold leading-tight text-slate-800 sm:text-4xl">
            Our Edukation System <br />
            <span className="text-fuchsia-500">Inspires</span> You More.
          </h2>
          <p className="text-s leading-relaxed text-gray-500">
            There are many variations of passages available but the majority
            have suffered alteration in some form by injected humour randomised
            words which dont look even slightly believable. If you are going to
            use passage.
          </p>

          <RevealGroup className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
            <div className="space-y-6">
              {features.map((feature, i) => (
                <RevealItem key={feature.title} index={i} direction="left">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0 rounded-full bg-orange-100/70 p-2.5">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="mb-1 text-s font-bold text-slate-800">
                        {feature.title}
                      </h4>
                      <p className="text-sm leading-normal text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
            <RevealItem index={features.length} direction="left">
              <div className="relative flex flex-col justify-between rounded-2xl border border-amber-100/50 bg-fuchsia-50/80 p-5">
                <p className="text-l italic leading-relaxed text-gray-500">
                  It is a long established fact that a reader will be distracted
                  by the content of a page when looking at its reader for the long
                  words layout.
                </p>
                <div className="mt-4 text-right font-serif text-2xl font-bold tracking-widest text-uisb-purple">
                  &rdquo;&rdquo;
                </div>
              </div>
            </RevealItem>
          </RevealGroup>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            {/* <button className="group flex items-center space-x-2 rounded-full bg-fuchsia-700 px-6 py-3.5 text-m font-semibold text-white shadow-md transition-all hover:bg-amber-600">
              <span>DISCOVER MORE</span>
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </button> */}
            {/* <div className="flex items-center space-x-3">
              <div className="rounded-full bg-amber-500 p-3 text-white shadow-sm">
                <FaPhoneAlt className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-400">
                  Call Now
                </span>
                <a
                  href="tel:+21236547898"
                  className="text-sm font-bold text-slate-800 transition-colors hover:text-amber-500"
                >
                  +2 123 654 7898
                </a>
              </div>
            </div> */}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
