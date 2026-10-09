import { h } from '../lib/dom.js';
import { buildWhatsAppLink, SITE } from '../config.js';
import { fuelLabel, vehiclesForProduct } from '../data/products.js';
import { vehicleName } from '../data/vehicles.js';
import { productPhoto } from './media.js';

const PREVIEW_COUNT = 3;

function specRow(label, value) {
  return h('div', {}, h('dt', {}, label), h('dd', {}, value));
}

/** Short fitment summary, e.g. "Toyota Corolla, Honda Civic and 9 more". */
function fitsSummary(product) {
  if (product.universal) return 'Fits most cars. Confirm the connector.';
  const names = vehiclesForProduct(product).map(vehicleName);
  const shown = names.slice(0, PREVIEW_COUNT).join(', ');
  const remaining = names.length - PREVIEW_COUNT;
  return remaining > 0 ? `${shown} and ${remaining} more` : shown;
}

/**
 * Product card.
 * @param {object} product
 * @param {{ onOpen?: (id: string) => void }} options
 * @returns {HTMLElement}
 */
export function createProductCard(product, { onOpen } = {}) {
  const open = () => onOpen?.(product.id);
  const whatsappHref = buildWhatsAppLink(
    `Hello ${SITE.name}, I'd like to enquire about the ${product.name}. Please confirm the price and whether it fits my car.`,
  );

  return h(
    'article',
    { class: 'product-card' },
    h(
      'div',
      { class: 'product-media' },
      h(
        'button',
        { type: 'button', class: 'media-open', onclick: open, 'aria-label': `View photos and details for ${product.name}` },
        productPhoto(product),
      ),
    ),
    h(
      'div',
      { class: 'product-body' },
      h('h3', {}, product.name),
      h('p', { class: 'product-desc' }, product.description),
      h(
        'dl',
        { class: 'spec' },
        specRow('Type', product.typeLabel),
        specRow('Fuel', fuelLabel(product)),
        specRow('Fits', fitsSummary(product)),
      ),
      h(
        'div',
        { class: 'product-actions' },
        h('a', {
          class: 'btn btn-wa',
          href: whatsappHref,
          target: '_blank',
          rel: 'noopener noreferrer',
          'data-track': 'whatsapp-product',
          'data-product': product.id,
          'aria-label': `Ask price for ${product.name} on WhatsApp`,
        }, 'Ask on WhatsApp'),
        h('button', { type: 'button', class: 'btn btn-line', onclick: open }, 'Details'),
      ),
    ),
  );
}
