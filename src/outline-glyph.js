// Generates stroke-free per-layer SVGs for Icon Composer.
// Icon Composer (iOS 26 / Liquid Glass) renders strokes inconsistently —
// filled paths render correctly. Each stroked element here is converted to
// a union of overlapping rectangles (segments) and discs (vertices/caps).
//
// Run: node src/outline-glyph.js
//
// Output (all at repo root):
//   radical.svg   — outlined polyline (filled)
//   prompt.svg    — outlined chevron + outlined underscore (filled, combined)
//   top-zone.svg  — closed polygon (already a fill — no outlining needed)
//   glyph.svg     — combined radical + prompt (single-color, for inline UI)

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GEOMETRY } from './geometry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const g = GEOMETRY;

const add  = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub  = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul  = (a, s) => [a[0] * s, a[1] * s];
const norm = a => { const l = Math.hypot(a[0], a[1]); return l ? [a[0]/l, a[1]/l] : [0,0]; };
const perp = a => [-a[1], a[0]];
const f    = n => Number(n.toFixed(4));

function rect(p1, p2, r) {
  const n = mul(perp(norm(sub(p2, p1))), r);
  const a = add(p1, n), b = add(p2, n), c = sub(p2, n), d = sub(p1, n);
  return `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}L${f(c[0])} ${f(c[1])}L${f(d[0])} ${f(d[1])}Z`;
}

function disc(p, r) {
  const [cx, cy] = p;
  return `M${f(cx-r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx+r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx-r)} ${f(cy)}Z`;
}

function outlinePolyline(pts, r) {
  const parts = [];
  for (let i = 0; i < pts.length - 1; i++) parts.push(rect(pts[i], pts[i+1], r));
  for (const p of pts) parts.push(disc(p, r));
  return parts.join('');
}

const radicalPts = [
  [g.tickStartX,  g.tickStartY],
  [g.tickBottomX, g.tickBottomY],
  [g.peakX,       g.peakY],
  [g.vincEndX,    g.vincEndY],
];
const radicalD = outlinePolyline(radicalPts, g.radicalStrokeWidth / 2);

const chevronPts = [
  [g.chevronTopX,    g.chevronTopY],
  [g.chevronApexX,   g.chevronApexY],
  [g.chevronBottomX, g.chevronBottomY],
];
const underscorePts = [
  [g.underscoreLeftX,  g.underscoreLeftY],
  [g.underscoreRightX, g.underscoreRightY],
];
const promptD = outlinePolyline(chevronPts, g.promptStrokeWidth / 2)
              + outlinePolyline(underscorePts, g.promptStrokeWidth / 2);

const topZonePoints = g.topZone.map(p => `${f(p[0])},${f(p[1])}`).join(' ');

function svgPath(d, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024"
     role="img" aria-label="RootShell — ${label}">
  <path d="${d}" fill="currentColor" fill-rule="nonzero"/>
</svg>
`;
}

const topZoneSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024"
     role="img" aria-label="RootShell — top zone">
  <polygon points="${topZonePoints}" fill="currentColor"/>
</svg>
`;

const combined = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024"
     role="img" aria-label="RootShell">
  <path id="radical" d="${radicalD}" fill="currentColor" fill-rule="nonzero"/>
  <path id="prompt"  d="${promptD}"  fill="currentColor" fill-rule="nonzero"/>
</svg>
`;

writeFileSync(path.join(ROOT, 'glyph.svg'),    combined);
writeFileSync(path.join(ROOT, 'radical.svg'),  svgPath(radicalD, 'radical'));
writeFileSync(path.join(ROOT, 'prompt.svg'),   svgPath(promptD,  'prompt'));
writeFileSync(path.join(ROOT, 'top-zone.svg'), topZoneSvg);
console.log('Wrote glyph.svg, radical.svg, prompt.svg, top-zone.svg');
