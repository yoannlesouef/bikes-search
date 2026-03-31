/**
 * Bike catalog client — reads from data/bikes.json.
 *
 * The JSON file is the single source of truth for bike data.
 * To add or update bikes, edit data/bikes.json and commit.
 */

const DATA_URL  = './data/bikes.json';
const PAGE_SIZE = 24;

// Module-level cache: fetched once per session.
let _cache = null;

async function loadAll() {
  if (_cache) return _cache;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Failed to load bike data (HTTP ${res.status})`);
  _cache = await res.json();
  return _cache;
}

// ─── Filtering ────────────────────────────────────────────────────────────

function applyFilters(bikes, params) {
  return bikes.filter(b => {
    if (params.category       && b.category        !== params.category)        return false;
    if (params.frame_material && b.frame_material   !== params.frame_material) return false;
    if (params.groupset_brand && b.groupset_brand   !== params.groupset_brand) return false;
    if (params.brake_type     && b.brake_type       !== params.brake_type)     return false;
    if (params.suspension     && b.suspension       !== params.suspension)     return false;
    if (params.wheel_size     && b.wheel_size       !== params.wheel_size)     return false;

    if (params.groupset_level &&
        b.groupset_level?.toLowerCase() !== params.groupset_level.toLowerCase()) return false;

    if (params.price_min != null && b.price_eur < Number(params.price_min)) return false;
    if (params.price_max != null && b.price_eur > Number(params.price_max)) return false;

    if (params.travel_min != null && (b.travel_mm == null || b.travel_mm < Number(params.travel_min))) return false;
    if (params.travel_max != null && (b.travel_mm == null || b.travel_mm > Number(params.travel_max))) return false;

    if (params.tire_clearance_min != null &&
        (b.tire_clearance_mm == null || b.tire_clearance_mm < Number(params.tire_clearance_min))) return false;

    if (params.q) {
      const q = params.q.toLowerCase();
      if (!b.brand?.toLowerCase().includes(q) && !b.model?.toLowerCase().includes(q)) return false;
    }

    return true;
  });
}

// ─── Sorting ──────────────────────────────────────────────────────────────

function applySort(bikes, sort) {
  const copy = [...bikes];
  switch (sort) {
    case 'price_desc': return copy.sort((a, b) => (b.price_eur ?? 0) - (a.price_eur ?? 0));
    case 'weight_asc': return copy.sort((a, b) => (a.weight_g  ?? 0) - (b.weight_g  ?? 0));
    case 'name_asc':   return copy.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
    default:           return copy.sort((a, b) => (a.price_eur ?? 0) - (b.price_eur ?? 0)); // price_asc
  }
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Returns a filtered, sorted, paginated slice of bikes.
 *
 * @param {object} params  category, price_min, price_max, frame_material,
 *                         groupset_brand, groupset_level, brake_type,
 *                         suspension, travel_min, travel_max,
 *                         tire_clearance_min, wheel_size, q, sort,
 *                         page (1-based), per_page
 * @returns {{ items, total, page, per_page, offset }}
 */
export async function getBikes(params = {}) {
  const all      = await loadAll();
  const filtered = applyFilters(all, params);
  const sorted   = applySort(filtered, params.sort);

  const perPage = params.per_page ?? PAGE_SIZE;
  const page    = params.page    ?? 1;
  const start   = (page - 1) * perPage;
  const items   = sorted.slice(start, start + perPage);

  return {
    items,
    total:    filtered.length,
    page,
    per_page: perPage,
    offset:   start + items.length < filtered.length ? page + 1 : null,
  };
}

/**
 * Returns a single bike by id.
 * @param {string} id
 * @returns {object}
 */
export async function getBikeById(id) {
  const all  = await loadAll();
  const bike = all.find(b => b.id === id);
  if (!bike) throw new Error(`Bike not found: ${id}`);
  return bike;
}

/**
 * Returns valid filter option values derived from the catalog itself.
 */
export function getFilterOptions() {
  return {
    categories:      ['road', 'gravel', 'mtb'],
    frame_materials: ['carbon', 'aluminum', 'steel', 'titanium'],
    brake_types:     ['hydraulic-disc', 'mechanical-disc', 'rim'],
    wheel_sizes:     ['700c', '26', '27.5', '29'],
    groupset_levels: {
      shimano:    ['claris', 'sora', 'tiagra', '105', '105 Di2', 'ultegra', 'Ultegra Di2', 'dura-ace', 'GRX 600', 'GRX 820', 'deore', 'Deore', 'XT', 'XTR'],
      sram:       ['apex', 'rival', 'force', 'red', 'NX Eagle', 'GX Eagle', 'X01 Eagle', 'XX1 Eagle'],
      campagnolo: ['centaur', 'potenza', 'chorus', 'record', 'super-record'],
    },
  };
}
