# Deployment

**Status: deployed 1 November 2026** to **https://therapy.mouzzambuild.com/**, approved by the owner in chat ("Yes, deploy there").

What was done:
- Created the subdomain `therapy` on the `mouzzambuild.com` website (Hostinger account u299383397), with document root `public_html/therapy`. This follows the same pattern as the `skincare`, `dental` and `aervek` demos. No portfolio files were changed, and no DNS records were edited by hand.
- Uploaded the 68 files in `site/` (including `.htaccess`) with `tools/upload.mjs` (TUS).
- Set canonical, `og:url` and `og:image` to the live origin in `src/build.mjs` (`SITE_ORIGIN`).
- Verified live: HTTPS 200; HTTP 301 to HTTPS; `X-Robots-Tag: noindex, nofollow`; 404 status for missing URLs; `tools/check.mjs` reports 13 pages, 49 assets and 0 problems; no console errors; no third-party requests; TTFB about 0.4 s for the homepage HTML (one curl sample). The portfolio and skincare demo still return 200.
- The portfolio does **not** link to the demo. Adding a link would be a separate, approved change.

To redeploy after edits: rebuild, generate a new upload URL (keys expire after about 6 h), then run `HOST_URL=… HOST_AUTH=… HOST_REST=… node tools/upload.mjs`.

Rollback: remove the `therapy` subdomain in hPanel and delete `public_html/therapy`.

---

The original proposal is kept below for reference.

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
