# Claude Instructions — bikes-search

## Project
A guided bike search and comparator. Static HTML/CSS/JS site. Bike data is stored in `data/bikes.json` — edit and commit to update the catalog. See `specs/PRD.md` for goals and `specs/architecture.md` for system design.

## Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML5 / CSS3 / JavaScript (ES modules, no framework) |
| Data | `data/bikes.json` (committed to repo) |
| Hosting | GitHub Pages (auto-deploys on push to main) |

No build step, no bundler, no transpiler. Ship files that run directly in the browser.

## Key Commands
```bash
# Serve locally
npx serve .
# or
python3 -m http.server 8080
```

## Conventions
- Follow feature specs in `specs/features/` before implementing — specs are the source of truth
- One feature per branch, named `feature/<feature-name>`
- Write tests alongside implementation using plain `<script type="module">` test files or a zero-config harness
- Do not add speculative abstractions — implement only what the spec requires
- CSS: use custom properties (variables) for colors, spacing, and type scale defined in `css/base.css`
- JS: use ES modules (`type="module"`), no global state pollution
- All data access goes through `js/api.js` — never read `data/bikes.json` directly from page scripts
- Tooltips and educational copy live in `js/copy.js` (a simple key→string map), not hardcoded inline

## What to avoid
- Do not modify `specs/` files unless explicitly asked
- Do not add a build step, bundler, or framework unless explicitly asked
- Do not add error handling for scenarios that can't happen
- Do not create helper utilities for one-time operations
- Do not hardcode bike data in JS/HTML — bike data lives in `data/bikes.json`
- Do not add features not covered by the active feature spec
