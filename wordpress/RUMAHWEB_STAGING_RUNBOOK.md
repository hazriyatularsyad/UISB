# Rumahweb cPanel staging setup

This runbook creates an isolated WordPress test site. It does **not** change DNS, files, or database for the live UISB website.

## 1. Create an isolated staging location

1. Sign in to Rumahweb cPanel.
2. Open **Domains** and create a subdomain such as `staging.uisb.ac.id` only if you control its DNS and are authorized to create it. If DNS is managed elsewhere, create the subdomain there first or use a temporary domain supplied by Rumahweb.
3. Assign a dedicated document root, for example `/home/CPANEL_USER/staging-uisb/`. Do not point it at the production `public_html` directory.
4. Enable SSL for the staging hostname using the available AutoSSL/Let's Encrypt option.
5. Use the current PHP version supported by both the installed WordPress release and the theme (theme header currently requires PHP 8.0+). Prefer a currently supported PHP 8.x release offered by the host.
6. Install a **separate** WordPress instance using the cPanel WordPress installer/Softaculous, with a new database and a new database user. Never select the live WordPress directory or live database.
7. In WordPress, enable a maintenance/coming-soon mode or restrict staging with host-level password protection. Enable “Discourage search engines” as an additional precaution; it is not access control.
8. Verify that the staging site's WordPress admin URL works and that the live UISB website remains unchanged.

## 2. Install the theme on staging

1. Download the migration branch from GitHub, or clone it locally.
2. Zip the **contents of** `wordpress/uisb-theme/` so that `style.css` and `functions.php` are at the ZIP root, not nested under an extra repository directory.
3. In staging WordPress, open **Appearance → Themes → Add New Theme → Upload Theme** and upload that ZIP.
4. Activate only on staging. If the site errors, use cPanel File Manager to rename the theme directory and restore the default theme.
5. Go to **Settings → Permalinks** and click Save once to refresh rewrite rules.
6. Do not switch the live domain, update live DNS, or install the theme on production during this phase.

## 3. Prepare a private content export from the Next.js project

From a trusted local copy of the repository, install dependencies and make sure the local environment contains the correct `DATABASE_URL` (keep it in a local ignored env file; do not paste it into chat or commit it).

Run:

```bash
npm install
npm run db:export -- /tmp/uisb-export.json
```

On macOS/Linux, `/tmp/uisb-export.json` is outside the repository. The script reads only content tables, opens a read-only transaction, and excludes `users` and `revoked_tokens`. It refuses to write the export inside the repository and creates the file with owner-only permissions where supported.

Before using it, verify the data source is the intended UISB database. Keep the JSON private and delete it securely after migration checks are complete. Never upload it to GitHub.

## 4. Import on staging

The importer currently requires WP-CLI. Check whether the hosting account provides WP-CLI; if not, ask Rumahweb support whether it can be run for the staging installation, or run it in a local/temporary WordPress environment connected only to the staging database. Do not weaken production security to work around missing CLI access.

Place the export outside the public document root, then run from the WordPress installation directory:

```bash
UISB_EXPORT_JSON=/home/CPANEL_USER/private/uisb-export.json wp eval-file /path/to/wordpress/scripts/import-uisb-content.php
```

Replace paths with actual server paths. Never expose the JSON through a public URL. Review warnings and counts. The importer is an initial version and must be checked against a real export before production use; it does not migrate every field or page yet.

## 5. Minimum acceptance checks

- The live site and live database have not changed.
- Staging uses a separate document root and database.
- SSL is active; staging is access-restricted and not indexed.
- Homepage, navigation, custom post type archives, single content, media, and mobile layout are checked.
- Import counts match the export, images are present in the Media Library, and a second test import does not create duplicate posts or unchanged image attachments.
- A database and files backup exists before any further migration test.

## Rollback

If staging breaks, deactivate the UISB theme by selecting a default theme or renaming `wp-content/themes/uisb-theme` in File Manager. Restore only the staging database/files backup if needed. Do not restore a staging backup over production.
