# FELU — Automation Portfolio

Static personal portfolio for **FELU, AI Automation Expert & Software Developer**.
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
| `work/eamaglobermovers.html` | `/work/eamaglobermovers.html` |
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

## Real screenshots (optional upgrade)

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
