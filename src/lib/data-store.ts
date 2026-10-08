import { query } from "./db"
import { revalidatePath } from "next/cache"
import {
  getNextSortOrder,
  standardRevalidatePaths,
  facilityRevalidatePaths,
  selectAll,
  createInsertHelpers,
  createUpdateSetter,
  executeList,
  executeGet,
  executeCreate,
  executeUpdate,
  executeDelete
} from "./crud-helpers"

// News
export type NewsItem = {
  id: number
  title: string
  date: string
  description: string
  image: string
  link: string
  sort_order: number
}

export type NewsInput = Omit<NewsItem, "id" | "sort_order">;

export async function listNews(): Promise<NewsItem[]> {
  return executeList<NewsItem>("news", "created_at DESC, id DESC");
}

export async function adminListNews(): Promise<NewsItem[]> {
  return executeList<NewsItem>("news", "created_at DESC, id DESC");
}

export async function getNews(id: number): Promise<NewsItem | null> {
  return executeGet<NewsItem>("news", id);
}

export async function createNews(input: NewsInput): Promise<NewsItem> {
  const columns = ["title", "date", "description", "image", "link", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("news");
  const values = [input.title, input.date, input.description, input.image, input.link, sortOrder];
  return executeCreate<NewsItem>("news", insertColumns, placeholders, values, standardRevalidatePaths("news"));
}

export async function updateNews(id: number, input: NewsInput): Promise<NewsItem> {
  const columns = ["title", "date", "description", "image", "link"];
  const setter = createUpdateSetter<NewsInput>(columns as (keyof NewsInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<NewsItem>("news", setClause, id, values, "id", standardRevalidatePaths("news"));
}

export async function deleteNews(id: number): Promise<void> {
  await executeDelete("news", id, "id", standardRevalidatePaths("news"));
}

// Dosen
export type DosenItem = {
  id: number
  name: string
  title: string
  campus: string
  description: string
  image: string
  sort_order: number
}

export type DosenInput = Omit<DosenItem, "id" | "sort_order">;

export async function listDosen(): Promise<DosenItem[]> {
  return executeList<DosenItem>("dosen", "sort_order ASC, id ASC");
}

export async function adminListDosen(): Promise<DosenItem[]> {
  return executeList<DosenItem>("dosen", "created_at DESC, id DESC");
}

export async function listDosenByTitle(title: string): Promise<DosenItem[]> {
  const sql = `
    SELECT id, name, title, campus, description, image, sort_order
    FROM dosen
    WHERE LOWER(title) = LOWER($1)
    ORDER BY sort_order ASC, id ASC
  `;
  const rows = await query<DosenItem>(sql, [title]);
  return rows;
}

export async function getDosen(id: number): Promise<DosenItem | null> {
  return executeGet<DosenItem>("dosen", id);
}

export async function createDosen(input: DosenInput): Promise<DosenItem> {
  const columns = ["name", "title", "campus", "description", "image", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("dosen");
  const values = [input.name, input.title, input.campus, input.description, input.image, sortOrder];
  return executeCreate<DosenItem>("dosen", insertColumns, placeholders, values, standardRevalidatePaths("dosen"));
}

export async function updateDosen(id: number, input: DosenInput): Promise<DosenItem> {
  const columns = ["name", "title", "campus", "description", "image"];
  const setter = createUpdateSetter<DosenInput>(columns as (keyof DosenInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<DosenItem>("dosen", setClause, id, values, "id", standardRevalidatePaths("dosen"));
}

export async function deleteDosen(id: number): Promise<void> {
  await executeDelete("dosen", id, "id", standardRevalidatePaths("dosen"));
}

// Testimonials
export type TestimonialItem = {
  id: number
  name: string
  designation: string
  description: string
  profile_image: string
  sort_order: number
}

export type TestimonialInput = Omit<TestimonialItem, "id" | "sort_order">;

export async function listTestimonials(): Promise<TestimonialItem[]> {
  return executeList<TestimonialItem>("testimonials");
}

export async function adminListTestimonials(): Promise<TestimonialItem[]> {
  return executeList<TestimonialItem>("testimonials", "created_at DESC, id DESC");
}

export async function getTestimonial(id: number): Promise<TestimonialItem | null> {
  return executeGet<TestimonialItem>("testimonials", id);
}

export async function createTestimonial(input: TestimonialInput): Promise<TestimonialItem> {
  const columns = ["name", "designation", "description", "profile_image", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("testimonials");
  const values = [input.name, input.designation, input.description, input.profile_image, sortOrder];
  return executeCreate<TestimonialItem>("testimonials", insertColumns, placeholders, values, standardRevalidatePaths("testimonials"));
}

export async function updateTestimonial(id: number, input: TestimonialInput): Promise<TestimonialItem> {
  const columns = ["name", "designation", "description", "profile_image"];
  const setter = createUpdateSetter<TestimonialInput>(columns as (keyof TestimonialInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<TestimonialItem>("testimonials", setClause, id, values, "id", standardRevalidatePaths("testimonials"));
}

export async function deleteTestimonial(id: number): Promise<void> {
  await executeDelete("testimonials", id, "id", standardRevalidatePaths("testimonials"));
}

// Videos
export type VideoItem = {
  id: number
  youtube_id: string
  title: string
  thumbnail: string
  sort_order: number
}

export type VideoInput = Omit<VideoItem, "id" | "sort_order">;

export async function listVideos(): Promise<VideoItem[]> {
  return executeList<VideoItem>("videos");
}

export async function adminListVideos(): Promise<VideoItem[]> {
  return executeList<VideoItem>("videos", "created_at DESC, id DESC");
}

export async function getVideo(id: number): Promise<VideoItem | null> {
  return executeGet<VideoItem>("videos", id);
}

export async function createVideo(input: VideoInput): Promise<VideoItem> {
  const columns = ["youtube_id", "title", "thumbnail", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("videos");
  const values = [input.youtube_id, input.title, input.thumbnail, sortOrder];
  return executeCreate<VideoItem>("videos", insertColumns, placeholders, values, standardRevalidatePaths("videos"));
}

export async function updateVideo(id: number, input: VideoInput): Promise<VideoItem> {
  const columns = ["youtube_id", "title", "thumbnail"];
  const setter = createUpdateSetter<VideoInput>(columns as (keyof VideoInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<VideoItem>("videos", setClause, id, values, "id", standardRevalidatePaths("videos"));
}

export async function deleteVideo(id: number): Promise<void> {
  await executeDelete("videos", id, "id", standardRevalidatePaths("videos"));
}

// Popups
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

export type PopupInput = Omit<PopupItem, "id" | "sort_order" | "updated_at">;

export async function listPopups(): Promise<PopupItem[]> {
  return executeList<PopupItem>("popups", "sort_order ASC, updated_at DESC, id ASC");
}

export async function adminListPopups(): Promise<PopupItem[]> {
  return executeList<PopupItem>("popups", "created_at DESC, id DESC");
}

export async function getActivePopups(): Promise<PopupItem[]> {
  const sql = `
    SELECT id, image, description, button_label, button_href, COALESCE(title,'UISB Event') as title, event_date, COALESCE(attendees,42) as attendees, is_active, sort_order, updated_at
    FROM popups
    WHERE is_active = true
    ORDER BY sort_order ASC, updated_at DESC, id ASC
  `;
  return query<PopupItem>(sql);
}

export async function getPopup(id: number): Promise<PopupItem | null> {
  return executeGet<PopupItem>("popups", id);
}

export async function createPopup(input: PopupInput): Promise<PopupItem> {
  const columns = ["image", "description", "button_label", "button_href", "title", "event_date", "attendees", "is_active", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("popups");
  const values = [input.image, input.description, input.button_label, input.button_href, input.title, input.event_date, input.attendees, input.is_active, sortOrder];
  return executeCreate<PopupItem>("popups", insertColumns, placeholders, values, standardRevalidatePaths("popups"));
}

export async function updatePopup(id: number, input: PopupInput): Promise<PopupItem> {
  const columns = ["image", "description", "button_label", "button_href", "title", "event_date", "attendees", "is_active"];
  const setter = createUpdateSetter<PopupInput>(columns as (keyof PopupInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<PopupItem>("popups", setClause, id, values, "id", standardRevalidatePaths("popups"));
}

export async function deletePopup(id: number): Promise<void> {
  await executeDelete("popups", id, "id", standardRevalidatePaths("popups"));
}

// Programs
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

export type ProgramInput = Omit<ProgramItem, "id" | "sort_order" | "updated_at">;

export async function listPrograms(): Promise<ProgramItem[]> {
  return executeList<ProgramItem>("programs", "sort_order ASC, id ASC", "is_active = true");
}

export async function adminListPrograms(): Promise<ProgramItem[]> {
  return executeList<ProgramItem>("programs", "created_at DESC, id DESC");
}

export async function getProgramBySlug(slug: string): Promise<ProgramItem | null> {
  const sql = `
    SELECT id, slug, title, label, image, description, short_description, is_active, sort_order, updated_at
    FROM programs
    WHERE slug = $1
  `;
  const rows = await query<ProgramItem>(sql, [slug]);
  return rows[0] ?? null;
}

export async function createProgram(input: ProgramInput): Promise<ProgramItem> {
  const columns = ["slug", "title", "label", "image", "description", "short_description", "is_active", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("programs");
  const values = [input.slug, input.title, input.label, input.image, input.description, input.short_description, input.is_active, sortOrder];
  return executeCreate<ProgramItem>("programs", insertColumns, placeholders, values, standardRevalidatePaths("programs"));
}

export async function updateProgram(id: number, input: ProgramInput): Promise<ProgramItem> {
  const columns = ["slug", "title", "label", "image", "description", "short_description", "is_active"];
  const setter = createUpdateSetter<ProgramInput>(columns as (keyof ProgramInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<ProgramItem>("programs", setClause, id, values, "id", standardRevalidatePaths("programs"));
}

export async function deleteProgram(id: number): Promise<void> {
  await executeDelete("programs", id, "id", standardRevalidatePaths("programs"));
}

// Facilities
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

export type FacilityInput = Omit<FacilityItem, "id" | "sort_order" | "updated_at">;

export async function listFacilities(): Promise<FacilityItem[]> {
  return executeList<FacilityItem>("facilities", "sort_order ASC, id ASC", "is_active = true");
}

export async function adminListFacilities(): Promise<FacilityItem[]> {
  return executeList<FacilityItem>("facilities", "created_at DESC, id DESC");
}

export async function getFacilityBySlug(slug: string): Promise<FacilityItem | null> {
  const sql = `
    SELECT id, slug, title, short_description, description, image, icon, is_active, sort_order, updated_at
    FROM facilities
    WHERE slug = $1
  `;
  const rows = await query<FacilityItem>(sql, [slug]);
  return rows[0] ?? null;
}

export async function createFacility(input: FacilityInput): Promise<FacilityItem> {
  const columns = ["slug", "title", "short_description", "description", "image", "icon", "is_active", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("facilities");
  const values = [input.slug, input.title, input.short_description, input.description, input.image, input.icon, input.is_active, sortOrder];
  const facility = await executeCreate<FacilityItem>("facilities", insertColumns, placeholders, values, ["/facility", "/dashboard/facilities"]);
  return facility;
}

export async function updateFacility(id: number, oldSlug: string, input: FacilityInput): Promise<FacilityItem> {
  const columns = ["slug", "title", "short_description", "description", "image", "icon", "is_active"];
  const setter = createUpdateSetter<FacilityInput>(columns as (keyof FacilityInput)[]);
  const { setClause, values } = setter(input);
  const facility = await executeUpdate<FacilityItem>("facilities", setClause, id, values, "id", ["/facility", `/facility/${oldSlug}`, `/facility/${input.slug}`, "/dashboard/facilities"]);
  return facility;
}

export async function deleteFacility(id: number, slug: string): Promise<void> {
  await executeDelete("facilities", id, "id", ["/facility", `/facility/${slug}`, "/dashboard/facilities"]);
}

// Information
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

export type InformationInput = Omit<InformationItem, "id" | "sort_order" | "updated_at">;

export async function listInformation(): Promise<InformationItem[]> {
  return executeList<InformationItem>("information", "sort_order ASC, id ASC", "is_active = true");
}

export async function adminListInformation(): Promise<InformationItem[]> {
  return executeList<InformationItem>("information", "created_at DESC, id DESC");
}

export async function getInformationBySlug(slug: string): Promise<InformationItem | null> {
  const sql = `
    SELECT id, slug, title, image, description, is_active, sort_order, updated_at
    FROM information
    WHERE slug = $1
  `;
  const rows = await query<InformationItem>(sql, [slug]);
  return rows[0] ?? null;
}

export async function createInformation(input: InformationInput): Promise<InformationItem> {
  const columns = ["slug", "title", "image", "description", "is_active", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("information");
  const values = [input.slug, input.title, input.image, input.description, input.is_active, sortOrder];
  return executeCreate<InformationItem>("information", insertColumns, placeholders, values, standardRevalidatePaths("information"));
}

export async function updateInformation(id: number, input: InformationInput): Promise<InformationItem> {
  const columns = ["slug", "title", "image", "description", "is_active"];
  const setter = createUpdateSetter<InformationInput>(columns as (keyof InformationInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<InformationItem>("information", setClause, id, values, "id", standardRevalidatePaths("information"));
}

export async function deleteInformation(id: number): Promise<void> {
  await executeDelete("information", id, "id", standardRevalidatePaths("information"));
}

// Achievements
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

export type AchievementInput = Omit<AchievementItem, "id" | "sort_order" | "updated_at">;

export async function listAchievements(): Promise<AchievementItem[]> {
  return executeList<AchievementItem>("achievements", "sort_order ASC, id ASC", "is_active = true");
}

export async function adminListAchievements(): Promise<AchievementItem[]> {
  return executeList<AchievementItem>("achievements", "created_at DESC, id DESC");
}

export async function getAchievementBySlug(slug: string): Promise<AchievementItem | null> {
  const sql = `
    SELECT id, slug, title, description, image, link_url, is_active, sort_order, updated_at
    FROM achievements
    WHERE slug = $1
  `;
  const rows = await query<AchievementItem>(sql, [slug]);
  return rows[0] ?? null;
}

export async function createAchievement(input: AchievementInput): Promise<AchievementItem> {
  const columns = ["slug", "title", "description", "image", "link_url", "is_active", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("achievements");
  const values = [input.slug, input.title, input.description, input.image, input.link_url, input.is_active, sortOrder];
  return executeCreate<AchievementItem>("achievements", insertColumns, placeholders, values, standardRevalidatePaths("achievements"));
}

export async function updateAchievement(id: number, input: AchievementInput): Promise<AchievementItem> {
  const columns = ["slug", "title", "description", "image", "link_url", "is_active"];
  const setter = createUpdateSetter<AchievementInput>(columns as (keyof AchievementInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<AchievementItem>("achievements", setClause, id, values, "id", standardRevalidatePaths("achievements"));
}

export async function deleteAchievement(id: number): Promise<void> {
  await executeDelete("achievements", id, "id", standardRevalidatePaths("achievements"));
}

// Hero Slides
export type HeroSlideItem = {
  id: number
  title: string
  image: string
  device_type: "desktop" | "mobile" | "all"
  is_active: boolean
  sort_order: number
  updated_at: string
}

export type HeroSlideInput = Omit<HeroSlideItem, "id" | "sort_order" | "updated_at">;

export async function listHeroSlides(): Promise<HeroSlideItem[]> {
  return executeList<HeroSlideItem>("hero_slides", "sort_order ASC, id ASC", "is_active = true");
}

export async function adminListHeroSlides(): Promise<HeroSlideItem[]> {
  return executeList<HeroSlideItem>("hero_slides", "created_at DESC, id DESC");
}

export async function getHeroSlide(id: number): Promise<HeroSlideItem | null> {
  return executeGet<HeroSlideItem>("hero_slides", id);
}

export async function createHeroSlide(input: HeroSlideInput): Promise<HeroSlideItem> {
  const columns = ["title", "image", "device_type", "is_active", "sort_order"];
  const { columns: insertColumns, placeholders } = createInsertHelpers(columns);
  const sortOrder = await getNextSortOrder("hero_slides");
  const values = [input.title, input.image, input.device_type, input.is_active, sortOrder];
  return executeCreate<HeroSlideItem>("hero_slides", insertColumns, placeholders, values, standardRevalidatePaths("hero_slides"));
}

export async function updateHeroSlide(id: number, input: HeroSlideInput): Promise<HeroSlideItem> {
  const columns = ["title", "image", "device_type", "is_active"];
  const setter = createUpdateSetter<HeroSlideInput>(columns as (keyof HeroSlideInput)[]);
  const { setClause, values } = setter(input);
  return executeUpdate<HeroSlideItem>("hero_slides", setClause, id, values, "id", standardRevalidatePaths("hero_slides"));
}

export async function deleteHeroSlide(id: number): Promise<void> {
  await executeDelete("hero_slides", id, "id", standardRevalidatePaths("hero_slides"));
}