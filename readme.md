# Comfortable Stay — Static GitHub Pages Site

Single-page, responsive static site for the Claim Free Stay offer. No backend — client-side only with Chart.js, localStorage demo bookings, and QR deep links to restaurant detail.

## Features
- Partner restaurants grid with thresholds and notes
- Chart.js bar chart of per-restaurant thresholds
- Eligibility checker (enter bill amount) inside details modal
- Booking form with validation; bookings saved to `localStorage`
- QR code (Google Chart API) linking to `?restaurant=<id>` so scans open the correct detail
- Accessible modal (Esc to close, focus trap) and mobile-first layout

## How To Publish (GitHub Pages)
Choose one of two approaches:

1) Main branch, root (simplest)
- Push this repository to GitHub
- In your repo go to `Settings → Pages`
- Under `Source`, choose `Branch: main` and `Folder: / (root)`
- Save. After it builds, your site will be live at:
  `https://<username>.github.io/ComForTable_And_Stay/`

2) Automatic deployment to `gh-pages` (optional)
- This repo includes `.github/workflows/pages-deploy.yml`
- On every push to `main`, the workflow publishes the root content to the `gh-pages` branch
- In `Settings → Pages`, select `Branch: gh-pages` and `Folder: / (root)`

Notes:
- If you prefer a `/docs` folder approach later, move files into `/docs` and update Pages to `Branch: main → Folder: /docs`. Add `.nojekyll` in that folder.
- QR deep links use `window.location.origin + window.location.pathname`, so they work for both `main` root and `gh-pages` deployments.

## Editing Data (thresholds, restaurants, rooms)
- Open `app.js`
- Update the `restaurants` array to change names, thresholds (₹), notes, and images.
- Update the `rooms` object to change features and images for `dormitory`, `pg`, and `hotel`.
- Chart values automatically reflect `restaurants[].threshold`.

## Tech / Dependencies
- Plain HTML/CSS/JS — no build step required
- Chart.js via CDN for the thresholds chart
- Google Chart API for QR generation (`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=<url>`)
- `localStorage` for demo bookings under key `cs_bookings`

## Future MERN Migration (Notes)
- Replace localStorage with API calls
  - `POST /api/bookings` { name, phone, checkIn, bill, roomType, restaurantId }
  - `GET /api/bookings?user=<phone>` → list bookings
  - `GET /api/restaurants` → list thresholds and metadata
  - `GET /api/restaurants/:id` → detail
- Models (example)
  - Restaurant: { id, name, threshold, note, address, cuisine, images[] }
  - Booking: { id, restaurantId, userId/phone, name, bill, checkIn, checkOut, roomType, createdAt }
- Auth/validation: add server-side validation, rate limiting, and audit logging

## Local Development
- Open `index.html` directly in a browser, or use any static server
- No build process — changes are instant

## Accessibility
- Semantic HTML (`header`, `main`, `footer`)
- Modal has `role="dialog"`, `aria-modal="true"`, labelled/desc elements, Esc to close
- Interactive controls are reachable by keyboard; focus trap keeps focus inside modal while open