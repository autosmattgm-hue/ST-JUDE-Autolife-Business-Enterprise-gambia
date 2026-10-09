import { h } from '../lib/dom.js';
import { buildWhatsAppLink, SITE } from '../config.js';
import { PRODUCTS, fuelLabel, vehiclesForProduct } from '../data/products.js';
import { vehicleName } from '../data/vehicles.js';
import { createProductCard } from './product-card.js';

const CATEGORIES = [
  ['all', 'All pumps'],
  ['in-tank', 'In-tank'],
  ['external', 'External'],
  ['mechanical', 'Mechanical'],
  ['module', 'Modules and senders'],
  ['accessories', 'Accessories'],
];

const DEFAULT_SORT = 'name';

/**
 * @param {{ onOpen: (id: string) => void }} options
 */
export function initCatalogue({ onOpen }) {
  const searchInput = document.getElementById('catalogue-search');
  const sortSelect = document.getElementById('catalogue-sort');
  const chipRow = document.getElementById('category-chips');
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('catalogue-count');
  const emptyEl = document.getElementById('catalogue-empty');
  const emptyWhatsApp = document.getElementById('catalogue-empty-wa');
  const resetBtn = document.getElementById('catalogue-reset');

  const state = { query: '', category: 'all', sort: DEFAULT_SORT };

  // Pre-compute a search index once. Universal pumps are not matched by car name.
  const index = PRODUCTS.map((product) => {
    const carNames = product.universal ? '' : vehiclesForProduct(product).map(vehicleName).join(' ');
    const text = [product.name, product.description, product.typeLabel, fuelLabel(product), carNames]
      .join(' ')
      .toLowerCase();
    return { product, text, fitCount: product.universal ? 0 : product.fits.length };
  });

  chipRow.replaceChildren(
    ...CATEGORIES.map(([value, label]) =>
      h('button', { type: 'button', class: 'chip', 'data-category': value, 'aria-pressed': 'false' }, label),
    ),
  );

  chipRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    render();
  });

  function visibleProducts() {
    const query = state.query.trim().toLowerCase();

    const matches = index.filter(
      ({ product, text }) =>
        (state.category === 'all' || product.category === state.category) &&
        (!query || text.includes(query)),
    );

    matches.sort((a, b) =>
      state.sort === 'fits'
        ? b.fitCount - a.fitCount || a.product.name.localeCompare(b.product.name)
        : a.product.name.localeCompare(b.product.name),
    );

    return matches.map((match) => match.product);
  }

  function render() {
    const products = visibleProducts();

    grid.replaceChildren(...products.map((product) => createProductCard(product, { onOpen })));

    countEl.textContent = products.length === 1 ? '1 pump found' : `${products.length} pumps found`;
    emptyEl.hidden = products.length > 0;

    const query = state.query.trim();
    emptyWhatsApp.href = buildWhatsAppLink(
      query
        ? `Hello ${SITE.name}, do you have a fuel pump for ${query}?`
        : `Hello ${SITE.name}, I need help finding a fuel pump for my car.`,
    );

    chipRow.querySelectorAll('[data-category]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.category === state.category));
    });

    resetBtn.hidden = !(state.query || state.category !== 'all' || state.sort !== DEFAULT_SORT);
  }

  searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    render();
  });

  sortSelect.addEventListener('change', (event) => {
    state.sort = event.target.value;
    render();
  });

  resetBtn.addEventListener('click', () => {
    state.query = '';
    state.category = 'all';
    state.sort = DEFAULT_SORT;
    searchInput.value = '';
    sortSelect.value = DEFAULT_SORT;
    render();
  });

  render();
}
