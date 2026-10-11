/**
 * Offline pump expert: answers from the site's own catalogue, cars and store info.
 * An optional NVIDIA key (settings gear) upgrades answers via DeepSeek when online.
 */
import { PRODUCTS, fuelLabel, vehiclesForProduct } from '../data/products.js';
import { MAKES, VEHICLES, vehicleName, vehiclesByMake } from '../data/vehicles.js';
import { SITE, buildWhatsAppLink } from '../config.js';

function norm(text) {
  return text.toLowerCase();
}

function findVehiclesIn(text) {
  const query = norm(text);
  return VEHICLES.filter(
    (vehicle) =>
      query.includes(norm(vehicle.model)) ||
      query.includes(norm(vehicle.make)) ||
      query.includes(vehicle.id.replace(/-/g, ' ')),
  ).slice(0, 4);
}

function findProductsIn(text) {
  const query = norm(text);
  return PRODUCTS.filter((product) => {
    const hay = norm(`${product.name} ${product.typeLabel} ${product.id.replace(/-/g, ' ')}`);
    return query.includes(norm(product.typeLabel)) ||
      query.includes(norm(product.name)) ||
      hay.split(/[^a-z0-9]+/).filter((w) => w.length > 3).some((word) => query.includes(word));
  }).slice(0, 4);
}

function productLine(product) {
  return `${product.name} (${product.typeLabel}, ${fuelLabel(product)})`;
}

function whatsappFor(message) {
  return buildWhatsAppLink(message);
}

/** Local answer engine: uses catalogue + store facts, no network. */
export function localAnswer(question) {
  const q = norm(question);
  const vehicles = findVehiclesIn(question);
  const products = findProductsIn(question);

  if (/(price|cost|how much|dalasi)/.test(q)) {
    return {
      text: `Prices depend on stock, so tap a pump then "Ask on WhatsApp" and ${SITE.shortName} will confirm. Call ${SITE.phoneDisplay} if urgent.`,
      links: [{ label: `WhatsApp ${SITE.shortName}`, href: whatsappFor(`Hello ${SITE.name}, please send me pump prices.`) }],
    };
  }

  if (/(where|location|address|directions|map|visit|shop|store|hour|open)/.test(q)) {
    return {
      text: `Visit ${SITE.name} in ${SITE.country}. We are open 24 hours from Monday through Saturday. Call or WhatsApp ${SITE.phoneDisplay} before you come so the pump is ready.`,
      links: [
        { label: 'Get directions', href: SITE.mapsDirectionsUrl },
        { label: 'WhatsApp us', href: whatsappFor(`Hello ${SITE.name}, I want to visit the shop.`) },
      ],
    };
  }

  if (/(no start|wont start|crank|stall|cut out|cuts out|sputter|jerk|hesitat|hard start|noise|whine|gauge|symptom|problem|fault|diagnos)/.test(q)) {
    return {
      text: 'Often the pump: listen for the 2-second prime hum, check fuse and relay, then pressure. Gauge jumping means sender fault. Send make, model, year and engine on WhatsApp.',
      links: [{ label: 'Describe symptoms on WhatsApp', href: whatsappFor(`Hello ${SITE.name}, symptoms: ${question.slice(0, 120)}. My car is: `) }],
    };
  }

  if (/(benz|mercedes|w124|e-class|e class)/.test(q)) {
    return {
      text: 'For Mercedes-Benz E-Class (W124) use the External Inline Pump in petrol. Match hose size and flow arrow. Confirm on WhatsApp before you pay.',
      links: [{ label: 'Ask about Benz pump', href: whatsappFor('Hello ST JUDE Autolife Business Enterprise, I need a pump for my Mercedes-Benz E-Class (W124).') }],
    };
  }

  if (vehicles.length > 0) {
    const vehicle = vehicles[0];
    const matches = PRODUCTS.filter((p) => p.universal || (p.fits && p.fits.includes(vehicle.id)));
    const list = matches.slice(0, 4).map(productLine).join('\n- ');
    return {
      text: matches.length
        ? `For your ${vehicleName(vehicle)}:\n- ${list}\nPick it in the finder, then confirm on WhatsApp.`
        : `No listed pump for ${vehicleName(vehicle)} yet. Send year + engine on WhatsApp.`,
      links: [{ label: 'WhatsApp about pump', href: whatsappFor(`Hello ${SITE.name}, I need a pump for my ${vehicleName(vehicle)}.`) }],
    };
  }

  if (products.length > 0) {
    const product = products[0];
    const cars = vehiclesForProduct(product).slice(0, 6).map(vehicleName).join(', ');
    return {
      text: `${productLine(product)}: ${product.description} Fits: ${cars || 'most cars'}. Tip: ${product.tips[0]}`,
      links: [
        { label: 'Ask price', href: whatsappFor(`Hello ${SITE.name}, I need the ${product.name}.`) },
        { label: 'See details', href: `#pump=${product.id}` },
      ],
    };
  }

  const makeHit = MAKES.find((make) => q.includes(norm(make)));
  if (makeHit) {
    const models = vehiclesByMake(makeHit).map(vehicleName).join(', ');
    return { text: `For ${makeHit} we cover: ${models}. Tell me the model.`, links: [{ label: 'Open finder', href: '#finder' }] };
  }

  return {
    text: `I'm the ${SITE.shortName} pump helper. Try "Hilux diesel pump", "car cuts out", or "where is your shop?". WhatsApp ${SITE.phoneDisplay} for prices.`,
    links: [{ label: 'Chat on WhatsApp', href: whatsappFor(`Hello ${SITE.name}, I need help. ${question.slice(0, 100)}`) }],
  };
}

/** Online upgrade through the same-origin server. The browser never sees the API key. */
async function onlineAnswer(question, signal) {
  const isLocalPreview = ['localhost', '127.0.0.1'].includes(location.hostname) && location.port && location.port !== '3000';
  const endpoint = isLocalPreview ? `${location.protocol}//${location.hostname}:3000/api/assistant` : '/api/assistant';
  const response = await fetch(endpoint, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: question.slice(0, 1000) }),
  });
  if (!response.ok) throw new Error(`AI unavailable (${response.status})`);
  const data = await response.json();
  const text = data?.answer?.trim();
  if (!text) throw new Error('Empty AI reply');
  return { text, links: [{ label: 'Confirm on WhatsApp', href: whatsappFor(`Hello ${SITE.name}, assistant said: ${text.slice(0, 120)}. Confirm for my car: `) }] };
}

export async function answerQuestion(question, { signal } = {}) {
  try {
    const online = await onlineAnswer(question, signal);
    if (online) return { ...online, source: 'ai' };
  } catch {
    // Fall through to offline expert.
  }
  return { ...localAnswer(question), source: 'local' };
}


