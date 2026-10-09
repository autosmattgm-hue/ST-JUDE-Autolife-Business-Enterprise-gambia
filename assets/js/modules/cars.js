import { h, clear } from '../lib/dom.js';
import { MAKES, VEHICLES, vehicleName, vehiclesByMake } from '../data/vehicles.js';
import { vehiclePhoto } from './media.js';

const ALL = 'all';

/**
 * @param {{ onSelectVehicle: (vehicleId: string) => void }} options
 */
export function initCars({ onSelectVehicle }) {
  const tabs = document.getElementById('make-tabs');
  const grid = document.getElementById('car-grid');
  let activeMake = ALL;

  function renderTabs() {
    clear(tabs);
    tabs.append(
      ...[ALL, ...MAKES].map((make) =>
        h(
          'button',
          {
            type: 'button',
            class: 'chip',
            'aria-pressed': String(make === activeMake),
            onclick: () => {
              activeMake = make;
              renderTabs();
              renderGrid();
            },
          },
          make === ALL ? 'All cars' : make,
        ),
      ),
    );
  }

  function renderGrid() {
    const vehicles = activeMake === ALL ? VEHICLES : vehiclesByMake(activeMake);

    grid.replaceChildren(
      ...vehicles.map((vehicle) =>
        h(
          'button',
          {
            type: 'button',
            class: 'car-tile',
            'aria-label': `Find pumps for ${vehicleName(vehicle)}`,
            onclick: () => onSelectVehicle(vehicle.id),
          },
          h('span', { class: 'car-photo' }, vehiclePhoto(vehicle)),
          h('span', { class: 'car-name' }, vehicleName(vehicle)),
          h('span', { class: 'car-cta' }, 'See pumps'),
        ),
      ),
    );
  }

  renderTabs();
  renderGrid();
}
