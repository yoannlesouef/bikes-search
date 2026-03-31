# Feature: Dynamic Technical Filters

## User story
As an **informed shopper**, I want technical filters that adapt to the bike category I selected so that I only see relevant options and can narrow results precisely without wading through irrelevant criteria.

## Acceptance criteria
- [ ] Filters panel is visible on `results.html` as a left sidebar (desktop) or a collapsible drawer (mobile, ≤768px)
- [ ] Filter state is synced to URL query params in real time (so the URL is shareable/bookmarkable)
- [ ] The following filters are always visible regardless of category:
  - Frame material: multi-select chips — Carbon, Aluminum, Steel, Titanium (each with a one-line tooltip)
  - Braking system: multi-select chips — Hydraulic disc, Mechanical disc, Rim
  - Price range: dual-handle slider (min/max), €0–€15 000
- [ ] When category = `road` or `endurance`:
  - Groupset brand: Shimano, SRAM, Campagnolo (radio)
  - Groupset level: dropdown populated from `/filters/options` for selected brand
  - Wheel size: 700c only (hidden, not shown as a filter)
- [ ] When category = `gravel`:
  - Groupset brand: Shimano (GRX), SRAM (Apex/Rival/Force) — same as road
  - Groupset level: same as road
  - Tire clearance: slider (min value only), 28mm–55mm
- [ ] When category = `mtb`:
  - Suspension type: Hardtail / Full-suspension (radio)
  - Suspension travel: slider (min/max), 80mm–200mm — only visible when suspension type is selected
  - Wheel size: 26" / 27.5" / 29" (multi-select)
- [ ] Each filter label has an accessible tooltip (`?` icon) with a plain-language explanation of what the filter means
- [ ] An "Active filters" summary bar shows applied filters as removable tags above the results
- [ ] A "Clear all filters" button resets to the wizard's pre-filtered state (not a full reset)
- [ ] Filter options are loaded from `GET /filters/options` on page load; filters disable while loading
- [ ] Result count updates live as filters change (debounce 300ms to avoid excessive fetches)

## Technical notes
- Filter logic lives in `js/filters.js`
- Filter values are read from and written to `URLSearchParams` — the page re-reads params on load
- Conditional filter visibility is driven by the `category` param — no server-side logic needed
- Tooltip copy lives in `js/copy.js` keyed by filter name
- Multi-select chip state: selected = filled, unselected = outlined; active class toggled in JS

## Edge cases
- A filter combination returns 0 results: show an empty state with "No bikes match — try relaxing a filter" and a quick-clear suggestion
- Browser back button: URL change re-reads params and re-renders filters without a full page reload (use `popstate` event)
- Groupset level dropdown must clear when groupset brand changes

## Out of scope
- Saving filter presets
- Sorting by geometry metrics (only price, weight, name)
- Free-text search within the filters panel (search is a separate top-bar input)
