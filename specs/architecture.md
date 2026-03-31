# Architecture — Bike Search & Comparator

## Overview
A fully static web application. No server-side rendering, no backend, no external services. Bike data is stored as a JSON file in the repository. The browser fetches it once on page load, then all filtering and sorting happens in memory.

## Stack
| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Vanilla HTML / CSS / JS (ES modules) | Zero dependency, fast load, no build step required |
| Data | `data/bikes.json` (committed to repo) | No service or account needed; edit and commit to update |
| Hosting | Static file hosting (GitHub Pages) | Free, auto-deploys on push to main |
| Domain | www.bikes-search.com | Production domain |
| Test URL | https://yoannlesouef.github.io/bikes-search/ | GitHub Pages staging |

## Data flow
```
User fills wizard / sets filters
        │
        ▼
js/api.js — fetch('./data/bikes.json')  (cached after first load)
        │
        ▼
In-memory filter + sort (js/api.js)
        │
        ▼
js/results.js — render cards to DOM
        │
        ▼
User selects models → js/comparator.js → compare.html
```

## Key design decisions

### ADR-1: No framework, no build step
Static pages open instantly and can be previewed by opening `index.html`. Avoids Node.js toolchain friction for a catalog-browsing app with no complex state management needs.

### ADR-2: All data access centralised in `js/api.js`
Page scripts never read `data/bikes.json` directly. If the data source ever changes (e.g. a CMS), only `js/api.js` needs updating.

### ADR-3: Client-side filtering over server-side pagination
The catalog is expected to be ≤ 2000 bikes. Filtering in memory avoids a round-trip per filter change and enables instant feedback. Re-evaluate if catalog grows beyond 10k items.

### ADR-4: Data stored as a JSON file in the repository
No external service or API key required. Updating the catalog means editing `data/bikes.json` and committing. GitHub Actions redeploys automatically.

## Folder structure
```
/
├── index.html              # Wizard entry point
├── results.html            # Filtered results
├── compare.html            # Side-by-side comparator
├── data/
│   └── bikes.json          # Bike catalog — edit this to add/update bikes
├── css/
│   ├── base.css            # Custom properties, reset, typography
│   ├── components.css      # Cards, buttons, tooltips, filter chips
│   └── pages/
│       ├── wizard.css
│       ├── results.css
│       └── compare.css
├── js/
│   ├── api.js              # Catalog client (reads bikes.json, filters, sorts)
│   ├── copy.js             # Tooltip / educational text strings
│   ├── wizard.js           # Wizard state machine
│   ├── filters.js          # Filter logic + URL-state sync
│   ├── results.js          # Results rendering
│   ├── comparator.js       # Comparator selection + table rendering
│   └── size-recommender.js # Height/inseam → frame size calculator
├── assets/
│   └── icons/
├── .github/workflows/
│   └── deploy.yml          # Auto-deploy to GitHub Pages on push to main
├── specs/
└── prompts/
```
