# Product Requirements — Bike Search & Comparator

## Problem
Choosing a bike is overwhelming. The market offers hundreds of models across road, gravel, and mountain categories, with technical specifications that most buyers — especially non-experts — cannot meaningfully compare. There is no single tool that starts from a rider's actual needs (use case, budget, level) and progressively guides them to a technically sound shortlist.

## Goal
Become the go-to guided selection tool for new and intermediate cyclists. A user should be able to arrive without knowing any bike jargon and leave with a confident, justified shortlist of 2–3 models they can compare and act on.

## Users

### Primary: The Undecided Buyer
- Exploring a first bike or an upgrade
- Knows their budget and how they want to ride, but not the specs
- Overwhelmed by technical marketing language
- Job-to-be-done: "Help me find the right bike for my situation without making me feel stupid."

### Secondary: The Informed Shopper
- Already knows their category (e.g. gravel bike, ~€2500)
- Wants precise filtering (groupset, frame material, geometry) and a fast comparison
- Job-to-be-done: "Let me filter down quickly and compare 2–3 models on the details I care about."

## Features (prioritized)
| Priority | Feature | Spec | Status |
|----------|---------|------|--------|
| P0 | Guided selection wizard | `features/guided-selection-wizard.md` | planned |
| P0 | Dynamic technical filters | `features/dynamic-filters.md` | planned |
| P0 | Results display | `features/results-display.md` | planned |
| P1 | Side-by-side comparator | `features/bike-comparator.md` | planned |
| P1 | Frame size recommender | `features/size-recommender.md` | planned |

## Out of scope
- User accounts, wishlists, or saved searches
- Purchase / checkout flow (link to retailer is sufficient)
- User reviews or ratings
- Used / second-hand bikes
- Accessories or clothing
- Admin UI for managing bike data (data is managed in the SaaS backend)

## Success metrics
- A user with no prior bike knowledge can reach a relevant shortlist in under 3 minutes
- Zero dead-end states: every wizard path surfaces at least one result
- Comparator used in >30% of sessions that reach the results page
- Catalog freshness: data lag ≤ 7 days from manufacturer release
