// Generate an iOS 26+ / Liquid Glass .icon bundle per variant.
// Uses icon.icon/ at the repo root as a template — only the fill colours
// are swapped per variant; layer geometry, glass settings, shadow, and
// translucency are preserved verbatim.
//
// Output: icons/<id>/AppIcon.icon/{icon.json,Assets/{radical.svg,tilde.svg}}

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(ROOT, 'icon.icon');

function hexToFloats(hex) {
  const h = hex.replace('#', '');
  const ch = i => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(5);
  return `${ch(0)},${ch(2)},${ch(4)},1.00000`;
}

function applyColors(template, variant) {
  const out = structuredClone(template);
  out.fill['automatic-gradient'] = `extended-srgb:${hexToFloats(variant.bg)}`;
  for (const layer of out.groups[0].layers) {
    if (layer.name === 'radical') {
      layer.fill.solid = `extended-srgb:${hexToFloats(variant.stroke)}`;
    } else if (layer.name === 'tilde') {
      layer.fill.solid = `extended-srgb:${hexToFloats(variant.tildeStroke || variant.stroke)}`;
    }
  }
  return out;
}

let cache = null;
async function loadTemplate() {
  if (cache) return cache;
  const [json, radical, tilde] = await Promise.all([
    fs.readFile(path.join(TEMPLATE_DIR, 'icon.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(TEMPLATE_DIR, 'Assets', 'radical.svg')),
    fs.readFile(path.join(TEMPLATE_DIR, 'Assets', 'tilde.svg')),
  ]);
  cache = { json, radical, tilde };
  return cache;
}

export async function writeIconBundle(variant, variantRoot) {
  const tmpl = await loadTemplate();
  const bundleDir = path.join(variantRoot, 'AppIcon.icon');
  const assetsDir = path.join(bundleDir, 'Assets');
  await fs.mkdir(assetsDir, { recursive: true });
  await fs.writeFile(
    path.join(bundleDir, 'icon.json'),
    JSON.stringify(applyColors(tmpl.json, variant), null, 2),
  );
  await fs.writeFile(path.join(assetsDir, 'radical.svg'), tmpl.radical);
  await fs.writeFile(path.join(assetsDir, 'tilde.svg'), tmpl.tilde);
}
