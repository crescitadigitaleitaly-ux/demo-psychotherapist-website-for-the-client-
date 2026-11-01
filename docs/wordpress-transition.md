# WordPress transition notes

## Static demo vs production
This demo shows the **design and interaction**. It does **not** meet the client's requirement to edit content without a developer: changing text here means editing HTML files and rebuilding. The production site needs a content management system with a visual editor. Platform choice remains subject to client approval.

## Recommendation for evaluation: a lightweight WordPress block theme
The client already runs WordPress, and we want to avoid adding another subscription. So the proposal is a small custom **block theme** (Full Site Editing) built on core blocks. It would have no page builder, and the plugin footprint would be minimal. **No specific commercial theme has been chosen.** Any theme considered later should be checked for its current suitability, licence, update history and cost before it is recommended.

Squarespace remains a valid option if the client prefers fully managed hosting and security in exchange for a monthly fee and less layout control.

## Mapping
| Demo element | WordPress equivalent |
|---|---|
| Design tokens in `:root` (colours, fonts, sizes, spacing) | `theme.json` palette, font families (self-hosted fonts), fluid type scale and spacing presets, editable centrally in **Appearance → Editor → Styles** |
| Header, navigation, demo bar, footer | Template parts (`header.html`, `footer.html`) with the core Navigation block, which supports sub-menus for "Therapy" |
| Seven main pages | Pages, built with core blocks (Group, Columns, Cover, Image, Heading, Details) |
| Sections such as the hero split, pathways list, philosophy band, steps, CTA band, FAQ and cycle diagram | Registered **block patterns** in the theme, which the therapist can insert and edit. Repeating items like the CTA band become **synced patterns** so one edit updates every page |
| FAQ (`<details>`) | Core **Details** block |
| Resources index and articles | Blog **posts** in a "Resources" category, with a Query Loop on the Resources page and a `single.html` template carrying the related links and educational notice |
| Service template | A page pattern or custom page template |
| 404 | `404.html` template |
| Titles and meta descriptions | Core title support, plus a lightweight SEO plugin only if the client wants per-page control |

## Integrations (production)
- **Booking:** add the client's approved booking link as a button on Contact, in the header CTA if wanted, and in the CTA pattern. Prefer a plain link over an embedded third-party widget, for privacy and speed.
- **Enquiry form:** a minimal form plugin or the existing site's form, sending only to the practice's email. It needs privacy wording approved by the practice and spam protection, and should collect no more data than needed. Confirm email deliverability (SMTP) before launch.
- **Redirects:** use the existing hosting or a redirect plugin, following the URL-mapping worksheet.

## Content and images to replace
See `content-replacement-checklist.md`. All stock photography should be swapped for the client's professional photographs where supplied.

## Maintenance and cost notes (to confirm with the client)
- WordPress core, theme and plugin updates are needed. Use automatic minor updates and keep plugins few.
- Ongoing costs are the existing hosting and domain, plus any premium plugin or template the client chooses. None is required by this approach.
