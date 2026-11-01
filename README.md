# The Relational Practice — Concept

A static website demo for an individual and couples psychotherapy practice in Sydney, Australia, with a focus on relationships, attachment and Emotionally Focused Therapy (EFT). It was built by Crescita Digitale Italia as a design concept for a client brief.

**Demonstration only.** "The Relational Practice" is a fictional, temporary identity. The site does not represent a real therapist, and it does not offer real services, fees, availability or qualifications. Every page carries `noindex, nofollow` and a visible demo notice.

## What's here

| Path | Purpose |
|---|---|
| `site/` | The complete, deployable static website: plain HTML, CSS and JS, with no server runtime. |
| `site/assets/{css,js,images,fonts}` | Shared styles (design tokens in `:root`), progressive-enhancement JS, optimised images and self-hosted OFL fonts. |
| `src/pages/` | Page content. Edit these files, not the generated HTML in `site/`. |
| `src/build.mjs` | Wraps each content file in the shared head, header and footer, and writes `site/`. |
| `tools/` | `serve.mjs` (local preview), `check.mjs` (link and page-rule crawler), `shots.mjs` (screenshots), `fetch-assets.mjs` (asset download). |
| `docs/` | Handover documents: design rationale, content notes, asset manifest, replacement checklist, QA report, WordPress transition, URL map, revisions and deployment plan. |

## Pages

The seven main pages are `index.html`, `about.html`, `individual-therapy.html`, `couples-therapy.html`, `emotionally-focused-therapy.html`, `resources.html` and `contact.html`.

The supporting pages are three articles in `resources/`, `privacy.html` (demo privacy information), `404.html` and `service-template.html`. The service template is kept out of the navigation.

## Run locally

Requires Node 18 or later. There are no dependencies to install.

```bash
node src/build.mjs
```

```bash
node tools/serve.mjs 8080
```

Open http://localhost:8080/ for root hosting, or http://localhost:8080/demos/therapy/ to test the site in a subdirectory.

```bash
node tools/check.mjs http://localhost:8080/demos/therapy/
```

## How repeated content is maintained

The header, navigation, footer, demo notice and `<head>` metadata live only in `src/build.mjs`. Each content file in `src/pages/` starts with a metadata comment (title, description, active nav item) and holds only the page body. `<x-img>` shorthands expand into responsive `<picture>` markup with intrinsic dimensions. All links are relative, so the output works at a domain root or in any subfolder.

## Licences

The code is by Crescita Digitale Italia. The fonts are under the SIL Open Font Licence (`site/assets/fonts/OFL-*.txt`). The photographs are under the Unsplash Licence; see `docs/asset-manifest.md`.
