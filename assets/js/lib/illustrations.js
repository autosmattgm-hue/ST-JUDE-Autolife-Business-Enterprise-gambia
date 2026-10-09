/**
 * Illustration fallbacks. When a real photo is missing, the site shows one of
 * these SVG drawings instead, so every card looks finished. Drop a real photo
 * into the matching folder and it replaces the illustration automatically.
 */

const INK = '#111418';
const BODY = '#2b313b';
const STEEL_LIGHT = '#f3f5f8';
const STEEL_DARK = '#9aa3b0';
const GLASS = '#cfd8e3';
const PAPER = '#f4f5f2';
const ACCENT = '#ffc61a';
const DISPLAY_FONT = 'Barlow Condensed, Arial Narrow, Arial, sans-serif';
const BODY_FONT = 'Barlow, Arial, sans-serif';

/** Brand colour per make, so Toyota / Benz / Honda tiles look different. */
const MAKE_COLORS = {
  Toyota: '#2b313b',
  Honda: '#1d4ed8',
  Nissan: '#6b7280',
  Hyundai: '#1e3a8a',
  Kia: '#111418',
  Mitsubishi: '#b42318',
  Mazda: '#9a1b1e',
  'Mercedes-Benz': '#0f766e',
  Isuzu: '#0e7c3a',
};

/** Small badge letter(s) drawn on the car door, e.g. T for Toyota, star for Benz. */
function makeBadge(make) {
  if (make === 'Mercedes-Benz') return '★';
  return (make || '?').charAt(0).toUpperCase();
}

const XML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes text placed inside SVG markup. */
export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);
}

function svgDocument(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false">` +
    `<defs><linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="${STEEL_LIGHT}"/><stop offset="0.5" stop-color="${STEEL_DARK}"/>` +
    `<stop offset="1" stop-color="${STEEL_LIGHT}"/></linearGradient></defs>` +
    `<rect width="${width}" height="${height}" fill="${PAPER}"/>${body}</svg>`;
}

const PUMP_STYLES = {
  vertical: (label) => `
    <rect x="186" y="24" width="28" height="38" rx="4" fill="${BODY}"/>
    <rect x="128" y="56" width="144" height="24" rx="6" fill="${INK}"/>
    <rect x="150" y="78" width="100" height="162" rx="22" fill="url(#steel)" stroke="${INK}" stroke-width="2"/>
    <rect x="150" y="128" width="100" height="40" fill="${ACCENT}" stroke="${INK}" stroke-width="2"/>
    <text x="200" y="154" text-anchor="middle" font-family="${DISPLAY_FONT}" font-weight="800" font-size="18" fill="${INK}">${label}</text>
    <rect x="246" y="196" width="34" height="16" rx="3" fill="${BODY}"/>
    <rect x="170" y="236" width="60" height="22" rx="6" fill="${INK}"/>`,

  inline: (label) => `
    <rect x="74" y="112" width="252" height="76" rx="38" fill="url(#steel)" stroke="${INK}" stroke-width="2"/>
    <rect x="52" y="136" width="30" height="28" rx="5" fill="${BODY}"/>
    <rect x="318" y="136" width="30" height="28" rx="5" fill="${BODY}"/>
    <rect x="144" y="134" width="112" height="32" rx="6" fill="${ACCENT}" stroke="${INK}" stroke-width="2"/>
    <text x="200" y="156" text-anchor="middle" font-family="${DISPLAY_FONT}" font-weight="800" font-size="17" fill="${INK}">${label}</text>`,

  mechanical: (label) => `
    <rect x="92" y="150" width="46" height="24" rx="5" fill="${BODY}"/>
    <rect x="130" y="104" width="140" height="110" rx="16" fill="url(#steel)" stroke="${INK}" stroke-width="2"/>
    <circle cx="200" cy="150" r="30" fill="${INK}"/>
    <circle cx="200" cy="150" r="10" fill="${STEEL_DARK}"/>
    <circle cx="146" cy="120" r="4" fill="${INK}"/>
    <circle cx="254" cy="120" r="4" fill="${INK}"/>
    <circle cx="146" cy="198" r="4" fill="${INK}"/>
    <circle cx="254" cy="198" r="4" fill="${INK}"/>
    <rect x="262" y="142" width="46" height="24" rx="5" fill="${BODY}"/>
    <text x="200" y="208" text-anchor="middle" font-family="${DISPLAY_FONT}" font-weight="800" font-size="16" fill="${INK}">${label}</text>`,

  relay: (label) => `
    <rect x="112" y="92" width="176" height="122" rx="14" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    <rect x="112" y="92" width="176" height="44" rx="14" fill="${ACCENT}" stroke="${INK}" stroke-width="2"/>
    <text x="200" y="122" text-anchor="middle" font-family="${DISPLAY_FONT}" font-weight="800" font-size="18" fill="${INK}">${label}</text>
    ${[0, 1, 2, 3].map((i) => `<rect x="${140 + i * 36}" y="176" width="18" height="26" rx="3" fill="${STEEL_LIGHT}" stroke="${INK}" stroke-width="1.5"/>`).join('')}`,
};

/**
 * Fuel pump illustration.
 * @param {{ style?: string, label?: string }} options
 * @returns {string} SVG markup
 */
export function pumpSvg({ style = 'vertical', label = '' } = {}) {
  const draw = PUMP_STYLES[style] ?? PUMP_STYLES.vertical;
  const shadow = '<ellipse cx="200" cy="262" rx="130" ry="10" fill="' + INK + '" fill-opacity="0.12"/>';
  return svgDocument(400, 300, shadow + draw(escapeXml(label)));
}

const CAR_BODIES = {
  sedan: 'M36 176 V140 Q36 126 52 122 L112 110 Q138 76 190 72 L252 72 Q290 74 314 104 L356 116 Q372 122 372 140 V176 Z',
  hatch: 'M40 176 V138 Q40 124 56 120 L112 110 Q140 68 210 66 L290 66 Q320 70 336 100 L352 124 Q362 132 362 150 V176 Z',
  suv: 'M34 176 V88 Q34 58 64 58 L318 52 Q344 52 356 84 L368 130 Q370 136 370 146 V176 Z',
  pickup: 'M30 176 V130 Q30 116 44 114 L120 110 Q132 70 170 68 L236 66 Q258 66 264 96 L264 120 L340 120 Q354 120 364 134 L372 176 Z',
};

const CAR_GLASS = {
  sedan: 'M134 110 Q154 84 190 82 L246 82 Q278 84 296 110 Z',
  hatch: 'M134 110 Q156 80 206 78 L282 78 Q306 82 318 104 Z',
  suv: 'M84 88 L94 68 Q98 64 106 64 L290 62 Q306 62 312 74 L328 90 Z',
  pickup: 'M136 112 Q146 84 174 82 L232 80 Q248 80 254 100 L254 112 Z',
};

/**
 * Side-profile car illustration, branded per make.
 * Toyota / Honda / Benz etc get their own body colour + door badge,
 * so the Benz tile reads as a Benz even before a real photo is added.
 * @param {{ body?: string, caption?: string, make?: string }} options
 * @returns {string} SVG markup
 */
export function carSvg({ body = 'sedan', caption = '', make = '' } = {}) {
  const shape = CAR_BODIES[body] ?? CAR_BODIES.sedan;
  const glass = CAR_GLASS[body] ?? CAR_GLASS.sedan;
  const paint = MAKE_COLORS[make] ?? BODY;
  const badge = makeBadge(make);
  const wheel = (cx) =>
    `<circle cx="${cx}" cy="190" r="24" fill="${INK}"/><circle cx="${cx}" cy="190" r="10" fill="${STEEL_DARK}"/>`;

  return svgDocument(
    400,
    250,
    `<ellipse cx="200" cy="216" rx="172" ry="7" fill="${INK}" fill-opacity="0.12"/>` +
      `<path d="${shape}" fill="${paint}" stroke="${INK}" stroke-width="2"/>` +
      `<path d="${glass}" fill="${GLASS}" stroke="${INK}" stroke-width="1.5"/>` +
      `<circle cx="200" cy="145" r="16" fill="#ffffff" fill-opacity="0.92" stroke="${INK}" stroke-width="1.5"/>` +
      `<text x="200" y="151" text-anchor="middle" font-family="${DISPLAY_FONT}" font-weight="800" font-size="16" fill="${INK}">${escapeXml(badge)}</text>` +
      wheel(100) +
      wheel(300) +
      `<text x="200" y="240" text-anchor="middle" font-family="${BODY_FONT}" font-weight="700" font-size="15" fill="${INK}">${escapeXml(caption)}</text>`,
  );
}

/**
 * Storefront illustration with the business sign.
 * @returns {string} SVG markup
 */
export function storefrontSvg() {
  const awning = Array.from({ length: 8 }, (_, i) =>
    `<rect x="${40 + i * 40}" y="100" width="40" height="22" fill="${i % 2 ? INK : ACCENT}"/>`,
  ).join('');

  return svgDocument(
    400,
    300,
    `<rect x="0" y="262" width="400" height="38" fill="#e5e8ec"/>` +
      `<rect x="40" y="70" width="320" height="192" fill="#ffffff" stroke="${INK}" stroke-width="2"/>` +
      `<rect x="40" y="48" width="320" height="38" fill="${ACCENT}" stroke="${INK}" stroke-width="2"/>` +
      `<text x="200" y="75" text-anchor="middle" font-family="${DISPLAY_FONT}" font-weight="800" font-size="22" fill="${INK}">ST JUDE AUTOLIFE</text>` +
      awning +
      `<rect x="64" y="136" width="112" height="90" fill="${GLASS}" stroke="${INK}" stroke-width="2"/>` +
      `<rect x="196" y="150" width="60" height="112" fill="${BODY}"/>` +
      `<rect x="280" y="136" width="56" height="90" fill="${GLASS}" stroke="${INK}" stroke-width="2"/>`,
  );
}

/** Converts SVG markup to a data URI usable as an <img> src (allowed by CSP img-src data:). */
export function toDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Swaps in the fallback illustration if the image fails to load.
 * Also handles images that failed before this script attached its listener.
 * @param {HTMLImageElement} img
 * @param {string} fallbackSrc data URI
 */
export function attachFallback(img, fallbackSrc) {
  const applyFallback = () => {
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.src = fallbackSrc;
  };

  img.addEventListener('error', applyFallback);
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) applyFallback();
}
