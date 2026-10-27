# UISB Next.js to WordPress migration audit

Date: 2026-10-27
Source branch audited: main
Migration branch: migration/wordpress-theme

## Findings from source inspection

- Next.js App Router is used under src/app, including public routes, login, API auth routes, and a multi-section dashboard.
- The home page renders hero slides, about, academics, news, achievements, testimonials, videos, campus map, and active popups.
- Content currently uses PostgreSQL tables in src/lib/schema.sql and the data access layer in src/lib/data-store.ts.
- File upload uses Supabase Storage via src/lib/upload.ts; accepted MIME types currently include SVG. Actual file validation should be reviewed further before production.
- Auth uses a custom signed session cookie, token revocation, environment credentials, and database users. The migration should use native WordPress users, roles, and capabilities rather than porting custom auth.
- The dashboard contains CRUD flows for news, programs, facilities, information, achievements, hero slides, popups, testimonials, videos, lecturers, and users.
- Existing CSS is Tailwind v4; UI animations use Motion. The scaffold replaces core responsive interactions with theme CSS/JS; full visual parity still requires comparing every component.

## Initial WordPress mapping

| Existing entity | WordPress target |
| --- | --- |
| News | Core Posts + categories + featured image |
| Static pages | Core Pages + dedicated templates as needed |
| Programs | program custom post type |
| Facilities | facility custom post type |
| Achievements | achievement custom post type |
| Lecturers | dosen custom post type |
| Testimonials | testimonial custom post type |
| Videos | video custom post type |
| Hero slides | hero_slide custom post type |
| Popups | popup custom post type |
| Information | information custom post type |
| Images | WordPress Media Library |

## Current scaffold in this branch

The wordpress/uisb-theme/ directory contains the initial theme bootstrap, header/footer, home/page/single/archive/search/404 templates, responsive CSS, lightweight JavaScript interactions, custom post type registration, and a first set of edit fields with nonce-validated and capability-checked post meta saving.

## Important gaps before production

1. Data importer from PostgreSQL/Supabase export into WordPress content and metadata.
2. Exact field mapping for every entity and import of image assets from Supabase Storage.
3. Dedicated detail templates and visual parity for all existing routes: academics, facility, information, founder, and rector welcome.
4. Popup, testimonial, video, campus map, and lecturer rendering wired to imported WordPress content.
5. Migration of URLs, redirect map, canonical metadata, sitemap and robots behavior.
6. WordPress-side functional testing, accessibility, performance and security testing.
7. PHP lint / WordPress staging test and a production backup/rollback plan.

## Security and migration notes

- Do not migrate custom Next.js authentication/session tokens into WordPress. Create WordPress users through the admin and assign least-privilege roles.
- Do not expose Supabase service role keys or database credentials in the theme or browser.
- WordPress nonce validation is CSRF protection, not a substitute for capability checks; both are present in the initial metadata save handler.
- Do not activate on the production site before importing into staging and comparing all critical routes.
- The current theme is an initial scaffold, not yet a complete production-ready migration.