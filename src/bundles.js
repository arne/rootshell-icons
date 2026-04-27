// Generate per-variant iOS 26+ / Liquid Glass .icon bundles by color-swapping
// a hand-authored `AppIcon.icon/` template at the repo root.
//
// Layer-name → variant-color mapping:
//   radical   → variant.radical
//   prompt    → variant.prompt
//   top-zone  → variant.top
// The auto-gradient fill is mapped to variant.bg.
//
// If `AppIcon.icon/` is absent (e.g. you haven't yet authored the v2 template in
// Icon Composer), this module logs a notice and skips bundle generation —
// the rest of the build (PNG iconsets, preview PNGs) still runs normally.
//
// Output: icons/<id>/AppIcon.icon/{icon.json,Assets/*.svg}

import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(ROOT, 'AppIcon.icon');

function hexToFloats(hex) {
  const h = hex.replace('#', '');
  const ch = i => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(5);
  return `${ch(0)},${ch(2)},${ch(4)},1.00000`;
}

const LAYER_COLOR = {
  'radical':  v => v.radical,
  'prompt':   v => v.prompt,
  'top-zone': v => v.top,
};

function applyColors(template, variant) {
  const out = structuredClone(template);
  if (out.fill && 'automatic-gradient' in out.fill) {
    out.fill['automatic-gradient'] = `extended-srgb:${hexToFloats(variant.bg)}`;
  }
  for (const layer of out.groups[0].layers) {
    const get = LAYER_COLOR[layer.name];
    if (get) {
      layer.fill.solid = `extended-srgb:${hexToFloats(get(variant))}`;
    }
  }
  return out;
}

let cache = null;
let warnedMissing = false;

async function loadTemplate() {
  if (cache) return cache;
  const json = JSON.parse(await fs.readFile(path.join(TEMPLATE_DIR, 'icon.json'), 'utf8'));
  const assetsDir = path.join(TEMPLATE_DIR, 'Assets');
  const files = await fs.readdir(assetsDir);
  const assets = Object.fromEntries(
    await Promise.all(files.map(async name => [name, await fs.readFile(path.join(assetsDir, name))]))
  );
  cache = { json, assets };
  return cache;
}

export async function writeIconBundle(variant, variantRoot) {
  if (!existsSync(TEMPLATE_DIR)) {
    if (!warnedMissing) {
      console.log('  (AppIcon.icon/ template not present at repo root — skipping Liquid Glass bundle generation)');
      warnedMissing = true;
    }
    return;
  }
  const tmpl = await loadTemplate();
  const bundleDir = path.join(variantRoot, 'AppIcon.icon');
  const assetsDir = path.join(bundleDir, 'Assets');
  await fs.mkdir(assetsDir, { recursive: true });
  await fs.writeFile(
    path.join(bundleDir, 'icon.json'),
    JSON.stringify(applyColors(tmpl.json, variant), null, 2),
  );
  for (const [name, buf] of Object.entries(tmpl.assets)) {
    await fs.writeFile(path.join(assetsDir, name), buf);
  }
}
