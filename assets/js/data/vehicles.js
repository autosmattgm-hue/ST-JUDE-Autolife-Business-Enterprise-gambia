/**
 * Vehicle catalogue. Powers the car finder, the "Cars we cover" grid and product fitments.
 *
 * Fields:
 *  id     Unique slug. Also the photo file name: assets/images/cars/<id>.jpg
 *  make   Manufacturer name
 *  model  Model name
 *  body   sedan | hatch | suv | pickup (shapes the fallback illustration)
 *
 * To add a car: add an entry here, then reference its id in data/products.js.
 */
const RAW_VEHICLES = [
  { id: 'toyota-corolla', make: 'Toyota', model: 'Corolla', body: 'sedan' },
  { id: 'toyota-camry', make: 'Toyota', model: 'Camry', body: 'sedan' },
  { id: 'toyota-vitz', make: 'Toyota', model: 'Vitz', body: 'hatch' },
  { id: 'toyota-rav4', make: 'Toyota', model: 'RAV4', body: 'suv' },
  { id: 'toyota-land-cruiser', make: 'Toyota', model: 'Land Cruiser', body: 'suv' },
  { id: 'toyota-prado', make: 'Toyota', model: 'Land Cruiser Prado', body: 'suv' },
  { id: 'toyota-hilux', make: 'Toyota', model: 'Hilux', body: 'pickup' },
  { id: 'honda-civic', make: 'Honda', model: 'Civic', body: 'sedan' },
  { id: 'honda-accord', make: 'Honda', model: 'Accord', body: 'sedan' },
  { id: 'honda-crv', make: 'Honda', model: 'CR-V', body: 'suv' },
  { id: 'nissan-sunny', make: 'Nissan', model: 'Sunny', body: 'sedan' },
  { id: 'nissan-almera', make: 'Nissan', model: 'Almera', body: 'sedan' },
  { id: 'nissan-xtrail', make: 'Nissan', model: 'X-Trail', body: 'suv' },
  { id: 'nissan-navara', make: 'Nissan', model: 'Navara', body: 'pickup' },
  { id: 'nissan-patrol', make: 'Nissan', model: 'Patrol', body: 'suv' },
  { id: 'hyundai-elantra', make: 'Hyundai', model: 'Elantra', body: 'sedan' },
  { id: 'hyundai-tucson', make: 'Hyundai', model: 'Tucson', body: 'suv' },
  { id: 'hyundai-santa-fe', make: 'Hyundai', model: 'Santa Fe', body: 'suv' },
  { id: 'kia-rio', make: 'Kia', model: 'Rio', body: 'hatch' },
  { id: 'kia-sportage', make: 'Kia', model: 'Sportage', body: 'suv' },
  { id: 'kia-sorento', make: 'Kia', model: 'Sorento', body: 'suv' },
  { id: 'mitsubishi-lancer', make: 'Mitsubishi', model: 'Lancer', body: 'sedan' },
  { id: 'mitsubishi-pajero', make: 'Mitsubishi', model: 'Pajero', body: 'suv' },
  { id: 'mitsubishi-l200', make: 'Mitsubishi', model: 'L200', body: 'pickup' },
  { id: 'mazda-3', make: 'Mazda', model: '3', body: 'hatch' },
  { id: 'mercedes-w124', make: 'Mercedes-Benz', model: 'E-Class (W124)', body: 'sedan' },
  { id: 'isuzu-dmax', make: 'Isuzu', model: 'D-Max', body: 'pickup' },
  { id: 'mercedes-c-class', make: 'Mercedes-Benz', model: 'C-Class (W204)', body: 'sedan' },
  { id: 'volkswagen-golf', make: 'Volkswagen', model: 'Golf', body: 'hatch' },
  { id: 'audi-a4', make: 'Audi', model: 'A4', body: 'sedan' },
];

export const VEHICLES = Object.freeze(
  RAW_VEHICLES.map((vehicle) =>
    Object.freeze({ ...vehicle, photo: `assets/images/cars/${vehicle.id}.jpg` }),
  ),
);

export const VEHICLES_BY_ID = Object.freeze(
  Object.fromEntries(VEHICLES.map((vehicle) => [vehicle.id, vehicle])),
);

/** Makes in catalogue order, de-duplicated. */
export const MAKES = Object.freeze([...new Set(VEHICLES.map((vehicle) => vehicle.make))]);

export function vehiclesByMake(make) {
  return VEHICLES.filter((vehicle) => vehicle.make === make);
}

export function vehicleName(vehicle) {
  return `${vehicle.make} ${vehicle.model}`;
}
