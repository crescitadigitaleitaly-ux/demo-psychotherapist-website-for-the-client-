# Proposed deployment plan (not yet executed)

**Status:** awaiting explicit approval of the exact domain and destination. Nothing has been uploaded, and no DNS, hosting or WordPress setting has been changed.

## Agreed direction
The owner chose to host this demo as a **new subdomain** on the existing Hostinger account, separate from the live portfolio, which stays untouched. This follows the same pattern as the existing `skincare.mouzzambuild.com` demo.

## Proposed destination (to confirm)
- **Domain:** `therapy.mouzzambuild.com`. Earlier messages mention both *mozambuild.com* and *mouzzambuild.com*. Hostinger records show the account's domain as **mouzzambuild.com**, but the exact subdomain needs your confirmation.
- **Hosting:** a Hostinger static website (no WordPress, no database) whose document root receives the contents of `site/`.

## Steps once approved
1. Create the subdomain or website in Hostinger (hPanel or the Hostinger API), with SSL enabled.
2. Upload the contents of `site/`, keeping the folder structure. All links are relative.
3. Add a small `.htaccess`:
   - `ErrorDocument 404 /404.html`
   - `Header set X-Robots-Tag "noindex, nofollow"` (belt and braces with the meta tags)
   - Long cache for `/assets/images` and `/assets/fonts`; short cache for HTML.
4. Fill in the deferred fields in `src/build.mjs` (canonical, `og:url`, `og:image`) with the approved domain, rebuild and re-upload.
5. Verify live: run `node tools/check.mjs https://<approved-domain>/`, check SSL, the 404 page, headers and console, and take screenshots at 390 and 1440 px.
6. Link to the demo from the portfolio only if separately approved. That would be a change to the live portfolio.

## Notes
- The 404 page uses relative links, so it styles correctly when served for top-level missing URLs at the subdomain root. A missing nested URL (for example `/resources/x`) would show the 404 text with broken styling unless the 404 page is changed to root-absolute asset paths for that host.
- `noindex` keeps the demo out of search results. It does **not** restrict access.
- Rollback: delete the subdomain website. The portfolio is unaffected.
