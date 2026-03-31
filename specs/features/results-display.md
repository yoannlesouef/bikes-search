# Feature: Results Display

## User story
As a **user who has completed the wizard or applied filters**, I want to see matching bikes presented clearly with key specs visible at a glance so that I can quickly evaluate options and shortlist models for comparison.

## Acceptance criteria
- [ ] Results are displayed as a responsive card grid on `results.html`: 3 columns (desktop ≥1024px), 2 columns (tablet), 1 column (mobile)
- [ ] Each card shows:
  - High-quality bike photo (16:9 crop, lazy-loaded)
  - Brand + model name (truncated to 2 lines max)
  - Price in EUR, prominently
  - Approximate weight (in kg, 1 decimal) — "N/A" if absent
  - Main groupset (brand + level, e.g. "Shimano Ultegra")
  - Category badge (Road / Gravel / MTB)
  - "Compare" checkbox — selecting adds the bike to the comparator tray (max 3)
- [ ] Sort bar above results: sort by Price ↑, Price ↓, Weight ↑, Name A–Z (default: Price ↑)
- [ ] Result count is shown: "142 bikes found" (or "14 bikes found" when filtered)
- [ ] A top-bar search input filters results by brand/model name (client-side, instant, no API call)
- [ ] Clicking a card (outside the Compare checkbox) opens a detail drawer/modal with:
  - Large photo
  - Full spec summary (all fields from the data model)
  - "View on retailer site" button (opens `retailer_url` in a new tab)
  - "Add to compare" button
- [ ] Comparator tray: a sticky bottom bar appears when ≥1 bike is selected for comparison, showing selected bike thumbnails and a "Compare (N)" button that navigates to `compare.html`
- [ ] If no results match, show an empty state: illustration, "No bikes found" heading, and "Clear all filters" CTA
- [ ] Initial load: show 24 bikes; a "Load more" button appends the next page (no infinite scroll)
- [ ] Images that fail to load show a neutral placeholder (grey bike silhouette SVG)

## Technical notes
- Rendering logic lives in `js/results.js`
- Card HTML is built via a `renderBikeCard(bike)` function returning a DOM node (no string innerHTML for card content — use `createElement`)
- Comparator selection state is stored in `js/comparator.js` (a module-level `Set` of bike IDs)
- The detail drawer is an accessible `<dialog>` element
- `results.html` reads wizard params from URL on load, pre-populates `js/filters.js`, and triggers the first fetch

## Edge cases
- User selects a 4th bike for comparison: show a toast "You can compare up to 3 bikes at a time" and do not add the 4th
- Slow network: show skeleton placeholder cards (CSS animation) during fetch
- Sort change while filters are active: re-sort the current in-memory result set (no new fetch if all results are loaded)

## Out of scope
- Infinite scroll (use pagination with "Load more")
- Favourites / wishlist
- Social sharing of individual cards
