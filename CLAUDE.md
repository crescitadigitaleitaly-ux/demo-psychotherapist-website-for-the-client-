# The Relational Practice — Concept: project state and how to resume

Static HTML/CSS/vanilla-JS demo of a Sydney psychotherapy practice website, made for an Upwork client brief (individual and couples therapy, attachment, EFT). Owner: Mouzzam Channa / Crescita Digitale Italia. Repo: https://github.com/crescitadigitaleitaly-ux/demo-psychotherapist-website-for-the-client-

## Hard rules (from the owner's brief)
- Demo only: no backend, no form submission, no analytics, no third-party scripts or embeds. Keep `noindex, nofollow` and the demo notice on every page.
- Never invent a therapist identity, credentials, EFT certification, testimonials, fees, hours, address, phone or email. Use labelled placeholders (`data-replace`, `.tbc`, `.placeholder`).
- EFT means Emotionally Focused Therapy, never Emotional Freedom Techniques. No efficacy promises.
- Never touch the live portfolio (mouzzambuild.com) or any client site. Publishing requires explicit approval of the exact destination.
- Don't buy templates, images, subscriptions or plugins.

## Workflow
- Edit `src/pages/*.html` (content) and `src/build.mjs` (shared head, header and footer), then run `node src/build.mjs`. Never hand-edit the generated `site/*.html`.
- CSS and JS are edited directly in `site/assets/`. Design tokens live in `:root`.
- Preview: `node tools/serve.mjs 8080` (root and `/demos/therapy/`). Check: `node tools/check.mjs http://localhost:8080/demos/therapy/`. Screenshots: `node tools/shots.mjs "<chrome or edge path>"`.
- Commit as "Mouzzam Channa" <channamouzzam@gmail.com>.

## Status (2026-11-01)
- Local build complete: 7 main pages, 3 articles, privacy, 404 and a service template. QA is in `docs/qa-report.md`.
- Owner decisions: static HTML (not WordPress) for the demo.
- **Live at https://therapy.mouzzambuild.com/** (deployed 2026-11-01, owner-approved). Hostinger account u299383397, a subdomain of the mouzzambuild.com website, root `public_html/therapy`. To redeploy: rebuild, get a fresh upload URL via the Hostinger MCP `hosting_files_generate-upload-url` (username u299383397, domain therapy.mouzzambuild.com), then run `tools/upload.mjs` with HOST_URL, HOST_AUTH and HOST_REST set. See `docs/deployment-plan.md`.
- Not run: axe-core (CDN load blocked in session), Lighthouse, screen readers, real devices.
