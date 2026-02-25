# Comfortable Stay — Interview Q&A, Theory, and MCQs

## Table of Contents
- [Interview Questions & Answers](#interview-questions--answers)
- [Theory Notes](#theory-notes)
- [MCQs](#mcqs)
- [Practical Checkpoints (Hands-On)](#practical-checkpoints-hands-on)

## Questions — Quick Navigation
- Theme persistence → [Q1](#q1)
- CSS variables → [Q2](#q2)
- Gradient performance → [Q3](#q3)
- Header color-mix → [Q4](#q4)
- Accessible modal → [Q5](#q5)
- QR codes → [Q6](#q6)
- Chart data → [Q7](#q7)
- Demo bookings → [Q8](#q8)
- Security → [Q9](#q9)
- Deployment → [Q10](#q10)
- Accessibility → [Q11](#q11)
- Responsiveness → [Q12](#q12)
- Defer scripts → [Q13](#q13)
- Backend migration → [Q14](#q14)
- System theme → [Q15](#q15)

## Interview Questions & Answers

<a id="q1"></a>1) How does the theme persistence (Light/Dark/System) work?
- The site stores the selected theme in `localStorage` under `cs_theme` and applies it to the `<html>` attribute `data-theme`. On load, it reads and applies the value, updating UI controls accordingly. The system preference is honored via `matchMedia('prefers-color-scheme: dark')` with a change listener.
- References: `script.js:21–62`, `index.html:29–36`, `styles.css:6–65`

<a id="q2"></a>2) Why use CSS variables for theming?
- CSS variables (`--primary`, `--secondary`, `--bg`, `--text`) let you switch entire theme palettes by toggling values in a single place. They’re dynamic, cascade-aware, and efficient for runtime changes without recompilation.
- References: `styles.css:6–65`

<a id="q3"></a>3) How is the gradient background implemented and why might it affect performance?
- The body uses a gradient based on theme variables: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`. `background-attachment: fixed` creates a parallax-like effect but can cause jank on low-end devices due to repaint costs during scroll.
- References: `styles.css:75–80`

<a id="q4"></a>4) What does `color-mix(in oklab, ...)` achieve in the header?
- It tints the header using perceptually uniform color mixing for consistent contrast across themes. This keeps text and nav visible against a vivid page background while preserving design coherence.
- References: `.site-header`, `styles.css:118–126`

<a id="q5"></a>5) How does the accessible modal ensure good UX?
- Uses `role="dialog"`, `aria-modal="true"`, labels/descriptions via IDs, Escape to close, a click backdrop, and a focus trap to keep keyboard navigation inside the modal. This follows WCAG recommendations for dialogs.
- References: `index.html:165–233`

<a id="q6"></a>6) How are QR codes generated without external secrets?
- A public Google Chart API URL encodes the target restaurant link into a QR image: `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=<url>`. A fallback link is shown if the image is blocked.
- References: `index.html:190–198`

<a id="q7"></a>7) How does the threshold chart get data?
- Chart.js is loaded via CDN with `defer`. Data comes from the app’s restaurant list: thresholds are mapped into chart datasets, so updating `restaurants[].threshold` automatically refreshes the chart configuration.
- References: `index.html:12–13`, `app.js` (data/chart logic)

<a id="q8"></a>8) Where are bookings stored and why only demo?
- Bookings are saved locally in the browser using `localStorage` (key like `cs_bookings`). This is for demo purposes only; no backend exists, and data persists only per browser/device.
- References: `index.html:67–77`, `app.js` (booking logic)

<a id="q9"></a>9) What security precautions are used for external links and forms?
- `rel="noopener"` is added to external links to prevent tab-nabbing. Inputs are validated client-side; dynamic HTML insertion (if any) should be sanitized. No secrets are embedded; QR generation uses public endpoints safely.
- References: `index.html` links, `script.js:81–107` (form example)

<a id="q10"></a>10) How is deployment handled for GitHub Pages?
- Either serve from `main` root directly via GitHub Pages settings or auto-deploy to `gh-pages` using an existing GitHub Actions workflow. Deep links and routing work from both locations.
- References: `.github/workflows/pages-deploy.yml:1–24`

<a id="q11"></a>11) What are key accessibility considerations in this site?
- Semantic structure (`header`, `main`, `footer`), labeled controls, ARIA attributes for dialogs, keyboard navigability, and focus management. Color contrasts are considered via theme choices and header tinting.

<a id="q12"></a>12) How do you ensure mobile responsiveness?
- Mobile-first CSS, fluid containers, grid layouts with `auto-fill` and `minmax()`, and touch-friendly target sizes. Avoid fixed widths; rely on max-width containers and responsive spacing.
- References: `styles.css:82–87`, `styles.css:176–185`

<a id="q13"></a>13) What’s the role of `defer` on scripts?
- `defer` loads the scripts without blocking rendering and executes them after the document is parsed, improving perceived performance and avoiding layout blocking.
- References: `index.html:12–18`

<a id="q14"></a>14) How would you migrate from localStorage to a backend?
- Replace localStorage operations with HTTP calls to backend endpoints (`POST /api/bookings`, `GET /api/bookings`, etc.), add authentication, input validation on server, rate limiting, CSRF protection, and audit logging.

<a id="q15"></a>15) Why use `matchMedia` for system theme?
- It allows the UI to reflect OS-level dark/light preference and update dynamically when the system setting changes, maintaining user consistency.


## Theory Notes

- CSS Theming
  - Use `data-theme` on `<html>` and theme-scoped CSS variables for palettes
  - Prefer `color-mix(in oklab, ...)` for perceptual color blending
  - Keep contrast high for legibility on headers over gradients

- Accessibility (A11y)
  - Dialogs: `role="dialog"`, `aria-modal="true"`, labelled/described elements
  - Keyboard: Esc to close, focus trap, tab order, visible focus states
  - Semantic tags and ARIA where static semantics don’t suffice

- Performance
  - `defer` scripts, compressed images, responsive sizes
  - Avoid heavy scroll effects; reconsider `background-attachment: fixed` on mobile
  - Minimize reflows/repaints with efficient CSS and DOM updates

- Security
  - `rel="noopener"` for external links
  - Validate and sanitize user inputs; avoid injecting unsanitized HTML
  - Do not store secrets in client; use environment variables and server-side protection when migrating

- Data & State
  - Local demo persistence via `localStorage`
  - Decouple view and data; chart reflects `restaurants[]` thresholds


## MCQs

1) Which mechanism persists the theme across sessions?
- A) Cookies
- B) URL query params
- C) `localStorage`
- D) IndexedDB
- Answer: C
- Explanation: The site uses `localStorage` with the key `cs_theme`.

2) What is the primary benefit of CSS variables for theming?
- A) Faster compilation
- B) Server-side rendering
- C) Dynamic runtime updates without rebuilds
- D) Automatic contrast checking
- Answer: C
- Explanation: Variables allow runtime changes by swapping values in the cascade.

3) Why add `rel="noopener"` to external links?
- A) Improves SEO
- B) Prevents tab-nabbing and access to `window.opener`
- C) Blocks tracking cookies
- D) Enables HTTP/2
- Answer: B
- Explanation: `noopener` increases security by isolating new tabs.

4) A dialog meets WCAG requirements when:
- A) It has a colored header
- B) Uses `aria-modal="true"` and traps focus
- C) Contains a `<section>` tag
- D) Disables keyboard navigation
- Answer: B
- Explanation: Proper ARIA roles and focus management are key.

5) `background-attachment: fixed` can cause:
- A) Faster scrolling on mobile
- B) Reduced memory usage
- C) Repaint jank during scroll on low-end devices
- D) Elimination of CLS
- Answer: C
- Explanation: Fixed backgrounds can be expensive to repaint.

6) Chart.js is loaded with `defer` primarily to:
- A) Execute before HTML parses
- B) Block CSS loading
- C) Avoid render blocking and run after parsing
- D) Force inline script execution
- Answer: C
- Explanation: `defer` improves page performance and timing.

7) Which is NOT a good practice for client-only bookings?
- A) Storing in `localStorage`
- B) Using strong server-side validation
- C) Showing clear demo warnings
- D) Avoiding sensitive data
- Answer: B
- Explanation: Client-only demo has no backend; server validation applies only after migration.

8) To maintain readable nav over a vivid gradient:
- A) Use `mix-blend-mode: difference`
- B) Tint header with `color-mix` and apply blur
- C) Remove nav links
- D) Force dark text only
- Answer: B
- Explanation: Tinting the header ensures contrast regardless of background.

9) Which statement about QR generation is accurate?
- A) Requires API keys
- B) Embeds secrets
- C) Uses public Google Chart API with encoded URL
- D) Works only on HTTPS
- Answer: C
- Explanation: It’s a public endpoint; no secrets used.

10) For mobile responsiveness, prefer:
- A) Fixed pixel widths
- B) Tables for layout
- C) CSS grid with `auto-fill` and `minmax()`
- D) Absolute positioning
- Answer: C
- Explanation: Grid with `minmax()` yields adaptive, fluid layouts.


## Practical Checkpoints (Hands-On)

- Toggle theme and reload to confirm persistence
- Open the modal and navigate via keyboard; ensure focus trap and Esc to close
- Inspect nav contrast over the gradient on both light and dark themes
- Update a restaurant threshold in `app.js` and verify Chart.js reflects changes
- Validate external links include `rel="noopener"` and that QR fallback link appears if the image is blocked
