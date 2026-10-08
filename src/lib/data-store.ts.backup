import { query } from "./db"
import { revalidatePath } from "next/cache"

export type NewsItem = {
  id: number
  title: string
  date: string
  description: string
  image: string
  link: string
  sort_order: number
}

export type DosenItem = {
  id: number
  name: string
  title: string
  campus: string
  description: string
  image: string
  sort_order: number
}

export type TestimonialItem = {
  id: number
  name: string
  designation: string
  description: string
  profile_image: string
  sort_order: number
}

export type NewsInput = Omit<NewsItem, "id" | "sort_order">
export type DosenInput = Omit<DosenItem, "id" | "sort_order">
export type TestimonialInput = Omit<TestimonialItem, "id" | "sort_order">

export async function listNews(): Promise<NewsItem[]> {
  return query<NewsItem>(
    "SELECT id, title, date, description, image, link, sort_order FROM news ORDER BY created_at DESC, id DESC",
  )
}

export async function adminListNews(): Promise<NewsItem[]> {
  return query<NewsItem>(
    "SELECT id, title, date, description, image, link, sort_order FROM news ORDER BY created_at DESC, id DESC",
  )
}

export async function getNews(id: number): Promise<NewsItem | null> {
  const rows = await query<NewsItem>(
    "SELECT id, title, date, description, image, link, sort_order FROM news WHERE id = $1",
    [id],
  )
  return rows[0] ?? null
}

export async function createNews(input: NewsInput): Promise<NewsItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM news",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<NewsItem>(
    "INSERT INTO news (title, date, description, image, link, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, date, description, image, link, sort_order",
    [input.title, input.date, input.description, input.image, input.link, next],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/news")
  return inserted[0]
}

export async function updateNews(id: number, input: NewsInput): Promise<NewsItem> {
  const updated = await query<NewsItem>(
    "UPDATE news SET title = $1, date = $2, description = $3, image = $4, link = $5, updated_at = NOW() WHERE id = $6 RETURNING id, title, date, description, image, link, sort_order",
    [input.title, input.date, input.description, input.image, input.link, id],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/news")
  return updated[0]
}

export async function deleteNews(id: number): Promise<void> {
  await query("DELETE FROM news WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/dashboard/news")
}

export async function listDosen(): Promise<DosenItem[]> {
  return query<DosenItem>(
    "SELECT id, name, title, campus, description, image, sort_order FROM dosen ORDER BY sort_order ASC, id ASC",
  )
}

export async function adminListDosen(): Promise<DosenItem[]> {
  return query<DosenItem>(
    "SELECT id, name, title, campus, description, image, sort_order FROM dosen ORDER BY created_at DESC, id DESC",
  )
}

export async function listDosenByTitle(title: string): Promise<DosenItem[]> {
  return query<DosenItem>(
    "SELECT id, name, title, campus, description, image, sort_order FROM dosen WHERE LOWER(title) = LOWER($1) ORDER BY sort_order ASC, id ASC",
    [title],
  )
}

export async function getDosen(id: number): Promise<DosenItem | null> {
  const rows = await query<DosenItem>(
    "SELECT id, name, title, campus, description, image, sort_order FROM dosen WHERE id = $1",
    [id],
  )
  return rows[0] ?? null
}

export async function createDosen(input: DosenInput): Promise<DosenItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM dosen",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<DosenItem>(
    "INSERT INTO dosen (name, title, campus, description, image, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, title, campus, description, image, sort_order",
    [input.name, input.title, input.campus, input.description, input.image, next],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/dosen")
  return inserted[0]
}

export async function updateDosen(id: number, input: DosenInput): Promise<DosenItem> {
  const updated = await query<DosenItem>(
    "UPDATE dosen SET name = $1, title = $2, campus = $3, description = $4, image = $5, updated_at = NOW() WHERE id = $6 RETURNING id, name, title, campus, description, image, sort_order",
    [input.name, input.title, input.campus, input.description, input.image, id],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/dosen")
  return updated[0]
}

export async function deleteDosen(id: number): Promise<void> {
  await query("DELETE FROM dosen WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/dashboard/dosen")
}

export async function listTestimonials(): Promise<TestimonialItem[]> {
  return query<TestimonialItem>(
    "SELECT id, name, designation, description, profile_image, sort_order FROM testimonials ORDER BY sort_order ASC, id ASC",
  )
}

export async function adminListTestimonials(): Promise<TestimonialItem[]> {
  return query<TestimonialItem>(
    "SELECT id, name, designation, description, profile_image, sort_order FROM testimonials ORDER BY created_at DESC, id DESC",
  )
}

export async function getTestimonial(id: number): Promise<TestimonialItem | null> {
  const rows = await query<TestimonialItem>(
    "SELECT id, name, designation, description, profile_image, sort_order FROM testimonials WHERE id = $1",
    [id],
  )
  return rows[0] ?? null
}

export async function createTestimonial(input: TestimonialInput): Promise<TestimonialItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM testimonials",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<TestimonialItem>(
    "INSERT INTO testimonials (name, designation, description, profile_image, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, designation, description, profile_image, sort_order",
    [input.name, input.designation, input.description, input.profile_image, next],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/testimonials")
  return inserted[0]
}

export async function updateTestimonial(id: number, input: TestimonialInput): Promise<TestimonialItem> {
  const updated = await query<TestimonialItem>(
    "UPDATE testimonials SET name = $1, designation = $2, description = $3, profile_image = $4, updated_at = NOW() WHERE id = $5 RETURNING id, name, designation, description, profile_image, sort_order",
    [input.name, input.designation, input.description, input.profile_image, id],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/testimonials")
  return updated[0]
}

export async function deleteTestimonial(id: number): Promise<void> {
  await query("DELETE FROM testimonials WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/dashboard/testimonials")
}

export type VideoItem = {
  id: number
  youtube_id: string
  title: string
  thumbnail: string
  sort_order: number
}

export type VideoInput = Omit<VideoItem, "id" | "sort_order">

export async function listVideos(): Promise<VideoItem[]> {
  return query<VideoItem>(
    "SELECT id, youtube_id, title, thumbnail, sort_order FROM videos ORDER BY sort_order ASC, id ASC",
  )
}

export async function adminListVideos(): Promise<VideoItem[]> {
  return query<VideoItem>(
    "SELECT id, youtube_id, title, thumbnail, sort_order FROM videos ORDER BY created_at DESC, id DESC",
  )
}

export async function getVideo(id: number): Promise<VideoItem | null> {
  const rows = await query<VideoItem>(
    "SELECT id, youtube_id, title, thumbnail, sort_order FROM videos WHERE id = $1",
    [id],
  )
  return rows[0] ?? null
}

export async function createVideo(input: VideoInput): Promise<VideoItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM videos",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<VideoItem>(
    "INSERT INTO videos (youtube_id, title, thumbnail, sort_order) VALUES ($1, $2, $3, $4) RETURNING id, youtube_id, title, thumbnail, sort_order",
    [input.youtube_id, input.title, input.thumbnail, next],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/videos")
  return inserted[0]
}

export async function updateVideo(id: number, input: VideoInput): Promise<VideoItem> {
  const updated = await query<VideoItem>(
    "UPDATE videos SET youtube_id = $1, title = $2, thumbnail = $3, updated_at = NOW() WHERE id = $4 RETURNING id, youtube_id, title, thumbnail, sort_order",
    [input.youtube_id, input.title, input.thumbnail, id],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/videos")
  return updated[0]
}

export async function deleteVideo(id: number): Promise<void> {
  await query("DELETE FROM videos WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/dashboard/videos")
}

export type PopupItem = {
  id: number
  image: string
  description: string
  button_label: string
  button_href: string
  title: string
  event_date: string | null
  attendees: number
  is_active: boolean
  sort_order: number
  updated_at: string
}

export type PopupInput = Omit<PopupItem, "id" | "sort_order" | "updated_at">

export async function listPopups(): Promise<PopupItem[]> {
  return query<PopupItem>(
    "SELECT id, image, description, button_label, button_href, COALESCE(title,'UISB Event') as title, event_date, COALESCE(attendees,42) as attendees, is_active, sort_order, updated_at FROM popups ORDER BY sort_order ASC, updated_at DESC, id ASC",
  )
}

export async function adminListPopups(): Promise<PopupItem[]> {
  return query<PopupItem>(
    "SELECT id, image, description, button_label, button_href, COALESCE(title,'UISB Event') as title, event_date, COALESCE(attendees,42) as attendees, is_active, sort_order, updated_at FROM popups ORDER BY created_at DESC, id DESC",
  )
}

export async function getActivePopups(): Promise<PopupItem[]> {
  return query<PopupItem>(
    "SELECT id, image, description, button_label, button_href, COALESCE(title,'UISB Event') as title, event_date, COALESCE(attendees,42) as attendees, is_active, sort_order, updated_at FROM popups WHERE is_active = true ORDER BY sort_order ASC, updated_at DESC, id ASC",
  )
}

export async function getPopup(id: number): Promise<PopupItem | null> {
  const rows = await query<PopupItem>(
    "SELECT id, image, description, button_label, button_href, COALESCE(title,'UISB Event') as title, event_date, COALESCE(attendees,42) as attendees, is_active, sort_order, updated_at FROM popups WHERE id = $1",
    [id],
  )
  return rows[0] ?? null
}

export async function createPopup(input: PopupInput): Promise<PopupItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM popups",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<PopupItem>(
    "INSERT INTO popups (image, description, button_label, button_href, title, event_date, attendees, is_active, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, image, description, button_label, button_href, title, event_date, attendees, is_active, sort_order, updated_at",
    [input.image, input.description, input.button_label, input.button_href, input.title, input.event_date, input.attendees, input.is_active, next],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/popups")
  return inserted[0]
}

export async function updatePopup(id: number, input: PopupInput): Promise<PopupItem> {
  const updated = await query<PopupItem>(
    "UPDATE popups SET image = $1, description = $2, button_label = $3, button_href = $4, title = $5, event_date = $6, attendees = $7, is_active = $8, updated_at = NOW() WHERE id = $9 RETURNING id, image, description, button_label, button_href, title, event_date, attendees, is_active, sort_order, updated_at",
    [input.image, input.description, input.button_label, input.button_href, input.title, input.event_date, input.attendees, input.is_active, id],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/popups")
  return updated[0]
}

export async function deletePopup(id: number): Promise<void> {
  await query("DELETE FROM popups WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/dashboard/popups")
}

export type ProgramItem = {
  id: number
  slug: string
  title: string
  label: string
  image: string
  description: string
  short_description: string
  is_active: boolean
  sort_order: number
  updated_at: string
}

export type ProgramInput = Omit<ProgramItem, "id" | "sort_order" | "updated_at">

export async function listPrograms(): Promise<ProgramItem[]> {
  return query<ProgramItem>(
    "SELECT id, slug, title, label, image, description, short_description, is_active, sort_order, updated_at FROM programs WHERE is_active = true ORDER BY sort_order ASC, id ASC",
  )
}

export async function adminListPrograms(): Promise<ProgramItem[]> {
  return query<ProgramItem>(
    "SELECT id, slug, title, label, image, description, short_description, is_active, sort_order, updated_at FROM programs ORDER BY created_at DESC, id DESC",
  )
}

export async function getProgramBySlug(slug: string): Promise<ProgramItem | null> {
  const rows = await query<ProgramItem>(
    "SELECT id, slug, title, label, image, description, short_description, is_active, sort_order, updated_at FROM programs WHERE slug = $1",
    [slug],
  )
  return rows[0] ?? null
}

export async function createProgram(input: ProgramInput): Promise<ProgramItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM programs",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<ProgramItem>(
    "INSERT INTO programs (slug, title, label, image, description, short_description, is_active, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, slug, title, label, image, description, short_description, is_active, sort_order, updated_at",
    [input.slug, input.title, input.label, input.image, input.description, input.short_description, input.is_active, next],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/programs")
  return inserted[0]
}

export async function updateProgram(id: number, input: ProgramInput): Promise<ProgramItem> {
  const updated = await query<ProgramItem>(
    "UPDATE programs SET slug = $1, title = $2, label = $3, image = $4, description = $5, short_description = $6, is_active = $7, updated_at = NOW() WHERE id = $8 RETURNING id, slug, title, label, image, description, short_description, is_active, sort_order, updated_at",
    [input.slug, input.title, input.label, input.image, input.description, input.short_description, input.is_active, id],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/programs")
  return updated[0]
}

export async function deleteProgram(id: number): Promise<void> {
  await query("DELETE FROM programs WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/dashboard/programs")
}

export type FacilityItem = {
  id: number
  slug: string
  title: string
  short_description: string
  description: string
  image: string
  icon: string
  is_active: boolean
  sort_order: number
  updated_at: string
}

export type FacilityInput = Omit<FacilityItem, "id" | "sort_order" | "updated_at">

export async function listFacilities(): Promise<FacilityItem[]> {
  return query<FacilityItem>(
    "SELECT id, slug, title, short_description, description, image, icon, is_active, sort_order, updated_at FROM facilities WHERE is_active = true ORDER BY sort_order ASC, id ASC",
  )
}

export async function adminListFacilities(): Promise<FacilityItem[]> {
  return query<FacilityItem>(
    "SELECT id, slug, title, short_description, description, image, icon, is_active, sort_order, updated_at FROM facilities ORDER BY created_at DESC, id DESC",
  )
}

export async function getFacilityBySlug(slug: string): Promise<FacilityItem | null> {
  const rows = await query<FacilityItem>(
    "SELECT id, slug, title, short_description, description, image, icon, is_active, sort_order, updated_at FROM facilities WHERE slug = $1",
    [slug],
  )
  return rows[0] ?? null
}

export async function createFacility(input: FacilityInput): Promise<FacilityItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM facilities",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<FacilityItem>(
    "INSERT INTO facilities (slug, title, short_description, description, image, icon, is_active, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, slug, title, short_description, description, image, icon, is_active, sort_order, updated_at",
    [input.slug, input.title, input.short_description, input.description, input.image, input.icon, input.is_active, next],
  )
  revalidatePath("/facility")
  revalidatePath("/dashboard/facilities")
  return inserted[0]
}

export async function updateFacility(id: number, oldSlug: string, input: FacilityInput): Promise<FacilityItem> {
  const updated = await query<FacilityItem>(
    "UPDATE facilities SET slug = $1, title = $2, short_description = $3, description = $4, image = $5, icon = $6, is_active = $7, updated_at = NOW() WHERE id = $8 RETURNING id, slug, title, short_description, description, image, icon, is_active, sort_order, updated_at",
    [input.slug, input.title, input.short_description, input.description, input.image, input.icon, input.is_active, id],
  )
  revalidatePath("/facility")
  revalidatePath(`/facility/${oldSlug}`)
  revalidatePath(`/facility/${input.slug}`)
  revalidatePath("/dashboard/facilities")
  return updated[0]
}

export async function deleteFacility(id: number, slug: string): Promise<void> {
  await query("DELETE FROM facilities WHERE id = $1", [id])
  revalidatePath("/facility")
  revalidatePath(`/facility/${slug}`)
  revalidatePath("/dashboard/facilities")
}

export type InformationItem = {
  id: number
  slug: string
  title: string
  image: string
  description: string
  is_active: boolean
  sort_order: number
  updated_at: string
}

export type InformationInput = Omit<InformationItem, "id" | "sort_order" | "updated_at">

export async function listInformation(): Promise<InformationItem[]> {
  return query<InformationItem>(
    "SELECT id, slug, title, image, description, is_active, sort_order, updated_at FROM information WHERE is_active = true ORDER BY sort_order ASC, id ASC",
  )
}

export async function adminListInformation(): Promise<InformationItem[]> {
  return query<InformationItem>(
    "SELECT id, slug, title, image, description, is_active, sort_order, updated_at FROM information ORDER BY created_at DESC, id DESC",
  )
}

export async function getInformationBySlug(slug: string): Promise<InformationItem | null> {
  const rows = await query<InformationItem>(
    "SELECT id, slug, title, image, description, is_active, sort_order, updated_at FROM information WHERE slug = $1",
    [slug],
  )
  return rows[0] ?? null
}

export async function createInformation(input: InformationInput): Promise<InformationItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM information",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<InformationItem>(
    "INSERT INTO information (slug, title, image, description, is_active, sort_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, slug, title, image, description, is_active, sort_order, updated_at",
    [input.slug, input.title, input.image, input.description, input.is_active, next],
  )
  revalidatePath("/information")
  revalidatePath("/dashboard/information")
  return inserted[0]
}

export async function updateInformation(id: number, input: InformationInput): Promise<InformationItem> {
  const updated = await query<InformationItem>(
    "UPDATE information SET slug = $1, title = $2, image = $3, description = $4, is_active = $5, updated_at = NOW() WHERE id = $6 RETURNING id, slug, title, image, description, is_active, sort_order, updated_at",
    [input.slug, input.title, input.image, input.description, input.is_active, id],
  )
  revalidatePath("/information")
  revalidatePath("/dashboard/information")
  return updated[0]
}

export async function deleteInformation(id: number): Promise<void> {
  await query("DELETE FROM information WHERE id = $1", [id])
  revalidatePath("/information")
  revalidatePath("/dashboard/information")
}

export type AchievementItem = {
  id: number
  slug: string
  title: string
  description: string
  image: string
  link_url: string
  is_active: boolean
  sort_order: number
  updated_at: string
}

export type AchievementInput = Omit<AchievementItem, "id" | "sort_order" | "updated_at">

export async function listAchievements(): Promise<AchievementItem[]> {
  return query<AchievementItem>(
    "SELECT id, slug, title, description, image, link_url, is_active, sort_order, updated_at FROM achievements WHERE is_active = true ORDER BY sort_order ASC, id ASC",
  )
}

export async function adminListAchievements(): Promise<AchievementItem[]> {
  return query<AchievementItem>(
    "SELECT id, slug, title, description, image, link_url, is_active, sort_order, updated_at FROM achievements ORDER BY created_at DESC, id DESC",
  )
}

export async function getAchievementBySlug(slug: string): Promise<AchievementItem | null> {
  const rows = await query<AchievementItem>(
    "SELECT id, slug, title, description, image, link_url, is_active, sort_order, updated_at FROM achievements WHERE slug = $1",
    [slug],
  )
  return rows[0] ?? null
}

export async function createAchievement(input: AchievementInput): Promise<AchievementItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM achievements",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<AchievementItem>(
    "INSERT INTO achievements (slug, title, description, image, link_url, is_active, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, slug, title, description, image, link_url, is_active, sort_order, updated_at",
    [input.slug, input.title, input.description, input.image, input.link_url, input.is_active, next],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/achievements")
  return inserted[0]
}

export async function updateAchievement(id: number, input: AchievementInput): Promise<AchievementItem> {
  const updated = await query<AchievementItem>(
    "UPDATE achievements SET slug = $1, title = $2, description = $3, image = $4, link_url = $5, is_active = $6, updated_at = NOW() WHERE id = $7 RETURNING id, slug, title, description, image, link_url, is_active, sort_order, updated_at",
    [input.slug, input.title, input.description, input.image, input.link_url, input.is_active, id],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/achievements")
  return updated[0]
}

export async function deleteAchievement(id: number): Promise<void> {
  await query("DELETE FROM achievements WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/dashboard/achievements")
}

export type HeroSlideItem = {
  id: number
  title: string
  image: string
  device_type: "desktop" | "mobile" | "all"
  is_active: boolean
  sort_order: number
  updated_at: string
}

export type HeroSlideInput = Omit<HeroSlideItem, "id" | "sort_order" | "updated_at">

export async function listHeroSlides(): Promise<HeroSlideItem[]> {
  return query<HeroSlideItem>(
    "SELECT id, title, image, device_type, is_active, sort_order, updated_at FROM hero_slides WHERE is_active = true ORDER BY sort_order ASC, id ASC",
  )
}

export async function adminListHeroSlides(): Promise<HeroSlideItem[]> {
  return query<HeroSlideItem>(
    "SELECT id, title, image, device_type, is_active, sort_order, updated_at FROM hero_slides ORDER BY created_at DESC, id DESC",
  )
}

export async function getHeroSlide(id: number): Promise<HeroSlideItem | null> {
  const rows = await query<HeroSlideItem>(
    "SELECT id, title, image, device_type, is_active, sort_order, updated_at FROM hero_slides WHERE id = $1",
    [id],
  )
  return rows[0] ?? null
}

export async function createHeroSlide(input: HeroSlideInput): Promise<HeroSlideItem> {
  const nextRows = await query<{ sort_order: number | string }>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS sort_order FROM hero_slides",
  )
  const next = nextRows[0]?.sort_order != null ? Number(nextRows[0].sort_order) : 0
  const inserted = await query<HeroSlideItem>(
    "INSERT INTO hero_slides (title, image, device_type, is_active, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING id, title, image, device_type, is_active, sort_order, updated_at",
    [input.title, input.image, input.device_type, input.is_active, next],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/hero")
  return inserted[0]
}

export async function updateHeroSlide(id: number, input: HeroSlideInput): Promise<HeroSlideItem> {
  const updated = await query<HeroSlideItem>(
    "UPDATE hero_slides SET title = $1, image = $2, device_type = $3, is_active = $4, updated_at = NOW() WHERE id = $5 RETURNING id, title, image, device_type, is_active, sort_order, updated_at",
    [input.title, input.image, input.device_type, input.is_active, id],
  )
  revalidatePath("/")
  revalidatePath("/dashboard/hero")
  return updated[0]
}

export async function deleteHeroSlide(id: number): Promise<void> {
  await query("DELETE FROM hero_slides WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/dashboard/hero")
}
