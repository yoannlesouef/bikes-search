# API Spec — Airtable Bike Catalog

All requests are made exclusively through `js/api.js`. Page scripts never call `fetch()` directly.

## Airtable coordinates
| Key | Value |
|-----|-------|
| Base ID | `appui8DPkWd2poZxy` |
| Table ID | `tblSDb5DQPpDmu3o2` |
| Table name | `Bikes` |
| Airtable REST base URL | `https://api.airtable.com/v0/appui8DPkWd2poZxy/tblSDb5DQPpDmu3o2` |

## Authentication
Requests include:
```
Authorization: Bearer <CATALOG_API_KEY>
```
`CATALOG_API_KEY` is set as `window.CATALOG_API_KEY` — injected at deploy time, never committed.
For local dev: copy `config.example.js` → `config.js` and add your personal access token.

---

## Public functions in `js/api.js`

### `getBikes(params)`
Fetches a filtered, sorted, paginated list of bikes.

**Params**
| Param | Type | Description |
|-------|------|-------------|
| category | string | `road` \| `gravel` \| `mtb` |
| price_min | number | Min price EUR |
| price_max | number | Max price EUR |
| frame_material | string | `carbon` \| `aluminum` \| `steel` \| `titanium` |
| groupset_brand | string | `shimano` \| `sram` \| `campagnolo` |
| groupset_level | string | e.g. `105`, `grx`, `gx-eagle` |
| brake_type | string | `hydraulic-disc` \| `mechanical-disc` \| `rim` |
| suspension | string | `hardtail` \| `full-suspension` |
| travel_min | number | Min suspension travel mm |
| travel_max | number | Max suspension travel mm |
| wheel_size | string | e.g. `700c`, `29` |
| q | string | Full-text search on Brand + Model |
| page | number | 1-based page number |
| per_page | number | Default 24, max 100 |
| sort | string | `price_asc` \| `price_desc` \| `weight_asc` \| `name_asc` |
| _offset | string | Airtable pagination cursor (from previous response) |

**Returns**
```js
{
  items:    Bike[],      // normalised bike objects
  total:    null,        // Airtable does not expose total count
  page:     number,
  per_page: number,
  offset:   string|null  // pass as _offset to fetch next page
}
```

**How filters map to Airtable**
Params are translated to an Airtable `filterByFormula` using `AND(...)` clauses, e.g.:
```
AND({Category}="road",{Price EUR}<=3000,{Frame Material}="carbon")
```

---

### `getBikeById(id)`
Fetches a single bike record by Airtable record ID (used by the comparator).

**Returns**: single `Bike` object.

---

### `getFilterOptions()`
Returns valid filter values — derived from the fixed table schema (no network call).

**Returns**
```js
{
  categories:      ['road', 'gravel', 'mtb'],
  frame_materials: ['carbon', 'aluminum', 'steel', 'titanium'],
  brake_types:     ['hydraulic-disc', 'mechanical-disc', 'rim'],
  wheel_sizes:     ['700c', '26', '27.5', '29'],
  groupset_levels: {
    shimano:    ['claris', 'sora', 'tiagra', '105', 'ultegra', 'dura-ace', 'grx', 'deore', 'xt', 'xtr'],
    sram:       ['apex', 'rival', 'force', 'red', 'nx-eagle', 'gx-eagle', 'x01-eagle', 'xx1-eagle'],
    campagnolo: ['centaur', 'potenza', 'chorus', 'record', 'super-record'],
  },
}
```

---

## Airtable field reference
| Data model field | Airtable field name | Type |
|-----------------|--------------------|----|
| id | (record.id) | Auto |
| brand | Brand | Single line text |
| model | Model | Single line text (primary) |
| category | Category | Single select |
| year | Year | Number |
| price_eur | Price EUR | Number |
| weight_g | Weight g | Number |
| frame_material | Frame Material | Single select |
| groupset_brand | Groupset Brand | Single select |
| groupset_level | Groupset Level | Single line text |
| brake_type | Brake Type | Single select |
| wheel_size | Wheel Size | Single line text |
| tire_clearance_mm | Tire Clearance mm | Number |
| suspension | Suspension | Single select |
| travel_mm | Travel mm | Number |
| sizes_available | Sizes Available | Multiple select |
| image_url | Image URL | URL |
| retailer_url | Retailer URL | URL |

## Error handling
`getBikes` and `getBikeById` throw a plain `Error` with a human-readable message on non-2xx responses. Callers should catch and display a user-facing error state.
