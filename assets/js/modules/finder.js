import { h, clear } from '../lib/dom.js';
import { buildWhatsAppLink, SITE } from '../config.js';
import { PRODUCTS, productFitsVehicle } from '../data/products.js';
import { MAKES, VEHICLES_BY_ID, vehicleName, vehiclesByMake } from '../data/vehicles.js';
import { vehiclePhoto } from './media.js';
import { createProductCard } from './product-card.js';

const FUEL_OPTIONS = [
  ['any', 'Not sure'],
  ['petrol', 'Petrol'],
  ['diesel', 'Diesel'],
];

/**
 * @param {{ onOpen: (id: string) => void }} options
 * @returns {{ selectVehicle: (vehicleId: string) => void }}
 */
export function initFinder({ onOpen }) {
  const makeSelect = document.getElementById('finder-make');
  const modelSelect = document.getElementById('finder-model');
  const fuelSelect = document.getElementById('finder-fuel');
  const previewEl = document.getElementById('finder-preview');
  const summaryEl = document.getElementById('finder-summary');
  const resultsEl = document.getElementById('finder-results');
  const whatsappEl = document.getElementById('finder-wa');

  clear(makeSelect);
  makeSelect.append(
    h('option', { value: '' }, 'Choose make'),
    ...MAKES.map((make) => h('option', { value: make }, make)),
  );

  clear(fuelSelect);
  fuelSelect.append(...FUEL_OPTIONS.map(([value, label]) => h('option', { value }, label)));

  function populateModels(make) {
    clear(modelSelect);
    modelSelect.append(
      h('option', { value: '' }, make ? 'Choose model' : 'Choose a make first'),
      ...(make ? vehiclesByMake(make).map((vehicle) => h('option', { value: vehicle.id }, vehicle.model)) : []),
    );
    modelSelect.disabled = !make;
  }

  function render() {
    const vehicle = VEHICLES_BY_ID[modelSelect.value];
    const fuel = fuelSelect.value;

    if (!vehicle) {
      previewEl.replaceChildren();
      summaryEl.textContent = 'Choose a make and model to see the pumps that fit your car.';
      resultsEl.replaceChildren();
      whatsappEl.href = buildWhatsAppLink(`Hello ${SITE.name}, I need a fuel pump. Can you help me find the right one?`);
      return;
    }

    const name = vehicleName(vehicle);
    const fuelText = fuel === 'any' ? '' : ` (${fuel})`;
    const matches = PRODUCTS.filter(
      (product) => productFitsVehicle(product, vehicle.id) && (fuel === 'any' || product.fuel.includes(fuel)),
    );

    previewEl.replaceChildren(vehiclePhoto(vehicle, { eager: true }));

    summaryEl.textContent = matches.length
      ? `${matches.length} pump${matches.length === 1 ? '' : 's'} for the ${name}${fuelText}`
      : `No pumps listed for the ${name}${fuelText} yet. Ask us, and we'll check.`;

    resultsEl.replaceChildren(
      ...matches.map((product) => createProductCard(product, { onOpen })),
    );

    whatsappEl.href = buildWhatsAppLink(
      `Hello ${SITE.name}, I need a fuel pump for my ${name}${fuelText}. Please check availability and price.`,
    );
  }

  makeSelect.addEventListener('change', () => {
    populateModels(makeSelect.value);
    render();
  });
  modelSelect.addEventListener('change', render);
  fuelSelect.addEventListener('change', render);

  populateModels('');
  render();

  /** Sets the finder to a given vehicle, used by the "Cars we cover" grid. */
  function selectVehicle(vehicleId) {
    const vehicle = VEHICLES_BY_ID[vehicleId];
    if (!vehicle) return;
    makeSelect.value = vehicle.make;
    populateModels(vehicle.make);
    modelSelect.value = vehicle.id;
    render();
  }

  return { selectVehicle };
}
