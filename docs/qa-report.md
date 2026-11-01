# QA report

Date: 1 November 2026. Environment: local Node static server (`tools/serve.mjs`), tested both at the root (`/`) and in a subdirectory (`/demos/therapy/`).

## Checks performed and results

| Check | Tool / method | Result |
|---|---|---|
| Internal links and assets (pages, CSS, JS, fonts, every `srcset` candidate) | `tools/check.mjs` crawler, root and subdirectory | 13 pages, 49 linked assets, **0 problems** in both locations |
| One H1 per page; unique titles and descriptions; `noindex, nofollow`; demo notice | `tools/check.mjs` | **Pass** on all 13 pages |
| No root-absolute links (subdirectory safety) | `tools/check.mjs` | **Pass** |
| `<img>` width, height and alt present | `tools/check.mjs` | **Pass** |
| Horizontal overflow at 320, 390, 768 and 1440 px | In-browser iframe measurement (Claude built-in browser) | **None** on all 13 pages |
| Console errors | Headless Edge (Chromium) via the DevTools protocol, 4 pages × 2 sizes | **None** |
| Mobile menu: accessible name, `aria-expanded`, focus moves into the menu, Escape closes the sub-menu then the menu and returns focus to the toggle | Real key presses in the built-in browser at 375 px | **Pass** (after fixing a 54 px offset caused by `backdrop-filter` on the sticky header) |
| Therapy sub-menu by keyboard (Enter) and current-page state | Built-in browser | **Pass**: `aria-expanded` toggles and Couples Therapy is marked `aria-current` |
| Desktop sub-menu by hover/click/focus | Code review plus desktop screenshot | Implemented as a click/Enter disclosure that closes on focus-out, outside click or Escape. **Touch on a physical device not tested.** |
| Form preview sends nothing | Built-in browser: resource-timing count before and after, plus cookies and storage | **0 new requests, 0 cookies, 0 localStorage or sessionStorage entries.** Fieldset disabled; no `action`; message "Demo only — no enquiry has been sent." delivered through `role="status"` `aria-live="polite"` |
| Reduced motion | Headless Edge with `prefers-reduced-motion: reduce` emulated | **Pass**: hero animations resolve to `none` |
| 200% zoom | Equivalent reflow widths: a 1440 px window at 200% ≈ 720 CSS px; 320 px ≈ 400% of 1280 | No overflow at 320, 390 or 768 px. **Browser zoom control itself not exercised.** |
| Colour contrast | Computed WCAG ratios for every text/background token pair (see design-rationale.md) | All text pairs ≥ 4.5:1. Sage and antique gold used only decoratively. Gold label text was darkened to #6E5B32 (5.0:1 on stone) after PageSpeed flagged 4.3:1 eyebrows on stone sections. |
| Structural accessibility: landmarks, heading order, `lang="en-AU"`, labelled controls, named links/buttons, valid ARIA references, duplicate ids, target size ≥ 24 px | Custom in-page audit script, 13 pages | One broken `aria-labelledby` found and **fixed**; now **0 issues** |
| Article length | Word count of article bodies | 496 / 473 / ~430 words (first-appointment extended after a 385-word first draft) |
| Unsupported claims (certification, guarantees, free consultation, testimonials, ratings) | grep over the built HTML | Clean. The only match is "does not guarantee a particular outcome". |
| Visual review | Full-page screenshots in `docs/screenshots/` (Home, Couples, EFT, Contact × desktop 1440 / mobile 390) | Fixed the hero frame misalignment on mobile, a shorter mobile hero crop, and the radio layout on the Contact form |

## Live checks (https://therapy.mouzzambuild.com/, 1 November 2026)
- `tools/check.mjs` against the live origin: 13 pages, 49 assets, **0 problems**.
- Headers: HTTPS 200; HTTP → HTTPS 301; `X-Robots-Tag: noindex, nofollow` on HTML and assets; HTML `no-cache`; images and fonts cached for 1 year; missing URL returns 404.
- Browser (built-in Chromium): fonts loaded, hero image loaded, JS enhanced, **0 console errors, 0 third-party requests**.

## PageSpeed Insights (pagespeed.web.dev, Lighthouse 13.6, live homepage)
| Run | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|
| Mobile, 1 Nov 2026 16:22 | 100 | 100 | 100 | 69 | 0.8 s | 0.8 s | 0 ms | 0 | 2.0 s |
| Desktop, 1 Nov 2026 16:29 | 100 | 100 | 100 | 69 | 0.3 s | 0.4 s | 0 ms | 0 | 0.9 s |

- SEO 69 comes only from "Page is blocked from indexing", which is the intended noindex on the demo.
- An earlier run scored Accessibility 97, flagging gold eyebrow text on stone (4.3:1) and the decorative "R" in the portrait placeholder. Both were fixed (gold-text #6E5B32; "R" moved to CSS) and the Hostinger CDN cache was cleared.
- One mobile run (16:20) reported CLS 0.54 and Performance 79. A local throttled probe (`tools/cls-probe.mjs`, slow 4G, 4x CPU) measured CLS 0.000, and the next two runs measured 0. The outlier is most likely Hostinger's CDN browser-check page being served to the test agent. Recorded here as a known variance.

## Not run / unverified
- **axe-core automated scan:** not run. Loading axe from a CDN into the page was blocked by this session's safety policy. Run it on the deployed demo, or locally with an installed axe extension.
- **Screen reader testing** (NVDA, VoiceOver) and **real touch devices** (iOS Safari, Android Chrome): not tested.
- **No automated test can establish full WCAG conformance.** No compliance claim is made.

## Open issues
- The 404 page loses its styling for missing *nested* URLs (see deployment-plan.md).
- The 1800RESPECT number was not re-verified online in this session.
- All clinical and practice content is provisional until the therapist reviews it.
