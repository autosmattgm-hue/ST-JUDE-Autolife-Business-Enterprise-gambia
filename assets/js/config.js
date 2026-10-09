/**
 * Central business configuration. Edit here when contact details change.
 * The static links in index.html use the same WhatsApp number, so update both.
 */
export const SITE = Object.freeze({
  name: 'ST JUDE Autolife Business Enterprise',
  shortName: 'ST JUDE Autolife',
  country: 'The Gambia',
  // wa.me links use international format with no "+" or spaces.
  whatsappNumber: '2204030870',
  phoneDisplay: '+220 403 0870',
  phoneHref: '+2204030870',
  // Coordinates resolved from https://maps.app.goo.gl/XDn46TD87VfBm9hy8
  mapsPlaceUrl: 'https://www.google.com/maps/place/13.416826,-16.674595',
  mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.416826,-16.674595',
  mapsEmbedUrl: 'https://www.google.com/maps?q=13.416826,-16.674595&z=17&output=embed',
});

/**
 * Builds a WhatsApp link with a pre-filled, URL-encoded message.
 * @param {string} message Plain-text message.
 * @returns {string}
 */
export function buildWhatsAppLink(message) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
