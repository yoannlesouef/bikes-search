# Data API — Bike Catalog

All data access goes through `js/api.js`. Page scripts never read `data/bikes.json` directly.

## Data source
`data/bikes.json` — a flat JSON array of bike objects committed to the repository.

To add, edit, or remove bikes: edit `data/bikes.json` and commit. The site redeploys automatically via GitHub Actions.

---

## Public functions in `js/api.js`

### `getBikes(params)`
Loads the full catalog (cached after first fetch), applies filters and sort in memory, returns a paginated slice.

**Params**
| Param | Type | Description |
|-------|------|-------------|
| category | string | `road` \| `gravel` \| `mtb` |
| price_min | number | Min price EUR |
| price_max | number | Max price EUR |
| frame_material | string | `carbon` \| `aluminum` \| `steel` \| `titanium` |
| groupset_brand | string | `shimano` \| `sram` \| `campagnolo` |
| groupset_level | string | e.g. `105`, `GRX 820`, `GX Eagle` |
| brake_type | string | `hydraulic-disc` \| `mechanical-disc` \| `rim` |
| suspension | string | `hardtail` \| `full-suspension` |
| travel_min | number | Min suspension travel mm |
| travel_max | number | Max suspension travel mm |
| tire_clearance_min | number | Min tyre clearance mm |
| wheel_size | string | e.g. `700c`, `29` |
| q | string | Full-text search on brand + model |
| sort | string | `price_asc` \| `price_desc` \| `weight_asc` \| `name_asc` |
| page | number | 1-based page (default: 1) |
| per_page | number | Items per page (default: 24) |

**Returns**
```js
{ items: Bike[], total: number, page: number, per_page: number, offset: number|null }
```

---

### `getBikeById(id)`
Returns a single bike by its `id` field. Used by the comparator.

---

### `getFilterOptions()`
Returns hardcoded valid filter values (no network call). Used to populate filter dropdowns.

---

## `data/bikes.json` format
Array of bike objects. Each object must match the fields in `specs/data-model.md`.

```json
[
  {
    "id": "1",
    "brand": "Specialized",
    "model": "Tarmac SL8 Expert",
    "category": "road",
    "year": 2025,
    "price_eur": 5500,
    "weight_g": 7200,
    "frame_material": "carbon",
    "groupset_brand": "shimano",
    "groupset_level": "Ultegra Di2",
    "brake_type": "hydraulic-disc",
    "wheel_size": "700c",
    "tire_clearance_mm": 33,
    "suspension": null,
    "travel_mm": null,
    "sizes_available": ["XS", "S", "M", "L", "XL"],
    "image_url": "",
    "retailer_url": "https://www.specialized.com"
  }
]
```

### Rules for editing `data/bikes.json`
- `id` must be unique (use an incrementing integer as a string)
- `category` must be exactly `road`, `gravel`, or `mtb`
- `suspension` and `travel_mm` are `null` for road and gravel bikes
- `image_url` can be left as `""` — a placeholder is shown in the UI
- Validate JSON before committing (e.g. paste into jsonlint.com)
