# Feature: Frame Size Recommender

## User story
As a **user looking at results or comparing bikes**, I want to enter my height and inseam so that the tool tells me which frame size fits me on a specific bike model, removing the guesswork of size charts.

## Acceptance criteria
- [ ] The recommender is accessible from two entry points:
  1. A "Find my size" button on each result card's detail drawer
  2. A "Find my size" link in the size row of the comparator table
- [ ] The recommender renders as a modal (`<dialog>`) over the current page
- [ ] The modal contains:
  - Height input (cm), integer, range 140–220
  - Inseam input (cm), integer, range 60–110
  - A unit toggle: cm / inches (converts inputs in real time, stores internally in cm)
  - A "Calculate" button
- [ ] On submit, the recommended size is highlighted in the bike's `sizes_available` list (e.g. "Your size: M")
- [ ] If the calculated size is not in `sizes_available` for that bike, show: "Size [X] is not available for this model — closest available: [Y]"
- [ ] If both height and inseam are provided, the recommendation is based on inseam (more accurate); height is used only when inseam is omitted
- [ ] The size formula is:
  - Road/Gravel: frame_size_cm ≈ inseam_cm × 0.67 → map result to standard sizes using the lookup table below
  - MTB: frame_size_cm ≈ inseam_cm × 0.57 → same lookup
  - Standard size lookup: XS < 48cm, S 48–52cm, M 52–56cm, L 56–60cm, XL ≥ 60cm
- [ ] The modal is dismissible via ESC key, the × button, or clicking the backdrop
- [ ] Inputs are validated: non-numeric input or out-of-range values show an inline error message; "Calculate" is disabled until inputs are valid

## Technical notes
- Logic lives in `js/size-recommender.js`
- The modal is triggered with `dialog.showModal()`; the bike object is passed in at open time
- Size lookup and formula are pure functions, easily unit-testable
- No API call needed — calculation is purely client-side using the bike's `sizes_available` and `category`

## Edge cases
- Bike has no `sizes_available` data: show "Size data not available for this model" and disable the form
- Inseam field left blank: fall back to height-based formula with a note "For a more accurate result, add your inseam measurement"
- Calculated size falls between two size thresholds: round to nearest size
- Inches input: convert to cm on blur before calculating (1 inch = 2.54 cm, round to nearest integer)

## Out of scope
- Stack/reach-based fit calculator (requires geometry data per size — deferred)
- Saving the user's measurements for future visits
- Integration with the wizard flow (size recommendation is a post-selection tool only)
