# Client content replacement checklist

Every placeholder in the page sources carries a `data-replace="…"` id, or uses the `.tbc` or `.placeholder` classes. To find them all:

```bash
grep -rn "data-replace\|class=\"tbc\"\|placeholder" src/pages
```

## Identity and branding
- [ ] Practice name: replace "The Relational Practice" in `src/build.mjs`, which updates the header, footer and titles.
- [ ] Remove the "Concept · Sydney" tag, the demo bar, and the demo wording in the footer (production only).
- [ ] Logo (SVG preferred) and favicon.
- [ ] Brand colours and typography: update the tokens in `:root` of `site/assets/css/main.css`, then re-check contrast.
- [ ] Remove `noindex, nofollow` (production only).

## Therapist information
- [ ] `home-bio`: homepage introduction (index.html)
- [ ] `about-bio`: full biography in the therapist's own words (about.html)
- [ ] Portrait placeholders on Home and About: professional photographs
- [ ] `about-qualifications`: verified qualifications
- [ ] `about-registration`: verified registration and memberships
- [ ] `eft-training`: accurate description of EFT training or certification status

## Services and practicalities
- [ ] `individual-concerns`: confirmed areas of focus (currently sample content)
- [ ] `individual-fees`, `couples-fees`, `contact-fees`: fees, session length and rebate information
- [ ] `individual-formats`: in-person or online availability
- [ ] `individual-confidentiality`: confidentiality wording
- [ ] Individual FAQ "move from individual to couples": practice policy
- [ ] Homepage "What to expect" steps, including the "A brief conversation" format

## Contact and booking
- [ ] `contact-address`: address or room details (or "online only")
- [ ] `contact-booking`: approved booking link
- [ ] `contact-email-phone`: email and phone
- [ ] `contact-availability`: days, hours and response times
- [ ] Replace the form preview with a production form (see wordpress-transition.md)

## Privacy and legal
- [ ] `privacy-hosting`: hosting provider and logs
- [ ] `privacy-production`: production privacy policy supplied or approved by the practice

## Optional additional service
- [ ] `service-intro`, `service-who`, `service-sessions`, `service-faq` in service-template.html, only if the client's sitemap includes an eighth page

## Clinical review
- [ ] All items listed under "Items flagged for therapist review" in content-notes.md

## Imagery
- [ ] Replace stock photography with the client's professional photographs where supplied, and update alt text.
