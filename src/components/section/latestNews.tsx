import Image from "next/image"
import { FaChevronRight } from "react-icons/fa6"
import { listNews, type NewsItem } from "@/lib/data-store"
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal"

function NewsCard({
  news,
  featured = false,
}: {
  news: NewsItem
  featured?: boolean
}) {
  return (
    <a
      href={news.link}
      className={
        featured
          ? "group relative block h-[380px] overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-1 sm:h-[420px] lg:col-span-2"
          : "group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1 lg:col-span-1"
      }
    >
      {featured ? (
        <>
          <Image
            src={news.image}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
            <span className="mb-2 block text-s font-medium text-slate-300">
              {news.date}
            </span>
            <h3 className="mb-2 text-2xl font-bold leading-snug transition-colors group-hover:text-amber-400 sm:text-2xl">
              {news.title}
            </h3>
            <p className="max-w-2xl text-sm text-slate-300 line-clamp-2 sm:text-sm">
              {news.description}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="relative mb-3 h-[270px] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={news.image}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="mb-1.5 block text-xs text-slate-400">
            {news.date}
          </span>
          <h3 className="mb-2 text-base font-bold leading-snug text-slate-800 transition-colors group-hover:text-amber-600">
            {news.title}
          </h3>
          <p className="text-s leading-relaxed text-slate-500 line-clamp-2">
            {news.description}
          </p>
        </>
      )}
    </a>
  )
}

export default async function LatestNews() {
  const allNews = await listNews()
  const newsList = allNews.slice(0, 5)

  if (newsList.length === 0) {
    return (
      <section className="md:w-[150vh] md:mx-auto px-4 font-sans sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 border">
          News & Updates
        </h2>
        <p className="text-center text-sm text-slate-500">No news yet.</p>
      </section>
    )
  }

  const [first, ...rest] = newsList

  return (
    <section className="md:w-[150vh] md:mx-auto font-sans">
      {/* MOBILE — <640px */}
      <div className=" px-4 py-20 sm:hidden">
        <div className="mx-auto max-w-md">
          <Reveal
            direction="up"
            className="mb-5 flex items-end justify-between gap-3"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              News & Updates
            <div className="my-2 h-[2px] w-10 bg-amber-600 "></div>
            </h2>
          </Reveal>

          {first && (
            <Reveal direction="up" duration={0.6}>
              <a href={first.link} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={first.image}
                    alt={first.title}
                    fill
                    sizes="(max-width: 640px) 100vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900">
                  {first.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-amber-700">
                  {first.date}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-4">
                  {first.description}
                </p>
              </a>
            </Reveal>
          )}

          <RevealGroup className="mt-6 space-y-4">
            {rest.map((news, i) => (
              <RevealItem key={news.id} index={i} direction="up" stagger={0.1}>
                <a href={news.link} className="group flex gap-3">
                  <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      sizes="112px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-snug text-slate-900 line-clamp-3">
                      {news.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-amber-700">
                      {news.date}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                      {news.description}
                    </p>
                  </div>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      {/* DESKTOP — >=640px */}
      <div className="hidden px-4 py-16 sm:block sm:px-6 lg:px-8">
        <Reveal direction="up" className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900  mb-3 py-4">
            News & Updates
            <div className="my-2 h-[2px] w-10 bg-amber-600 "></div>
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {first && (
            <RevealItem
              index={0}
              direction="up"
              duration={0.7}
              className="lg:col-span-2"
            >
              <NewsCard news={first} featured />
            </RevealItem>
          )}
          {rest.map((news, i) => (
            <RevealItem
              key={news.id}
              index={i + 1}
              direction={i % 2 === 0 ? "left" : "right"}
              stagger={0.12}
            >
              <NewsCard news={news} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
