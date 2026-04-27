// Single source of truth for the RootShell v2 mark geometry.
// All coordinates are in a 100x100 viewBox.

export const GEOMETRY = {
  // Radical polyline — extends off-canvas left and right so that, after the
  // iOS squircle clip, the tick + vinculum read as a continuous frame edge.
  // Path: tickStart → tickBottom → peak → vincEnd
  tickStartX: -4,   tickStartY: 56,
  tickBottomX: 14,  tickBottomY: 77,
  peakX: 36,        peakY: 20,
  vincEndX: 114,    vincEndY: 20,
  radicalStrokeWidth: 12,

  // Top-zone polygon — fills everything above/right of the radical.
  // Starts along the radical, then sweeps to the top-right corner and back.
  topZone: [
    [-4, 56], [14, 77], [36, 20], [114, 20],
    [200, 20], [200, -100], [-4, -100],
  ],

  // Chevron `>` — apex at (53,60), arms reach back to x=43.
  chevronTopX: 43,    chevronTopY: 50,
  chevronApexX: 53,   chevronApexY: 60,
  chevronBottomX: 43, chevronBottomY: 70,

  // Underscore `_` — horizontal segment.
  underscoreLeftX: 62,  underscoreLeftY: 71,
  underscoreRightX: 74, underscoreRightY: 71,

  // Stroke for prompt (chevron + underscore).
  promptStrokeWidth: 6,
};

export function radicalPath(g = GEOMETRY) {
  return `M ${g.tickStartX} ${g.tickStartY} L ${g.tickBottomX} ${g.tickBottomY} L ${g.peakX} ${g.peakY} L ${g.vincEndX} ${g.vincEndY}`;
}

export function topZonePolygon(g = GEOMETRY) {
  return g.topZone.map(p => p.join(',')).join(' ');
}

export function chevronPath(g = GEOMETRY) {
  return `M ${g.chevronTopX} ${g.chevronTopY} L ${g.chevronApexX} ${g.chevronApexY} L ${g.chevronBottomX} ${g.chevronBottomY}`;
}

export function underscorePath(g = GEOMETRY) {
  return `M ${g.underscoreLeftX} ${g.underscoreLeftY} L ${g.underscoreRightX} ${g.underscoreRightY}`;
}

// Darken a hex color by `amount` in HSL lightness (0..1). Used to derive the
// bottom stop of each gradient — cheap, deterministic, no manual second-color
// per variant.
function darken(hex, amount = 0.08) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, sat = 0;
  let lit = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = lit > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r)      hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) hue = ((b - r) / d + 2) / 6;
    else                hue = ((r - g) / d + 4) / 6;
  }
  lit = Math.max(0, lit - amount);
  const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = lit < 0.5 ? lit * (1 + sat) : lit + sat - lit * sat;
  const p = 2 * lit - q;
  const r2 = hueToRgb(p, q, hue + 1/3);
  const g2 = hueToRgb(p, q, hue);
  const b2 = hueToRgb(p, q, hue - 1/3);
  const toHex = n => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}

// Render the icon as a self-contained SVG string at the given pixel size.
// Layer order (bottom → top):
//   1. bg gradient rect       (variant.bg → darken(variant.bg))
//   2. top-zone polygon       (variant.top → darken(variant.top))
//   3. radical polyline       (stroked, off-canvas)
//   4. chevron polyline       (stroked)
//   5. underscore segment     (stroked)
export function renderSVG(variant, px) {
  const g = GEOMETRY;
  const bgEnd = darken(variant.bg);
  const topEnd = darken(variant.top);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${variant.bg}"/>
      <stop offset="100%" stop-color="${bgEnd}"/>
    </linearGradient>
    <linearGradient id="top" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${variant.top}"/>
      <stop offset="100%" stop-color="${topEnd}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#bg)"/>
  <polygon points="${topZonePolygon(g)}" fill="url(#top)"/>
  <path d="${radicalPath(g)}" fill="none" stroke="${variant.radical}" stroke-width="${g.radicalStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${chevronPath(g)}" fill="none" stroke="${variant.prompt}" stroke-width="${g.promptStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${underscorePath(g)}" fill="none" stroke="${variant.prompt}" stroke-width="${g.promptStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}
