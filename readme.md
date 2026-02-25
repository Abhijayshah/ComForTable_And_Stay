# Comfortable Stay — Claim Free Stay Offer

Responsive, client-side only site to showcase partner restaurants and let users check eligibility and book a demo free stay. Built with plain HTML/CSS/JS, Chart.js via CDN, and localStorage for demo bookings.

## Features
- Partner restaurants grid with thresholds and notes
- Threshold bar chart (Chart.js, deferred load)
- Details modal: bill eligibility checker (₹), room images, QR deep link
- Booking form: client-side validation; saved to `localStorage`
- QR codes via Google Chart API linking to `?restaurant=<id>`
- Theme selector: `Light/Dark/System` with persistence (`cs_theme`)
- Accessible, mobile-first layout

## Project Structure
- `index.html` — main page markup and sections
- `styles.css` — theme variables, layout, components, modal, chart styles
- `app.js` — restaurants data, chart setup, modal/booking logic
- `script.js` — theme persistence, smooth anchors, footer year, optional form helpers
- `.github/workflows/pages-deploy.yml` — GitHub Pages auto-deploy to `gh-pages`

## Quick Start (Local)
- Open `index.html` in a browser, or run a static server:
  - Python: `python3 -m http.server 8000`
  - Node: `npx http-server -p 8000` or `npx serve -p 8000`
- Visit `http://localhost:8000/`

## Deployment (GitHub Pages)
- Easiest: `Settings → Pages → Source: Branch: main, Folder: /(root)`
- Auto-deploy: uses `.github/workflows/pages-deploy.yml` to publish root to `gh-pages`; set Pages to `Branch: gh-pages, Folder: /(root)`
- QR deep links use `window.location.origin + window.location.pathname` so paths work on both root and `gh-pages`

## Configuration & Data
- Edit `app.js`:
  - `restaurants[]`: `{ id, name, threshold, note, cuisine, images[] }`
  - `rooms` object: features/images for `dormitory`, `pg`, `hotel`
- Chart pulls `restaurants[].threshold` automatically
- Demo bookings persist under `localStorage` key `cs_bookings`

## Theme & Styling
- Theme is controlled by `data-theme` on `<html>` (`light`, `dark`, `system`) and persisted in `localStorage`
- Colors set in `styles.css` under `html[data-theme=...]` blocks (`--bg`, `--text`, `--primary`, `--secondary`, etc.)
- Background can be a gradient (e.g., violet→blue) in `body { background: ... }`
- Header uses a tinted, blurred backdrop for readability over gradients

## Accessibility
- Semantic sections: `header`, `main`, `footer`
- Modal uses `role="dialog"`, `aria-modal="true"`, labelled/description IDs, Esc to close, focus trap
- Keyboard navigation supported across interactive elements

## Performance
- Use `defer` scripts (already set) to avoid render blocking
- Consider disabling `background-attachment: fixed` on low-end mobile devices if scrolling stutters
- Optimize images (dimensions, compression) to reduce layout shifts

## Security Best Practices
- No secrets/keys in repo; QR uses public Google Chart API
- External links use `rel="noopener"` to prevent tab-nabbing
- Validate user input in forms; sanitize any dynamic HTML if added later
- For future backend: add rate limiting, CORS, CSRF protection, audit logs

## Troubleshooting
- `net::ERR_CONNECTION_REFUSED`: ensure the static server is running; try a different port (`8080`) and check firewall/VPN
- QR image blocked: the modal shows a link fallback; click the restaurant link directly
- 404 on Pages: verify Pages branch/folder and that site is served from repo root; avoid moving files without updating settings

## Contributing
- Fork, create a feature branch, make changes, and open a PR
- Keep styles consistent; use existing CSS variables and patterns
- Test accessibility (keyboard + screen reader) and responsiveness before submitting