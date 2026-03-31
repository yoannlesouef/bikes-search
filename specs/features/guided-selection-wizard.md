# Feature: Guided Selection Wizard

## User story
As an **undecided buyer**, I want to answer a few plain-language questions about how I plan to ride so that I am directed to a relevant set of bikes without needing to know any technical terminology.

## Acceptance criteria
- [ ] The wizard is the first screen a user sees on `index.html`
- [ ] The wizard presents exactly 4 steps in order: Use Case → Level → Budget → Priority
- [ ] Each step shows one question at a time with visual choice cards (not a dropdown)
- [ ] Step 1 — Use Case: options are "Pure speed (Road)", "Long-distance comfort (Endurance)", "Adventure & gravel", "Mountain / off-road" with an icon and one-line description each
- [ ] Step 2 — Level: options are "Occasional (a few times a month)", "Regular (weekly rides)", "Competitor (racing / training)"
- [ ] Step 3 — Budget: a slider with a visible EUR value, range €500–€15 000, step €250
- [ ] Step 4 — Priority: options are "Performance (weight, aero)", "Durability & reliability", "Comfort (long rides)"
- [ ] A "Back" button is available from step 2 onwards
- [ ] Completing step 4 navigates to `results.html` with wizard answers encoded as URL query params
- [ ] The wizard is fully keyboard-navigable (arrow keys to select a card, Enter to confirm)
- [ ] A "Skip wizard — show all bikes" link bypasses the wizard and goes to `results.html` with no pre-filters

## Technical notes
- Wizard state is managed in `js/wizard.js` as a plain JS object `{ use_case, level, budget_max, priority }`
- URL param mapping on redirect: `?category=road&price_max=3000&priority=performance`
- Animations between steps: CSS transition only (slide-in from right, no JS animation library)
- `index.html` imports `js/wizard.js` as an ES module

## Edge cases
- User refreshes mid-wizard: restart from step 1 (no state persistence)
- Budget slider at max value (€15 000): do not send `price_max` param (no upper cap)
- All four use cases must map to a valid `category` API param or combination

## Out of scope
- More than 4 wizard steps
- Saving wizard answers to localStorage
- Branching logic (all users see all 4 steps in the same order)
