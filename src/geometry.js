// Single source of truth for the RootShell mark geometry.
// All coordinates are in a 100x100 viewBox.

export const GEOMETRY = {
  // Radical — checkmark + vinculum (top bar).
  // Path: tickStart → tickBottom → peak → vincEnd
  tickStartX: 14,  tickStartY: 60,
  tickBottomX: 22, tickBottomY: 82,
  peakX: 36,       peakY: 14,
  vincEndX: 60,    vincEndY: 14,

  // Tilde — sine wave centered at (tildeCenterX, tildeCenterY).
  tildeCenterX: 56,
  tildeCenterY: 52,
  tildeWidth: 33,
  tildeAmp: 8,

  // Stroke
  strokeWidth: 5,
};

// SVG path string for the radical (sans-serif, no terminal flares).
export function radicalPath(g = GEOMETRY) {
  return `M ${g.tickStartX} ${g.tickStartY} L ${g.tickBottomX} ${g.tickBottomY} L ${g.peakX} ${g.peakY} L ${g.vincEndX} ${g.vincEndY}`;
}

// SVG path string for the tilde (two mirrored cubics forming a sine wave).
export function tildePath(g = GEOMETRY) {
  const x0 = g.tildeCenterX - g.tildeWidth / 2;
  const x3 = g.tildeCenterX + g.tildeWidth / 2;
  const cx = g.tildeCenterX;
  const cy = g.tildeCenterY;
  const halfW = g.tildeWidth / 2;
  const cpA = g.tildeAmp * (4 / 3); // Bezier approximation of a quarter sine
  return [
    `M ${x0} ${cy}`,
    `C ${x0 + halfW * 0.25} ${cy - cpA}, ${x0 + halfW * 0.75} ${cy - cpA}, ${cx} ${cy}`,
    `C ${cx + halfW * 0.25} ${cy + cpA}, ${cx + halfW * 0.75} ${cy + cpA}, ${x3} ${cy}`,
  ].join(' ');
}

// Render the icon as a self-contained SVG string at the given pixel size.
export function renderSVG(variant, px) {
  const g = GEOMETRY;
  const tildeStroke = variant.tildeStroke || variant.stroke;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${variant.bg}"/>
      <stop offset="100%" stop-color="${variant.bgEnd}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#bg)"/>
  <path d="${radicalPath(g)}" fill="none" stroke="${variant.stroke}" stroke-width="${g.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${tildePath(g)}" fill="none" stroke="${tildeStroke}" stroke-width="${g.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}
