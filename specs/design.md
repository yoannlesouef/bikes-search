# Bike Search — Design Specification
## "Performance Minimalism"

**Version:** 1.0  
**Date:** 2026-03-31  
**Status:** Approved for implementation

---

## 1. Design Philosophy

The guiding principle is **Performance Minimalism**: the aesthetic vocabulary of serious cycling — editorial sports photography, race timing screens, premium kit catalogues — stripped back to its functional core. Every visual choice should communicate speed, precision, and confidence. No decorative chrome, no gradients for their own sake, no corporate-SaaS softness.

The site is a **tool used by people who care about bikes**. The design should respect that. It should feel like it belongs next to Cycling Weekly or Velonews, not a generic e-commerce template.

---

## 2. Design Tokens

### 2.1 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--c-bg` | `#f4f4f2` | Page background — slightly warmer off-white, not sterile |
| `--c-surface` | `#ffffff` | Cards, sidebar, modals |
| `--c-surface-2` | `#f0efed` | Subtle secondary surface (filter panel bg, alternate rows) |
| `--c-border` | `#e2e2de` | All dividers and input borders |
| `--c-border-strong` | `#c8c8c4` | Focused/hover border states |
| `--c-text` | `#111110` | Primary text — near-black with warm undertone |
| `--c-text-2` | `#3d3d3a` | Secondary headings |
| `--c-muted` | `#6a6a66` | Supporting copy, labels, placeholders |
| `--c-muted-light` | `#a8a8a4` | Disabled, ghost states |
| `--c-accent` | `#e63946` | Primary accent — energetic red-coral (CTAs, active states, progress) |
| `--c-accent-dk` | `#c0272f` | Hover/pressed state for accent |
| `--c-accent-bg` | `#fdeced` | Tinted background for accent-tinted surfaces |
| `--c-navy` | `#0d1b2a` | Hero background, dark surfaces |
| `--c-navy-2` | `#172436` | Secondary dark — hero gradient end |
| `--c-road` | `#1a6bff` | Road bikes — electric blue |
| `--c-road-bg` | `#deeaff` | Road badge background |
| `--c-gravel` | `#1f8c56` | Gravel bikes — forest green |
| `--c-gravel-bg` | `#d0f0e0` | Gravel badge background |
| `--c-mtb` | `#d45f00` | MTB — burnt orange |
| `--c-mtb-bg` | `#fde2c8` | MTB badge background |
| `--c-danger` | `#d43030` | Errors, destructive actions |
| `--c-warning` | `#e8a020` | Warnings |
| `--c-success` | `#1f8c56` | Success states |

**Category border colors are load-bearing UI:** Cards get a 3px left border in their category color. This enables instant visual scanning without reading the badge text.

### 2.2 Typography

Font family: **Inter** (Google Fonts, weights 400/500/600/700/800)

The Inter 800 (ExtraBold) weight is added for hero and display headings to push hierarchy harder.

| Token | Value | Notes |
|---|---|---|
| `--fs-xs` | `11px` | Labels, badges, caps |
| `--fs-sm` | `13px` | Secondary body, filters |
| `--fs-md` | `15px` | Base body copy |
| `--fs-lg` | `18px` | Card prices, sub-headings |
| `--fs-xl` | `22px` | Section headings |
| `--fs-2xl` | `30px` | Page headings |
| `--fs-3xl` | `48px` | Hero / display |
| `--fs-4xl` | `64px` | Wizard budget value display |
| `--fw-normal` | `400` | Body |
| `--fw-medium` | `500` | UI labels |
| `--fw-semibold` | `600` | Card titles, nav |
| `--fw-bold` | `700` | Headings |
| `--fw-black` | `800` | Display / hero |
| `--lh-tight` | `1.1` | Hero, display headings |
| `--lh-snug` | `1.25` | Section headings |
| `--lh-base` | `1.5` | Body copy |
| `--ls-tight` | `-0.03em` | Headings — tighter tracking for sport feel |
| `--ls-wide` | `0.06em` | All-caps labels, badges |

**Heading defaults:** All h1–h4 use `--fw-bold`, `--lh-snug`, `letter-spacing: --ls-tight`. Hero h1 uses `--fw-black`.

### 2.3 Spacing Scale

8px grid. The `--sp-N` tokens map to multiples of 4px for granular control and multiples of 8px for structural spacing.
