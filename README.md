# RootShell Icon

App icon for **RootShell** — the radical (√) of the unknown (~). A square root of tilde mark in clean sans-serif strokes.

This repo holds 12 terminal-theme colorway variants and a one-command generator that emits:

- **iOS 26+** `AppIcon.icon/` Liquid Glass bundles (vector layers + `icon.json`)
- **iOS (legacy)** `AppIcon.appiconset/` folders (drop into Xcode asset catalog)
- **macOS** `rootshell.iconset/` folders → `.icns` via `iconutil`
- Preview PNGs at 180 / 512 / 1024 px

## Quick start

```bash
npm install
npm run build           # renders all 12 variants → ./icons/<id>/
npm run icns            # converts every iconset → <id>/rootshell.icns
```

That's it. `./icons/<id>/AppIcon.appiconset/` is what you drop into Xcode. `./icons/<id>/rootshell.icns` is the macOS bundle icon.

## What the mark is

Two strokes, baked into `src/geometry.js`:

1. **Radical** — checkmark + vinculum: `(12,61) → (22,77) → (36,20) → (58,20)`
2. **Tilde** — sine wave centered at `(56, 51)`, width 33, amplitude 8

Coordinates are in a 100×100 viewBox. Stroke width is 6, round caps, round joins. To tweak the geometry, edit `src/geometry.js` and rerun `npm run build`.

## The 12 variants

Defined in `src/variants.js`. Each entry is `{ id, name, bg, bgEnd, stroke, tildeStroke? }`. `bg → bgEnd` is a subtle diagonal gradient that mirrors the auto-gradient iOS 26 applies to Liquid Glass icons:

| # | id | Style |
|---|---|---|
| 01 | solarized-dark | Solarized Dark — base1 radical, yellow tilde |
| 02 | solarized-light | Solarized Light — base01 radical, orange tilde |
| 03 | dracula | Dracula — foreground radical, purple tilde |
| 04 | nord | Nord — snow storm radical, frost tilde |
| 05 | gruvbox-dark | Gruvbox Dark — fg radical, bright yellow tilde |
| 06 | tokyo-night | Tokyo Night — fg radical, magenta tilde |
| 07 | catppuccin | Catppuccin Mocha — text radical, peach tilde |
| 08 | bases | Bases — muted neutral radical, green tilde |
| 09 | mono-light | Mono Light — warm grey radical, ink tilde |
| 10 | monokai | Monokai — off-white radical, pink tilde |
| 11 | mono-dark | Mono Dark — grey radical, bone tilde |
| 12 | rose-pine | Rosé Pine — text radical, rose tilde |

## Adding a variant

```js
// src/variants.js
{ id: '13-my-variant', name: 'My variant',
  bg: '#...', bgEnd: '#...', stroke: '#...', tildeStroke: '#...' }
```

Then `npm run build`. New folder appears under `icons/`.

## Output structure (per variant)

```
icons/01-solarized-dark/
├── AppIcon.icon/                   # iOS 26+ Liquid Glass bundle
│   ├── icon.json
│   └── Assets/
│       ├── radical.svg
│       └── tilde.svg
├── AppIcon.appiconset/
│   ├── Contents.json
│   ├── Icon-iphone-20-2x.png       (40px)
│   ├── Icon-iphone-20-3x.png       (60px)
│   ├── Icon-iphone-29-2x.png       (58px)
│   ├── Icon-iphone-29-3x.png       (87px)
│   ├── Icon-iphone-40-2x.png       (80px)
│   ├── Icon-iphone-40-3x.png       (120px)
│   ├── Icon-iphone-60-2x.png       (120px)
│   ├── Icon-iphone-60-3x.png       (180px)
│   ├── Icon-ipad-20-2x.png         (40px)
│   ├── Icon-ipad-29-2x.png         (58px)
│   ├── Icon-ipad-40-2x.png         (80px)
│   └── Icon-ipad-83.5-2x.png       (167px)
├── rootshell.iconset/
│   ├── icon_16x16.png
│   ├── icon_16x16@2x.png
│   ├── icon_32x32.png
│   ├── icon_32x32@2x.png
│   ├── icon_128x128.png
│   ├── icon_128x128@2x.png
│   ├── icon_256x256.png
│   ├── icon_256x256@2x.png
│   ├── icon_512x512.png
│   └── icon_512x512@2x.png
├── rootshell.icns        # only after `npm run icns`
├── preview-180.png
├── preview-512.png
└── preview-1024.png
```

## Drop into Xcode

1. Open your `.xcassets` in Xcode
2. Right-click `AppIcon` → **Show in Finder**
3. Replace `AppIcon.appiconset/` with `icons/<variant-id>/AppIcon.appiconset/`
4. Build

## Generate `.icns` (macOS only)

`npm run icns` runs `iconutil -c icns` on every iconset. Or manually:

```bash
iconutil -c icns icons/01-solarized-dark/rootshell.iconset
# → icons/01-solarized-dark/rootshell.icns
```

## Browser preview

Open `index.html` in a browser to compare all 12 variants side by side. It uses
ES modules, so serve it locally rather than opening via `file://`:

```bash
npx serve .
# or: python -m http.server
```

### GitHub Pages

The repo is set up to be served as-is. In **Settings → Pages**, set:

- **Source:** Deploy from a branch
- **Branch:** `main` / `/ (root)`

The site will be live at `https://<user>.github.io/rootshell-icons/`. The page
renders all 12 variants client-side from `src/variants.js` + `src/geometry.js`,
so no build step is needed for the preview.

## License

MIT
