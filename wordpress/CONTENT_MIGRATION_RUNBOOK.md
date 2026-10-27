# Content export/import runbook

This migration importer is intended for a **staging WordPress installation first**. It does not connect to PostgreSQL directly and never needs production database credentials. Export only the content tables to JSON on a trusted machine, then run the import with WP-CLI.

## 1. Export the legacy content

Export the tables defined in `src/lib/schema.sql` to one JSON object whose keys are table names and whose values are arrays of rows. Include these keys where available:

- `news`
- `dosen`
- `testimonials`
- `videos`
- `popups`
- `programs`
- `facilities`
- `information`
- `achievements`
- `hero_slides`

Do not export `users` or `revoked_tokens`. WordPress should have its own user accounts and authentication; do not migrate Next.js password hashes or session revocations.

Use a database client or a dedicated export script that has read-only credentials. Keep the resulting JSON outside the public web root and do not commit it to Git. Confirm that exported content does not include private information.

## 2. Run in staging

1. Install WordPress on an isolated staging site with HTTPS and a current supported PHP version.
2. Back up the staging database and uploads.
3. Install and activate `wordpress/uisb-theme`.
4. Put the JSON file outside the web root, readable by the account running WP-CLI.
5. Run:

```bash
UISB_EXPORT_JSON=/secure/path/uisb-export.json wp eval-file wordpress/scripts/import-uisb-content.php
```

6. Review every warning and the created/updated/skipped counts.
7. Run the importer a second time in staging to confirm it updates imported posts rather than duplicating them.
8. Compare counts and representative content against the source before accepting the migration.

## 3. Importer mapping

The importer stores the source table and row ID in `_uisb_source_table` and `_uisb_source_id` to make repeated runs idempotent. It maps content into WordPress posts/custom post types and stores selected source fields as `_uisb_*` post meta. Images are sideloaded into the WordPress Media Library only when the URL is HTTPS and belongs to a Supabase domain.

## 4. Known limitations to resolve before production

- Export JSON format must be verified against the actual database output; timestamps, nulls, and boolean serialization need checking.
- Verify every Supabase Storage hostname used by the real project. The importer intentionally rejects other hosts until reviewed.
- Review media import volume, image file size, timeouts, duplicate attachment handling, and retry behavior. A repeated run can re-download images.
- Importer currently does not migrate WordPress page content, taxonomy relationships, all URL fields, all columns, or Next.js users.
- Slugs and legacy URL redirects need an explicit approved mapping before import. Do not guess the final public URL scheme.
- Add test coverage and run PHP lint against the exact target PHP version before production use.
- The custom post type's metadata fields and templates must be reconciled with this import mapping before content can be considered visually complete.
