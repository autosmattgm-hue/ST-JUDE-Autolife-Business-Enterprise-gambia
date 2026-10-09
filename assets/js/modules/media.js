import { h } from '../lib/dom.js';
import { carSvg, pumpSvg, toDataUri } from '../lib/illustrations.js';
import { vehicleName } from '../data/vehicles.js';

/** Ordered, de-duplicated real photos for this exact catalogue product. */
export function photosForProduct(product) {
  const own = product.photos && product.photos.length > 0 ? product.photos : [product.photo];
  return [...new Set(own)];
}

/**
 * Creates an <img> that walks through this product's real photos before
 * falling back to a drawn illustration only when every photo fails to load.
 */
export function createImage({ src, fallbacks = [], fallback, alt, width, height, eager = false, className }) {
  const img = h('img', {
    alt,
    width,
    height,
    class: className,
    decoding: 'async',
    loading: eager ? 'eager' : 'lazy',
  });
  // Walk the chain: product photos -> drawn illustration.
  const chain = [src, ...fallbacks, fallback].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index);
  let step = 0;
  img.addEventListener('error', () => {
    if (step >= chain.length - 1) return;
    step += 1;
    img.src = chain[step];
  });
  img.src = chain[0] || fallback;
  return img;
}

/** Pump photo with illustration fallback. Options override the defaults. */
export function productPhoto(product, options = {}) {
  const { photos: overridePhotos, ...rest } = options;
  const single =
    overridePhotos && overridePhotos.length === 1 ? overridePhotos[0] : null;
  // Gallery thumbs lock to one photo; cards walk the product photo chain.
  const chain = single ? [single] : photosForProduct(product);
  return createImage({
    src: chain[0],
    fallbacks: chain,
    fallback: toDataUri(pumpSvg(product.art)),
    alt: product.alt,
    width: 800,
    height: 600,
    ...rest,
  });
}

/**
 * Car photo. No car photos ship yet, so every car shows a branded
 * illustration with its real name (e.g. Mercedes-Benz E-Class W124).
 */
export function vehiclePhoto(vehicle, options = {}) {
  return createImage({
    src: vehicle.photo,
    fallback: toDataUri(carSvg({ body: vehicle.body, caption: vehicleName(vehicle), make: vehicle.make })),
    alt: vehicleName(vehicle),
    width: 800,
    height: 500,
    ...options,
  });
}
