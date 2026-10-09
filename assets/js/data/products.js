import { VEHICLES, VEHICLES_BY_ID } from './vehicles.js';

/**
 * Pump catalogue. Add or edit products here; the whole site renders from this list.
 *
 * Fields:
 *  id          Unique slug. Also the photo file name: assets/images/products/<id>.jpg
 *  name        Display name
 *  category    in-tank | external | mechanical | module | accessories
 *  fuel        Array: ['petrol'], ['diesel'] or both
 *  typeLabel   Short spec value shown on cards
 *  description One-line plain-language description
 *  fits        Vehicle ids from data/vehicles.js (typical applications)
 *  universal   true = fits most cars (matched by connector). Ignores `fits`.
 *  art         Fallback illustration: { style: vertical|inline|mechanical|relay, label }
 *  tips        Short buying tips shown in the product details
 *  alt         Optional alt text (defaults to name)
 */
const RAW_PRODUCTS = [
  {
    id: 'in-tank-petrol',
    name: 'Electric In-Tank Fuel Pump (Petrol)',
    category: 'in-tank',
    fuel: ['petrol'],
    typeLabel: 'In-tank, petrol',
    description: 'Submersible pump fitted inside the fuel tank. The most common design on modern petrol cars.',
    fits: [
      'toyota-corolla', 'toyota-camry', 'toyota-vitz', 'honda-civic', 'honda-accord',
      'nissan-sunny', 'nissan-almera', 'hyundai-elantra', 'kia-rio', 'mitsubishi-lancer', 'mazda-3',
    ],
    art: { style: 'vertical', label: 'Petrol' },
    photos: ['in-tank-petrol.jpg', 'in-tank-petrol-2.jpg', 'in-tank-petrol-3.jpg'],
    tips: [
      'Check the flange and connector on your old pump before ordering.',
      'If the fuel gauge reads wrong, the sender may be at fault. Ask us to check it.',
    ],
  },
  {
    id: 'in-tank-diesel',
    name: 'Electric In-Tank Fuel Pump (Diesel)',
    category: 'in-tank',
    fuel: ['diesel'],
    typeLabel: 'In-tank, diesel',
    description: 'Electric in-tank pump built for the flow and pressure needs of diesel engines.',
    fits: [
      'toyota-prado', 'hyundai-tucson', 'hyundai-santa-fe', 'kia-sorento',
      'kia-sportage', 'mitsubishi-pajero', 'nissan-xtrail',
    ],
    art: { style: 'vertical', label: 'Diesel' },
    photos: ['in-tank-diesel.jpg'],
    tips: [
      'Diesel pumps need the correct flow and pressure rating. Send us your engine code.',
      'Replace the fuel filter when you fit a new pump, to protect it.',
    ],
  },
  {
    id: 'suv-fuel-module',
    name: 'Fuel Pump Module with Sender',
    category: 'module',
    fuel: ['petrol'],
    typeLabel: 'Complete module',
    description: 'Pump, fuel-level sender and housing in one assembly. Often the simplest fix when the whole unit has failed.',
    fits: [
      'honda-crv', 'toyota-rav4', 'kia-sportage', 'hyundai-tucson', 'nissan-xtrail', 'nissan-patrol',
    ],
    art: { style: 'vertical', label: 'Module' },
    photos: ['suv-fuel-module.jpg', 'suv-fuel-module-2.jpg'],
    tips: [
      'A complete module saves time, because the sender and housing come with the pump.',
      'Check the module flange size against your tank opening.',
    ],
  },
  {
    id: 'fuel-level-sender',
    name: 'Fuel Level Sender Unit',
    category: 'module',
    fuel: ['petrol'],
    typeLabel: 'Sender unit',
    description: 'Fuel gauge sender that reports tank level. Replace it if the gauge reads wrong or jumps.',
    fits: ['honda-civic', 'honda-accord', 'toyota-camry', 'nissan-sunny', 'nissan-almera'],
    art: { style: 'vertical', label: 'Sender' },
    photos: ['fuel-level-sender.jpg'],
    tips: [
      'Worn senders make the gauge jump or stick.',
      'Check the float arm moves freely before you refit.',
    ],
  },
  {
    id: 'external-inline-petrol',
    name: 'External Inline Electric Fuel Pump',
    category: 'external',
    fuel: ['petrol'],
    typeLabel: 'External, inline',
    description: 'Inline pump mounted on the fuel line outside the tank. Used on many older and aftermarket setups.',
    fits: ['toyota-land-cruiser', 'mitsubishi-pajero', 'nissan-patrol', 'mercedes-w124'],
    art: { style: 'inline', label: 'Inline' },
    photos: ['external-inline-petrol.jpg'],
    tips: [
      'Fit it the way the old pump was, with the flow arrow pointing towards the engine.',
      'Use the correct hose size and clamps for the fuel line.',
    ],
  },
  {
    id: 'mechanical-lift-diesel',
    name: 'Mechanical Fuel Lift Pump',
    category: 'mechanical',
    fuel: ['diesel'],
    typeLabel: 'Mechanical, diesel',
    description: 'Engine-driven lift pump that feeds fuel to the injection pump on diesel engines.',
    fits: ['toyota-hilux', 'toyota-land-cruiser', 'nissan-navara', 'mitsubishi-l200', 'isuzu-dmax'],
    art: { style: 'mechanical', label: 'Lift' },
    photos: ['mechanical-lift-diesel.jpg'],
    tips: [
      'Lift pumps wear with age. Weak lifting shows up as hard starting or lost power.',
      'Bleed the fuel system after fitting, following your engine manual.',
    ],
  },
  {
    id: 'relay-connector-kit',
    name: 'Fuel Pump Relay and Connector Kit',
    category: 'accessories',
    fuel: ['petrol', 'diesel'],
    typeLabel: 'Relay and connector',
    description: 'Relay and plug connector that keeps a replacement pump running reliably. Matched by pin count.',
    universal: true,
    art: { style: 'relay', label: 'Relay' },
    photos: ['relay-connector-kit.jpg'],
    tips: [
      'Match the connector pin count to your old pump plug.',
      'A failing relay can look like a dead pump. Check it before you replace the pump.',
    ],
  },
  {
    id: 'filter-strainer-kit',
    name: 'Fuel Filter Strainer Kit',
    category: 'accessories',
    fuel: ['petrol', 'diesel'],
    typeLabel: 'Strainer kit',
    description: 'Replacement strainer for the pump inlet. Clean fuel protects a new pump from early failure.',
    universal: true,
    art: { style: 'relay', label: 'Filter' },
    photos: ['filter-strainer-kit.jpg'],
    tips: [
      'Fit a new strainer whenever you fit a pump, so debris does not reach the new one.',
      'Check the strainer size against the pump inlet.',
    ],
  },
  {
    id: 'fuel-pressure-regulator',
    name: 'Fuel Pressure Regulator',
    category: 'accessories',
    fuel: ['petrol'],
    typeLabel: 'Pressure regulator',
    description: 'Keeps fuel rail pressure steady. Check its ports before you order.',
    fits: ['toyota-corolla', 'honda-civic', 'hyundai-elantra', 'kia-rio', 'nissan-almera'],
    art: { style: 'relay', label: 'Regulator' },
    photos: ['fuel-pressure-regulator.jpg'],
    tips: [
      'Check the vacuum and fuel ports match your old regulator.',
      'Low fuel pressure can cause hesitation and poor acceleration. Ask us to confirm the fit first.',
    ],
  },
  {
    id: 'toyota-rav4-fuel-module', name: 'Toyota RAV4 Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'RAV4 module',
    description: 'Complete in-tank RAV4 pump module with sender. Confirm year, engine and connector before ordering.', fits: ['toyota-rav4'], art: { style: 'vertical', label: 'RAV4' }, photos: ['toyota-rav4-fuel-module.jpg'],
    tips: ['RAV4 modules vary by generation. Send your VIN or old module photo for confirmation.'],
  },
  {
    id: 'toyota-corolla-fuel-module', name: 'Toyota Corolla Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'Corolla module',
    description: 'Complete Corolla in-tank pump and sender assembly. Match the top connector and tank flange.', fits: ['toyota-corolla'], art: { style: 'vertical', label: 'Corolla' }, photos: ['toyota-corolla-fuel-module.jpg'],
    tips: ['Corolla pump modules differ by model year and engine. Confirm before payment.'],
  },
  {
    id: 'toyota-camry-fuel-module', name: 'Toyota Camry Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'Camry module',
    description: 'In-tank Camry replacement module with pump, sender and housing in one assembly.', fits: ['toyota-camry'], art: { style: 'vertical', label: 'Camry' }, photos: ['toyota-camry-fuel-module.jpg'],
    tips: ['Bring the old Camry module or a clear top-connector photo to match it.'],
  },
  {
    id: 'toyota-land-cruiser-fuel-module', name: 'Toyota Land Cruiser Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'Land Cruiser module',
    description: 'Heavy-duty in-tank fuel module for selected petrol Land Cruiser applications.', fits: ['toyota-land-cruiser'], art: { style: 'vertical', label: 'Land Cruiser' }, photos: ['toyota-land-cruiser-fuel-module.webp'],
    tips: ['Land Cruiser pumps are engine- and year-specific. Confirm the connector and tank opening.'],
  },
  {
    id: 'toyota-vitz-fuel-module', name: 'Toyota Vitz / Yaris Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'Vitz module',
    description: 'Compact in-tank pump module for selected Toyota Vitz, Vios and Yaris petrol cars.', fits: ['toyota-vitz'], art: { style: 'vertical', label: 'Vitz' }, photos: ['toyota-vitz-fuel-module.jpg'],
    tips: ['Verify the 1.0L or 1.5L engine and the module part number before ordering.'],
  },
  {
    id: 'mitsubishi-lancer-fuel-module', name: 'Mitsubishi Lancer Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'Lancer module',
    description: 'Complete replacement in-tank module for selected Mitsubishi Lancer petrol models.', fits: ['mitsubishi-lancer'], art: { style: 'vertical', label: 'Lancer' }, photos: ['mitsubishi-lancer-fuel-module.jpg'],
    tips: ['Check engine size and connector pins; Lancer modules are not all interchangeable.'],
  },
  {
    id: 'mitsubishi-pajero-fuel-module', name: 'Mitsubishi Pajero Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'Pajero module',
    description: 'In-tank pump module for selected Mitsubishi Pajero and Montero petrol applications.', fits: ['mitsubishi-pajero'], art: { style: 'vertical', label: 'Pajero' }, photos: ['mitsubishi-pajero-fuel-module.jpg'],
    tips: ['Pajero modules vary across generations. Send a clear photo of the old unit first.'],
  },
  {
    id: 'mercedes-c-class-fuel-module', name: 'Mercedes-Benz C-Class Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'C-Class module',
    description: 'Fuel delivery module for selected Mercedes-Benz C-Class W204 petrol models.', fits: ['mercedes-c-class'], art: { style: 'vertical', label: 'C-Class' }, photos: ['mercedes-c-class-fuel-module.jpg'],
    tips: ['Mercedes may use left and right modules. Confirm the side, chassis code and engine.'],
  },
  {
    id: 'volkswagen-golf-fuel-module', name: 'Volkswagen Golf Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'Golf module',
    description: 'In-tank electric fuel pump module for selected Volkswagen Golf petrol models.', fits: ['volkswagen-golf'], art: { style: 'vertical', label: 'Golf' }, photos: ['volkswagen-golf-fuel-module.jpg'],
    tips: ['Golf modules change between generations. Match the OEM number and plug before ordering.'],
  },
  {
    id: 'audi-a4-fuel-module', name: 'Audi A4 Fuel Pump Module', category: 'module', fuel: ['petrol'], typeLabel: 'Audi A4 module',
    description: 'In-tank module with pump and level sender for selected Audi A4 petrol models.', fits: ['audi-a4'], art: { style: 'vertical', label: 'Audi A4' }, photos: ['audi-a4-fuel-module.jpg'],
    tips: ['Confirm the A4 generation, engine code and module part number before purchase.'],
  },
];

export const PRODUCTS = Object.freeze(
  RAW_PRODUCTS.map((product) => {
    const photos =
      product.photos && product.photos.length > 0 ? product.photos : [`${product.id}.jpg`];
    return Object.freeze({
      ...product,
      alt: product.alt ?? product.name,
      photo: `assets/images/products/${photos[0]}`,
      photos: Object.freeze(photos.map((file) => `assets/images/products/${file}`)),
    });
  }),
);

export const PRODUCTS_BY_ID = Object.freeze(
  Object.fromEntries(PRODUCTS.map((product) => [product.id, product])),
);

/** Vehicles a product fits. Universal products return the full catalogue. */
export function vehiclesForProduct(product) {
  if (product.universal) return VEHICLES;
  return product.fits.map((id) => VEHICLES_BY_ID[id]).filter(Boolean);
}

export function productFitsVehicle(product, vehicleId) {
  return product.universal || product.fits.includes(vehicleId);
}

/** "Petrol", "Diesel" or "Petrol and diesel". */
export function fuelLabel(product) {
  const labels = product.fuel.map((fuel) => fuel.charAt(0).toUpperCase() + fuel.slice(1));
  return labels.length > 1 ? labels.join(' and ') : labels[0];
}
