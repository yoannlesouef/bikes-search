# Architecture — Bike Search & Comparator

## Overview
A fully static web application. No server-side rendering, no backend. The browser fetches bike data from an external SaaS API at runtime, applies filtering and sorting in-memory, and renders results with vanilla JS.

## Stack
| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Vanilla HTML / CSS / JS (ES modules) | Zero dependency, fast load, no build step required |
| Data source | SaaS bike catalog API (REST/JSON) | Managed externally, updated weekly by editorial team |
| Hosting | Static file host (Netlify / GitHub Pages) | Free tier covers traffic; no server to maintain |
| Domain | www.bikes-search.com | Production domain |

## Data flow
```
User fills wizard / sets filters
        │
        ▼
js/api.js — fetch(CATALOG_API_URL + queryString)
        │
        ▼
SaaS Bike Catalog API  ←── editorial team updates weekly
        │
        ▼
JSON response { items: [...], total: N }
        │
        ▼
js/filters.js — in-memory filter + sort (client-side)
        │
        ▼
js/results.js — render cards to DOM
        │
        ▼
User selects models → js/comparator.js → compare.html
```

## Key design decisions

### ADR-1: No framework, no build step
Static pages open instantly and can be previewed by opening `index.html`. Avoids Node.js toolchain friction for a catalog-browsing app that has no complex state management needs.

### ADR-2: All API calls centralised in `js/api.js`
The SaaS provider, API key format, and base URL are single points of change. Page scripts never call `fetch()` directly.

### ADR-3: Client-side filtering over server-side pagination
The catalog is expected to be ≤ 2000 bikes at launch. Filtering in memory avoids a round-trip per filter change, enabling instant filter feedback. Re-evaluate if catalog grows beyond 10k items.

### ADR-4: API key handled via environment variable injected at deploy time
The SaaS API read key is injected as `window.CATALOG_API_KEY` via a Netlify/GitHub Pages deploy step. Never committed to the repo.

## Folder structure
```
/
├── index.html              # Wizard entry point
├── results.html            # Filtered results
├── compare.html            # Side-by-side comparator
├── css/
│   ├── base.css            # Custom properties, reset, typography
│   ├── components.css      # Cards, buttons, tooltips, filter chips
│   └── pages/
│       ├── wizard.css
│       ├── results.css
│       └── compare.css
├── js/
│   ├── api.js              # SaaS API client
│   ├── copy.js             # Tooltip / educational text strings
│   ├── wizard.js           # Wizard state machine
│   ├── filters.js          # Filter logic + URL-state sync
│   ├── results.js          # Results rendering
│   ├── comparator.js       # Comparator selection + table rendering
│   └── size-recommender.js # Height/inseam → frame size calculator
├── assets/
│   └── icons/              # SVG icons (inline-able)
├── specs/
└── prompts/
```
