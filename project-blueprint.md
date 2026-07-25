# Interstellar Agency — Project Blueprint

**Module:** CM1605 Web Technology · **Brand:** Orion Apex / Interstellar Agency  
**Stack:** HTML5 · CSS3 · JavaScript (ES6) · XML  

This blueprint is the definitive description of what the project **is**, how it is **structured**, and how each part **connects**. Use it alongside `README.md` (overview) and the live files in the repo.

---

## 1. Vision & product

A fictional premium **interstellar travel agency** website where visitors can:

1. Explore **90 destinations** across six cosmic categories  
2. Browse **15 curated multi-stop packages**  
3. Inspect a fleet of **15 spaceships**  
4. Submit a **booking inquiry** with custom client-side validation  

Tone: editorial aerospace luxury. Copyright year in the UI: **2145**.

**Target audience:** experience-seekers, sci-fi / space enthusiasts, aspirational luxury travellers.

---

## 2. Hard constraints (assessment rules)

| Rule | Implementation |
|------|----------------|
| No frontend frameworks | No React, Vue, Angular, Node app servers |
| No CSS libraries | No Bootstrap, Tailwind, etc. — only `css/global.css` |
| No HTML5 form validation | Booking form uses `novalidate`; logic in `js/validation.js` |
| Data from local XML | Catalogue in `data/destinations.xml`, parsed with `DOMParser` |
| Offline / `file://` friendly | Same XML embedded in `data/destinations.js` as `DESTINATIONS_XML` |
| Separation of concerns | HTML = structure · CSS = presentation · JS = behaviour · XML = data |

---

## 3. Catalogue data model

### 3.1 Volumes

| Entity | Count | ID pattern (examples) |
|--------|------:|------------------------|
| Destinations | 90 | `BLK-01` … `NEB-15` (15 per category) |
| Packages | 15 | `PKG-01` … `PKG-15` |
| Spaceships | 15 | `SHIP-01` … `SHIP-15` |

### 3.2 Destination categories (15 each)

1. Black Holes  
2. Habitable Planets  
3. Non-Habitable Planets  
4. Natural Satellites  
5. Stars  
6. Nebulas  

### 3.3 XML shape (conceptual)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interstellarAgency>
  <destinations>
    <destination id="BLK-01">
      <name>…</name>
      <category>…</category>
      <description>…</description>
      <lightYearsFromEarth>…</lightYearsFromEarth>
      <requiredShip>…</requiredShip>
      <cost>…</cost>
      <imagePath>…</imagePath>
      <rating>…</rating>
      <reviews>…</reviews>
    </destination>
    <!-- … -->
  </destinations>
  <packages>
    <package id="PKG-01">
      <packageName>…</packageName>
      <description>…</description>
      <totalDuration>…</totalDuration>
      <price>…</price>
      <imagePath>…</imagePath>
      <rating>…</rating>
      <reviews>…</reviews>
      <destinationRef category="…" id="BLK-01"/>
      <!-- typically one stop per category -->
    </package>
  </packages>
  <spaceships>
    <spaceship id="SHIP-01">
      <name>…</name>
      <shipClass>…</shipClass>
      <material>…</material>
      <experience>…</experience>
      <capacity>…</capacity>
      <range>…</range>
      <speed>…</speed>
      <fuelSource>…</fuelSource>
      <description>…</description>
      <imagePath>…</imagePath>
      <rating>…</rating>
      <reviews>…</reviews>
    </spaceship>
  </spaceships>
</interstellarAgency>
```

**Element vs attribute:** fields like `<name>` are child elements; `id="BLK-01"` on `<destination>` is an attribute. Packages reference destinations with `<destinationRef id="…" category="…"/>`.

### 3.4 Dual data files

| File | Purpose |
|------|---------|
| `data/destinations.xml` | Human-readable / rubric “single XML database” |
| `data/destinations.js` | `const DESTINATIONS_XML = \`…\`` — identical XML for `file://` |

When editing catalogue content for local demos, keep **both** files in sync.

---

## 4. Architecture

### 4.1 Layers

```text
┌──────────────────────────────────────────────┐
│  HTML pages (shells + semantic content)      │
├──────────────────────────────────────────────┤
│  css/global.css  (tokens, layout, components)│
├──────────────────────────────────────────────┤
│  js/app.js       (chrome, parse, render)     │
│  js/validation.js (booking only)             │
├──────────────────────────────────────────────┤
│  data/*.xml + destinations.js                │
└──────────────────────────────────────────────┘
```

### 4.2 Shared “components” (JavaScript)

Built once in `app.js`, injected on `DOMContentLoaded`:

| Function | Injects |
|----------|---------|
| `buildNavigation()` | Fixed header, links, theme toggle, mobile menu |
| `buildFooter()` | Link columns, social icons, copyright |
| `buildChatbot()` | “Ask Orion” launcher + keyword reply panel |

Card factories (data → DOM):

- `createDestinationCard`  
- `createPackageCard`  
- `createSpaceshipCard`  

Images: `createImageWithFallback` (primary → category/journey fallback → `assets/example.jpg`) with `addEventListener('error')` — **no** inline `onerror` in HTML.

### 4.3 Page initialisers

| Function | Page / condition |
|----------|------------------|
| `initDestinationsPage` | `#destinations-grid` + `#filter-bar` |
| `initFeatured` | `#featured-grid` (homepage mix) |
| `initPackagesPage` | `#packages-grid` |
| `initPackageDetail` | `#package-detail` + `?id=` |
| `initSpaceshipsPage` | `#spaceships-grid` |
| `initSpaceshipDetail` | `#spaceship-detail` + `?id=` |
| `initHeroVideo` | Home hero — attaches MP4 **after** reveal |

### 4.4 Data pipeline

```text
<script src="data/destinations.js">  →  DESTINATIONS_XML string
<script src="js/app.js">
        ↓
getData()
  · DOMParser.parseFromString(..., 'text/xml')
  · querySelectorAll('destinations > destination') etc.
  · map nodes → JS objects { id, name, category, … }
  · cache in cachedData
        ↓
render / filter / detail templates
```

Helper `t(parent, tag)` reads trimmed `textContent` of a child element.

### 4.5 Templated detail URLs

| URL | Behaviour |
|-----|-----------|
| `package.html?id=PKG-01` | Find package · resolve `destinationRef` stops · FAQ accordion |
| `spaceship.html?id=SHIP-01` | Find ship · render specs table |

Active nav mapping: detail pages highlight **Packages** or **Spaceships** respectively.

---

## 5. Page inventory

| File | Purpose |
|------|---------|
| `index.html` | Hero video, stats, featured mix, TravelAgency JSON-LD |
| `destinations.html` | Filter pills + search + destination grid |
| `packages.html` | All package cards |
| `package.html` | Single package template |
| `spaceships.html` | All ship cards |
| `spaceship.html` | Single ship template |
| `booking.html` | Inquiry form + loads `validation.js` |
| `about.html` | Mission, catalogue, fleet, safety, FAQ + FAQPage JSON-LD |
| `terms.html` | Terms & conditions |

Wireframes (planning): `Planning_and_Docs/*.png`.

---

## 6. Design system (as shipped)

> Earlier drafts used a cyan/teal palette and Space Grotesk. The **shipped** product is monochrome + Archivo/Inter (**self-hosted** `.woff2` files — no CDN). This section matches the live `global.css`.

### 6.1 Philosophy

- UI ink is **only** black or white  
- Emphasis via weight, scale, borders — not accent colour  
- Full-colour photography and the hero video are the only colour on the site  

### 6.2 CSS tokens (`:root`)

| Token | Role |
|-------|------|
| `--bg` | Page background (`#000` dark / `#fff` light) |
| `--text` | Text and primary borders |
| `--border` | Soft structural lines |
| `--font-head` | Archivo (local `assets/fonts/Archivo.woff2`) |
| `--font-body` | Inter (local `assets/fonts/Inter.woff2`) |
| `--header-h` | Fixed header height (padding offset on `body`) |
| `--max` | Content max width (~1200px) |
| `--sp-sm` … `--sp-xl` | Spacing scale |

Light mode: `document.documentElement.classList` → `light` (also restored early from `localStorage` in each page `<head>`).

### 6.3 Components in CSS

- Buttons: `.btn`, `.card-select`, `.submit-btn` (outline → fill invert on hover)  
- Cards: `.destination-card`, `.card-img`, ratings, specs, price  
- Booking: `.booking-card`, `.form-group`, `.error-message`, success block  
- Chat: `.chat-launcher`, `.chat-panel`  
- Detail: `.detail-hero`, `.stops-grid`, `.faq`, `.spec-table`  

### 6.4 Responsive behaviour

- Grids collapse (e.g. 3 → 1 columns)  
- Hamburger + slide-in nav around `max-width: 860px`  
- Fluid type via `clamp()` where used  
- `prefers-reduced-motion` disables transitions  

---

## 7. Booking form blueprint

### 7.1 Six control types (required)

| Type | Control | Field |
|------|---------|--------|
| text | `<input type="text">` | Traveler name |
| email | `<input type="email">` | Contact email |
| select | `<select>` | Preferred spacecraft |
| radio | `<input type="radio">` | Travel class |
| checkbox | `<input type="checkbox">` | Journey add-ons |
| textarea | `<textarea>` | Special requirements |

Submit control: `<button type="submit">`.

### 7.2 Validation (`js/validation.js`)

- Wired with `addEventListener` (`blur` / `change` / `submit`)  
- Validates: **name** (≥ 2 chars), **email** (`@` + `.` rules in JS), **spacecraft**, **travel class**  
- On failure: show `.error-message`, scroll to first error  
- On success: replace card contents with a confirmation message  

---

## 8. UX behaviours & load strategy

| Behaviour | Mechanism |
|-----------|-----------|
| Theme persistence | `localStorage` key `theme` |
| Anti-flicker reveal | Hide `body` until `html.app-ready`; set after chrome + catalogue + images settle |
| Image alt flash | Images use `.img-pending` until load / fallback settles |
| Hero video | ~large MP4; `preload="none"` + `data-src`; `initHeroVideo()` after reveal |
| Image fallbacks | Primary path → category/journey art → `assets/example.jpg` |
| Chatbot | Keyword matching only — no external API |
| Prices | Formatted as US dollars (e.g. `$2 million`) |
| Ratings | Stars from XML `rating` / `reviews` |

---

## 9. SEO & AEO

| Technique | Where |
|-----------|--------|
| Unique title + meta description | Every page |
| Open Graph / Twitter cards | Every page |
| Semantic landmarks | `header`, `nav`, `main`, `section`, `article`, `footer` |
| JSON-LD `TravelAgency` | `index.html` |
| JSON-LD `FAQPage` | `about.html` |
| FAQ copy | About + each package detail |

---

## 10. File map (complete)

```text
/
├── *.html                    # Nine site pages
├── css/global.css            # Sole stylesheet
├── js/app.js                 # App shell + catalogue UI
├── js/validation.js          # Booking validation
├── data/destinations.xml     # Master XML
├── data/destinations.js      # Embedded XML string
├── assets/
│   ├── logo.png
│   ├── favicon.png
│   ├── example.jpg           # Ultimate image placeholder
│   ├── Spaceflight.mp4       # Home hero (loaded late)
│   ├── fonts/                # Archivo.woff2, Inter.woff2 (offline)
│   └── images/               # Category, journey, ship assets
├── Planning_and_Docs/        # Wireframes + viva-practice-questions.md
├── image-manifest.md         # Expected image filenames
├── project-blueprint.md      # This document
└── README.md                 # GitHub-facing overview
```

---

## 11. Script load order (every page)

```html
<script src="data/destinations.js"></script>
<script src="js/app.js"></script>
```

Booking page adds:

```html
<script src="js/validation.js"></script>
```

**Why this order:** `DESTINATIONS_XML` must exist before `getData()` runs.

---

## 12. Event-handling convention

- Prefer **`element.addEventListener(...)`** in JS files  
- Do **not** put behaviour in HTML attributes (`onclick`, inline `onerror`, etc.)  
- HTML remains structure; JavaScript owns interaction  

---

## 13. Definition of done (checklist)

- [x] Nine pages with consistent chrome  
- [x] XML-driven destinations, packages, spaceships  
- [x] Filters + search on Destinations  
- [x] Detail templates with `?id=`  
- [x] Booking with six control types + custom validation + success UI  
- [x] Dark/light theme with persistence  
- [x] Chatbot widget  
- [x] About + Terms content  
- [x] SEO meta + JSON-LD  
- [x] Runs from `file://` without a server  
- [x] Monochrome design system in `global.css`  

---

## 14. Related docs

| Doc | Use |
|-----|-----|
| `README.md` | Public GitHub summary & quick start |
| `image-manifest.md` | Intended image filename inventory |
| `Planning_and_Docs/viva-practice-questions.md` | 50 viva practice questions |
| Wireframe PNGs in `Planning_and_Docs/` | Original layout references |
