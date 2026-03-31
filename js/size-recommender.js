/**
 * Frame size recommender — modal, pure client-side calculation.
 */

const SIZE_MAP = [
  { max: 48, size: 'XS' },
  { max: 52, size: 'S'  },
  { max: 56, size: 'M'  },
  { max: 60, size: 'L'  },
  { max: Infinity, size: 'XL' },
];

const FACTORS = { road: 0.67, gravel: 0.67, mtb: 0.57 };

export function calcSize(inseam_cm, category) {
  const factor = FACTORS[category] ?? 0.67;
  const frameCm = inseam_cm * factor;
  return SIZE_MAP.find(s => frameCm <= s.max)?.size ?? 'XL';
}

export function initSizeRecommender() {
  const dialog = document.getElementById('size-dialog');
  if (!dialog) return;

  // Open from any element with data-open-size + data-bike-id
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-size]');
    if (!trigger) return;
    const bikeId = trigger.dataset.bikeId;
    // bike passed via data attribute as JSON or looked up externally
    const bike = window.__bikeMap?.get(bikeId);
    openModal(dialog, bike);
  });
}

function openModal(dialog, bike) {
  const body = dialog.querySelector('.size-modal-body');
  body.innerHTML = `
    <div class="size-form">
      <div class="size-field">
        <label for="height-input">Height</label>
        <div class="size-input-wrap">
          <input type="number" id="height-input" min="140" max="220" placeholder="175" class="size-input">
          <span class="size-unit" id="height-unit">cm</span>
        </div>
        <span class="size-error" id="height-error"></span>
      </div>
      <div class="size-field">
        <label for="inseam-input">Inseam <span style="color:var(--c-muted);font-weight:400">(optional but more accurate)</span></label>
        <div class="size-input-wrap">
          <input type="number" id="inseam-input" min="60" max="110" placeholder="82" class="size-input">
          <span class="size-unit" id="inseam-unit">cm</span>
        </div>
        <span class="size-error" id="inseam-error"></span>
      </div>
      <div class="size-unit-toggle">
        <label><input type="radio" name="unit" value="cm" checked> cm</label>
        <label><input type="radio" name="unit" value="in"> inches</label>
      </div>
      <button class="btn btn-primary" id="btn-calc" style="width:100%" disabled>Calculate my size</button>
      <div id="size-result" style="display:none"></div>
    </div>`;

  const heightInput = body.querySelector('#height-input');
  const inseamInput = body.querySelector('#inseam-input');
  const calcBtn     = body.querySelector('#btn-calc');
  const resultEl    = body.querySelector('#size-result');
  let unit = 'cm';

  body.querySelectorAll('input[name=unit]').forEach(r => {
    r.addEventListener('change', () => {
      unit = r.value;
      if (unit === 'in') {
        heightInput.min = 55; heightInput.max = 87; heightInput.placeholder = '69';
        inseamInput.min = 24; inseamInput.max = 44; inseamInput.placeholder = '32';
        body.querySelectorAll('.size-unit').forEach(s => s.textContent = 'in');
      } else {
        heightInput.min = 140; heightInput.max = 220; heightInput.placeholder = '175';
        inseamInput.min = 60;  inseamInput.max = 110; inseamInput.placeholder = '82';
        body.querySelectorAll('.size-unit').forEach(s => s.textContent = 'cm');
      }
      validate();
    });
  });

  function toCm(v) {
    return unit === 'in' ? Math.round(v * 2.54) : v;
  }

  function validate() {
    const h = parseFloat(heightInput.value);
    const ok = !isNaN(h) && h >= parseFloat(heightInput.min) && h <= parseFloat(heightInput.max);
    calcBtn.disabled = !ok;
    return ok;
  }

  heightInput.addEventListener('input', validate);
  inseamInput.addEventListener('input', validate);

  calcBtn.addEventListener('click', () => {
    if (!validate()) return;
    const heightCm = toCm(parseFloat(heightInput.value));
    const inseamVal = parseFloat(inseamInput.value);
    const inseamCm  = !isNaN(inseamVal) ? toCm(inseamVal) : null;

    let recommended, note = '';
    if (inseamCm) {
      recommended = calcSize(inseamCm, bike?.category ?? 'road');
    } else {
      // Fallback: rough height-based estimate (inseam ≈ height × 0.47)
      const estimatedInseam = Math.round(heightCm * 0.47);
      recommended = calcSize(estimatedInseam, bike?.category ?? 'road');
      note = '<p style="font-size:var(--fs-sm);color:var(--c-muted);margin-top:var(--sp-2)">Add your inseam for a more precise recommendation.</p>';
    }

    const available = bike?.sizes_available ?? [];
    const hasSize = available.length === 0 || available.includes(recommended);
    const closest = !hasSize && available.length
      ? findClosest(recommended, available)
      : null;

    resultEl.style.display = 'block';
    if (available.length === 0) {
      resultEl.innerHTML = `<div class="size-result-box warning">Size data not available for this model.</div>`;
    } else if (hasSize) {
      resultEl.innerHTML = `
        <div class="size-result-box success">
          Your recommended size: <strong>${recommended}</strong>
          ${note}
          <div class="size-chips">
            ${available.map(s => `<span class="chip ${s === recommended ? 'active' : ''}">${s}</span>`).join('')}
          </div>
        </div>`;
    } else {
      resultEl.innerHTML = `
        <div class="size-result-box warning">
          Size <strong>${recommended}</strong> is not available for this model.
          Closest available: <strong>${closest}</strong>
          ${note}
          <div class="size-chips">
            ${available.map(s => `<span class="chip ${s === closest ? 'active' : ''}">${s}</span>`).join('')}
          </div>
        </div>`;
    }
  });

  dialog.querySelector('.modal__header h3').textContent = bike
    ? `Find your size — ${bike.brand} ${bike.model}`
    : 'Find your size';

  dialog.showModal();
}

function findClosest(target, available) {
  const ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const ti = ORDER.indexOf(target);
  let best = available[0], bestDist = Infinity;
  available.forEach(s => {
    const d = Math.abs(ORDER.indexOf(s) - ti);
    if (d < bestDist) { bestDist = d; best = s; }
  });
  return best;
}
