/* Comfortable Stay — Static Demo App (client-only)
   - Restaurants & thresholds are defined below
   - Chart.js draws threshold bars
   - Google Chart API generates QR for deep-link to `?restaurant=<id>`
   - Bookings are saved to localStorage (`cs_bookings`)
   - TODO: replace localStorage with POST /api/bookings (MERN migration)

   Modify data in `restaurants` and `rooms`. UI updates automatically.
*/

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   threshold: number,
 *   partnerNote: string,
 *   address: string,
 *   cuisine: string,
 *   images: string[]
 * }} Restaurant
 */

/**
 * @typedef {{ features: string[], images: string[] }} Room
 * @typedef {{ dormitory: Room, pg: Room, hotel: Room }} Rooms
 */

// Client-only data (edit thresholds/images here)
/** @type {Restaurant[]} */
const restaurants = [
  {
    id: 'r1',
    name: 'Nebula Bistro',
    threshold: 1500,
    partnerNote: 'Premium partner',
    address: 'Cyber Park, Sector 64',
    cuisine: 'Modern Indian',
    images: [
      'https://picsum.photos/seed/r1a/600/360',
      'https://picsum.photos/seed/r1b/600/360',
    ],
  },
  {
    id: 'r2',
    name: 'Byte & Bite Cafe',
    threshold: 700,
    partnerNote: 'Casual partner',
    address: 'Tech Arcade, Phase 2',
    cuisine: 'Cafe / Continental',
    images: [
      'https://picsum.photos/seed/r2a/600/360',
      'https://picsum.photos/seed/r2b/600/360',
    ],
  },
  {
    id: 'r3',
    name: 'Quantum Grill',
    threshold: 2200,
    partnerNote: 'Premium partner',
    address: 'Downtown Hub',
    cuisine: 'BBQ / Grill',
    images: [
      'https://picsum.photos/seed/r3a/600/360',
      'https://picsum.photos/seed/r3b/600/360',
    ],
  },
  {
    id: 'r4',
    name: 'Circuit Curry House',
    threshold: 900,
    partnerNote: 'Casual partner',
    address: 'North Avenue',
    cuisine: 'Indian Homestyle',
    images: [
      'https://picsum.photos/seed/r4a/600/360',
      'https://picsum.photos/seed/r4b/600/360',
    ],
  },
];

/** @type {Rooms} */
const rooms = {
  dormitory: {
    features: ['Shared bunk beds', 'Lockers', 'Common lounge'],
    images: [
      'https://picsum.photos/seed/dorm1/600/360',
      'https://picsum.photos/seed/dorm2/600/360',
    ],
  },
  pg: {
    features: ['Meals included', 'Wi-Fi', 'Quiet hours'],
    images: [
      'https://picsum.photos/seed/pg1/600/360',
      'https://picsum.photos/seed/pg2/600/360',
    ],
  },
  hotel: {
    features: ['Private room', 'Ensuite bath', 'Room service'],
    images: [
      'https://picsum.photos/seed/hotel1/600/360',
      'https://picsum.photos/seed/hotel2/600/360',
    ],
  },
};

// Storage helpers
const LS_KEY = 'cs_bookings';
/** @returns {any[]} */
function readBookings() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read bookings', e);
    return [];
  }
}
/** @param {any[]} data */
function writeBookings(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write bookings', e);
  }
}

// HTML escape to avoid injection
/** @param {string} str */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Render restaurant cards
function renderRestaurants() {
  const grid = document.getElementById('restaurantGrid');
  if (!grid) return;
  grid.innerHTML = '';

  restaurants.forEach((r) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('tabindex', '0');

    const img = document.createElement('img');
    img.className = 'card-img';
    img.src = r.images[0];
    img.alt = `${r.name} image`;

    const body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = `
      <div class="card-title">${escapeHTML(r.name)}</div>
      <div class="card-sub">${escapeHTML(r.cuisine)} · ₹${r.threshold} threshold</div>
      <div class="card-row">
        <span class="partner-note">${escapeHTML(r.partnerNote)}</span>
        <div class="card-actions">
          <button class="btn btn-ghost" data-qr="${r.id}">QR</button>
          <button class="btn btn-primary" data-open="${r.id}">Details</button>
        </div>
      </div>
    `;

    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });

  grid.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const openId = t.getAttribute('data-open');
    const qrId = t.getAttribute('data-qr');
    if (openId) openModal(openId);
    if (qrId) openModal(qrId, { focusQR: true });
  });
}

// Accessible modal and focus trap
let lastFocus = null;
function setModalVisible(visible) {
  const modal = document.getElementById('restaurantModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', visible ? 'false' : 'true');
  document.body.style.overflow = visible ? 'hidden' : '';
}
function trapFocus(e) {
  const modal = document.getElementById('restaurantModal');
  if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
  if (e.key !== 'Tab') return;
  const focusables = modal.querySelectorAll('a[href], button, input, select, textarea');
  const list = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'));
  if (!list.length) return;
  const first = list[0];
  const last = list[list.length - 1];
  // Shift+Tab cycles backward
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  trapFocus(e);
});

function closeModal() {
  setModalVisible(false);
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

/**
 * @param {string} restaurantId
 * @param {{ focusQR?: boolean }} [opts]
 */
function openModal(restaurantId, opts = {}) {
  const modal = document.getElementById('restaurantModal');
  const title = document.getElementById('modalTitle');
  const desc = document.getElementById('modalDesc');
  const imagesBox = document.getElementById('modalImages');
  const infoBox = document.getElementById('modalInfo');
  const billInput = document.getElementById('billAmountInput');
  const eligMsg = document.getElementById('eligibilityMsg');
  const qrImg = document.getElementById('qrImage');
  const qrFallback = document.getElementById('qrFallback');
  const qrLinkText = document.getElementById('qrLinkText');
  const form = document.getElementById('bookingForm');
  const closeBtn = document.getElementById('modalCloseBtn');

  const r = restaurants.find((x) => x.id === restaurantId);
  if (!modal || !r || !title || !desc || !imagesBox || !infoBox || !billInput || !eligMsg || !qrImg || !qrFallback || !qrLinkText || !form || !closeBtn) return;

  lastFocus = document.activeElement;
  title.textContent = r.name;
  desc.textContent = `Threshold: ₹${r.threshold}. Cuisine: ${r.cuisine}. ${r.partnerNote}.`;
  imagesBox.innerHTML = '';
  r.images.forEach((src) => {
    const im = document.createElement('img');
    im.src = src; im.alt = `${r.name} photo`;
    imagesBox.appendChild(im);
  });

  // Room teasers (first image of chosen room type); details in rooms object
  const roomTypeEl = document.getElementById('roomType');
  const chosenRoom = rooms[roomTypeEl.value];
  const roomFeat = chosenRoom.features.join(', ');
  infoBox.innerHTML = `
    <p><strong>Address:</strong> ${escapeHTML(r.address)}</p>
    <p><strong>Room sample:</strong> ${escapeHTML(roomFeat)}</p>
  `;

  // Eligibility init
  eligMsg.textContent = '';
  eligMsg.classList.remove('ok', 'no');
  billInput.value = '';

  // QR deep link uses origin+pathname to work on GitHub Pages
  const base = `${window.location.origin}${window.location.pathname}`; // e.g., https://username.github.io/repo/index.html
  const deepLink = `${base}?restaurant=${encodeURIComponent(r.id)}`;
  const qrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(deepLink)}`;

  qrImg.src = qrUrl;
  qrImg.onload = () => { qrFallback.hidden = true; };
  qrImg.onerror = () => {
    qrFallback.hidden = false;
    qrLinkText.href = deepLink;
    qrLinkText.textContent = deepLink;
  };

  // Close handling
  modal.addEventListener('click', (ev) => {
    const t = ev.target;
    if (t instanceof HTMLElement && t.dataset.close === 'true') closeModal();
  }, { once: true });
  closeBtn.addEventListener('click', () => closeModal(), { once: true });

  // Eligibility message update
  billInput.oninput = () => {
    const bill = Number(billInput.value || 0);
    if (!Number.isFinite(bill) || bill <= 0) {
      eligMsg.textContent = '';
      eligMsg.classList.remove('ok', 'no');
      return;
    }
    if (bill >= r.threshold) {
      eligMsg.textContent = 'Eligible for free stay ✅';
      eligMsg.classList.add('ok');
      eligMsg.classList.remove('no');
    } else {
      const diff = r.threshold - bill;
      eligMsg.textContent = `Not eligible. +₹${diff} needed.`;
      eligMsg.classList.add('no');
      eligMsg.classList.remove('ok');
    }
  };

  // Booking submission
  form.onsubmit = (ev) => {
    ev.preventDefault();
    const name = document.getElementById('guestName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const checkIn = document.getElementById('checkIn').value;
    const roomType = document.getElementById('roomType').value;
    const bill = Number(document.getElementById('billAmountInput').value || 0);

    // Simple validations
    const errors = [];
    if (name.length < 2) errors.push('Enter a valid full name');
    if (!/^\d{10}$/.test(phone)) errors.push('Enter a 10-digit phone');
    if (!checkIn) errors.push('Select a check-in date');
    if (!Number.isFinite(bill) || bill <= 0) errors.push('Enter your bill amount');
    if (bill < r.threshold) errors.push(`Bill must be ≥ ₹${r.threshold} to qualify`);

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    const checkOut = computeCheckoutNextDay(checkIn);
    const booking = {
      id: `b_${Date.now()}`,
      restaurantId: r.id,
      restaurantName: r.name,
      threshold: r.threshold,
      name, phone, checkIn, checkOut, bill, roomType,
      createdAt: new Date().toISOString(),
    };

    const existing = readBookings();
    existing.push(booking);
    writeBookings(existing);
    renderBookings();

    // TODO: replace with POST /api/bookings
    alert('Booking confirmed! Saved to your browser.');
    closeModal();
  };

  setModalVisible(true);
  if (opts.focusQR) {
    qrImg.focus();
  } else {
    billInput.focus();
  }
}

// Chart.js thresholds
function renderChart() {
  const ctx = document.getElementById('thresholdChart');
  if (!ctx || !window.Chart) return;
  const labels = restaurants.map((r) => r.name);
  const data = restaurants.map((r) => r.threshold);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Threshold (₹)', data }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

// Booking list rendering
function renderBookings() {
  const wrap = document.getElementById('bookingsList');
  const clearBtn = document.getElementById('clearBookingsBtn');
  if (!wrap || !clearBtn) return;
  const bookings = readBookings();
  wrap.innerHTML = '';
  wrap.setAttribute('aria-busy', 'true');

  if (!bookings.length) {
    const empty = document.createElement('p');
    empty.className = 'fine';
    empty.textContent = 'No bookings yet.';
    wrap.appendChild(empty);
  } else {
    bookings.forEach((b, idx) => {
      const r = restaurants.find((x) => x.id === b.restaurantId);
      const card = document.createElement('article');
      card.className = 'card';
      const img = document.createElement('img');
      img.className = 'card-img';
      img.src = r ? r.images[0] : 'https://picsum.photos/seed/booking/600/360';
      img.alt = `${b.restaurantName} booking image`;
      const body = document.createElement('div');
      body.className = 'card-body';
      const maskedPhone = b.phone.replace(/\d(?=\d{4})/g, '*');
      body.innerHTML = `
        <div class="card-title">${escapeHTML(b.restaurantName)} · ${escapeHTML(b.roomType)}</div>
        <div class="card-sub">Check-in: ${escapeHTML(b.checkIn)} · Check-out: ${escapeHTML(b.checkOut)}</div>
        <div class="card-sub">You paid: ₹${b.bill} (threshold: ₹${b.threshold}) · ${escapeHTML(maskedPhone)}</div>
        <div class="card-row">
          <button class="btn" data-open="${b.restaurantId}">Open</button>
          <button class="btn btn-danger" data-del="${idx}">Delete</button>
        </div>
      `;
      card.appendChild(img);
      card.appendChild(body);
      wrap.appendChild(card);
    });
  }

  wrap.setAttribute('aria-busy', 'false');

  wrap.onclick = (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const delIdx = t.getAttribute('data-del');
    const openId = t.getAttribute('data-open');
    if (delIdx) {
      const list = readBookings();
      list.splice(Number(delIdx), 1);
      writeBookings(list);
      renderBookings();
    } else if (openId) {
      openModal(openId);
    }
  };

  clearBtn.onclick = () => {
    if (confirm('Clear all bookings?')) {
      writeBookings([]);
      renderBookings();
    }
  };
}

// Compute next-day 11:59 formatted
/**
 * @param {string} checkIn YYYY-MM-DD
 * @returns {string} next day at 11:59 (local) formatted as YYYY-MM-DD 11:59
 */
function computeCheckoutNextDay(checkIn) {
  try {
    const [y, m, d] = checkIn.split('-').map((x) => Number(x));
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + 1);
    dt.setHours(11, 59, 0, 0);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} 11:59`;
  } catch {
    return checkIn + ' 11:59';
  }
}

// Deep-link handler: open modal if ?restaurant=<id>
function handleQueryParam() {
  const params = new URLSearchParams(window.location.search);
  const rid = params.get('restaurant');
  if (rid && restaurants.some((r) => r.id === rid)) {
    // Defer until grid renders
    setTimeout(() => openModal(rid), 50);
  }
}

// Init
function init() {
  // Footer year
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = String(new Date().getFullYear());

  renderRestaurants();
  renderChart();
  renderBookings();
  handleQueryParam();
}

document.addEventListener('DOMContentLoaded', init);