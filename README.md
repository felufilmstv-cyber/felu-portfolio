# Felu AI DEV — Automation Portfolio

Static personal portfolio for **Favour Adefelu Adeleye, AI Automation Expert & Software Developer**.
No framework, no build step, no backend. Deploys straight to GitHub Pages.

## Why this design

- **Dark charcoal `#0A0A0B` + signal-lime `#C6F135`** — evokes terminal/systems status
  ("live, operational") without cyberpunk clichés. Lime is reserved for
  *interactive / live / result* elements only, so colour works as a system, not decoration.
- **Space Grotesk (display) + Inter (body) + JetBrains Mono (utility labels).**
  The mono face is the technical identity: tags, metrics, logs, nav.
- **Motion is mechanical, not playful:** 2px scroll-progress bar, clip-rise hero,
  transform/opacity-only reveals via IntersectionObserver, a flowing pipeline diagram.
  `prefers-reduced-motion` disables all of it.

## Stack

Pure `HTML / CSS / JS` — one `css/style.css`, one `js/main.js` shared by all pages.
Zero npm dependencies. Images are inline SVG/CSS placeholders (correct 4:3 / 1200×900
aspect) ready to swap for real screenshots or WebP exports.

## Pages / routes

| File | Route on Pages |
|---|---|
| `index.html` | `/` |
| `work.html` | `/work.html` |
| `about.html` | `/about.html` |
| `contact.html` | `/contact.html` |
| `work/emmaglobermovers.html` | `/work/emmaglobermovers.html` |
| `work/support-pilot.html` | `/work/support-pilot.html` |
| `work/reportflow.html` | `/work/reportflow.html` |
| `work/rag-agent.html` | `/work/rag-agent.html` |
| `work/product-pipeline.html` | `/work/product-pipeline.html` |
| `404.html` | fallback |

## Run locally

```bash
# any static server, e.g:
npx serve .
# or
python -m http.server 8000
```

## Deploy to GitHub Pages

1. Push this folder to a repo (root = this site).
2. Repo → **Settings → Pages** → Source: **Deploy from a branch**, Branch: `main`, Folder: `/ (root)`.
3. Custom domain (optional): add `CNAME` file with your domain + DNS CNAME → `[USER].github.io`.
4. `.nojekyll` is included so folders like `work/` pass through untouched.

## Visual system tuning (redesign notes)

- **Wordmark:** `.wm` lockup in `css/style.css` — `FELU` in Chakra Petch 700
  (`--font-mark`), `AI·DEV` in tracked-out mono with a lime→cyan gradient
  (`--accent` → `--accent-2`). Used in nav, hero name line (`.mark-name`), footer.
- **Pipeline background:** inline SVG `svg.pipe-bg` at the top of the hero in
  `index.html`. Node labels are the SVG `<text>` elements (LEAD → WEBHOOK →
  AI AGENT → VOICE → CRM) — edit text/positions there. Rail colour/opacity via
  the `<g>` stroke attributes; pulse colour via `--accent-2`; loop timing is an
  8s cycle — pulse windows in each pulse's `keyTimes`, node flashes via the
  `.n-*` `animation-delay` rules in CSS. Nodes tagged `only-desktop` hide on mobile.
- **Motif reuse:** `.flow-div` (line + travelling dot) dividers before the quote
  and CTA sections, plus a labelled strip above the skills list — same file.
- **Reduced motion:** SMIL is paused and pulses/halos hidden via the `rm` class
  set in `js/main.js`; CSS keyframe motion is disabled in media queries.
- **Ambient node-graph:** last block of `js/main.js` (creates its own fixed
  `<canvas>`, no markup). Tune: `COUNT`/`LINK` (45/150px desktop, 18/130px
  mobile), drift speed `s` (~0.1–0.22 px/frame), pulse cadence (~2.2–4.4s,
  max 2 concurrent), base `rgba(255,255,255,.06/.09)`, pulse lime. Live probe:
  `window.__netbg` (`{ticks, nodes, pulses}`).

## Profile photo

Save the headshot as `assets/profile.jpg` (portrait orientation works best).
It renders in the About hero (4:5 crop, face-safe `object-position`) and the
homepage About preview (1:1 crop), with descriptive alt text. If the file is
missing, the photo blocks remove themselves via `onerror` and the layout holds.

## Canvas screenshots (optional upgrade)

Projects 04–05 already reference `assets/rag-agent.png` and `assets/product-pipeline.png` —
drop those files in and they appear automatically over the designed fallbacks
(the `<img onerror="this.remove()">` pattern). Same for projects 01–03: replace any
`.shot` div with `<img src="../assets/[project].webp" …>` plus the `shotwrap` wrapper
(see `work/rag-agent.html` for the pattern).

## Interactions (each has a reason)

1. Scroll progress + nav solid-state — orientation, "pipeline executing".
2. Cursor-follow project preview (fine-pointer only; tap = navigate on touch).
3. Expandable skills system list — categories, not icon grids.
4. Count-up metrics tied to case-study results.
5. Magnetic CTA buttons (subtle, pointer-fine only).
6. **Signature:** runnable input → process → output pipeline with streaming log.
