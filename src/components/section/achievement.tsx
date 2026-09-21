import { listAchievements } from "@/lib/data-store"
import AchievementCards from "./achievement-cards"
import { Reveal } from "@/components/ui/reveal"

export default async function Achievement() {
  const achievements = await listAchievements()

  return (
    <section className="w-full py-20 px-4 font-body sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <Reveal direction="up">
          <div className="space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-uisb-purple">
              OUR EXCELLENCE
            </p>
            <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
              Achievement
            </h2>
            <div className="mx-auto h-px w-8 bg-amber-500" />
            <p className="mx-auto max-w-2xl text-sm text-slate-600">
              Built on 30 years of academic excellence, delivering quality
              education that empowers students to succeed in a rapidly evolving
              world.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <AchievementCards items={achievements} />
        </Reveal>
      </div>
    </section>
  )
}
