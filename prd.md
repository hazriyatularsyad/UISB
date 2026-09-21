# Product Requirements Document (PRD) — UISB Marketing Website

## Meta

- **Project:** UISB (Universitas Islam Sumatera Barat) Marketing Website
- **Website:** https://uisb.ac.id
- **Version:** 1.0.0-beta
- **Last updated:** 2026-09-15
- **Status:** In development / beta

---

## 1. Product Overview

### 1.1 Problem Statement
UISB needs a modern, fast, and easily maintainable marketing website to attract new students (registrasi/PMB), inform visitors about programs, facilities, information, news, achievements, testimonials, videos, and campus locations, and to project a credible digital-first campus brand.

### 1.2 Solution
A Next.js 16 (App Router, Turbopack) web application with:
- A public-facing marketing site ("the site")
- An admin dashboard for non-technical staff to manage all site content without touching code

### 1.3 Goals & Success Metrics
- **Goal 1:** Present a credible campus brand. Metric: consistent use of UISB purple (#681e91) + amber/orange accents across all pages.
- **Goal 2:** Content editors can update everything from a dashboard. Metric: 9 content types editable via CRUD — zero code edits for content changes.
- **Goal 3:** Good perceived performance and motion. Metric: scroll-reveal animations with `prefers-reduced-motion` support; heavy carousels excluded from replay animations.
- **Goal 4:** Visitor conversion path to PMB (registration). Metric: PMB pill in navbar + WhatsApp floating button reachable from every public page.

### 1.4 Target Audience
- Prospective students and parents
- Academic visitors (faculty, partnerships)
- UISB admin staff (content editors)
- General public researching the campus

---

## 2. Roles, Permissions & Users

| Role | Access | Notes |
|---|---|---|
| Guest / visitor | Public pages only | Home, academics, facility, information, news, testimonials, videos, map |
| Content Editor | `/dashboard/*` | Full CRUD on all 9 content types (no auth implemented yet — see Known Gaps) |

> **Security note:** Dashboard currently has no authentication gate. Auth must be added before production launch.

---

## 3. Functional Requirements

### 3.1 Public Marketing Pages

#### 3.1.1 Homepage (`/`)
Sections, top to bottom:
| Order | Section | Component | Data source | Motion |
|---|---|---|---|---|
| 1 | Hero carousel | `minimalist-hero.tsx` / `heroUi.tsx` | `siteData.heroSlides` (static) | Auto-slide 4.5s, crossfade, mobile image variant |
| 2 | About us | `aboutUs.tsx` | Static copy + CountUp (30 years) | Reveal left/right, count-up |
| 3 | Academics | `academics.tsx` | `listPrograms()` DB | RevealGroup stagger per card |
| 4 | Latest News | `latestNews.tsx` | `listNews()` DB | Reveal, alternating left/right |
| 5 | Achievement | `achievement.tsx` | `listAchievements()` DB | RevealItem stagger, center card highlight |
| 6 | People Say | `people-say.tsx` | `listTestimonials()` DB | Carousel (own animation) |
| 7 | Video | `videoSection.tsx` | `listVideos()` DB | 3D carousel |
| 8 | Campus Map | `campusMap.tsx` | `siteData.maps` (static) | Reveal (map once) |
| — | Welcome popup | `welcome-popup.tsx` | `getActivePopups()` DB | Modal, auto-slide, cookie |
| — | WhatsApp FAB | `whatsapp-float.tsx` | `siteData.contact.whatsapp` | FAB + popover |
| — | Footer | `footer.tsx` | `siteData` static | Static |

#### 3.1.2 Academics Detail (`/academics/[slug]`)
- Back link → `/#all-programs`
- Cover image, kicker, title (`font-serif text-4xl md:text-5xl`), description
- Dosen section filtered by `program.label` (`listDosenByTitle`)
- `notFound()` if slug missing

#### 3.1.3 Facility (`/facility`, `/facility/[slug]`)
- `/facility`: dark showcase (`bg-[#222]`) with `InteractiveSelector` — flex-expand image cards (min 44px), staggered entrance, active card expands (flex 7:1), title = Link → detail
- `/facility/[slug]`: InteractiveSelector pre-expanded on current slug + hero (image, title, description) + "Galeri Fasilitas" via `DynamicFrameLayout` — 9-image hover-expand grid (images only, no video)
- Data from `facilities` table

#### 3.1.4 Information (`/information`, `/information/[slug]`)
- `/information`: list + image selector — left column service titles (`text-3xl → lg:text-5xl font-black`, active = `text-slate-900 scale-105`), right column active image (`aspect-[4/3]` → `md:h-[480px]`)
- `/information/[slug]`: hero image + title + description; chips linking to other information
- Data from `information` table
- `export const dynamic = "force-dynamic"` so new entries appear instantly

#### 3.1.5 API Endpoints
| Route | Method | Returns |
|---|---|---|
| `/api/information` | GET | Active information array (JSON) |
| `/api/achievements` | GET | Active achievements array (JSON) |

### 3.2 Admin Dashboard (`/dashboard`)

Shell: fixed sidebar (logo + link back to site + CRUD navigation), mobile slide-in drawer with Escape/backdrop close. `isDashboard` guard hides the public navbar/footer/WhatsApp FAB on dashboard routes.

| Menu | Route | Table | Core fields |
|---|---|---|---|
| Hero Slides | `/dashboard/hero` | `hero_slides` | title, image, device_type (desktop/mobile/all), is_active |
| Achievements | `/dashboard/achievements` | `achievements` | title, description, image, link_url, is_active |
| Programs | `/dashboard/programs` | `programs` | title, label/user, image, description, short_description, is_active |
| Facilities | `/dashboard/facilities` | `facilities` | title, short_description, description, image, icon, is_active |
| Information | `/dashboard/information` | `information` | title, description, image, is_active |
| Popups | `/dashboard/popups` | `popups` | image, title, description, button_label, button_href, event_date, attendees, is_active, sort_order |
| News | `/dashboard/news` | `news` | title, date, description, image, link |
| Dosen | `/dashboard/dosen` | `dosen` | name, title (datalist from program titles), campus, description, image |
| Testimonials | `/dashboard/testimonials` | `testimonials` | name, designation, description, profile_image |
| Videos | `/dashboard/videos` | `videos` | title, youtube_id, thumbnail, link |

Common manager behavior:
- **Create/Edit form** with image upload (drag/click file → stored in `public/uploads/<entity>/`), active checkbox, auto-slug from title.
- **DataTable** with image thumbnail + title + `/slug`, Active badge, ID, Edit/Delete actions.
- **Server actions** (`src/app/dashboard/<entity>/actions.ts`) with validation, duplicate-slug error ("Slug sudah dipakai."), `revalidatePath` on create/update/delete.
- **Banner** success/error feedback.

### 3.3 Content Schema

All tables live in `src/lib/schema.sql` (Supabase Postgres). Common columns: `id SERIAL PRIMARY KEY`, `is_active BOOLEAN DEFAULT true`, `sort_order INTEGER`, `created_at` / `updated_at TIMESTAMPTZ`.

| Table | Unique column | Content columns |
|---|---|---|
| `hero_slides` | — | `title`, `image`, `device_type`, `is_active`, `sort_order` |
| `programs` | `slug` | `title`, `label`, `image`, `description`, `short_description` |
| `facilities` | `slug` | `title`, `short_description`, `description`, `image`, `icon` |
| `information` | `slug` | `title`, `description`, `image` |
| `achievements` | `slug` | `title`, `description`, `image`, `link_url` |
| `popups` | — | `image`, `title`, `description`, `button_label`, `button_href`, `event_date TIMESTAMPTZ`, `attendees INT` |
| `news` | — | `title`, `date`, `description`, `image`, `link` |
| `dosen` | — | `name`, `title`, `campus`, `description`, `image` |
| `testimonials` | — | `name`, `designation`, `description`, `profile_image` |
| `videos` | — | `title`, `youtube_id`, `thumbnail`, `link` |

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Static generation where safe; **`force-dynamic`** for DB-driven listing pages (information, facility) so dashboard edits appear immediately.
- Lazy-loaded images and maps (`loading="lazy"`).
- Scroll-reveal replays limited to light blocks; heavy carousels excluded.

### 4.2 Accessibility
- `prefers-reduced-motion` disables all reveal/count-up/carousel motion (`useReducedMotion`).
- Form labels use matching `htmlFor`/`id` (fixed in all 4 managers).
- Decorative icons `aria-hidden`.
- Keyboard: selector cards are `role="button"` with Enter/Space; focus-visible rings on emphasis elements.
- Contrast: body text ≥ 4.5:1 on light floors.

### 4.3 Security
- `revalidatePath` only on server actions.
- Duplicate-slug detection (Postgres unique constraint surfaced to user).
- File upload sanitized filename (`saveUploadedFile`). **Pending:** dashboard auth.

### 4.4 SEO
- Metadata set in `layout.tsx` (title "UISB", description "Toward Campus Business Digital").
- Semantic headings (`h1-h6`), alt text on images.
- API routes are noindex; dashboard robots noindex via Next default.

### 4.5 Browser Support
Target: evergreen desktop (Chrome, Safari, Edge, Firefox) + mobile (375px+). Tailwind breakpoints: `sm` 640, `md` 768, `lg` 1024. Uses `min-h-[100dvh]` with `supports-[height:100dvh]` fallback.

---

## 5. Dependencies

| Package | Purpose |
|---|---|
| `next` 16.3 | App Router, Turbopack |
| `react` 19 | Runtime |
| `tailwindcss` v4 | Styling (`@import "tailwindcss"`, `@theme inline`) |
| `motion` / `motion/react` 13.2 | All animations (reveal, carousel, hover) |
| `pg` 8.23 | Postgres pool (Supabase) |
| `react-icons` 5.7 | FontAwesome icons |
| `lucide-react` 1.41 | UI icons (navbar, popup, testimonials) |
| `class-variance-authority` | Button variants (shadcn pattern) |
| `@radix-ui/react-slot` | `asChild` slot pattern |

DB scripts: `npm run db:init` (apply schema), `npm run db:seed` (seed), `npm run db:migrate`.

---

## 6. Motion Specification

- **Scroll reveal (replay):** `Reveal`/`RevealItem` `whileInView`, `viewport={{ once: false, amount: 0.2 }}`, ease `[0.22, 1, 0.36, 1]`, duration 0.5–0.7s. Grid stagger `index × 0.08–0.12s`.
- **Count-up:** `useSpring(stiffness 60, damping 20)`, resets to 0 out of view, recounts on enter.
- **Hero:** auto-slide 4500ms, `AnimatePresence mode=popLayout`, scale 1.06→1 crossfade.
- **Cards hover:** `y -3 / scale 1.03` (highlight card `y -6`, plum shadow).
- **WhatsApp FAB:** Spring open popover; safe-area aware.
- **Popup:** center modal, backdrop blur, auto-slide dots.
- **Reduced motion:** all of the above collapse to static.

---

## 7. Design System Summary

Full tokens in `design.md`. Highlights:
- **Colors:** `uisb-purple #681e91`, `uisb-purple-pudar #734a93`, `uisb-orange #fbb536`, `amber-500 #f59e0b`, `orange-CTA #FF5500`, WhatsApp `#25D366`.
- **Fonts:** Montserrat display + Roboto body (`next/font/google`).
- **Radius:** binary — `rounded-4xl` (content), `rounded-full` (chrome/pills).
- **Layout width:** `md:w-[150vh] md:mx-auto` (navbar-safe) / `max-w-7xl` editorial.

---

## 8. Data / Prop Contracts

Key data-store functions (`src/lib/data-store.ts`):

| Function | Signature |
|---|---|
| `listPrograms` / `adminListPrograms` | `() => ProgramItem[]` |
| `getProgramBySlug` | `(slug) => ProgramItem \| null` |
| `listFacilities` / `adminListFacilities` | `() => FacilityItem[]` |
| `getFacilityBySlug` | `(slug) => FacilityItem \| null` |
| `listInformation` / `adminListInformation` | `() => ServiceItem[]` |
| `getServiceBySlug` | `(slug) => ServiceItem \| null` |
| `listAchievements` / `adminListAchievements` | `() => AchievementItem[]` |
| `listNews` | `() => NewsItem[]` |
| `listDosen` / `listDosenByTitle` | `() => DosenItem[]` / `(title) => DosenItem[]` |
| `listTestimonials` | `() => TestimonialItem[]` |
| `listVideos` | `() => VideoItem[]` |
| `getActivePopups` | `() => PopupItem[]` |
| `create/update/delete*` | per entity, with `revalidatePath` |

Each CRUD entity has a matching server-actions module and manager component.
Image upload: `saveUploadedFile(file, "uploads/<entity>")` → returns `/uploads/<entity>/<timestamp>-<name>`.

---

## 9. Acceptance Criteria

1. **Homepage** renders all 8 sections in order with reveal motion; reduce-motion users see content statically.
2. **Dashboard edits reflect immediately** on `/information`, `/facility`, `/`, `/academics/[slug]`, and detail pages (dynamic + revalidate).
3. **CRUD complete** for all 9 entities: create → appears; edit → updates; delete → disappears; image upload works; active toggle hides from public site.
4. **Navbar:** FACILITY links `/facility`; FACULTY dropdown shows live programs; ABOUT US dropdown shows 4 links; PMB pill present on desktop; mobile drawer equivalent.
5. **Welcome popup:** shows active popup once/24h per browser; auto-slides; Esc/backdrop close.
6. **WhatsApp FAB:** opens popover, validates Nama/Pesan, builds `wa.me` link with prefilled text.
7. **Facility detail** shows InteractiveSelector (active pre-expanded) + hero + 9-image gallery.
8. **Information page** lists all active information from DB and swaps image on click; detail route works.
9. **Accessibility:** reduced-motion respected; labels/ids match; keyboard operable selectors.
10. `npm run build` passes with all routes; no TypeScript errors.

---

## 10. Known Gaps / Backlog

| # | Item | Priority |
|---|---|---|
| 1 | **Dashboard authentication** (login/roles) | High |
| 2 | Dark mode implementation | Medium |
| 3 | Unified focus-visible styling across cards | Low |
| 4 | More API endpoints (`/api/programs`, `/api/facilities`, etc.) | Low |
| 5 | Hero copy layer (headline + subtext overlay) | Low |
| 6 | Server-side validation hardening on image types/sizes | Medium |
| 7 | Pagination for news/information lists | Low |
| 8 | i18n (ID/EN) | Backlog |

---

## 11. Appendices

- **Design tokens:** see `design.md`
- **DB schema:** `src/lib/schema.sql`
- **Seed data:** `src/scripts/seed-db.ts`
- **Fonts:** Montserrat + Roboto via `next/font/google` (`src/app/layout.tsx`)
- **Dev scripts:** `npm run dev`, `npm run build`, `npm run db:init`, `npm run db:seed`