import { MetadataRoute } from "next"
import { listInformation } from "@/lib/data-store"
import { listPrograms } from "@/lib/data-store"
import { listFacilities } from "@/lib/data-store"

const BASE_URL = "https://uisb.ac.id"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [information, programs, facilities] = await Promise.all([
    listInformation(),
    listPrograms(),
    listFacilities(),
  ])

  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const },
    { url: `${BASE_URL}/information`, lastModified: new Date(), changeFrequency: "daily" as const },
    { url: `${BASE_URL}/facility`, lastModified: new Date(), changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/academics`, lastModified: new Date(), changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/founder`, lastModified: new Date(), changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/sambutan-rektor`, lastModified: new Date(), changeFrequency: "monthly" as const },
  ]

  const informationRoutes = information.map((item) => ({
    url: `${BASE_URL}/information/${item.slug}`,
    lastModified: new Date(item.updated_at || new Date()),
    changeFrequency: "weekly" as const,
  }))

  const programRoutes = programs.map((item) => ({
    url: `${BASE_URL}/academics/${item.slug}`,
    lastModified: new Date(item.updated_at || new Date()),
    changeFrequency: "monthly" as const,
  }))

  const facilityRoutes = facilities.map((item) => ({
    url: `${BASE_URL}/facility/${item.slug}`,
    lastModified: new Date(item.updated_at || new Date()),
    changeFrequency: "monthly" as const,
  }))

  return [...staticRoutes, ...informationRoutes, ...programRoutes, ...facilityRoutes]
}
