import { h, clear } from '../lib/dom.js';
import { buildWhatsAppLink, SITE } from '../config.js';
import { PRODUCTS } from '../data/products.js';
import { MAKES, VEHICLES, vehicleName } from '../data/vehicles.js';

const MAX_LENGTH = { name: 60, phone: 20, model: 60, year: 4, notes: 400 };
const DEFAULT_MAX = 60;

/**
 * Strips control characters, trims whitespace and enforces a length limit.
 * Values are only ever placed inside a URL-encoded WhatsApp message.
 */
function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

export function initEnquiry() {
  const form = document.getElementById('enquiry-form');
  const status = document.getElementById('enquiry-status');
  const makeSelect = document.getElementById('enq-make');
  const partSelect = document.getElementById('enq-part');
  const modelList = document.getElementById('vehicle-names');

  clear(makeSelect);
  makeSelect.append(
    h('option', { value: '' }, 'Choose make'),
    ...MAKES.map((make) => h('option', { value: make }, make)),
  );

  clear(partSelect);
  partSelect.append(
    h('option', { value: '' }, 'Choose a pump'),
    ...PRODUCTS.map((product) => h('option', { value: product.name }, product.name)),
    h('option', { value: 'Not sure yet' }, 'Not sure yet'),
  );

  modelList.replaceChildren(
    ...VEHICLES.map((vehicle) => h('option', { value: vehicleName(vehicle) })),
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const field = (name) => clean(data.get(name), MAX_LENGTH[name] ?? DEFAULT_MAX);

    const message = [
      `Hello ${SITE.name}, I need help with a fuel pump.`,
      `Name: ${field('name')}`,
      `Phone: ${field('phone') || 'Not given'}`,
      `Car: ${field('make')} ${field('model')}`,
      `Year: ${field('year') || 'Not given'}`,
      `Fuel: ${field('fuel')}`,
      `Pump needed: ${field('part')}`,
      `Notes: ${field('notes') || 'None'}`,
    ].join('\n');

    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
    status.textContent = 'WhatsApp is opening with your details. Press send to finish.';
  });
}
