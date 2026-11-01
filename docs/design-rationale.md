# Design rationale

## The brief, in one line
A warm, sophisticated, editorial website for a boutique psychotherapy practice. It should feel calm and contemporary rather than clinical, and centre on relationships, attachment and EFT.

## Reference review (accessed 1 November 2026)
I read each reference's page structure and content. I did not inspect its CSS, so typefaces and exact colours aren't recorded. Nothing was copied.

- **natajsawagner.com.** The homepage alternates content types: a hero, a split image-and-text block, a credentials block, a numbered benefits list beside an arch-cropped photo, and a resources grid. Calls to action close each section. **Lesson:** vary section layouts down the page and close sections with a clear next step. The arch crop softens a layout without needing decorative shapes.
- **integrativemind.ca.** It uses a short top navigation with a visually separated booking button, an about teaser with a portrait, and a single consultation band near the end. **Lesson:** keep one visually dominant CTA in the header and repeat it once, prominently, after the services.
- **leighannvandyke.com.** It has a text-led problem section and three parallel specialty blocks with text links, and uses FAQ accordions to stay compact. It also has a skip link. **Lesson:** native FAQ disclosures keep practical detail available without making the page long, and secondary links stay as text so the primary action dominates.
- **michellecoxtherapy.com.** It has short eyebrow labels above headings, a list of the concerns clients bring, and warm close-up lifestyle photography. **Lesson:** small eyebrow labels give editorial rhythm, and quiet object photography (cups, plants, textiles) suggests warmth without implying a real room.

## One design direction
- **Editorial typography.** Cormorant Garamond for headings, with italic emphasis on a single key word, and Source Sans 3 for body text at 18px with 1.7 line height. Paragraphs are capped at about 66 characters. Fluid headings run from about 38px on mobile to 72px on desktop.
- **Palette.** This is the provisional demo palette, documented as an interpretation and not client branding: ivory `#F6F3ED`, stone `#E6E1D6`, sage `#A6AE96`, deep olive `#3E4A3A`, antique gold `#B39B6A` and charcoal `#343831`. Contrast was measured. Sage (2.1:1) and gold (2.4:1) fail as text on ivory, so they are used only for rules, borders and ornaments. Two text-safe companions were added: `#6E5B32` (gold-text, 5.9:1 on ivory, 5.0:1 on stone; darkened after a PageSpeed contrast finding) and `#D9C9A3` (gold-light, 5.7:1 on olive).
- **Layout.** The maximum content width is 1200px. Sections vary between a split hero, an asymmetric statement with a small image, a numbered pathway list (instead of a card grid), a full olive philosophy band, a step sequence, an asymmetric resource feature and an image-plus-colour enquiry band. There is one arched image on the homepage and fine gold offset frames elsewhere, with no blobs or pill clusters.
- **Photography.** Quiet interiors, linen, dried grasses, olive and eucalyptus, plus one understated image of a couple. There are no portraits, so no stock person is presented as the therapist. The therapist portrait is an elegant labelled placeholder.
- **Motion.** A gentle entrance on the hero only, using CSS keyframes, and switched off under `prefers-reduced-motion`. Nothing is hidden until a scroll event fires.
- **Trust and honesty.** The demo notice appears on every page, and everything that needs client confirmation is clearly labelled. Clinical wording that touches safety or evidence is flagged for therapist review.

## Three perspectives
- **Designer:** consistent tokens, varied but coherent sections, accessible contrast and focus states, and maintainable shared templates.
- **Therapist:** EFT is explained accurately, with sources, without implying certification or promising outcomes. Confidentiality and safety are handled carefully, and the biography is left for their own words.
- **Prospective client:** three clear pathways, plain-language explanations, practical FAQs, one consistent "Enquire about therapy" action, crisis information, and no pressure.
