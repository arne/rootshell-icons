# RootShell v2 template — design

**Date:** 2026-04-27
**Branch:** `v2-template`
**Status:** Approved (pending spec review)

## Goal

Replace the v1 mark (`√` + `~` on a single-zone background) with the v2 mark
(off-canvas radical splitting the tile into two zones, with `>_` as the rooted
expression) across all 12 colorway variants.

Source of the new geometry/colors: `~/rootshell.zip` → `rootshell-icons-v3/`
(zip uses "v3" naming internally; we adopt **v2** in this repo).

## Non-goals

- No dual-template support. v2 replaces v1 in this branch.
- No new Icon Composer template ships in this branch — the user will author
  one separately and drop it in as a follow-up commit.
- No legacy iconset format changes. PNG `AppIcon.appiconset/` and
  `rootshell.iconset/` keep their current structure.

## Approach

### Geometry (`src/geometry.js`)

100×100 viewBox. All values copied from the v3 export.

| Element | Spec |
|---|---|
| Radical polyline | `(-4,56) → (14,77) → (36,20) → (114,20)` — extends off-canvas left/right; stroke width **12** |
| Top-zone polygon | `(-4,56) (14,77) (36,20) (114,20) (200,20) (200,-100) (-4,-100)` — fills everything above/right of the radical |
| Chevron `>` | `(43,50) → (53,60) → (43,70)` polyline; stroke **6** |
| Underscore `_` | `(62,71) → (74,71)` segment; stroke **6** |

All strokes use round caps + round joins (matches v1's stroke style).

The module exports:
- `GEOMETRY` — flat object of all coordinates and stroke widths
- `radicalPath(g)` — SVG `M…L…` path string (polyline form, for stroke rendering)
- `promptPath(g)` — combined chevron + underscore polyline path string
- `topZonePolygon(g)` — `points="…"` string for the top-zone polygon
- `renderSVG(variant, px)` — full composed flat SVG (used by `build.js` and the preview page)

### Variants (`src/variants.js`)

Schema changes:
- Drop `tildeStroke` → add `prompt`
- Drop `stroke` → add `radical` (rename for clarity with the new layer model)
- Drop explicit `bgEnd` — derive `bgEnd` and `topEnd` programmatically as ~8%
  HSL-lightness drop from `bg` and `top` respectively

Each entry:
```js
{ id, name, bg, top, radical, prompt }
```

12 entries, colors copied verbatim from `rootshell-icons-v3/README.md`:

| # | id | bg | top | radical | prompt |
|---|---|---|---|---|---|
| 01 | `01-solarized-dark`  | `#002b36` | `#073642` | `#586e75` | `#b58900` |
| 02 | `02-solarized-light` | `#fdf6e3` | `#eee8d5` | `#93a1a1` | `#cb4b16` |
| 03 | `03-dracula`         | `#282a36` | `#44475a` | `#6272a4` | `#bd93f9` |
| 04 | `04-nord`            | `#2e3440` | `#3b4252` | `#4c566a` | `#88c0d0` |
| 05 | `05-gruvbox-dark`    | `#282828` | `#3c3836` | `#7c6f64` | `#fabd2f` |
| 06 | `06-tokyo-night`     | `#1a1b26` | `#292e42` | `#414868` | `#bb9af7` |
| 07 | `07-catppuccin`      | `#1e1e2e` | `#313244` | `#45475a` | `#fab387` |
| 08 | `08-bases`           | `#141210` | `#201e1a` | `#3a3630` | `#48a068` |
| 09 | `09-mono-light`      | `#f5f1ea` | `#e6e1d4` | `#9a948a` | `#1a1a1a` |
| 10 | `10-monokai`         | `#272822` | `#3e3d32` | `#75715e` | `#a6e22e` |
| 11 | `11-mono-dark`       | `#0e0e0e` | `#1f1f1f` | `#3a3a3a` | `#e8e6e0` |
| 12 | `12-rose-pine`       | `#232136` | `#2a283e` | `#393552` | `#ea9a97` |

### Layer SVGs for Icon Composer (`src/outline-glyph.js`, repo root)

Rewritten to emit **three per-layer SVGs**, all stroke-free (every element is
a closed filled path — Icon Composer renders strokes inconsistently):

- **`radical.svg`** — outlined polyline. Each segment becomes a rectangle
  perpendicular to the segment direction, each vertex becomes a disc — same
  technique as v1's `outlinePolyline()`. Stroke width 12 → disc radius 6.
- **`prompt.svg`** — outlined chevron + outlined underscore, combined into
  one path with `fill-rule="nonzero"`. Stroke width 6 → disc radius 3.
- **`top-zone.svg`** — closed polygon (no outlining; already a fill).

Plus **`glyph.svg`** — combined radical + prompt single-color SVG for inline
UI use. The existing `tilde.svg` is deleted.

All four use `fill="currentColor"` so they recolor inside Icon Composer or
when used as `<img>` masks.

### Build pipeline (`src/build.js`)

- `renderSVG(variant, px)` rebuilt for the v2 layer order:
  1. `<rect>` filled with bg gradient (`bg` → `bgEnd`)
  2. `<polygon>` filled with top gradient (`top` → `topEnd`)
  3. Radical polyline (stroke)
  4. Chevron polyline (stroke)
  5. Underscore segment (stroke)
- Bg/top gradients derived in-script using HSL lightness math.
- PNG raster → `AppIcon.appiconset/` and `rootshell.iconset/` writing is
  unchanged in shape (paths, file names, `Contents.json`).
- `writeIconBundle(variant, root)` is still called, but `bundles.js` now
  no-ops gracefully when `icon.icon/` is absent (see next section).

### Liquid Glass bundle (`src/bundles.js`, `icon.icon/`)

- The `icon.icon/` template at the repo root is **deleted** in this branch.
- `bundles.js` is kept and updated to:
  - Check for `icon.icon/` existence at start. If missing, log a single
    notice (`icon.icon/ template not present — skipping Liquid Glass bundle generation`)
    and return without writing per-variant `AppIcon.icon/` directories.
  - When the template *is* present, color-swap by layer name. Update the
    layer-name map from `{radical, tilde}` to `{radical, prompt, top-zone}`.
    The auto-gradient fill keeps mapping to `variant.bg`. If a known layer
    name is missing in the template, skip it silently.

The user authors a v2 Icon Composer template separately and commits the
resulting `icon.icon/` directory in a follow-up commit. No code changes are
needed at that point — `bundles.js` will detect the template and start
producing per-variant bundles automatically.

### Preview (`index.html`)

- Drop the "Flat SVG / Liquid Glass" tab toggle and all CSS-filter
  glass approximation code (`#glass-bevel` filter, `.glass-*` rules,
  `loadGlyphPaths`, `renderGlass`).
- Single grid of 12 v2 icons rendered from `renderSVG(v, 220)`.
- Swatch row updated: `bg / top / radical / prompt` (4 swatches per card).

### README

Rewritten to describe the v2 mark, the new geometry, the per-layer SVG
outputs, and the "drop your Icon Composer template into `icon.icon/`" flow.

## Files affected

```
modified:   src/geometry.js
modified:   src/variants.js
modified:   src/outline-glyph.js
modified:   src/build.js
modified:   src/bundles.js
modified:   index.html
modified:   README.md
deleted:    icon.icon/                    (template — user will recreate via Icon Composer)
deleted:    tilde.svg
added:      top-zone.svg
added:      prompt.svg
modified:   radical.svg                   (regenerated for new geometry)
modified:   glyph.svg                     (regenerated)
```

`src/sizes.js` and `src/icns.js` untouched.

## Verification

After `npm run build`:
- All 12 `icons/<id>/AppIcon.appiconset/` folders exist with PNGs at expected sizes
- All 12 `icons/<id>/rootshell.iconset/` folders exist
- All 12 `icons/<id>/preview-*.png` files exist
- All 12 `icons/<id>/icon.svg` files render the v2 mark
- **No** `icons/<id>/AppIcon.icon/` folders exist (template absent — skipped)
- Build script logs the "skipping Liquid Glass bundle" notice once
- `radical.svg`, `prompt.svg`, `top-zone.svg`, `glyph.svg` at repo root match
  the v3 export's reference outputs visually
- `index.html` opens locally and renders 12 v2 cards with correct colors
