/**
 * Airtable bike catalog API client.
 *
 * Base:  appui8DPkWd2poZxy
 * Table: tblSDb5DQPpDmu3o2 (Bikes)
 *
 * Requires window.CATALOG_API_KEY to be set before any call.
 * In development, set it in config.js (git-ignored).
 */

const BASE_ID  = 'appui8DPkWd2poZxy';
const TABLE_ID = 'tblSDb5DQPpDmu3o2';
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

const PAGE_SIZE = 24;

// ─── Field name map (Airtable → data model) ──────────────────────────────────

function normalise(record) {
  const f = record.fields;
  return {
    id:               record.id,
    brand:            f['Brand']            ?? null,
    model:            f['Model']            ?? null,
    category:         f['Category']         ?? null,
    year:             f['Year']             ?? null,
    price_eur:        f['Price EUR']        ?? null,
    weight_g:         f['Weight g']         ?? null,
    frame_material:   f['Frame Material']   ?? null,
    groupset_brand:   f['Groupset Brand']   ?? null,
    groupset_level:   f['Groupset Level']   ?? null,
    brake_type:       f['Brake Type']       ?? null,
    wheel_size:       f['Wheel Size']       ?? null,
    tire_clearance_mm:f['Tire Clearance mm']?? null,
    suspension:       f['Suspension']       ?? null,
    travel_mm:        f['Travel mm']        ?? null,
    sizes_available:  f['Sizes Available']  ?? [],
    image_url:        f['Image URL']        ?? null,
    retailer_url:     f['Retailer URL']     ?? null,
  };
}

// ─── Filter params → Airtable filterByFormula ────────────────────────────────

function buildFormula(params) {
  const clauses = [];

  if (params.category)
    clauses.push(`{Category}="${params.category}"`);

  if (params.price_min != null)
    clauses.push(`{Price EUR}>=${params.price_min}`);

  if (params.price_max != null)
    clauses.push(`{Price EUR}<=${params.price_max}`);

  if (params.frame_material)
    clauses.push(`{Frame Material}="${params.frame_material}"`);

  if (params.groupset_brand)
    clauses.push(`{Groupset Brand}="${params.groupset_brand}"`);

  if (params.groupset_level)
    clauses.push(`{Groupset Level}="${params.groupset_level}"`);

  if (params.brake_type)
    clauses.push(`{Brake Type}="${params.brake_type}"`);

  if (params.suspension)
    clauses.push(`{Suspension}="${params.suspension}"`);

  if (params.travel_min != null)
    clauses.push(`{Travel mm}>=${params.travel_min}`);

  if (params.travel_max != null)
    clauses.push(`{Travel mm}<=${params.travel_max}`);

  if (params.wheel_size)
    clauses.push(`{Wheel Size}="${params.wheel_size}"`);

  if (params.q) {
    const q = params.q.replace(/"/g, '\\"');
    clauses.push(`OR(FIND(LOWER("${q}"),LOWER({Brand})),FIND(LOWER("${q}"),LOWER({Model})))`);
  }

  return clauses.length === 0 ? '' : `AND(${clauses.join(',')})`;
}

// ─── Sort param → Airtable sort array ────────────────────────────────────────

const SORT_MAP = {
  price_asc:  [{ field: 'Price EUR',  direction: 'asc'  }],
  price_desc: [{ field: 'Price EUR',  direction: 'desc' }],
  weight_asc: [{ field: 'Weight g',   direction: 'asc'  }],
  name_asc:   [{ field: 'Brand',      direction: 'asc'  }],
};

// ─── HTTP helper ─────────────────────────────────────────────────────────────

async function airtableFetch(url) {
  const key = window.CATALOG_API_KEY;
  if (!key) throw new Error('CATALOG_API_KEY is not set');

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Airtable error ${res.status}`);
  }

  return res.json();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filtered list of bikes.
 *
 * @param {object} params
 *   category, price_min, price_max, frame_material, groupset_brand,
 *   groupset_level, brake_type, suspension, travel_min, travel_max,
 *   wheel_size, q, page (1-based), per_page, sort
 * @returns {{ items: Bike[], total: number, page: number, per_page: number, offset: string|null }}
 */
export async function getBikes(params = {}) {
  const perPage = params.per_page ?? PAGE_SIZE;
  const url = new URL(BASE_URL);

  const formula = buildFormula(params);
  if (formula) url.searchParams.set('filterByFormula', formula);

  const sortKey = params.sort ?? 'price_asc';
  const sort = SORT_MAP[sortKey] ?? SORT_MAP.price_asc;
  sort.forEach((s, i) => {
    url.searchParams.set(`sort[${i}][field]`, s.field);
    url.searchParams.set(`sort[${i}][direction]`, s.direction);
  });

  url.searchParams.set('pageSize', perPage);
  if (params._offset) url.searchParams.set('offset', params._offset);

  const data = await airtableFetch(url.toString());

  return {
    items:    (data.records ?? []).map(normalise),
    total:    null,          // Airtable does not return total count
    page:     params.page ?? 1,
    per_page: perPage,
    offset:   data.offset ?? null,   // pass back as _offset for next page
  };
}

/**
 * Fetch a single bike by Airtable record ID.
 * @param {string} id
 * @returns {Bike}
 */
export async function getBikeById(id) {
  const data = await airtableFetch(`${BASE_URL}/${id}`);
  return normalise(data);
}

/**
 * Fetch valid filter option values.
 * Derived client-side from the table schema — no extra API call needed
 * because the select choices are fixed at table-creation time.
 */
export function getFilterOptions() {
  return {
    categories:      ['road', 'gravel', 'mtb'],
    frame_materials: ['carbon', 'aluminum', 'steel', 'titanium'],
    brake_types:     ['hydraulic-disc', 'mechanical-disc', 'rim'],
    wheel_sizes:     ['700c', '26', '27.5', '29'],
    groupset_levels: {
      shimano:     ['claris', 'sora', 'tiagra', '105', 'ultegra', 'dura-ace', 'grx', 'deore', 'xt', 'xtr'],
      sram:        ['apex', 'rival', 'force', 'red', 'nx-eagle', 'gx-eagle', 'x01-eagle', 'xx1-eagle'],
      campagnolo:  ['centaur', 'potenza', 'chorus', 'record', 'super-record'],
    },
  };
}
