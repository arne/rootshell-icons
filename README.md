# RootShell Icon

App icon for **RootShell** — the radical (√) of the unknown (~). A square root of tilde mark in clean sans-serif strokes.

This repo holds 16 colorway variants and a one-command generator that emits:

- **iOS** `AppIcon.appiconset/` folders (drop into Xcode asset catalog)
- **macOS** `rootshell.iconset/` folders → `.icns` via `iconutil`
- Preview PNGs at 180 / 512 / 1024 px

## Quick start

```bash
npm install
npm run build           # renders all 16 variants → ./icons/<id>/
npm run icns            # converts every iconset → <id>/rootshell.icns
```

That's it. `./icons/<id>/AppIcon.appiconset/` is what you drop into Xcode. `./icons/<id>/rootshell.icns` is the macOS bundle icon.

## What the mark is

Two strokes, baked into `src/geometry.js`:

1. **Radical** — checkmark + vinculum: `(14,60) → (22,82) → (36,14) → (60,14)`
2. **Tilde** — sine wave centered at `(56, 52)`, width 33, amplitude 8

Coordinates are in a 100×100 viewBox. Stroke width is 5, round caps, round joins. To tweak the geometry, edit `src/geometry.js` and rerun `npm run build`.

## The 16 variants

Defined in `src/variants.js`. Each entry is `{ id, name, bg, bgEnd, stroke, tildeStroke? }`:

| # | id | Style |
|---|---|---|
| 01 | cream-ink | Cream on near-black (canonical) |
| 02 | bone-charcoal | Warmer bone on charcoal |
| 03 | phosphor-green | CRT phosphor on near-black |
| 04 | amber-crt | Amber CRT terminal |
| 05 | cyan-dusk | Cyan on dusk navy |
| 06 | magenta-noir | Soft magenta on noir |
| 07 | cream-amber | Cream radical, amber tilde |
| 08 | cream-phosphor | Cream radical, phosphor tilde |
| 09 | cream-coral | Cream radical, coral tilde |
| 10 | bone-cyan | Bone radical, cyan tilde |
| 11 | slate-cream | Slate radical, cream tilde |
| 12 | indigo-saffron | Indigo bg, saffron mark |
| 13 | ink-on-cream | Ink on cream (light) |
| 14 | cream-coral-light | Light bg, coral tilde |
| 15 | sage-ink | Sage bg, ink mark |
| 16 | paper-slate | Paper bg, slate radical, terra tilde |

## Adding a variant

```js
// src/variants.js
{ id: '17-my-variant', name: 'My variant',
  bg: '#...', bgEnd: '#...', stroke: '#...', tildeStroke: '#...' }
```

Then `npm run build`. New folder appears under `icons/`.

## Output structure (per variant)

```
icons/01-cream-ink/
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
│   ├── Icon-ipad-20-1x.png         (20px)
│   ├── Icon-ipad-20-2x.png         (40px)
│   ├── Icon-ipad-29-1x.png         (29px)
│   ├── Icon-ipad-29-2x.png         (58px)
│   ├── Icon-ipad-40-1x.png         (40px)
│   ├── Icon-ipad-40-2x.png         (80px)
│   ├── Icon-ipad-76-2x.png         (152px)
│   ├── Icon-ipad-83.5-2x.png       (167px)
│   └── Icon-marketing-1024.png     (1024px)
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
iconutil -c icns icons/01-cream-ink/rootshell.iconset
# → icons/01-cream-ink/rootshell.icns
```

## Browser preview

Open `index.html` in a browser to compare all 16 variants side by side. It uses
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
renders all 16 variants client-side from `src/variants.js` + `src/geometry.js`,
so no build step is needed for the preview.

## License

MIT
