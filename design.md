---
version: beta
name: "UISB"
website: "https://uisb.ac.id"
description: >-
  Universitas Islam Sumatera Barat (UISB) marketing site. Full-bleed hero image carousel with auto-slide, fixed glassmorphic pill navbar in deep purple with DB-driven faculty dropdown, and editorial section blocks all animated by scroll-reveal (Reveal / RevealGroup / RevealItem / CountUp). Montserrat carries every display moment; Roboto carries chrome labels and body. Two accents exist — amber-500 (hover/active/indicators) and UISB orange #fbb536 (hero progress, card footer bars). Content is fully DB-driven (Postgres/Supabase) with an admin dashboard CRUD for programs, facilities, information, achievements, popups, news, dosen, testimonials, and videos. Radius is binary: rounded-4xl illustrative for content blocks, rounded-full for chrome (navbar, pills, WhatsApp FAB).

seo:
  title: "UISB Design System — purple navbar, carousel hero, DB-driven sections, reveal motion"
  metaDescription: "UISB marketing site: deep purple glassmorphic pill navbar, auto-slide hero carousel, scroll-reveal sections, Montserrat + Roboto, DB-driven content with Supabase + dashboard CRUD. Tokens for Next.js 16, Tailwind v4, Motion."
  highlights:
    - "Deep purple #681e91 glassmorphic pill navbar — centered fixed, backdrop-blur-xl, FACILITY link + db-driven FACULTY dropdown + ABOUT US dropdown, amber-500 links"
    - "Full-bleed hero carousel — 3 slides auto-rotate every 4.5s, min-h-100dvh, crossfade via AnimatePresence, mobile image variant"
    - "Scroll-reveal system — Reveal (fade+slide replay), RevealGroup/RevealItem (staggered grids), CountUp (number replay), all respected by useReducedMotion"
    - "Two-face typography — Montserrat (display, 600-800, tight tracking), Roboto (chrome + body, 13-16px)"
    - "Two accents — amber-500 (#f59e0b) for hover/active/indicators, uisb-orange (#fbb536) for hero progress and program-card footers"
    - "DB-driven everything — programs, facilities, information, achievements, news, dosen, testimonials, videos, popups with dashboard CRUD"
  tags:
    - "Education & University"
    - "Marketing & Landing"
    - "Admin Dashboard"
  lastUpdated: "2026-09-15"
  author:
    name: "UISB Web Team"
  opening: |
    UISB's marketing site is built around a deep purple brand (#681e91) with restrained, purpose-driven motion. The navbar is a fixed glassmorphic pill that links to FACILITY (/facility), a DB-driven FACULTY dropdown (programs from Supabase), and an ABOUT US dropdown. The hero is a full-bleed image carousel (min-h-100dvh) that auto-rotates through 3 campus slides with a crossfade. Every section below the fold enters with a scroll-reveal (fade + slide) and grid items stagger in sequence.

    Content is 100% database-driven (Supabase Postgres). The admin dashboard (/dashboard) provides CRUD for 9 entity types. Public pages: / (home), /academics/[slug], /facility, /facility/[slug], /information, /information/[slug]. An API layer (/api/information, /api/achievements) exposes active content as JSON.

  associated: []
  related:
    - href: "/"
      title: "UISB home"
      description: "The live marketing site."
    - href: "/information"
      title: "UISB information"
      description: "Service list + image selector (listInformation)."
    - href: "/facility"
      title: "UISB facility"
      description: "Interactive facility selector + gallery."
  questions:
    - id: "primary-color"
      title: "What is UISB's primary brand color?"
      answer: "Deep purple #681e91, wired as --color-uisb-purple. Used for the fixed pill navbar fill (90% opacity over backdrop-blur-xl), the academics section background, the highlight border on achievement cards, and the footer fill (fuchsia-950 base). Two supporting purple tokens exist: uisb-purple-pudar #734a93 (top strip + footer accents) and the highlight ring."
    - id: "accents"
      title: "What accents does UISB use?"
      answer: "Two: amber-500 #f59e0b (Tailwind default) for hover states, active indicators, kickers, and the location pulse; and UISB orange #fbb536 (--color-uisb-orange) for the hero progress bar, program-card footer bars (bg-amber-600), and section accents. The top decorative strip is purple → purple-pudar → orange diagonals."
    - id: "typography"
      title: "What typefaces does UISB use?"
      answer: "Montserrat for every display moment (h1-h6 via font-serif/font-heading, weights 400-800, tight negative tracking on large sizes) and Roboto for chrome + body (--color-body, weights 300-700). Both self-hosted via next/font/google with display: swap and the latin subset — no <link> tags."
    - id: "hero-behavior"
      title: "How does the hero work?"
      answer: "MinimalistHero renders a full-bleed (min-h-100dvh) image carousel. Slides come from heroSlides in src/data/site.ts with desktop + mobile image variants. Auto-rotate every 4500ms (guarded by document.hidden), crossfade via AnimatePresence mode=popLayout with a gentle scale 1.06→1. A fixed bottom-vignette gradient (from-black/70) keeps contrast for the navbar. Reduced-motion users get static first slide."
    - id: "reveal-motion"
      title: "How are scroll reveal animations done?"
      answer: "src/components/ui/reveal.tsx exports Reveal (single block fade+slide up/left/right, whileInView once:false so it replays on every enter), RevealGroup + RevealItem (grid stagger via index * stagger delay), and CountUp (spring-driven number that resets to 0 when out of view and recounts on re-entry). All respect useReducedMotion by rendering static content. Heavy sections (hero carousel, video 3D carousel, Google Maps iframe) are intentionally not wrapped in replay reveals."
    - id: "database"
      title: "How is content managed?"
      answer: "Supabase Postgres accessed through src/lib/db.ts (pool) + src/lib/data-store.ts (typed CRUD with revalidatePath). Tables: programs, facilities, information, achievements, popups, news, dosen, testimonials, videos. The dashboard (/dashboard) provides an admin CRUD for all of them. List pages force-dynamic so new content appears instantly."
    - id: "public-pages"
      title: "What public routes exist?"
      answer: "/ (home: hero, about, academics, news, achievement, people-say, video, campus-map), /academics/[slug], /facility + /facility/[slug], /information + /information/[slug]. Plus /api/information and /api/achievements JSON endpoints. Dashboard at /dashboard."
  mockups:
    - "marketing-hero"
    - "academic-grid"

colors:
  uisb-purple: "#681e91"
  uisb-purple-pudar: "#734a93"
  uisb-purple-soft: "rgba(104, 30, 145, 0.9)"
  uisb-orange: "#fbb536"
  amber-500: "#f59e0b"
  amber-600: "#d97706"
  orange-cta: "#FF5500"
  slate-50: "#f8fafc"
  slate-100: "#f1f5f9"
  slate-200: "#e2e8f0"
  slate-300: "#cbd5e1"
  slate-400: "#94a3b8"
  slate-500: "#64748b"
  slate-600: "#475569"
  slate-700: "#334155"
  slate-900: "#0f172a"
  zinc-50: "#fafafa"
  zinc-100: "#f4f4f5"
  zinc-300: "#d4d4d8"
  zinc-400: "#a1a1aa"
  zinc-500: "#71717a"
  zinc-600: "#52525b"
  zinc-700: "#3f3f46"
  zinc-800: "#27272a"
  zinc-900: "#18181b"
  white: "#ffffff"
  black-overlay: "rgba(0, 0, 0, 0.6)"
  whatsapp: "#25D366"

typography:
  display-xl:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 64px
    letterSpacing: "-0.96px"
  display-lg:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 52.8px
    letterSpacing: "-0.64px"
  display-md:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 35.2px
    letterSpacing: "-0.32px"
  heading-lg:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 26.4px
    letterSpacing: "-0.24px"
  heading-md:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: "0"
  body-lg:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: "0"
  body-md:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: "0"
  body-sm:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: "0"
  nav-link:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 13px
    letterSpacing: "0.12em"
  button-md:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 14px
    letterSpacing: "0"
  kicker:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 14.4px
    letterSpacing: "0.18em"
  caption:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16.8px
    letterSpacing: "0.04em"
  tiny:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: 10px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: "0.04em"

rounded:
  none: "0px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  illustrative: "24px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  base: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  2xl: "64px"
  3xl: "80px"
  4xl: "96px"
  nav-pad: "32px"

shadow:
  navbar: "0 10px 25px -5px rgba(104, 30, 145, 0.30)"
  navbar-hover: "0 10px 25px -5px rgba(104, 30, 145, 0.50)"
  card-sm: "0 1px 3px rgba(0, 0, 0, 0.06)"
  card: "0 10px 25px -5px rgba(104, 30, 145, 0.12)"
  highlight: "0 25px 50px -12px rgba(104, 30, 145, 0.25)"
  whatsapp: "0 8px 24px rgba(0, 0, 0, 0.18)"
  popup: "0 16px 48px rgba(15, 23, 42, 0.16)"

components:
  navbar:
    backgroundColor: "{colors.uisb-purple-soft}"
    textColor: "{colors.white}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.full}"
    padding: "{spacing.nav-pad} {spacing.lg}"
    position: "fixed"
    backdropBlur: "xl"
  navbar-link:
    backgroundColor: "transparent"
    textColor: "{colors.amber-500}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    hover: "{colors.white}"
  hero:
    backgroundColor: "black"
    textColor: "{colors.white}"
    typography: "{typography.display-xl}"
    height: "100dvh"
    motion: "auto-slide 4500ms + crossfade"
  reveal:
    direction: "up | left | right"
    viewport: "{ once: false, amount: 0.2 }"
    transition: "0.6s spring [0.22, 1, 0.36, 1]"
    reducedMotion: "static render"
  reveal-item:
    stagger: "0.08-0.12s / index"
    viewport: "{ once: false, amount: 0.2 }"
    transition: "0.55s spring"
  count-up:
    motion: "useSpring stiffness 60 damping 20"
    viewport: "{ once: false, amount: 0.5 }"
    reset: "0 saat keluar viewport"
  program-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.slate-900}"
    typography: "{typography.heading-md}"
    rounded: "{rounded.illustrative}"
    footerBar: "{colors.amber-600}"
  achievement-card:
    backgroundColor: "{colors.white}"
    highlight: "border-2 border-uisb-purple ring-1 ring-uisb-purple/20 shadow-amber-500/20"
    rounded: "{rounded.illustrative}"
    hover: "y -6 / scale 1.03 spring"
  information-item:
    activeText: "{colors.slate-900} scale-105"
    inactiveText: "{colors.slate-400}"
    typography: "text-3xl → lg:text-5xl font-black"
  whatsapp-float:
    backgroundColor: "{colors.whatsapp}"
    rounded: "{rounded.full}"
    popover: "max-w-360px rounded-[24px]"
    zIndex: "70"
  welcome-popup:
    backdrop: "bg-slate-900/40 backdrop-blur"
    rounded: "24px"
    zIndex: "80"
    cookie: "aisb_popup_hash 24h"
    autoSlide: "3500-10000ms"
  campus-map-iframe:
    backgroundColor: "transparent"
    rounded: "{rounded.illustrative}"
    height: "400px (mobile) / 480px (desktop)"
  campus-location-button:
    backgroundColor: "{colors.white}"
    textColor: "{colors.slate-800}"
    rounded: "{rounded.illustrative}"
    active: "border-{colors.amber-500} bg-amber-50"
  footer:
    backgroundColor: "fuchsia-950"
    textColor: "{colors.amber-500}"
    rounded: "{rounded.none}"
    padding: "40px 16px"
---

## Overview

UISB's marketing site pairs a single dominant brand color (deep purple `{colors.uisb-purple}` #681e91) with restrained, purpose-driven motion. The navbar is a fixed glassmorphic pill (`FACILITY` link + DB-driven `FACULTY` dropdown + `ABOUT US` dropdown). The hero is a full-bleed image carousel that auto-rotates through campus slides. Below the fold, every section enters with a scroll-reveal: fade + slide, staggered for grids, number count-up for stats.

**Most important shift:** content is **100% database-driven** (Supabase Postgres). Nothing on the public pages is hardcoded content — programs, facilities, information (Information), achievements, news, dosen, testimonials, videos, and popups are all edited from the admin dashboard at `/dashboard`. This replaced the earlier fully-static marketing template.

**Key Characteristics:**
- **Glassmorphic purple pill navbar** — fixed centered, `backdrop-blur-xl`, plum-tinted shadow (30% resting / 50% hover), scroll-shrink via useTransform. Links amber-500, hover white. `FACULTY` dropdown is populated from the `programs` table (2-column grid of `/academics/[slug]` links).
- **Full-bleed auto-slide hero** — `min-h-100dvh` with `supports-[height:100dvh]` fallback, 3 slides (desktop + mobile image variants), crossfade via `AnimatePresence mode=popLayout`, `intervalMs` default 4500, paused when `document.hidden`. Bottom-vignette `from-black/70`.
- **Scroll-reveal system** — `Reveal`, `RevealGroup`/`RevealItem` (stagger by index), `CountUp` (spring number). All `whileInView` with `once: false` so they replay on every re-entry. Fully disabled under `prefers-reduced-motion`.
- **Two-face typography** — Montserrat (display, 400-800, tight negative tracking) + Roboto (chrome + body, 300-700). Self-hosted via `next/font/google`.
- **Two-accent system** — amber-500 for hover/active/indicators/kickers; UISB orange #fbb536 for hero progress and program-card footer bars. Orange-CTA #FF5500 for the PMB pill.
- **Binary radius scale** — rounded-4xl (24px) for content blocks, rounded-full (9999px) for chrome (navbar pill, WhatsApp FAB, badges).
- **DB-driven + dashboard** — 9 entity types with full CRUD, server actions (`revalidatePath`), file upload to `public/uploads/`.

## Colors

### Brand

- **UISB Purple** (`{colors.uisb-purple}` #681e91): the dominant brand color — fixed pill navbar fill (90% opacity over `backdrop-blur-xl`), the academics section background, the highlight border + ring on achievement cards, the section kicker accent. Wired as `--color-uisb-purple`.
- **UISB Purple Pudar** (`{colors.uisb-purple-pudar}` #734a93): the muted purple tier — used in the top decorative strip and secondary accents. Wired as `--color-uisb-purple-pudar`.

### Accents

- **Amber 500** (`{colors.amber-500}` #f59e0b): the primary interactive accent — nav links, hover states, kickers, active location button, section-heading divider, highlight card icon bg. Never a primary CTA fill.
- **UISB Orange** (`{colors.uisb-orange}` #fbb536): the warm brand accent — hero progress bar, program-card footer bar (`bg-amber-600`), welcome-popup CTA. Wired as `--color-uisb-orange`.
- **Orange CTA** (`{colors.orange-cta}` #FF5500): the PMB (registrasi) pill only.

### Surface

- **Slate 50/100/200** — light-section floors and dividers (news section, cards).
- **White** — card backgrounds, dashboard form surfaces.
- **Zinc 900** (`{colors.zinc-900}`) — dark showcase floors (facility selector `bg-[#222]`, hero `bg-black`).

### Ink

- **Slate 900 / 800 / 700** — headings and primary text on light surfaces.
- **Slate 600 / 500 / 400** — body, secondary, muted text.
- **Slate 200 / 300** — dividers and muted body on light cards.

## Typography

### Font Families

Two voices with clearly divided labor: **Montserrat** for every display moment (hero, section headings, card titles, information titles) and **Roboto** for chrome + body (nav links, CTA pills, body paragraphs, kickers). Self-hosted via `next/font/google` in `src/app/layout.tsx`, applied via CSS variables `--font-montserrat` and `--font-roboto`. `<body>` defaults to Roboto; `h1-h6` default to Montserrat.

### Hierarchy

| Token | Family | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `{typography.display-xl}` | Montserrat | 64px | 700 | 64px | -0.96px | Hero / page h1 (`font-serif text-4xl md:text-5xl`) |
| `{typography.display-md}` | Montserrat | 32px | 700 | 35.2px | -0.32px | Section headings (`text-3xl md:text-4xl`) |
| `{typography.heading-lg}` | Montserrat | 24px | 600 | 26.4px | -0.24px | News card / card titles (`text-lg`) |
| `{typography.heading-md}` | Montserrat | 20px | 600 | 24px | 0 | Program card titles, location buttons |
| `{typography.body-lg}` | Roboto | 16px | 400 | 24px | 0 | Default body / about description |
| `{typography.body-md}` | Roboto | 14px | 400 | 20px | 0 | Compact body, captions |
| `{typography.nav-link}` | Roboto | 13px | 500 | 13px | 0.12em | Nav links, footer links |
| `{typography.button-md}` | Roboto | 14px | 700 | 14px | 0 | CTA pill labels |
| `{typography.kicker}` | Roboto | 12px | 700 | 14.4px | 0.18em (uppercase) | Section kickers ("ACADEMICS", "OUR EXCELLENCE") |
| `{typography.tiny}` | Roboto | 10px | 500 | 14px | 0.04em | Ultra-compact labels |

### Principles

Display weight is always 600-800, never lighter, with tight negative tracking on the large tiers. Kickers are Roboto 12px / 700 / 0.18em uppercase. Body text keeps 4.5:1 contrast on light floors and uses `text-sm md:text-base` density.

## Layout

- **Max content width:** `max-w-7xl` for editorial sections; the navbar and footer use the constrained `md:w-[150vh] md:mx-auto` pill/container pattern. Many sections use `md:w-[150vh] md:mx-auto` (the fixed-navbar-safe width) instead of `max-w-7xl`.
- **Homepage rhythm:** hero (full-bleed) → About `py-16` → Academics (purple floor, 5-up grid) → Latest News (cards) → Achievement (3 cards, center highlight) → People Say (carousel) → Video (3D carousel) → Campus Map → Footer.
- **Grids:** academics `lg:grid-cols-5` (cards `h-60` image + `bg-amber-600` title bar), news `lg:grid-cols-3` (featured `col-span-2`), achievement `md:grid-cols-3` (highlight = `border-uisb-purple` + ring), campus map `lg:grid-cols-12` (4-col list + 8-col iframe).
- **Information page:** left `md:col-span-7` list of service titles (`text-3xl → lg:text-5xl font-black`, active `scale-105`), right `md:col-span-5` image (`aspect-[4/3]` mobile → `md:h-[480px]`).
- **Mobile:** all grids collapse to single column; hero uses `imageSrcMobile`; section padding `px-4 sm:px-6 lg:px-8`.

## Motion

Motion is restrained and **event-driven + viewport-driven**:

- **Scroll reveal (replay):** `Reveal` / `RevealItem` use `whileInView` with `viewport={{ once: false, amount: 0.2 }}` — blocks fade + slide in, then slide back out and replay on re-entry. Grids stagger with `index * 0.08-0.12s`.
- **Count-up:** `CountUp` animates 0 → N via spring on first view, resets to 0 when scrolled out, recounts on re-entry.
- **Hero carousel:** auto-advance every 4500ms with crossfade; paused when the tab is hidden.
- **Hover micro-interactions:** card lift (`y -3 / scale 1.03`, highlight card `y -6`), link underlines expanding 0→75%, WhatsApp FAB translate-tap, social icon lift.
- **Navbar:** scroll-shrink width + padding, scroll-scale opacity.
- **Popup / WhatsApp:** backdrop blur overlay (z-80), popover z-70 with spring entrance.

**Heavy sections intentionally NOT wrapped in replay reveals:** hero carousel, VideoSection 3D carousel (already animates), and the Google Maps iframe wrapper — these use static or once-mount behavior to avoid jank from repeated re-animations.

All motion collapses to static under `useReducedMotion()`.

## Shapes

Binary radius scale — rounded-4xl (24px) for content, rounded-full (9999px) for chrome.

- `{rounded.illustrative}` 24px — hero images, program cards, news cards, achievement cards, map iframe, location buttons, dashboard cards, selector cards, WhatsApp popover.
- `{rounded.full}` 9999px — navbar pill, WhatsApp FAB, PMB pill, badge pills.
- `{rounded.md}` 12px — badges / small chips on cards.

## Components

**`navbar`** — Fixed centered pill, `{colors.uisb-purple-soft}` fill over `backdrop-blur-xl`, `{rounded.full}`, plum-tinted shadow. Links: HOME (#), FACILITY (/facility), FACULTY (dropdown from `programs` table, 2-col grid of `/academics/[slug]` links), ABOUT US (dropdown: Our Campus / Sambutan Rektor / Board of Foundation / Campus Life). Right: PMB pill (`#FF5500`) on desktop, hamburger on mobile. Mobile panel lists the same items; dropdowns expand inline.

**`navbar-link`** — Roboto 13px / 500 / 0.12em, amber-500 resting → white hover. Expanding underline (0→75%) on group-hover.

**`hero`** — Full-bleed carousel `min-h-100dvh` (`supports-[height:100dvh]` fallback), slides from `siteData.heroSlides` with `imageSrc` (desktop) + `imageSrcMobile` (mobile, `object-[50%_35%]`), auto-rotate 4500ms, `AnimatePresence mode=popLayout` crossfade (opacity 0 + scale 1.06 → 1). Bottom-vignette `from-black/70 via-black/20 to-transparent` overlay. Image error fallback → `/images/Hero1.png`.

**`reveal` (ui/reveal.tsx)** — `Reveal`: fade+slide wrapper (`up/left/right/none`), `whileInView`, `viewport={{ once, amount }}`, ease `[0.22,1,0.36,1]`, `useReducedMotion` → plain div. `RevealGroup` + `RevealItem`: wrapper renders a plain container; items stagger by `index * stagger`. `CountUp`: `useSpring` number with replay.

**`aboutUs`** — Left image collage (2-col, rounded `80px_80px_0_80px` shapes) + amber "30 Years" badge with **CountUp**; right editorial text + 3 feature rows + quote card. Reveal left/right entry.

**`academics-section`** — Purple floor (`bg-uisb-purple`), left column: amber kicker + Montserrat title + divider + description + CTA arrow; right: `lg:grid-cols-5` program cards (white, `h-60` image, `bg-amber-600` title bar that inverts text to white on hover) wrapped in `RevealGroup`/`RevealItem` stagger.

**`latest-news`** — Header (title + "View All News") + grid: featured card (`col-span-2`, image + `from-black/80` overlay + white text) + secondary cards. Cards reveal with alternating left/right slide.

**`achievement`** — Cream floor, center heading "Why Choose UISB", 3 white cards (`md:grid-cols-3`) with image (`h-48`, gradient overlay + amber icon badge), center card highlighted (`border-2 border-uisb-purple ring-1 ring-uisb-purple/20 shadow-amber-500/20`, hover `y -6`). DB-driven. `isHighlighted = Math.floor(items.length / 2)`.

**`people-say`** — Kicker + title + divider + horizontal scroll carousel of testimonial cards (21st.dev base) with background image and modal detail.

**`video-section`** — 3D carousel (perspective 1200px), left/center/right cards with spring rotateY + hover lift, auto-advance 3000ms (paused while watching), click streams YouTube in a modal. Dots control. Reduced-motion safe.

**`campus-map`** — Heading + 12-col grid: left location buttons (amber active state), right Google Maps iframe (400px mobile / 480px desktop, lazy).

**`information` (/information)** — List + image selector. Left: `/ Latest Information` red label + service titles stacked (`text-3xl sm:text-4xl lg:text-5xl font-black`, active `text-slate-900 scale-105`). Right: active service image (`aspect-[4/3]` mobile, `md:h-[480px]`). DB-driven from `information` table.

**`facility` (/facility + /facility/[slug])** — `/facility`: full-screen dark `bg-[#222]` with `InteractiveSelector` (flex-expand image cards, `activeSlug` pre-expands). `/facility/[slug]`: selector + hero (image `h-64 md:h-130` + title + description with `Reveal`) + "Galeri Fasilitas" — a 9-image `DynamicFrameLayout` hover-expand grid.

**`whatsapp-float`** — Fixed FAB bottom-right (`z-[70]`, safe-area aware, `bg-[#25D366]`, `h-14 w-14 rounded-full`). Toggle opens a popover (`max-w-[360px] rounded-[24px]`) with Nama + Pesan fields → opens `wa.me/628116655515?text=...`. Hidden on dashboard.

**`welcome-popup`** — Center portrait modal (z-80, backdrop `bg-slate-900/40 backdrop-blur`), `EventCountdownCard` (`h-150` image with `from-black/10` gradient, title, optional event date + attendees count-up, CTA). Auto-slides 3500→10000ms with dots. Dismissed via 24h cookie hash; Esc and backdrop close.

**`footer`** — `fuchsia-950` fill, 4-col grid, Montserrat/amber brand block + quick links + resources + contact. Copyright bar below.

**`dashboard`** — `/dashboard` shell: sidebar (logo + 9 CRUD links, active ring state) + per-entity manager (DataTable + Banner + form with image upload via `saveUploadedFile` + auto-slug + active checkbox). Server actions with duplicate-slug detection; revalidatePath on create/update/delete.

## Do's and Don'ts

**Do** treat UISB purple as the load-bearing brand color (navbar, academics floor, highlight rings, footer).

**Do** keep the radius binary — rounded-4xl content, rounded-full chrome.

**Do** keep amber rare: hover, active, indicators, kickers. Never as a primary CTA fill.

**Do** use scroll-reveal replay for light blocks, but keep heavy carousels, video carousels, and iframe maps off the replay path.

**Do** self-host fonts via `next/font/google`, never `<link>` to a CDN.

**Don't** hardcode content — route everything through `data-store.ts` + dashboard CRUD so edits appear on the public site without a code change.

**Don't** introduce continuous animation loops beyond the hero auto-slide and video carousel (both pause on hidden/hover states).

**Don't** add mid-tier radii (12px or 16px) to cards — it softens the content-vs-chrome contrast.

**Don't** swap the plum-tinted navbar shadow for neutral gray.

## Known Gaps / Notes

- **Hero copy layer:** the hero is image-only; display-xl headline + subtext reserved for a future overlay.
- **Dark mode:** ships light-only; reserved tokens exist but `dark:` variants are not implemented.
- **Focus-visible matrix:** keyboard tab order works; full focus-ring styling not yet uniform across all cards.
- **Accessibility:** labels on dashboard forms now carry matching `htmlFor`/`id`; `aria-hidden` on decorative icons is applied; reduced-motion supported.
- **API layer:** `/api/information` and `/api/achievements` expose active content as JSON; other entities can be exposed on the same pattern.