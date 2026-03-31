/**
 * Comparator — manages selection state and renders compare.html table.
 */

const MAX = 3;
const STORAGE_KEY = 'bs_compare_ids';

// In-memory set of selected bike IDs (used on results.html)
let selected = new Set();

// ─── Tray (results.html) ──────────────────────────────────────────────────

export function initTray(bikes) {
  // bikes = Map<id, bike> — passed in by results.js after fetch
  const tray = document.getElementById('compare-tray');
  if (!tray) return;

  function renderTray() {
    const thumbsEl   = tray.querySelector('.compare-tray__bikes');
    const countEl    = tray.querySelector('.compare-tray__count');
    const btnCompare = tray.querySelector('.compare-tray__btn');

    // Build up to 3 slots
    let html = '';
    const ids = [...selected];
    for (let i = 0; i < MAX; i++) {
      const id = ids[i];
      if (id) {
        const b = bikes.get(id);
        const imgSrc = b?.image_url || '';
        html += `
          <div class="compare-tray__thumb">
            ${imgSrc ? `<img src="${imgSrc}" alt="${b.brand} ${b.model}" loading="lazy">` : ''}
            <button class="compare-tray__thumb-remove" data-id="${id}" title="Remove" aria-label="Remove ${b?.model}">×</button>
          </div>`;
      } else {
        html += `<div class="compare-tray__slot">+</div>`;
      }
    }
    thumbsEl.innerHTML = html;
    countEl.textContent = `Compare (${selected.size})`;
    btnCompare.disabled = selected.size < 2;
    tray.classList.toggle('visible', selected.size > 0);

    thumbsEl.querySelectorAll('.compare-tray__thumb-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        removeFromCompare(btn.dataset.id);
      });
    });
  }

  tray.querySelector('.compare-tray__btn')?.addEventListener('click', () => {
    if (selected.size >= 2) {
      window.location.href = `compare.html?ids=${[...selected].join(',')}`;
    }
  });

  // Expose renderTray so results.js can call it
  window.__renderTray = renderTray;
  renderTray();
}

export function addToCompare(id) {
  if (selected.size >= MAX) {
    showToast('You can compare up to 3 bikes at a time');
    return false;
  }
  selected.add(id);
  window.__renderTray?.();
  return true;
}

export function removeFromCompare(id) {
  selected.delete(id);
  // Uncheck the card checkbox
  const cb = document.querySelector(`.bike-card__compare[data-id="${id}"]`);
  if (cb) cb.checked = false;
  window.__renderTray?.();
}

export function isSelected(id) { return selected.has(id); }

// ─── Toast helper ─────────────────────────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── Compare page (compare.html) ─────────────────────────────────────────

export async function initComparePage() {
  const params = new URLSearchParams(location.search);
  const ids    = params.get('ids')?.split(',').filter(Boolean) ?? [];
  const root   = document.getElementById('compare-root');
  if (!root) return;

  if (ids.length < 2) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⚖️</div>
        <h3>Select at least 2 bikes to compare</h3>
        <p>Go back to results and choose 2 or 3 bikes using the compare checkbox.</p>
        <a href="results.html" class="btn btn-primary">← Back to results</a>
      </div>`;
    return;
  }

  root.innerHTML = '<p class="loading-msg">Loading bikes…</p>';

  const { getBikeById } = await import('./api.js');
  const results = await Promise.allSettled(ids.map(id => getBikeById(id)));
  const bikes   = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
  const failed  = results.filter(r => r.status === 'rejected').length;

  if (bikes.length < 2) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⚠️</div>
        <h3>Could not load bikes</h3>
        <p>Please go back and try again.</p>
        <a href="results.html" class="btn btn-primary">← Back to results</a>
      </div>`;
    return;
  }

  if (failed > 0) {
    root.insertAdjacentHTML('beforebegin',
      `<div class="alert-warning">⚠️ ${failed} bike(s) could not be loaded.</div>`);
  }

  document.title = `Comparing: ${bikes.map(b => b.model).join(' vs ')} — Bike Search`;
  document.querySelector('.compare-heading')?.textContent
    && (document.querySelector('.compare-heading').textContent =
        `Comparing: ${bikes.map(b => b.model).join(' vs ')}`);

  const hasMTB = bikes.some(b => b.category === 'mtb');
  const hasSus = bikes.some(b => b.suspension);

  const ROWS = [
    { key: 'image',          label: '',                  render: b => `<img src="${b.image_url||''}" alt="${b.brand} ${b.model}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--r-md)" onerror="this.style.display='none'">` },
    { key: 'brand_model',    label: 'Model',             render: b => `<strong>${b.brand}</strong><br>${b.model}` },
    { key: 'price_eur',      label: 'Price',             render: b => b.price_eur ? `€${b.price_eur.toLocaleString('fr-FR')}` : '—', compare: true },
    { key: 'category',       label: 'Category',          render: b => b.category ? `<span class="badge badge-${b.category}">${b.category}</span>` : '—' },
    { key: 'frame_material', label: 'Frame Material',    render: b => b.frame_material || '—', compare: true },
    { key: 'weight_g',       label: 'Weight',            render: b => b.weight_g ? `${(b.weight_g/1000).toFixed(1)} kg` : 'N/A', compare: true },
    { key: 'groupset',       label: 'Groupset',          render: b => b.groupset_brand ? `${cap(b.groupset_brand)} ${b.groupset_level||''}` : '—' },
    { key: 'brake_type',     label: 'Braking',           render: b => b.brake_type || '—', compare: true },
    { key: 'wheel_size',     label: 'Wheel Size',        render: b => b.wheel_size || '—' },
    { key: 'tire_clearance', label: 'Max Tyre Width',    render: b => b.tire_clearance_mm ? `${b.tire_clearance_mm} mm` : '—' },
    ...(hasMTB ? [
      { key: 'suspension',   label: 'Suspension',        render: b => b.suspension || '—', compare: true },
    ] : []),
    ...(hasSus ? [
      { key: 'travel_mm',    label: 'Travel',            render: b => b.travel_mm ? `${b.travel_mm} mm` : '—', compare: true },
    ] : []),
    { key: 'sizes',          label: 'Sizes Available',   render: b => (b.sizes_available||[]).join(', ') || '—' },
  ];

  // Determine which rows have all-same values
  function allSame(row) {
    const vals = bikes.map(b => {
      if (row.key === 'price_eur') return b.price_eur;
      if (row.key === 'weight_g')  return b.weight_g;
      if (row.key === 'groupset')  return `${b.groupset_brand}${b.groupset_level}`;
      if (row.key === 'brand_model' || row.key === 'image') return null;
      return b[row.key];
    });
    const defined = vals.filter(v => v != null);
    return defined.length > 0 && defined.every(v => v === defined[0]);
  }

  let html = `<div class="compare-table-wrap"><table class="compare-table">`;

  // Header row (empty label cell + one col per bike)
  html += `<thead><tr><th class="compare-table__label-col"></th>`;
  bikes.forEach((b, i) => {
    html += `<th class="compare-table__bike-col">
      <button class="compare-col-remove" data-idx="${i}" title="Remove" aria-label="Remove ${b.model}">×</button>
    </th>`;
  });
  html += `</tr></thead><tbody>`;

  ROWS.forEach(row => {
    const same = row.compare && allSame(row);
    html += `<tr class="${same ? 'row-same' : (row.compare ? 'row-differs' : '')}">`;
    html += `<td class="compare-table__label">${row.label}</td>`;
    bikes.forEach(b => {
      html += `<td class="compare-table__cell">${row.render(b)}</td>`;
    });
    html += `</tr>`;
  });

  // CTA row
  html += `<tr><td></td>`;
  bikes.forEach(b => {
    html += `<td class="compare-table__cell"><a href="${b.retailer_url||'#'}" target="_blank" rel="noopener" class="btn btn-primary" style="width:100%">View bike →</a></td>`;
  });
  html += `</tr>`;

  html += `</tbody></table></div>`;
  root.innerHTML = html;

  // Remove-column buttons
  root.querySelectorAll('.compare-col-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const remaining = ids.filter((_, i) => i !== parseInt(btn.dataset.idx));
      if (remaining.length < 2) {
        root.innerHTML = `<div class="empty-state"><div class="empty-state__icon">⚖️</div><h3>Need at least 2 bikes to compare</h3><a href="results.html" class="btn btn-primary">← Back to results</a></div>`;
      } else {
        window.location.href = `compare.html?ids=${remaining.join(',')}`;
      }
    });
  });
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
