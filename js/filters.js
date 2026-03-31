/**
 * Filter logic — reads/writes URLSearchParams, drives API calls.
 */

import { getFilterOptions } from './api.js';
import { COPY } from './copy.js';

let _onFilterChange = null;
const opts = getFilterOptions();

export function initFilters(onChange) {
  _onFilterChange = onChange;
  renderFilters();
  window.addEventListener('popstate', renderFilters);
}

export function getFilterParams() {
  const p = new URLSearchParams(location.search);
  const out = {};
  for (const [k, v] of p.entries()) {
    if (v) out[k] = v;
  }
  return out;
}

function setParam(key, value) {
  const p = new URLSearchParams(location.search);
  if (value == null || value === '') p.delete(key);
  else p.set(key, value);
  history.pushState({}, '', `?${p.toString()}`);
  _onFilterChange?.();
  renderActiveFilters();
}

function deleteParam(key) { setParam(key, null); }

// ─── Active filter tags ───────────────────────────────────────────────────

export function renderActiveFilters() {
  const bar = document.getElementById('active-filters');
  if (!bar) return;
  const p = new URLSearchParams(location.search);
  const SKIP = ['sort', 'q', '_offset'];
  const LABELS = {
    category: 'Category', price_max: 'Max price', price_min: 'Min price',
    frame_material: 'Material', groupset_brand: 'Brand', groupset_level: 'Groupset',
    brake_type: 'Braking', suspension: 'Suspension',
    travel_min: 'Travel min', travel_max: 'Travel max', wheel_size: 'Wheel size',
    priority: 'Priority',
  };
  const tags = [];
  for (const [k, v] of p.entries()) {
    if (SKIP.includes(k)) continue;
    const label = LABELS[k] || k;
    const display = k === 'price_max' || k === 'price_min'
      ? `€${parseInt(v).toLocaleString('fr-FR')}`
      : v;
    tags.push({ key: k, label: `${label}: ${display}` });
  }
  if (tags.length === 0) { bar.innerHTML = ''; return; }
  bar.innerHTML = tags.map(t => `
    <span class="active-filter-tag">
      ${t.label}
      <button data-key="${t.key}" aria-label="Remove filter ${t.label}">×</button>
    </span>`).join('') +
    `<button class="btn btn-ghost text-sm" id="btn-clear-all">Clear all</button>`;

  bar.querySelectorAll('[data-key]').forEach(btn => {
    btn.addEventListener('click', () => deleteParam(btn.dataset.key));
  });
  bar.querySelector('#btn-clear-all')?.addEventListener('click', clearAll);
}

function clearAll() {
  const p = new URLSearchParams(location.search);
  const keep = ['sort'];
  for (const k of [...p.keys()]) {
    if (!keep.includes(k)) p.delete(k);
  }
  history.pushState({}, '', `?${p.toString()}`);
  _onFilterChange?.();
  renderFilters();
  renderActiveFilters();
}

// ─── Filter panel render ──────────────────────────────────────────────────

function renderFilters() {
  const panel = document.getElementById('filter-panel');
  if (!panel) return;
  const p    = new URLSearchParams(location.search);
  const cat  = p.get('category');

  panel.innerHTML = `
    ${filterChips('Frame Material', 'frame_material', opts.frame_materials, p)}
    ${filterChips('Braking System', 'brake_type',     opts.brake_types,     p)}
    ${filterPrice(p)}
    ${cat === 'mtb' ? filterMTB(p) : ''}
    ${(cat === 'road' || cat === 'gravel') ? filterGroupset(p) : ''}
    ${cat === 'gravel' ? filterTireClearance(p) : ''}
    ${cat === 'mtb' ? filterWheelSize(p) : ''}
  `;

  bindChips(panel);
  bindPrice(panel, p);
  bindGroupset(panel, p);
  bindMTB(panel, p);
  bindTireClearance(panel, p);
}

// ─── Chips ────────────────────────────────────────────────────────────────

function filterChips(label, key, values, p) {
  const current = p.get(key) || '';
  const tip = COPY[key]?.tip || '';
  return `
    <div class="filter-group">
      <div class="filter-group__label">
        ${label}
        ${tip ? `<span class="tooltip-icon" data-tip="${tip}">?</span>` : ''}
      </div>
      <div class="filter-group__chips" data-filter="${key}">
        ${values.map(v => `
          <button class="chip ${current === v ? 'active' : ''}" data-value="${v}">
            ${v}
          </button>`).join('')}
      </div>
    </div>`;
}

function bindChips(panel) {
  panel.querySelectorAll('.filter-group__chips').forEach(group => {
    const key = group.dataset.filter;
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const p = new URLSearchParams(location.search);
        const current = p.get(key);
        setParam(key, current === chip.dataset.value ? null : chip.dataset.value);
        renderFilters();
      });
    });
  });
}

// ─── Price ────────────────────────────────────────────────────────────────

function filterPrice(p) {
  const max = parseInt(p.get('price_max') || 15000);
  return `
    <div class="filter-group">
      <div class="filter-group__label">Max Price</div>
      <div class="range-wrap">
        <input type="range" id="filter-price-max" min="500" max="15000" step="250" value="${max}">
        <div class="range-labels">
          <span>€500</span>
          <span id="filter-price-display">€${max.toLocaleString('fr-FR')}</span>
          <span>€15 000+</span>
        </div>
      </div>
    </div>`;
}

function bindPrice(panel, p) {
  const slider  = panel.querySelector('#filter-price-max');
  const display = panel.querySelector('#filter-price-display');
  if (!slider) return;
  let timer;
  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    display.textContent = `€${v.toLocaleString('fr-FR')}`;
    clearTimeout(timer);
    timer = setTimeout(() => {
      setParam('price_max', v === 15000 ? null : v);
    }, 300);
  });
}

// ─── Groupset ─────────────────────────────────────────────────────────────

function filterGroupset(p) {
  const brand   = p.get('groupset_brand') || '';
  const level   = p.get('groupset_level') || '';
  const levels  = brand ? (opts.groupset_levels[brand] || []) : [];
  return `
    <div class="filter-group">
      <div class="filter-group__label">Groupset Brand</div>
      <div class="filter-group__chips" data-filter="groupset_brand">
        ${Object.keys(opts.groupset_levels).map(b => `
          <button class="chip ${brand === b ? 'active' : ''}" data-value="${b}">${b}</button>`).join('')}
      </div>
    </div>
    ${brand ? `
    <div class="filter-group">
      <div class="filter-group__label">Groupset Level</div>
      <select class="filter-select" id="filter-groupset-level">
        <option value="">All levels</option>
        ${levels.map(l => `<option value="${l}" ${level === l ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>` : ''}`;
}

function bindGroupset(panel, p) {
  // Brand chips handled by bindChips
  const sel = panel.querySelector('#filter-groupset-level');
  sel?.addEventListener('change', () => {
    setParam('groupset_level', sel.value || null);
  });
}

// ─── MTB-specific ─────────────────────────────────────────────────────────

function filterMTB(p) {
  const sus  = p.get('suspension') || '';
  const tMin = p.get('travel_min') || 80;
  const tMax = p.get('travel_max') || 200;
  return `
    <div class="filter-group">
      <div class="filter-group__label">Suspension Type</div>
      <div class="filter-group__chips" data-filter="suspension">
        <button class="chip ${sus === 'hardtail' ? 'active' : ''}" data-value="hardtail">Hardtail</button>
        <button class="chip ${sus === 'full-suspension' ? 'active' : ''}" data-value="full-suspension">Full Suspension</button>
      </div>
    </div>
    ${sus ? `
    <div class="filter-group">
      <div class="filter-group__label">Suspension Travel</div>
      <div class="range-wrap">
        <input type="range" id="filter-travel-max" min="80" max="200" step="10" value="${tMax}">
        <div class="range-labels">
          <span>80 mm</span>
          <span id="filter-travel-display">${tMax} mm max</span>
          <span>200 mm</span>
        </div>
      </div>
    </div>` : ''}`;
}

function bindMTB(panel, p) {
  const tSlider  = panel.querySelector('#filter-travel-max');
  const tDisplay = panel.querySelector('#filter-travel-display');
  if (!tSlider) return;
  let timer;
  tSlider.addEventListener('input', () => {
    const v = parseInt(tSlider.value);
    tDisplay.textContent = `${v} mm max`;
    clearTimeout(timer);
    timer = setTimeout(() => setParam('travel_max', v === 200 ? null : v), 300);
  });
}

// ─── Gravel: tire clearance ───────────────────────────────────────────────

function filterTireClearance(p) {
  const min = p.get('tire_clearance_min') || 28;
  return `
    <div class="filter-group">
      <div class="filter-group__label">
        Min Tyre Width
        <span class="tooltip-icon" data-tip="${COPY.tire_clearance.tip}">?</span>
      </div>
      <div class="range-wrap">
        <input type="range" id="filter-tire-min" min="28" max="55" step="1" value="${min}">
        <div class="range-labels">
          <span>28 mm</span>
          <span id="filter-tire-display">${min} mm min</span>
          <span>55 mm</span>
        </div>
      </div>
    </div>`;
}

function bindTireClearance(panel, p) {
  const slider  = panel.querySelector('#filter-tire-min');
  const display = panel.querySelector('#filter-tire-display');
  if (!slider) return;
  let timer;
  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    display.textContent = `${v} mm min`;
    clearTimeout(timer);
    timer = setTimeout(() => setParam('tire_clearance_min', v === 28 ? null : v), 300);
  });
}

// ─── MTB wheel size ───────────────────────────────────────────────────────

function filterWheelSize(p) {
  const ws = p.get('wheel_size') || '';
  return `
    <div class="filter-group">
      <div class="filter-group__label">Wheel Size</div>
      <div class="filter-group__chips" data-filter="wheel_size">
        ${['26','27.5','29'].map(s => `
          <button class="chip ${ws === s ? 'active' : ''}" data-value="${s}">${s}"</button>`).join('')}
      </div>
    </div>`;
}
