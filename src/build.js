// Renders every RootShell variant at every required size using sharp.
// One render per UNIQUE pixel size per variant (sharp's PNG encoder is fast,
// but we still dedupe — 17 iOS sizes collapse to ~12 unique pixel widths).
//
// Usage: npm run build

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { VARIANTS } from './variants.js';
import { IOS_ICONS, MAC_ICONS, PREVIEW_SIZES } from './sizes.js';
import { renderSVG } from './geometry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'icons');

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function renderVariant(variant) {
  const root = path.join(ICONS_DIR, variant.id);
  const iosDir = path.join(root, 'AppIcon.appiconset');
  const macDir = path.join(root, 'rootshell.iconset');
  await ensureDir(iosDir);
  await ensureDir(macDir);

  // Collect every unique pixel size we need
  const allPx = new Set([
    ...IOS_ICONS.map(x => x.px),
    ...MAC_ICONS.map(x => x.px),
    ...PREVIEW_SIZES,
  ]);

  // Render the SVG once at a high master resolution, then resize down to each
  // target px with lanczos3. Supersampling avoids the jaggy edges librsvg
  // produces when rasterizing thin strokes directly at small sizes.
  // Output is palettised PNG (libimagequant) — flat-color icons compress 4–6×
  // smaller than truecolor RGBA at no visible loss.
  const masterSvg = renderSVG(variant, 1024);
  const buffers = {};
  await Promise.all([...allPx].map(async (px) => {
    buffers[px] = await sharp(Buffer.from(masterSvg))
      .resize(px, px, { kernel: 'lanczos3' })
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toBuffer();
  }));

  // Write iOS appiconset
  const images = [];
  for (const spec of IOS_ICONS) {
    await fs.writeFile(path.join(iosDir, spec.file), buffers[spec.px]);
    images.push({
      size: `${spec.size}x${spec.size}`,
      idiom: spec.idiom,
      filename: spec.file,
      scale: `${spec.scale}x`,
    });
  }
  await fs.writeFile(
    path.join(iosDir, 'Contents.json'),
    JSON.stringify({ images, info: { version: 1, author: 'rootshell-icon' } }, null, 2)
  );

  // Write macOS iconset
  for (const m of MAC_ICONS) {
    await fs.writeFile(path.join(macDir, m.name), buffers[m.px]);
  }

  // Preview PNGs at the variant root
  for (const px of PREVIEW_SIZES) {
    await fs.writeFile(path.join(root, `preview-${px}.png`), buffers[px]);
  }

  // SVG source (handy for re-rendering or pasting into Figma)
  await fs.writeFile(path.join(root, 'icon.svg'), renderSVG(variant, 1024));

  return { id: variant.id, sizes: allPx.size };
}

async function main() {
  await ensureDir(ICONS_DIR);
  console.log(`Rendering ${VARIANTS.length} variants...`);
  const t0 = Date.now();
  for (const v of VARIANTS) {
    const r = await renderVariant(v);
    console.log(`  ✓ ${r.id.padEnd(24)} (${r.sizes} unique sizes)`);
  }
  console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s → icons/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
