# Bike Search & Comparator

A guided bike selection and comparison tool. Helps cyclists — from beginners to competitors — find the right bike through a progressive, non-technical-first approach: start with use case questions, then refine with technical filters, and finally compare shortlisted models side-by-side.

## Live demo
https://www.bikes-search.com

## Setup
```bash
# No build step — open index.html directly or serve with any static server
npx serve .
# or
python3 -m http.server 8080
```

## Stack
- **Frontend**: Vanilla HTML / CSS / JavaScript (no framework, no build step)
- **Data**: External SaaS bike catalog API (read-only, updated weekly)
- **Hosting**: Static (Netlify / GitHub Pages / any CDN)

See `specs/architecture.md` for system design and `specs/api.md` for the API contract.

## Features
| Feature | Spec | Status |
|---------|------|--------|
| Guided selection wizard | `specs/features/guided-selection-wizard.md` | planned |
| Dynamic technical filters | `specs/features/dynamic-filters.md` | planned |
| Results display | `specs/features/results-display.md` | planned |
| Side-by-side comparator | `specs/features/bike-comparator.md` | planned |
| Frame size recommender | `specs/features/size-recommender.md` | planned |

## Development workflow
1. Pick a feature from `specs/features/`
2. Create a branch: `git checkout -b feature/<name>`
3. Use `prompts/implement-feature.md` to drive the implementation session
4. Open a PR — one feature per PR
5. Use `prompts/review.md` before merging

## Project structure
```
/
├── index.html              # Entry point — wizard start screen
├── results.html            # Results & filter page
├── compare.html            # Side-by-side comparator
├── css/
│   ├── base.css            # Reset, typography, variables
│   ├── components.css      # Reusable UI components
│   └── pages/             # Page-specific styles
├── js/
│   ├── api.js              # SaaS API client (fetch wrapper)
│   ├── wizard.js           # Guided selection wizard logic
│   ├── filters.js          # Dynamic filter logic
│   ├── results.js          # Results rendering
│   ├── comparator.js       # Comparator logic
│   └── size-recommender.js # Frame size calculator
├── assets/
│   └── icons/
├── specs/                  # Feature & system specs
└── prompts/                # Claude Code prompt templates
```
