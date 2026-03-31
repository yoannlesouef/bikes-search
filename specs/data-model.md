# Data Model — Bike Catalog

The data model describes the shape of bike objects returned by the SaaS catalog API and used throughout the frontend. This is a read-only model — the frontend never writes.

## Entities

### Bike
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | yes | Stable unique identifier |
| brand | string | yes | Manufacturer name (e.g. "Specialized", "Trek") |
| model | string | yes | Model name (e.g. "Tarmac SL8 Expert") |
| category | enum | yes | `road` \| `gravel` \| `mtb` |
| year | number | yes | Model year |
| price_eur | number | yes | Retail price in EUR |
| weight_g | number | no | Claimed weight in grams (size M or as stated) |
| frame_material | enum | yes | `carbon` \| `aluminum` \| `steel` \| `titanium` |
| groupset_brand | enum | yes | `shimano` \| `sram` \| `campagnolo` \| `mixed` |
| groupset_level | string | yes | Level within brand (e.g. "105", "GX Eagle") |
| brake_type | enum | yes | `hydraulic-disc` \| `mechanical-disc` \| `rim` |
| wheel_size | string | yes | e.g. `700c`, `29`, `27.5` |
| tire_clearance_mm | number | no | Max tire width in mm |
| suspension | enum | no | `hardtail` \| `full-suspension` — null for road/gravel |
| travel_mm | number | no | Suspension travel in mm — null if no suspension |
| sizes_available | string[] | yes | Available frame sizes (e.g. `["XS","S","M","L","XL"]`) |
| geometry | object | no | Stack/reach per size — see shape below |
| image_url | string | yes | High-res product photo URL |
| retailer_url | string | yes | Link to buy / more info |
| updated_at | ISO 8601 | yes | Last catalog update timestamp |

### Geometry (nested in Bike)
```
geometry: {
  stack_mm: { [size: string]: number },  // e.g. { "S": 530, "M": 545 }
  reach_mm: { [size: string]: number }
}
```

## Relationships
The catalog is flat — bikes are standalone entities with no relational links. Category is the primary grouping key for conditional filter logic.

## Notes
- `weight_g` may be absent for some models; the UI must degrade gracefully (show "N/A").
- `geometry` is only used by the frame size recommender feature.
- `groupset_level` values are free strings normalized by the catalog team — the `/filters/options` endpoint provides the valid set.
- The frontend caches the full result set in memory for the session; no local storage persistence is required.

## Wizard Profile (in-memory, never persisted)
The guided wizard builds a transient profile used to pre-populate filters:

| Field | Type | Description |
|-------|------|-------------|
| use_case | enum | `speed` \| `endurance` \| `gravel` \| `mtb` |
| level | enum | `occasional` \| `regular` \| `competitor` |
| budget_max | number | Max budget in EUR |
| priority | enum | `performance` \| `durability` \| `comfort` |

This maps to API filter params as follows:
- `use_case` → `category`
- `budget_max` → `price_max`
- `level = competitor` → biases toward higher groupset levels (client-side sort/weight, not an API param)
