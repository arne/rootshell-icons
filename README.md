# RootShell Icon — v2

App icon for **RootShell** — an off-canvas radical (√) splits the tile into two zones, with `>_` as the rooted expression.

This repo holds 12 terminal-theme colorway variants and a one-command generator that emits, per variant:

- **iOS legacy** — `AppIcon.appiconset/` (drop into Xcode asset catalog)
- **macOS** — `rootshell.iconset/` → `.icns` via `iconutil`
- **Preview PNGs** at 180 / 512 / 1024 px

For **iOS 26+ Liquid Glass**, compose `radical.svg`, `prompt.svg`, and `top-zone.svg` (at the repo root) in Apple's Icon Composer, then drop the resulting `icon.icon/` bundle at the repo root. Once present, `npm run build` colour-swaps it into per-variant `AppIcon.icon/` bundles automatically (see "Liquid Glass" below).

## Quick start

```bash
npm install
npm run build           # renders all 12 variants → ./icons/<id>/
npm run icns            # converts every iconset → <id>/rootshell.icns (macOS only)
```

`./icons/<id>/AppIcon.appiconset/` is what you drop into Xcode.
`./icons/<id>/rootshell.icns` is the macOS bundle icon.

## What the mark is

100×100 viewBox, all coordinates baked into `src/geometry.js`:

| Element | Spec |
|---|---|
| Radical polyline | `(-4,56) → (14,77) → (36,20) → (114,20)` — extends off-canvas; stroke 12 |
| Top-zone polygon | Closes everything above/right of the radical |
| Chevron `>` | `(43,50) → (53,60) → (43,70)` — stroke 6 |
| Underscore `_` | `(62,71) → (74,71)` — stroke 6 |

Round caps, round joins. Tweak `src/geometry.js` and rerun `npm run build`.

## The 12 variants

Defined in `src/variants.js`. Each entry is `{ id, name, bg, top, radical, prompt }`. Gradient bottom stops are auto-derived (≈8% HSL lightness drop).

| # | id | Style |
|---|---|---|
| 01 | solarized-dark | Solarized Dark |
| 02 | solarized-light | Solarized Light |
| 03 | dracula | Dracula |
| 04 | nord | Nord |
| 05 | gruvbox-dark | Gruvbox Dark |
| 06 | tokyo-night | Tokyo Night |
| 07 | catppuccin | Catppuccin Mocha |
| 08 | bases | Bases (warm green prompt) |
| 09 | mono-light | Mono Light |
| 10 | monokai | Monokai |
| 11 | mono-dark | Mono Dark |
| 12 | rose-pine | Rosé Pine |

## Layer SVGs for Icon Composer

`src/outline-glyph.js` writes four files at the repo root:

- `radical.svg` — outlined polyline (filled, currentColor)
- `prompt.svg` — outlined chevron + underscore (filled, currentColor)
- `top-zone.svg` — closed polygon (filled, currentColor)
- `glyph.svg` — combined radical + prompt (single-colour, for inline UI)

Drop the first three into Icon Composer as separate layers and tint each from the variant's colours.

```bash
node src/outline-glyph.js   # regenerate after editing src/geometry.js
```

## Liquid Glass (`AppIcon.icon`)

Compose the v2 layout in Icon Composer once, then export the `.icon` bundle and **drop the resulting `icon.icon/` directory at the repo root**. Layer naming convention used by `src/bundles.js`:

| Layer name in Icon Composer | Mapped from variant field |
|---|---|
| `radical`  | `variant.radical` |
| `prompt`   | `variant.prompt`  |
| `top-zone` | `variant.top`     |
| (background) `automatic-gradient` | `variant.bg` |

Once `icon.icon/` is present, `npm run build` colour-swaps it into 12 per-variant `icons/<id>/AppIcon.icon/` bundles. If absent, the build prints a notice and skips bundle generation.

## Adding a variant

```js
// src/variants.js
{ id: '13-my-variant', name: 'My variant',
  bg: '#…', top: '#…', radical: '#…', prompt: '#…' }
```

Then `npm run build`.

## Output structure (per variant)

```
icons/01-solarized-dark/
├── AppIcon.icon/                   # iOS 26+ Liquid Glass — only if icon.icon/ template exists
├── AppIcon.appiconset/             # legacy iOS asset catalog
├── rootshell.iconset/              # macOS .icns inputs
├── rootshell.icns                  # only after `npm run icns`
├── icon.svg                        # composed flat SVG, 1024px
├── preview-180.png
├── preview-512.png
└── preview-1024.png
```

## Browser preview

Open `index.html` via a local server (it uses ES modules):

```bash
npx serve .
# or: python -m http.server
```

The page renders all 12 variants client-side from `src/variants.js` + `src/geometry.js` — no build step needed for the preview.

## License

MIT
