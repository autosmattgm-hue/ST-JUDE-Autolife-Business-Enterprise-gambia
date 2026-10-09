/** Local answer engine: uses catalogue + store facts, no network. */
export function localAnswer(question) {
  const q = norm(question);
  const vehicles = findVehiclesIn(question);
  const products = findProductsIn(question);
  const links = [];

  if (/(price|cost|how much|dalasi)/.test(q)) {
    return {
      text: `Prices depend on the exact pump and stock, so I can't quote here. Tap a pump, then "Ask on WhatsApp" and ${SITE.shortName} will confirm the price and fit. Call ${SITE.phoneDisplay} if you need it fast.`,
      links: [{ label: `WhatsApp ${SITE.shortName}`, href: whatsappFor(`Hello ${SITE.name}, please send me pump prices.`) }],
    };
  }

  if (/(where|location|address|directions|map|visit|shop|store|hour|open)/.test(q)) {
    return {
      text: `Visit ${SITE.name} in ${SITE.country}. Call or WhatsApp ${SITE.phoneDisplay} before you come so the pump is ready. Use "Get directions" in the Visit section for the map.`,
      links: [
        { label: 'Get directions', href: SITE.mapsDirectionsUrl },
        { label: 'WhatsApp us', href: whatsappFor(`Hello ${SITE.name}, I want to visit the shop.`) },
      ],
    };
  }

  if (/(no start|wont start|crank|stall|cut out|cuts out|die|dead|sputter|jerk|hesitat|hard start|noise|whine|humming|gauge|symptom|problem|fault|diagnos)/.test(q)) {
    return {
      text: 'Those signs often point to the pump, but check first: listen for the 2-second prime hum, check the fuel-pump fuse and relay, then fuel pressure. If the gauge jumps, the sender is likely at fault. Send your make, model, year and engine on WhatsApp and we confirm the fit.',
      links: [{ label: 'Describe symptoms on WhatsApp', href: whatsappFor(`Hello ${SITE.name}, my car has these symptoms: ${question.slice(0, 120)}. My car is: `) }],
    };
  }

  if (/(benz|mercedes|w124|e-class|e class)/.test(q)) {
    links.push({ label: 'Ask about Benz pump on WhatsApp', href: whatsappFor(`Hello ${SITE.name}, I need a fuel pump for my Mercedes-Benz E-Class (W124). Please confirm price.`) });
    return { text: 'For Mercedes-Benz E-Class (W124) use the External Inline Pump in petrol. Match the hose size and flow arrow to your old pump. Confirm on WhatsApp before you pay.', links };
  }

  if (vehicles.length > 0) {
    const vehicle = vehicles[0];
    const matches = PRODUCTS.filter((p) => p.universal || (p.fits && p.fits.includes(vehicle.id)));
    const list = matches.slice(0, 4).map(productLine).join('\n• ');
    links.push({ label: `WhatsApp about ${vehicleName(vehicle)} pump`, href: whatsappFor(`Hello ${SITE.name}, I need a fuel pump for my ${vehicleName(vehicle)}. Please confirm price and fit.`) });
    return {
      text: matches.length
        ? `For your ${vehicleName(vehicle)}:\n• ${list}\nPick it in the finder to see photos, then confirm on WhatsApp.`
        : `I don't list a pump for the ${vehicleName(vehicle)} yet. Send your year and engine size on WhatsApp and we'll check.`,
      links,
    };
  }

  if (products.length > 0) {
    const product = products[0];
    const cars = vehiclesForProduct(product).slice(0, 6).map(vehicleName).join(', ');
    links.push({ label: `Ask price for ${product.name}`, href: whatsappFor(`Hello ${SITE.name}, I need the ${product.name}. Please confirm price for my car: `) });
    links.push({ label: 'See pump details', href: `#pump=${product.id}` });
    return { text: `${productLine(product)}: ${product.description} Typical fits: ${cars || 'most cars'}. Tip: ${product.tips[0]}`, links };
  }

  if (/(order|buy|deliver|payment|pay|whatsapp)/.test(q)) {
    return {
      text: 'To order: pick your car in the finder, tap the pump, then "Ask on WhatsApp". We confirm fit and price, then arrange pickup or delivery. No account needed.',
      links: [{ label: 'Start order on WhatsApp', href: whatsappFor(`Hello ${SITE.name}, I want to order a fuel pump. My car is: `) }],
    };
  }

  const makeHit = MAKES.find((make) => q.includes(norm(make)));
  if (makeHit) {
    const models = vehiclesByMake(makeHit).map(vehicleName).join(', ');
    return { text: `For ${makeHit} we cover: ${models}. Tell me the model and I'll list its pumps.`, links: [{ label: 'Open car finder', href: '#finder' }] };
  }

  if (/(hi|hello|hey|good|thanks|thank|which|what|fit|recommend|best)/.test(q)) {
    return {
      text: `Hello! I'm the ${SITE.shortName} pump helper. Ask "which pump for my Corolla?", "Benz fuel pump price?", or "car won't start". For prices and stock we confirm on WhatsApp at ${SITE.phoneDisplay}.`,
      links: [{ label: 'Browse all pumps', href: '#products' }],
    };
  }

  return {
    text: `I help with pump choice, fitment, symptoms, prices and visiting the shop. Try "Hilux diesel pump", "car cuts out", or "where is your shop?". For a firm price, WhatsApp ${SITE.phoneDisplay}.`,
    links: [{ label: 'Chat on WhatsApp', href: whatsappFor(`Hello ${SITE.name}, I need help with a fuel pump. ${question.slice(0, 100)})`) }],
  };
}
