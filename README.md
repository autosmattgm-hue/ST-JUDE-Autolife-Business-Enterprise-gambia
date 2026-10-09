# ST JUDE Autolife Business Enterprise: Website v2

A fast, mobile-first website for a car fuel pump specialist in The Gambia.
No build step or external dependencies. The included Node server protects the AI API key.

---

## 1. What's new in v2

| Feature | What it does for customers and the business |
|---|---|
| **Car finder** | Choose make, model and fuel. Shows every pump that fits that car. The strongest sales tool on the site. |
| **Pump catalogue** | Live search by pump or car model, category filters, sort by name or "most cars". |
| **Product details** | Photo gallery (pump and cars it fits), fitment list, buying tips, WhatsApp and share. Each pump has its own link, such as `#pump=in-tank-petrol`. |
| **Cars we cover** | Filter by make, tap any of 27 car models to see its pumps. |
| **Enquiry form** | Fills in the car details and opens WhatsApp with the message already written. No backend needed. |
| **FAQ** | Answers common questions. Also marked up for Google (FAQPage schema). |
| **Mobile action bar** | Call, WhatsApp and Directions pinned to the bottom of phone screens. |
| **Live section highlighting** | The menu shows which section you are reading. |
| **Illustration fallbacks** | Missing photos show a drawn pump or car, so the site always looks finished. Real photos replace them automatically. |

---

## 2. Responsive design

The layout is mobile-first and tested at these widths: 320, 360, 390, 430, 768 and 1280 px.

- **No horizontal scrolling** at any width (checked by measuring the page).
- **Fluid type** scales smoothly between phones and desktops.
- **Touch targets** are at least 44 px. The mobile menu, chips and buttons are sized for thumbs.
- **Phone-safe layout:** `viewport-fit=cover`, safe-area padding for notched phones and home indicators, and `100dvh` so the browser address bar never hides content.
- **No iOS zoom:** form fields use 16 px text.
- **Full-screen product details** on phones. A centred window on tablets and laptops.
- **Breakpoints:** 600 px, 900 px and 1200 px.
- **Reduced motion** is respected.

---

## 3. Folder structure

```
st-jude-autolife-v2/
├── index.html                       Page structure, SEO, schema, CSP
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── css/
    │   └── styles.css               Design system and responsive layout
    ├── js/
    │   ├── config.js                Phone number, map links, WhatsApp helper
    │   ├── main.js                  Entry point
    │   ├── data/
    │   │   ├── vehicles.js          Makes, models and body types (edit to add cars)
    │   │   └── products.js          Pumps, fitments, tips (edit to add pumps)
    │   ├── lib/
    │   │   ├── dom.js               Safe element builder (no innerHTML)
    │   │   └── illustrations.js     Drawn pump, car and storefront fallbacks
    │   └── modules/
    │       ├── finder.js            Car finder
    │       ├── catalogue.js         Search, filters, sort
    │       ├── product-card.js      Pump card
    │       ├── product-dialog.js    Details, gallery, share, deep links
    │       ├── cars.js              Cars we cover
    │       ├── enquiry.js           Enquiry form to WhatsApp
    │       ├── nav.js               Menu and section highlighting
    │       └── media.js             Image factory with fallback
    └── images/
        ├── hero-fuel-pump.jpg       (1200 x 960 px)  hero picture
        ├── store-front.jpg          (1200 x 900 px)  about section
        ├── products/                one per pump, 800 x 600 px
        └── cars/                    one per car, 800 x 500 px
```

---

## 4. Add your real photos

Every image slot already works. Until you add a photo, a drawn illustration shows instead. To replace one, save your photo with the exact file name below and it appears automatically. No code changes needed.

**Pump photos** (`assets/images/products/`):

| File name | Pump |
|---|---|
| `in-tank-petrol.jpg` | Electric In-Tank Fuel Pump (Petrol) |
| `in-tank-diesel.jpg` | Electric In-Tank Fuel Pump (Diesel) |
| `suv-fuel-module.jpg` | Fuel Pump Module with Sender |
| `fuel-level-sender.jpg` | Fuel Level Sender Unit |
| `external-inline-petrol.jpg` | External Inline Electric Fuel Pump |
| `mechanical-lift-diesel.jpg` | Mechanical Fuel Lift Pump |
| `relay-connector-kit.jpg` | Fuel Pump Relay and Connector Kit |
| `filter-strainer-kit.jpg` | Fuel Filter Strainer Kit |
| `fuel-pressure-regulator.jpg` | Fuel Pressure Regulator |

**Car photos** (`assets/images/cars/`), one per model. Name each file after its id:

`toyota-corolla`, `toyota-camry`, `toyota-vitz`, `toyota-rav4`, `toyota-land-cruiser`, `toyota-prado`, `toyota-hilux`, `honda-civic`, `honda-accord`, `honda-crv`, `nissan-sunny`, `nissan-almera`, `nissan-xtrail`, `nissan-navara`, `nissan-patrol`, `hyundai-elantra`, `hyundai-tucson`, `hyundai-santa-fe`, `kia-rio`, `kia-sportage`, `kia-sorento`, `mitsubishi-lancer`, `mitsubishi-pajero`, `mitsubishi-l200`, `mazda-3`, `mercedes-w124`, `isuzu-dmax`

Add `.jpg` to each, for example `toyota-corolla.jpg`.

**Photo tips**
1. Shoot pumps on a plain white or light background, in daylight. Include the connector and any part number.
2. Shoot cars from the side, full car in frame, ideally at the same height and angle for a consistent look.
3. Save as JPG or WebP, under 300 KB each, and keep the aspect ratio shown above.
4. Use your own photos, not copies from manufacturer or other shops' sites. Copied photos can breach copyright.

---

## 5. Run it locally

The included server delivers the site and keeps the NVIDIA API key private:

```bash
npm start
# then open http://localhost:3000
```

---

## 6. Edit the content

| To change | Edit |
|---|---|
| Add or edit a pump | `assets/js/data/products.js`: copy an entry, set a unique `id`, `category`, `fuel` and `fits` (car ids). |
| Add a car | `assets/js/data/vehicles.js`: add an entry with `make`, `model` and `body` (sedan, hatch, suv or pickup). Then add its id to the pumps that fit it. |
| WhatsApp number or map link | `assets/js/config.js` **and** the WhatsApp links in `index.html`. Keep them in sync. |
| FAQ answers | `index.html`, the FAQ section **and** the FAQPage schema in the `<head>`. Keep them matching. |
| Colours and spacing | The tokens at the top of `assets/css/styles.css`. |
| Domain for SEO | `canonical`, `og:url`, `og:image` and schema URLs in `index.html`; `robots.txt`; `sitemap.xml`. |

**Before publishing, confirm:**
- Each car-to-pump fitment against your real stock. Fitment lists are typical applications, and the page says so.
- The FAQ answers, especially the delivery and price statements. Change them if your policy differs.

### AI key (.env)
- Copy `.env.example` to `.env` and set `NVIDIA_API_KEY=your-key`. The default model is `z-ai/glm-5.3-flash`; override `NVIDIA_MODEL` only when your NVIDIA account has access to another currently supported model.
- Start the site with `npm start`. The server reads the key and the browser calls only `/api/assistant`; the key is never sent to visitors.
- `.env` is git-ignored. Do not deploy this site as static files only: deploy it to a Node-capable host and add `NVIDIA_API_KEY` as an environment variable there.

---

## 7. Deploy (free)

**Vercel (recommended):** push this folder to GitHub, import the repository in Vercel, select the **Other** framework preset and leave the build command empty. Add `NVIDIA_API_KEY` under **Project Settings → Environment Variables** for Production, Preview and Development. Vercel automatically deploys `api/assistant.js`, so the AI endpoint works at `/api/assistant` without exposing the key.

**Other Node-capable hosts:** deploy the folder to a host that runs `npm start`, set `NVIDIA_API_KEY` in its private environment settings, and expose port `3000` (or the platform's `PORT`).

**Static hosts:** Netlify Drop and a static Cloudflare Pages project can host the catalogue, but not the secure AI endpoint. Use a Node-capable host or add an equivalent serverless API before using them.

After deploying, replace the `your-domain.com` placeholders listed in section 6 and redeploy.

### AI troubleshooting

- A `404` for `/api/assistant` while using VS Code Live Preview is expected: that preview serves static files only. Run `npm start` and open `http://localhost:3000`, or deploy to Vercel.
- The browser never reads `.env`. On Vercel, add the key in Environment Variables, then redeploy.
- If the endpoint returns `502`, generate a valid NVIDIA API key with access to the configured model, set it as `NVIDIA_API_KEY`, and redeploy. The on-page catalogue assistant still supplies local answers if the online provider is unavailable.

---

## 8. Testing done for this version

Tested in headless Chromium with automated scripts:

- **Layout:** no horizontal overflow at 320, 360, 390, 430, 768 and 1280 px.
- **Errors:** no JavaScript errors on the page.
- **Images:** every missing photo falls back to its illustration. No broken images are left.
- **Finder:** make, model and fuel selection show the correct pumps. For example, a Toyota Corolla shows 4 pumps, or 2 when filtered to diesel.
- **Search:** "Hilux" finds the matching pump. An unmatched search shows the WhatsApp lead with the search pre-filled.
- **Details dialog:** opens, the gallery switches photos, the URL hash updates and clears, and deep links open the dialog.
- **Mobile menu:** opens, and closes after you tap a link or press Escape.
- **Enquiry form:** validates required fields, and builds a complete WhatsApp message.

**Not tested here:** physical phones, and Google Fonts and the Google Maps embed, which the test sandbox blocks. Before launch, test on one small Android phone and one iPhone, check the map embed loads, and run Google PageSpeed Insights.

---

## 9. Business roadmap (highest ROI first)

1. **Google Business Profile (free, today).** Use the same name, phone and link to this site. Ask first customers for reviews. This drives the most local calls and visits.
2. **WhatsApp Business catalogue (free, today).** Load the pumps, add quick replies, and set your business hours.
3. **Photos (this week).** Real photos of your stock and cars convert far better than illustrations. This is the single biggest visual upgrade.
4. **Analytics (this week).** Add Google Analytics 4. The page already tracks WhatsApp taps, calls, directions and product views, through `data-track` attributes. To enable it, add the GA4 tag and allow its domains in the CSP.
5. **One SEO page per car model (ongoing).** For example, "Toyota Corolla fuel pump in The Gambia". This is the cheapest way to earn organic enquiries.
6. **Upsells to test.** Fitting service, a fuel pump test or pressure check, and bundles such as pump plus relay plus strainer.

---

## 10. Scaling path

| Stage | Trigger | Upgrade |
|---|---|---|
| **1. Launch (now)** | Enquiries arrive on WhatsApp | This static site |
| **2. Live stock** | Stock changes often and the owner wants live availability | A small Node.js (TypeScript) API with PostgreSQL for pumps, stock, fitments and enquiries. Protect the admin area with hashed passwords, rate limiting and CSRF protection. |
| **3. Online orders** | Customers want to pay online | Checkout with local mobile money (confirm current options with a local provider) and an order dashboard. Verify every payment on the server. |
| **4. Automation** | Many enquiries a day | WhatsApp Business Platform API for automatic replies, order updates and a CRM view. |

The likely stack for stage 2 onwards: React and TypeScript for the front end, Tailwind CSS, Node.js with TypeScript on the back end, PostgreSQL, Docker, and CI/CD with GitHub Actions. The fitment data in `products.js` and `vehicles.js` maps directly onto database tables, so this site becomes the front end of that system without a rewrite.

---

## 11. Security notes

- No secrets in front-end code. Never put API keys or database credentials in these files.
- The Content Security Policy allows scripts from the same site only. Widen it deliberately if you add analytics.
- All text is inserted with `textContent` and DOM APIs, never `innerHTML`. Search input and form fields cannot inject markup.
- The enquiry form strips control characters and enforces length limits before building the WhatsApp message.
- Links that open in new tabs use `rel="noopener noreferrer"`.
