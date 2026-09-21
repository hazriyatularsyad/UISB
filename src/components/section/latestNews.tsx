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
          <img
            src={news.image}
            alt={news.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
          <div className="mb-3 h-[270px] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <img
              src={news.image}
              alt={news.title}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
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
          Latest News
        </h2>
        <p className="text-center text-sm text-slate-500">No news yet.</p>
      </section>
    )
  }

  const [first, ...rest] = newsList

  return (
    <section className="md:w-[150vh] md:mx-auto px-4 py-16 font-sans sm:px-6 lg:px-8">
      <Reveal direction="up" className="mb-10 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-amber-600 mb-3 py-4">
          Latest News
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
    </section>
  )
}
