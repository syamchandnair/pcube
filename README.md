# P Cube Legals — website templates

Three static designs, ready to host on GitHub Pages. No build step, no
frameworks, no dependencies beyond Google Fonts (loaded over HTTPS).

## Structure

```
index.html          landing page that links to all three designs
heritage/            Design A — Heritage (classic, stone & maroon, serif)
verdict/              Design B — Verdict (bold, dark, watermark mark)
counsel/              Design C — Counsel (modern, plain-language, booking flow)
assets/
  css/base.css        shared reset, layout, logo, switcher, disclaimer modal
  css/heritage.css    Design A theme
  css/verdict.css     Design B theme
  css/counsel.css     Design C theme
  js/site.js          shared behaviour (see below)
  favicon.svg
.nojekyll             tells GitHub Pages not to run Jekyll on this repo
```

Each design has its own set of pages (Home / Practice areas / Contact, or
similar) with the same content, just laid out differently. Every page is a
complete, self-contained HTML file — open any one directly in a browser, no
server required.

## Publish on GitHub Pages

1. Create a new GitHub repository and push the contents of this folder to
   its default branch (e.g. `main`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   pick the `main` branch and the `/ (root)` folder, then **Save**.
4. GitHub gives you a URL like `https://<username>.github.io/<repo>/`
   within a minute or two. The `.nojekyll` file is already included so
   GitHub serves the files as-is.

No further configuration is needed. If you'd rather serve one design at
the domain root, copy that design's files (plus `assets/`) up one level
and update the relative links from `../assets/...` to `assets/...`.

## The design switcher

Every page loads `assets/js/site.js`, which adds a small bar in the
top-right corner with a dropdown to jump between the three designs. This
is meant for reviewing the options — **once a design is chosen, open
`assets/js/site.js` and set `SHOW_SWITCHER = false`** (or delete the
`<script src="../assets/js/site.js">` line's switcher block) to remove it
from the live site.

## What `site.js` does

- **Design switcher** — described above.
- **Mobile navigation** — toggles the `.nav` menu on narrow screens.
- **Bar Council of India entry notice** — shows once per browser
  (stored in `localStorage`) reminding visitors the site is informational
  only. Set `SHOW_DISCLAIMER = false` in `site.js` to remove it, or edit
  the wording directly in the script.
- **Booking choice groups** (Design C's `book.html`) — plain buttons with
  `aria-pressed`, no framework, with a live summary panel.
- **Contact forms** — see below.

## Contact and booking forms

GitHub Pages hosts static files only; it cannot receive form submissions
on its own. Each `<form data-static-form>` currently shows an on-page
message instead of submitting, so nothing is silently lost.

To make a form actually deliver messages, without adding a backend:

1. Sign up for a form service that accepts static POSTs, e.g.
   [Formspree](https://formspree.io), [Getform](https://getform.io), or
   [Web3Forms](https://web3forms.com) (all have free tiers).
2. Add `action="https://your-service-url"` and `method="POST"` to the
   `<form>` tag (see the comment left above each form in the HTML).
3. Once a form has an `action` attribute, `site.js` steps aside and lets
   the browser submit it normally — no other changes needed.

## Content still to fill in

Every placeholder is wrapped in `[square brackets]`: office address,
phone number, advocate names, enrolment numbers, fees, opening hours,
and the practice-area list. Search each design's folder for `[` to find
them all. Photos are marked with `<!-- Replace with <img …> -->` comments
next to grey placeholder boxes.

## Fonts and the logo

- Headings use **Outfit** and **Playfair Display**; body text uses
  **Poppins** — all loaded free from Google Fonts. If the firm has a
  licence for **Filson Pro** (used in the original brand deck), swap the
  `<link>` tag and `font-family` declarations in each theme's CSS file.
- The logo mark is redrawn as inline SVG (`<svg class="mark">…</svg>`,
  repeated in each page's header/footer) so it scales crisply with no
  image file to load. Replace it with the agency's master artwork if you
  have the vector source — swap the inline `<svg>` markup for an
  `<img src="…logo.svg">` using the same `class="mark"`.

## Accessibility and responsiveness

Every page: has a skip link, real `<button>`/`<a>`/`<label>` elements
(never a `div` standing in for a control), visible focus states, and a
mobile layout down to phone widths. Motion is minimal and respects
`prefers-reduced-motion`.
