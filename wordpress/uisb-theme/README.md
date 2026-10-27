# UISB Custom WordPress Theme (initial scaffold)

This folder contains the first migration scaffold for the UISB Next.js website.

## Included
- Responsive theme shell and mobile navigation
- Homepage templates for hero slides, programs, news posts, and achievements
- WordPress custom post types for programs, facilities, achievements, lecturers, testimonials, videos, hero slides, popups, and information
- Accessible navigation toggle, simple hero controls, reduced-motion support, and scroll reveal
- Generic page, single, archive, search, and 404 templates

## Install in a staging WordPress site
1. Zip the `uisb-theme` folder (the folder itself must be at the ZIP root).
2. In WordPress Admin, open Appearance → Themes → Add New Theme → Upload Theme.
3. Upload the ZIP and activate only on staging.
4. Assign menus under Appearance → Menus / Editor, add a site logo, and create sample content in the custom post types.

## Important limitations
This is an initial scaffold, not a production-ready full migration. The current Next.js content lives partly in PostgreSQL and Supabase Storage; data import, field mapping, admin UI for custom metadata, remaining page templates, redirects, and end-to-end testing still need implementation. Do not activate on the production UISB domain before staging validation and a verified backup.
