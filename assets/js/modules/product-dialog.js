import { h, clear } from '../lib/dom.js';
import { buildWhatsAppLink, SITE } from '../config.js';
import { PRODUCTS_BY_ID, fuelLabel, vehiclesForProduct } from '../data/products.js';
import { vehicleName } from '../data/vehicles.js';
import { productPhoto, photosForProduct, vehiclePhoto } from './media.js';

const HASH_PREFIX = '#pump=';
const MAX_CAR_PHOTOS = 8;

function specRow(label, value) {
  return h('div', {}, h('dt', {}, label), h('dd', {}, value));
}

function buildGallery(product, vehicles) {
  const pumpPhotos = photosForProduct(product);
  const pumpItems = pumpPhotos.map((src, index) => ({
    label: pumpPhotos.length > 1 ? `Pump photo ${index + 1} of ${pumpPhotos.length}` : 'Pump',
    image: () =>
      productPhoto(product, { eager: true, photos: [src] }),
    thumb: () =>
      productPhoto(product, { width: 160, height: 120, photos: [src] }),
  }));
  const items = [
    ...pumpItems,
    ...vehicles.slice(0, MAX_CAR_PHOTOS).map((vehicle) => ({
      label: vehicleName(vehicle),
      image: () => vehiclePhoto(vehicle, { eager: true }),
      thumb: () => vehiclePhoto(vehicle, { width: 160, height: 100 }),
    })),
  ];

  const figure = h('figure', { class: 'media gallery-main' });
  const caption = h('p', { class: 'gallery-caption', 'aria-live': 'polite' });

  const thumbButtons = items.map((item, index) =>
    h(
      'button',
      {
        type: 'button',
        class: 'thumb',
        'aria-pressed': String(index === 0),
        'aria-label': `Show ${item.label} photo`,
        onclick: () => show(index),
      },
      item.thumb(),
    ),
  );

  function show(index) {
    const item = items[index];
    figure.replaceChildren(item.image());
    caption.textContent = item.label;
    thumbButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }

  show(0);

  return h('div', { class: 'gallery' }, figure, caption, h('div', { class: 'thumbs' }, thumbButtons));
}

function buildInfo(product, vehicles) {
  const status = h('p', { class: 'share-status', role: 'status' });

  const shareButton = h(
    'button',
    { type: 'button', class: 'btn btn-line', onclick: () => share(product, status) },
    'Share',
  );

  const whatsappHref = buildWhatsAppLink(
    `Hello ${SITE.name}, I'd like to enquire about the ${product.name}. Please confirm the price and fit.`,
  );

  return h(
    'div',
    { class: 'dialog-info' },
    h('p', { class: 'dialog-kicker' }, product.typeLabel),
    h('h2', { id: 'product-dialog-title' }, product.name),
    h('p', { class: 'dialog-desc' }, product.description),
    h(
      'dl',
      { class: 'spec' },
      specRow('Fuel', fuelLabel(product)),
      specRow('Fits', product.universal ? 'Most cars. Confirm the connector.' : `${vehicles.length} car models`),
    ),
    h('h3', { class: 'dialog-h3' }, product.universal ? 'Cars it suits' : 'Cars that use this pump'),
    h('div', { class: 'tags' }, vehicles.map((vehicle) => h('span', { class: 'tag' }, vehicleName(vehicle)))),
    h('h3', { class: 'dialog-h3' }, 'Before you order'),
    h('ul', { class: 'tips' }, product.tips.map((tip) => h('li', {}, tip))),
    h(
      'div',
      { class: 'dialog-actions' },
      h(
        'a',
        {
          class: 'btn btn-wa btn-lg',
          href: whatsappHref,
          target: '_blank',
          rel: 'noopener noreferrer',
          'data-track': 'whatsapp-dialog',
          'data-product': product.id,
        },
        'Ask price on WhatsApp',
      ),
      shareButton,
    ),
    status,
  );
}

async function share(product, status) {
  const url = `${location.href.split('#')[0]}${HASH_PREFIX}${product.id}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: product.name, text: `${product.name}, ${SITE.name}`, url });
    } catch {
      // The visitor cancelled the share sheet. Nothing to report.
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    status.textContent = 'Link copied to clipboard.';
  } catch {
    status.textContent = `Copy this link: ${url}`;
  }
}

/** Sets up the product details dialog and returns its public API. */
export function initProductDialog() {
  const dialog = document.getElementById('product-dialog');
  const content = document.getElementById('product-dialog-content');
  const closeButton = document.getElementById('dialog-close');

  closeButton.addEventListener('click', () => dialog.close());

  // Clicking the backdrop (the dialog element itself) closes the dialog.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    if (location.hash.startsWith(HASH_PREFIX)) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  });

  function open(productId, { updateHash = true } = {}) {
    const product = PRODUCTS_BY_ID[productId];
    if (!product) return;

    const vehicles = vehiclesForProduct(product);
    clear(content);
    content.append(
      h('div', { class: 'dialog-grid' }, buildGallery(product, vehicles), buildInfo(product, vehicles)),
    );

    if (!dialog.open) dialog.showModal();
    content.closest('.dialog-inner').scrollTop = 0;

    if (updateHash) history.replaceState(null, '', `${HASH_PREFIX}${productId}`);
  }

  /** Opens the dialog when the URL contains #pump=<id>. */
  function openFromHash() {
    if (!location.hash.startsWith(HASH_PREFIX)) return;
    try {
      const id = decodeURIComponent(location.hash.slice(HASH_PREFIX.length));
      open(id, { updateHash: false });
    } catch {
      // Malformed hash. Ignore it.
    }
  }

  return { open, openFromHash };
}
