# Asset manifest

All photographs come from Unsplash under the **Unsplash Licence** (https://unsplash.com/license), which allows free commercial and non-commercial use without permission. Attribution is appreciated but not required. Every photo was checked as "Free" (not Unsplash+) on 1 November 2026. The images were downloaded locally through Unsplash's image CDN, already resized and cropped. Each image is stored at 640 and 1200 px wide in WebP and JPEG (`tools/fetch-assets.mjs`). No images are hotlinked.

None of the images shows the actual practice, and no person shown represents the therapist.

| File prefix | Unsplash page | Creator | Crop | Used on |
|---|---|---|---|---|
| `hero-armchair` | https://unsplash.com/photos/_ITQJtPxkJk | Olena Bohovyk | 4:5 | Home hero; `social-preview.jpg` (1200×630) |
| `armchair-light` | https://unsplash.com/photos/7mmmEkyk0aQ | Alina Bondar | 4:5 | About hero |
| `chair-plant` | https://unsplash.com/photos/B8r-3sqLWUE | mk. s | 4:5 | Individual Therapy hero |
| `couple-beach` | https://unsplash.com/photos/6t6h5kABuW4 | Bob Oh | 3:2 | Couples Therapy feature (informative alt text) |
| `olive-branch` | https://unsplash.com/photos/sgj62wdIsgQ | Kelis | 3:2 | EFT hero |
| `olive-vase` | https://unsplash.com/photos/Ce3wzkvxNHk | Heather Newsom | 4:5 | Home welcome; Couples Therapy |
| `pampas` | https://unsplash.com/photos/3pR7d-tIRx8 | Patrick Langwallner | 3:2 | Attachment article; resource previews |
| `curtain-light` | https://unsplash.com/photos/3VSa5sbvdpc | Saad Ahmad | 3:2 | Patterns article; About; previews |
| `dried-flowers` | https://unsplash.com/photos/JUd2dkNdNEY | Alsu Vershinina | 4:5 | Home enquiry band |
| `coffee-table` | https://unsplash.com/photos/sh88a-1Z8ns | Fredrik Posse | 3:2 | First-appointment article; previews |
| `eucalyptus` | https://unsplash.com/photos/-KYfVX_t_FM | Pascal Debrunner | 3:2 | Individual Therapy; service template |

Decorative images use `alt=""`. The couples photograph has descriptive alt text because it supports the page's meaning.

## Other assets
- `favicon.svg`: original, made for this demo.
- Fonts: Cormorant Garamond and Source Sans 3, as variable woff2 files with the latin subset, from Google Fonts. Licence: SIL Open Font Licence 1.1 (`site/assets/fonts/OFL-CormorantGaramond.txt`, `OFL-SourceSans3.txt`).

## Social preview fields to fill after deployment approval
`og:url`, `og:image` (absolute URL to `assets/images/social-preview.jpg`) and `<link rel="canonical">`. These are commented out in the `<head>` produced by `src/build.mjs`.
