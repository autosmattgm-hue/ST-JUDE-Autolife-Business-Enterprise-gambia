import { attachFallback, carSvg, pumpSvg, storefrontSvg, toDataUri } from './lib/illustrations.js';
import { initNav } from './modules/nav.js';
import { initFinder } from './modules/finder.js';
import { initCatalogue } from './modules/catalogue.js';
import { initCars } from './modules/cars.js';
import { initProductDialog } from './modules/product-dialog.js';
import { initEnquiry } from './modules/enquiry.js';
import { initAssistant } from './modules/assistant-ui.js';

/**
 * Static <img data-fallback="pump|car|store"> elements in the HTML get the
 * matching illustration if their photo is missing.
 */
function hydrateStaticImages() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    const { fallback, style, body, make, label } = img.dataset;
    let svg;
    if (fallback === 'car') svg = carSvg({ body, caption: label, make });
    else if (fallback === 'store') svg = storefrontSvg();
    else svg = pumpSvg({ style, label });
    attachFallback(img, toDataUri(svg));
  });
}

/** Scrolls smoothly unless the visitor prefers reduced motion. */
function scrollIntoViewRespectingMotion(element) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

function init() {
  hydrateStaticImages();
  initNav();

  const dialog = initProductDialog();
  const finder = initFinder({ onOpen: dialog.open });

  initCatalogue({ onOpen: dialog.open });

  initCars({
    onSelectVehicle: (vehicleId) => {
      finder.selectVehicle(vehicleId);
      scrollIntoViewRespectingMotion(document.getElementById('finder'));
    },
  });

  initEnquiry();

  initAssistant();

  dialog.openFromHash();
  window.addEventListener('hashchange', dialog.openFromHash);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Analytics hook. Works once a GA4 tag is added (see README).
  document.addEventListener('click', (event) => {
    const element = event.target.closest('[data-track]');
    if (!element || typeof window.gtag !== 'function') return;
    window.gtag('event', element.dataset.track, {
      product_id: element.dataset.product,
    });
  });
}

init();
