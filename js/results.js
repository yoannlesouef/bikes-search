/**
 * Results page — fetch, render cards, detail drawer, comparator tray.
 */

import { getBikes }                      from './api.js';
import { initFilters, getFilterParams, renderActiveFilters } from './filters.js';
import { initTray, addToCompare, removeFromCompare, isSelected } from './comparator.js';

const bikeMap = new Map(); // id → bike
let   allBikes = [];
let   currentOffset = null;
let   loading = false;

export async function initResults() {
  renderActiveFilters();
  initFilters(onFilterChange);
  setupSearch();
  setupSort();
  await fetchAndRender(false);
  initTray(bikeMap);
}

// ─── Fetch ────────────────────────────────────────────────────────────────

async function fetchAndRender(append = false) {
  if (loading) return;
  loading = true;
  const grid = document.getElementById('results-grid');

  if (!append) {
    allBikes = [];
    bikeMap.clear();
    currentOffset = null;
    grid.innerHTML = renderSkeletons(6);
    document.getElementById('results-count').textContent = 'Loading…';
  }

  const params = getFilterParams();
  const q = document.getElementById('search-input')?.value.trim();
  if (q) params.q = q;
  if (currentOffset) params._offset = currentOffset;

  try {
    const res = await getBikes(params);
    res.items.forEach(b => { bikeMap.set(b.id, b); allBikes.push(b); });
    currentOffset = res.offset;

    if (!append) grid.innerHTML = '';
    res.items.forEach(b => grid.appendChild(renderCard(b)));

    if (allBikes.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state__icon">🚲</div>
          <h3>No bikes found</h3>
          <p>Try adjusting or clearing your filters.</p>
          <button class="btn btn-primary" onclick="location.href='results.html'">Clear all filters</button>
        </div>`;
    }

    document.getElementById('results-count').textContent =
      `${allBikes.length} bike${allBikes.length !== 1 ? 's' : ''} found`;

    const loadMore = document.getElementById('btn-load-more');
    if (loadMore) loadMore.style.display = currentOffset ? 'flex' : 'none';

  } catch (err) {
    grid.innerHTML = `<p class="error-msg" style="grid-column:1/-1">Failed to load bikes: ${err.message}</p>`;
  }
  loading = false;
}

function onFilterChange() {
  renderActiveFilters();
  fetchAndRender(false);
}

// ─── Skeletons ────────────────────────────────────────────────────────────

function renderSkeletons(n) {
  return Array.from({ length: n }, () => `
    <div class="bike-card" style="pointer-events:none">
      <div class="skeleton" style="aspect-ratio:16/9;border-radius:0"></div>
      <div style="padding:var(--sp-4);display:flex;flex-direction:column;gap:var(--sp-3)">
        <div class="skeleton" style="height:12px;width:40%"></div>
        <div class="skeleton" style="height:18px;width:80%"></div>
        <div class="skeleton" style="height:14px;width:60%"></div>
      </div>
    </div>`).join('');
}

// ─── Card ─────────────────────────────────────────────────────────────────

function renderCard(b) {
  const el = document.createElement('article');
  el.className = 'bike-card';
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `${b.brand} ${b.model}`);

  const weight  = b.weight_g ? `${(b.weight_g / 1000).toFixed(1)} kg` : 'N/A';
  const groupset = b.groupset_brand
    ? `${cap(b.groupset_brand)} ${b.groupset_level || ''}`.trim()
    : '—';

  el.innerHTML = `
    <div class="bike-card__image-wrap">
      ${b.category ? `<span class="bike-card__badge"><span class="badge badge-${b.category}">${b.category}</span></span>` : ''}
      ${b.image_url
        ? `<img src="${b.image_url}" alt="${b.brand} ${b.model}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=bike-card__img-placeholder>🚲</div>'">`
        : `<div class="bike-card__img-placeholder">🚲</div>`
      }
      <input type="checkbox" class="bike-card__compare" data-id="${b.id}"
        title="Add to compare" aria-label="Add ${b.model} to compare"
        ${isSelected(b.id) ? 'checked' : ''}>
    </div>
    <div class="bike-card__body">
      <div class="bike-card__brand">${b.brand || ''}</div>
      <div class="bike-card__model">${b.model || ''}</div>
      <div class="bike-card__price">${b.price_eur ? `€${b.price_eur.toLocaleString('fr-FR')}` : '—'}</div>
      <div class="bike-card__specs">
        <div class="bike-card__spec">
          <span class="bike-card__spec-label">Weight</span>
          <span class="bike-card__spec-value">${weight}</span>
        </div>
        <div class="bike-card__spec">
          <span class="bike-card__spec-label">Groupset</span>
          <span class="bike-card__spec-value" style="font-size:var(--fs-sm)">${groupset}</span>
        </div>
      </div>
    </div>`;

  // Compare checkbox
  const cb = el.querySelector('.bike-card__compare');
  cb.addEventListener('click', e => {
    e.stopPropagation();
    if (cb.checked) {
      const ok = addToCompare(b.id);
      if (!ok) cb.checked = false;
    } else {
      removeFromCompare(b.id);
    }
  });

  // Card click → detail drawer
  el.addEventListener('click', () => openDrawer(b));
  el.addEventListener('keydown', e => { if (e.key === 'Enter') openDrawer(b); });

  return el;
}

// ─── Detail drawer ────────────────────────────────────────────────────────

function openDrawer(b) {
  const dialog = document.getElementById('detail-dialog');
  if (!dialog) return;

  const weight  = b.weight_g ? `${(b.weight_g / 1000).toFixed(1)} kg` : 'N/A';
  const groupset = b.groupset_brand
    ? `${cap(b.groupset_brand)} ${b.groupset_level || ''}`.trim()
    : '—';

  const rows = [
    ['Category',       b.category ? `<span class="badge badge-${b.category}">${b.category}</span>` : '—'],
    ['Price',          b.price_eur ? `€${b.price_eur.toLocaleString('fr-FR')}` : '—'],
    ['Weight',         weight],
    ['Frame',          b.frame_material || '—'],
    ['Groupset',       groupset],
    ['Braking',        b.brake_type || '—'],
    ['Wheel Size',     b.wheel_size || '—'],
    ['Tyre Clearance', b.tire_clearance_mm ? `${b.tire_clearance_mm} mm` : '—'],
    ...(b.suspension ? [['Suspension', b.suspension]] : []),
    ...(b.travel_mm  ? [['Travel',     `${b.travel_mm} mm`]] : []),
    ['Sizes',          (b.sizes_available||[]).join(', ') || '—'],
  ];

  dialog.querySelector('.modal__body').innerHTML = `
    ${b.image_url ? `<img src="${b.image_url}" alt="${b.brand} ${b.model}" style="width:100%;border-radius:var(--r-md);margin-bottom:var(--sp-5);aspect-ratio:16/9;object-fit:cover">` : ''}
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:var(--sp-4);margin-bottom:var(--sp-5)">
      <div>
        <div style="font-size:var(--fs-xs);color:var(--c-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${b.brand||''}</div>
        <h2 style="font-size:var(--fs-xl)">${b.model||''}</h2>
      </div>
      <div style="font-size:var(--fs-2xl);font-weight:var(--fw-bold);white-space:nowrap">${b.price_eur ? `€${b.price_eur.toLocaleString('fr-FR')}` : ''}</div>
    </div>
    <table class="spec-table" style="width:100%;border-collapse:collapse;font-size:var(--fs-sm)">
      ${rows.map(([l, v]) => `
        <tr style="border-bottom:1px solid var(--c-border)">
          <td style="padding:var(--sp-3) 0;color:var(--c-muted);width:45%">${l}</td>
          <td style="padding:var(--sp-3) 0;font-weight:var(--fw-medium)">${v}</td>
        </tr>`).join('')}
    </table>
    <div style="margin-top:var(--sp-6);display:flex;gap:var(--sp-3)">
      ${b.retailer_url ? `<a href="${b.retailer_url}" target="_blank" rel="noopener" class="btn btn-primary btn-lg" style="flex:1;justify-content:center">View on retailer site →</a>` : ''}
      <button class="btn btn-secondary btn-lg" id="drawer-compare-btn" style="flex:1">
        ${isSelected(b.id) ? '✓ In compare' : '+ Add to compare'}
      </button>
    </div>`;

  dialog.querySelector('.modal__header h3').textContent = `${b.brand} ${b.model}`;

  dialog.querySelector('#drawer-compare-btn')?.addEventListener('click', () => {
    if (!isSelected(b.id)) {
      const ok = addToCompare(b.id);
      if (ok) {
        const cb = document.querySelector(`.bike-card__compare[data-id="${b.id}"]`);
        if (cb) cb.checked = true;
      }
    }
    dialog.close();
  });

  dialog.showModal();
}

// ─── Search ───────────────────────────────────────────────────────────────

function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => fetchAndRender(false), 350);
  });
}

// ─── Sort ─────────────────────────────────────────────────────────────────

function setupSort() {
  const sel = document.getElementById('sort-select');
  if (!sel) return;
  const p = new URLSearchParams(location.search);
  sel.value = p.get('sort') || 'price_asc';
  sel.addEventListener('change', () => {
    const p2 = new URLSearchParams(location.search);
    p2.set('sort', sel.value);
    history.pushState({}, '', `?${p2.toString()}`);
    fetchAndRender(false);
  });
}

// ─── Load more ────────────────────────────────────────────────────────────

export function setupLoadMore() {
  const btn = document.getElementById('btn-load-more');
  btn?.addEventListener('click', () => fetchAndRender(true));
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
