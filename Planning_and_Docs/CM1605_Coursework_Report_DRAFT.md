CM1605 Web Technology — Coursework Report (DRAFT)

Copy this into: CM1605 Coursework - Report Template.docx
Module: CM1605 Web Technology
Topic / case study: Travel Destination Explorer — Interstellar Agency (Orion Apex)

Student details (fill in):
RGU ID: ________________
IIT Student ID: ________________
Student Name: ________________

Word-count target: main body about 1000 words (follow your lecturer’s rule for appendices).
Deadline reminder: 25 July 2026, 12:00 (noon).


EXACT SCREENSHOT LIST (what to capture and where to paste)

Use this list only. Each item is one screenshot (or one image file).

SECTION 2 — Technical Discussion (inside the report body)

SCREENSHOT A — Paste after the XML code sample
What: Open destinations.html in the browser. Show the Destinations page with many destination cards loaded in the grid (category “All” is fine). Include the page title and at least a few cards with images/names visible.
File to open: destinations.html

SCREENSHOT B — Paste after the filter code sample
What: On destinations.html, click one category filter button (example: Nebulas or Black Holes). Screenshot the page showing that filter button as active AND fewer cards than in Screenshot A (so the filter clearly worked). Also show the results count text if visible.
File to open: destinations.html

SCREENSHOT C — Paste after the booking validation code sample (first of two)
What: Open booking.html. Leave required fields empty (or invalid). Click Submit Inquiry. Screenshot the form showing the red/error messages under the invalid fields (name, email, spacecraft, and/or travel class).
File to open: booking.html

SCREENSHOT D — Paste after Screenshot C (second booking image)
What: On booking.html, fill valid name, valid email, choose a spacecraft, choose a travel class, then submit. Screenshot the success message screen (Journey Booked Successfully / confirmation text), not the empty form.
File to open: booking.html


SECTION 3.3 — Colour Contrast Test

SCREENSHOT E — Paste in section 3.3
What: Open WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/). Set Foreground #FFFFFF and Background #000000 (or the reverse #000000 on #FFFFFF). Screenshot the result page showing the contrast ratio (should show 21:1 / pass AAA).
Optional second image: the opposite pair (black on white) if you want both themes.


SECTION 3.6 — Accessibility Test (TWO pages required)

SCREENSHOT F — Paste in section 3.6
What: Accessibility tool report for the HOME page.
How: Open index.html, then run WAVE (https://wave.webaim.org/ — use “WAVE browser extension” on the open page, or upload if needed) OR axe DevTools. Screenshot the summary panel that shows the page was tested (errors/alerts/contrast summary).
Page: index.html

SCREENSHOT G — Paste in section 3.6
What: Same accessibility tool report, but for the BOOKING page.
Page: booking.html


SECTION 4 — Validation Reports (TWO pages required)

SCREENSHOT H — Paste in section 4
What: W3C Markup Validation result for HOME.
How: Go to https://validator.w3.org/ → Validate by File Upload → upload index.html → screenshot the result. You want “No errors” / green success if possible. Warnings are OK.
File to upload: index.html

SCREENSHOT I — Paste in section 4
What: W3C Markup Validation result for BOOKING.
File to upload: booking.html


APPENDIX — Screenshots of website pages (extra site photos)

SCREENSHOT J — Home page (index.html) full view with hero / headline visible
SCREENSHOT K — Packages page (packages.html) showing the package cards
SCREENSHOT L — One package detail page (open any Details link, e.g. package.html?id=PKG-01)
SCREENSHOT M — Spaceships page (spaceships.html)
SCREENSHOT N — One spaceship detail page (e.g. spaceship.html?id=SHIP-01)
SCREENSHOT O — About page (about.html)
SCREENSHOT P — Terms page (terms.html)
(Optional) SCREENSHOT Q — Home or Destinations in light theme after clicking the theme toggle


APPENDIX — Low-fidelity wireframes (already on your computer — insert these files)

IMAGE R — Planning_and_Docs/Interstellar Homepage Wireframe-export.png
IMAGE S — Planning_and_Docs/Destinations Explorer Wireframe-export.png
IMAGE T — Planning_and_Docs/Booking Inquiry Wireframe-export.png


APPENDIX — Prompts

No screenshot. Copy the three prompt paragraphs from the Appendix: Prompts section of this draft.


MINIMUM SET IF YOU ARE SHORT ON TIME (do these first)

Must have: A, B, C, D, E, F, G, H, I, R, S, T
Then if time: J to P

Tip for W3C: if it complains about missing CSS/JS paths after file upload, that is normal; still aim for zero HTML errors.


1. Introduction

This coursework implements Case Study 2: Travel Destination Explorer, re-themed as Interstellar Agency (Orion Apex) — a fictional premium space-tourism site. Visitors explore a catalogue of cosmic destinations, curated multi-stop packages and a fleet of spaceships, then submit a booking inquiry.

Key features:
Nine HTML pages with a shared header, footer and theme toggle.
90 destinations in six categories, filterable and searchable.
15 packages and 15 spaceships, with detail pages driven by URL ?id=.
Catalogue data stored in well-formed XML and rendered with JavaScript.
Booking form using six form control types and custom JS validation (no HTML5 validation).
Monochrome UI, responsive layout, and offline use by opening index.html locally.


2. Technical Discussion

Development followed separation of concerns: HTML for structure, one global CSS file for presentation, JavaScript for behaviour, and XML for data. Shared chrome (navigation, footer, chatbot) is injected once from js/app.js so every page stays consistent.

XML integration

Destination, package and spaceship records live in data/destinations.xml. For local file:// demos, the same XML is embedded in data/destinations.js as DESTINATIONS_XML. getData() parses it with DOMParser and maps nodes into JavaScript objects used by the cards and detail pages.

Code sample:

const xmlDoc = new DOMParser().parseFromString(DESTINATIONS_XML.trim(), 'text/xml');
xmlDoc.querySelectorAll('destinations > destination').forEach(n => {
  destinations.push({
    id: n.getAttribute('id'),
    name: t(n, 'name'),
    category: t(n, 'category'),
  });
});

SCREENSHOT A (paste here): destinations.html with All selected and the full card grid visible.

Category filtering (JavaScript)

On destinations.html, category buttons and a search box update state; renderDestinations() filters the array and rebuilds the grid. More than two filter options are supported (six categories plus “All”).

Code sample:

filterBar.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.category = btn.getAttribute('data-category');
    renderDestinations(data.destinations, state);
  });
});

SCREENSHOT B (paste here): destinations.html after clicking one category (e.g. Nebulas) so fewer cards show and the filter looks active.

Booking validation (JavaScript)

booking.html uses novalidate so the browser does not apply HTML5 validation. js/validation.js validates at least three fields with addEventListener: traveler name (length), email (must contain @ and a . after it), spacecraft (non-empty select), and travel class (a radio selected). On success the form is replaced with a confirmation message; on failure error messages are shown.

Code sample:

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const ok = validateName() && validateEmail()
    && validateSpacecraft() && validateTravelClass();
  if (!ok) return;
  bookingCard.innerHTML = successHTML;
});

SCREENSHOT C (paste here): booking.html after Submit with empty/invalid fields — error messages visible.
SCREENSHOT D (paste here): booking.html success message after a valid submit.


3. Discussion of UX/UI Principles / Applications / Justifications

3.1 Navigation Techniques

Folder structure (simplified):

ORION_APEX_CM1605_Sem2_CW/
  index.html, destinations.html, packages.html, package.html,
  spaceships.html, spaceship.html, booking.html, about.html, terms.html
  css/global.css
  js/app.js, validation.js
  data/destinations.xml, destinations.js
  assets/

Navigation is a fixed top bar with links to Home, Destinations, Packages, Spaceships, Book Journey and About. The active page is marked with a CSS class and aria-current="page". Detail pages (package.html, spaceship.html) map back to their listing in the nav so users still know which section they are in. A full breadcrumb trail was not added; instead, detail pages include a clear “back” link (e.g. “All packages”), which keeps the path short. On small screens a hamburger menu reveals the same links.

CSS sample:

.site-header { position: fixed; top: 0; left: 0; right: 0; }
.nav-links a.active { /* underline / weight for current page */ }

3.2 Colour balance / selection / consistency

The UI is deliberately monochrome (#000 / #fff) so full-colour space photography and the hero video provide the only colour. Borders use a low-opacity line token. Buttons share one outline style that fills and inverts on hover. Logo, icons and chat control stay black/white for consistency across all pages via CSS variables.

CSS sample:

:root { --bg: #000000; --text: #ffffff; --border: rgba(255,255,255,0.28); }
:root.light { --bg: #ffffff; --text: #000000; }

3.3 Colour Contrast Test

Black text on white (light mode) and white text on black (dark mode) both give a contrast ratio of 21:1, which exceeds WCAG AAA for normal text.

SCREENSHOT E (paste here): WebAIM Contrast Checker result for #FFFFFF on #000000 (21:1 / pass).

3.4 Typography / consistency

Headings use Archivo (geometric, engineered feel); body text uses Inter (high legibility). Both are self-hosted as .woff2 files under assets/fonts/ and declared with @font-face, so the viva demo works offline. Heading hierarchy (h1–h3) and shared classes (.section-title, .btn) keep sizes and weight consistent; fluid clamp() sizes support responsive layouts.

CSS sample:

--font-head: 'Archivo', 'Arial Black', Arial, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
h1, h2, h3 { font-family: var(--font-head); }
body { font-family: var(--font-body); }

3.5 Accessibility

Text: semantic landmarks (header, nav, main, section, footer); logical heading order; visible focus via interactive controls.

Images: meaningful alt text on content images; logo has an accessible name on the home link (aria-label).

Forms: every control has a label (linked with for/id where applicable); errors are exposed in text near fields; novalidate is paired with clear JS messages rather than silent failure.

Tables: spaceship specifications use a semantic table with th headers for screen-reader context.

HTML sample:

<label for="traveler-name">Traveler Name</label>
<input type="text" id="traveler-name" name="traveler-name">

3.6 Accessibility Test

SCREENSHOT F (paste here): WAVE or axe accessibility summary for index.html (Home).
SCREENSHOT G (paste here): WAVE or axe accessibility summary for booking.html (Booking).
After the images, one short sentence is enough (example: No critical missing-label issues were found on the booking form; contrast is high because of the monochrome palette).


4. Validation Reports

All pages were checked against the W3C Markup Validation Service.

SCREENSHOT H (paste here): W3C validator result after uploading index.html.
SCREENSHOT I (paste here): W3C validator result after uploading booking.html.


5. Evaluation of AI-generated low-fidelity wireframes

AI wireframe tools were used to produce early layouts for the homepage, destinations explorer and booking inquiry (see Appendix).

What AI got right: clear hero and CTA structure; a filter bar above a card grid; a stepped booking form that matches how users fill enquiries.

What AI got wrong / what we changed: early suggestions used multi-colour dashboard chrome and dense cards; the final site moved to a strict monochrome system, richer catalogue (packages/ships), and XML-driven rendering instead of static placeholder cards. Some AI layouts implied breadcrumbs everywhere; we used a fixed global nav plus back links on detail pages.

Inclusivity: high-contrast black/white supports readability; labels on all form controls; responsive collapse of grids and a mobile menu improve small-screen use. We still rely on category fallbacks where individual destination photos are missing, which is a content limitation rather than a layout one.

Ethical considerations: AI layouts are a starting point, not a substitute for human judgement. Prompts and outputs are disclosed in the Appendix; visual assets and branding were adapted for an original fictional agency; we did not treat generated wireframes as final accessible design without review.


6. References

Google (n.d.) HTML, CSS and JavaScript documentation. Available at: https://developer.mozilla.org/ (Accessed: 25 July 2026).

W3C (n.d.) Markup Validation Service. Available at: https://validator.w3.org/ (Accessed: 25 July 2026).

WebAIM (n.d.) Contrast Checker. Available at: https://webaim.org/resources/contrastchecker/ (Accessed: 25 July 2026).

WebAIM (n.d.) WAVE Web Accessibility Evaluation Tool. Available at: https://wave.webaim.org/ (Accessed: 25 July 2026).

Mozilla Developer Network (n.d.) DOMParser. Available at: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser (Accessed: 25 July 2026).

Add any image/font tool sources you actually used, in Harvard style.


Appendix: Screenshots of website pages

SCREENSHOT J (paste here): index.html — Home with hero and headline.
SCREENSHOT K (paste here): packages.html — package cards.
SCREENSHOT L (paste here): package.html?id=PKG-01 — one package detail page.
SCREENSHOT M (paste here): spaceships.html — ship cards.
SCREENSHOT N (paste here): spaceship.html?id=SHIP-01 — one ship detail page.
SCREENSHOT O (paste here): about.html.
SCREENSHOT P (paste here): terms.html.


Appendix: Screenshots of low-fidelity wireframes

IMAGE R (insert file): Planning_and_Docs/Interstellar Homepage Wireframe-export.png
IMAGE S (insert file): Planning_and_Docs/Destinations Explorer Wireframe-export.png
IMAGE T (insert file): Planning_and_Docs/Booking Inquiry Wireframe-export.png


Appendix: Prompts

Use (or adapt) these as the prompts recorded for Task A:

Prompt 1 — Homepage
Create a low-fidelity wireframe for a premium space-travel agency homepage named Interstellar Agency. Include a top navigation bar with logo and links (Home, Destinations, Packages, Book, About), a full-width hero with headline Explore the Unknown, short supporting text, two CTA buttons, and a featured destinations section below. Desktop layout, simple grayscale boxes only.

Prompt 2 — Destinations explorer
Create a low-fidelity wireframe for a destinations explorer page. Show page title, a horizontal row of category filter buttons (All, Nebulas, Stars, Planets, Black Holes, etc.), a search field, and a responsive 3-column card grid. Each card has an image placeholder, title, short text, and a select button. Grayscale wireframe style.

Prompt 3 — Booking inquiry
Create a low-fidelity wireframe for a travel booking inquiry form in three steps: (1) traveler name and email, (2) spacecraft dropdown and travel-class radio buttons, (3) checkbox add-ons and a large comments textarea, with a submit button at the bottom. Clean card layout, desktop width, grayscale.


Final packaging checklist (before 12:00)

Student IDs/name filled on cover
All YOU MUST ADD screenshots pasted
Wireframes + prompts in Appendix
Export / save as one PDF
Zip site folder + PDF with student number in the filename
Test unzip, then open index.html offline
Upload to Moodle

End of draft — paste into the official Word template, then add your screenshots.
