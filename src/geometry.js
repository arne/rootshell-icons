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

// Render the icon as a self-contained SVG string at the given pixel size.
// Layer order (bottom → top):
//   1. bg rect                (flat variant.bg)
//   2. top-zone polygon       (flat variant.top)
//   3. radical polyline       (stroked, off-canvas)
//   4. chevron polyline       (stroked)
//   5. underscore segment     (stroked)
export function renderSVG(variant, px) {
  const g = GEOMETRY;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${variant.bg}"/>
  <polygon points="${topZonePolygon(g)}" fill="${variant.top}"/>
  <path d="${radicalPath(g)}" fill="none" stroke="${variant.radical}" stroke-width="${g.radicalStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${chevronPath(g)}" fill="none" stroke="${variant.prompt}" stroke-width="${g.promptStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${underscorePath(g)}" fill="none" stroke="${variant.prompt}" stroke-width="${g.promptStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}
