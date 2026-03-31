# Feature: Side-by-Side Comparator

## User story
As a **user who has shortlisted 2–3 bikes**, I want to see them in a structured side-by-side table so that I can immediately spot the differences in specs, geometry, and price and make a confident final decision.

## Acceptance criteria
- [ ] `compare.html` accepts bike IDs via URL query param: `?ids=uuid1,uuid2,uuid3`
- [ ] Fetches full bike objects for each ID via `GET /bikes/:id`
- [ ] Displays bikes as 2 or 3 columns in a comparison table (minimum 2 bikes required to render the table)
- [ ] If fewer than 2 IDs are in the URL, show an error state: "Select at least 2 bikes to compare" with a "Back to results" button
- [ ] Comparison table rows:
  - Photo (full-width within column, 16:9)
  - Brand & model
  - Price (EUR)
  - Category
  - Frame material
  - Weight
  - Groupset (brand + level)
  - Braking system
  - Wheel size
  - Tire clearance
  - Suspension type (shown only if any bike is MTB)
  - Suspension travel (shown only if any bike has suspension)
  - Sizes available
- [ ] Cells where values differ across columns are highlighted (e.g. background tint) to draw attention to differences
- [ ] Cells where values are identical across all compared bikes are visually de-emphasised (grey text)
- [ ] A "View on retailer site" button appears below each bike column
- [ ] An "Add/change bike" button in each column lets the user navigate back to `results.html` to swap a bike (current IDs preserved in URL)
- [ ] A "Remove" (×) button in each column removes that bike from the comparison; if only 1 remains, show the "need at least 2" state
- [ ] The table is horizontally scrollable on mobile (columns do not collapse to stacked layout)
- [ ] Page title and heading reflect compared models: e.g. "Comparing: Tarmac SL8 vs Emonda SLR"

## Technical notes
- Logic lives in `js/comparator.js`
- Difference highlighting: compare values across all bike objects for each field after fetch; add `data-differs` attribute to `<td>` elements where not all values match; style via CSS
- The table uses a `<table>` element with `<thead>` for row labels and one `<td>` per bike per row
- Row labels (field names) include a tooltip (same `js/copy.js` pattern as filters)

## Edge cases
- One of the IDs in the URL is invalid or returns 404: show a warning banner "One bike could not be loaded" and render the table with the remaining valid bikes (if ≥ 2)
- All three bikes have the same price: price row is de-emphasised, not highlighted
- Very long model names: truncate with `text-overflow: ellipsis` in the heading cell

## Out of scope
- More than 3 bikes in a single comparison
- Printing / PDF export
- Geometry diagram overlay
