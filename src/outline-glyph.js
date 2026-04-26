// Generates a stroke-free glyph.svg by outlining the radical + tilde
// geometry into filled shapes. Icon Composer (iOS 26 / Liquid Glass)
// renders strokes inconsistently — filled paths render correctly.
//
// Approach: union of overlapping primitives with fill-rule=nonzero.
//   - each line segment → rectangle
//   - each vertex / cap   → circle
//   - bezier curves are flattened to a high-resolution polyline first
//
// Run:  node src/outline-glyph.js  (writes ./glyph.svg)

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GEOMETRY } from './geometry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const g = GEOMETRY;
const R = g.strokeWidth / 2;

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

function flattenCubic(p0, p1, p2, p3, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    pts.push([
      u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
      u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1],
    ]);
  }
  return pts;
}

function outlinePolyline(pts, r) {
  const parts = [];
  for (let i = 0; i < pts.length - 1; i++) parts.push(rect(pts[i], pts[i+1], r));
  for (const p of pts) parts.push(disc(p, r));
  return parts.join('');
}

// Radical — checkmark + vinculum
const radical = [
  [g.tickStartX,  g.tickStartY],
  [g.tickBottomX, g.tickBottomY],
  [g.peakX,       g.peakY],
  [g.vincEndX,    g.vincEndY],
];

// Tilde — two cubic beziers, sampled densely, joined into a polyline
const cx = g.tildeCenterX, cy = g.tildeCenterY;
const halfW = g.tildeWidth / 2;
const cpA = g.tildeAmp * (4/3);
const x0 = cx - halfW, x3 = cx + halfW;

const SUBDIV = 48; // per cubic; total tilde polyline = 2*48 + 1 = 97 points
const tilde = [
  ...flattenCubic([x0, cy], [x0 + halfW*0.25, cy - cpA], [x0 + halfW*0.75, cy - cpA], [cx, cy], SUBDIV),
  ...flattenCubic([cx, cy], [cx + halfW*0.25, cy + cpA], [cx + halfW*0.75, cy + cpA], [x3, cy], SUBDIV).slice(1),
];

const radicalD = outlinePolyline(radical, R);
const tildeD   = outlinePolyline(tilde, R);

function svgFor(d, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024"
     role="img" aria-label="RootShell — ${label}">
  <path d="${d}" fill="currentColor" fill-rule="nonzero"/>
</svg>
`;
}

// Combined glyph — for inline UI use (single-colour rendering)
const combined = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024"
     role="img" aria-label="RootShell">
  <path id="radical" d="${radicalD}" fill="currentColor" fill-rule="nonzero"/>
  <path id="tilde"   d="${tildeD}"   fill="currentColor" fill-rule="nonzero"/>
</svg>
`;

// Per-layer SVGs — drop each into Icon Composer as its own layer
writeFileSync(path.join(ROOT, 'glyph.svg'),   combined);
writeFileSync(path.join(ROOT, 'radical.svg'), svgFor(radicalD, 'radical'));
writeFileSync(path.join(ROOT, 'tilde.svg'),   svgFor(tildeD,   'tilde'));
console.log(`Wrote glyph.svg, radical.svg, tilde.svg`);
