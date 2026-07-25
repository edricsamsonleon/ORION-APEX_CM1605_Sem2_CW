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

AI wireframe tools (UX Magic / similar) were used to produce low-fidelity layouts for the site pages. Because the finished website has nine HTML pages, wireframes were planned for all nine pages. The prompts and wireframe images are in the Appendix.

What AI got right: the tools captured the fixed top navigation, hero plus CTA pattern on Home, filter bar plus card grid on Destinations, package/ship card grids, and a stepped booking form structure close to the final enquiry page.

What AI got wrong / what we changed: early outputs sometimes looked like colourful dashboards or generic travel templates. The final site uses a strict monochrome black/white UI, shared header/footer injected by JavaScript, XML-driven cards, detail pages with back links instead of full breadcrumbs, and offline self-hosted fonts. We adjusted spacing, button style, and content sections (About FAQs, Terms legal blocks, spaceship spec table) by hand in HTML/CSS.

Inclusivity: high-contrast black/white supports readability; form controls have labels (and fieldsets for radio/checkbox groups); responsive grids and a mobile menu help small screens. Category image fallbacks keep cards usable when individual photos are missing.

Ethical considerations: AI wireframes are a starting point, not a substitute for human design judgement or accessibility testing. Prompts and outputs are disclosed in the Appendix. The fictional Interstellar Agency branding and final implementation were reviewed and built by us; we did not treat generated wireframes as finished accessible pages without validation and WAVE checks.


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

Insert these files from Planning_and_Docs/ (already generated):

WIREFRAME 1 (Home): Home Wireframe-export.png
WIREFRAME 2 (Destinations): Destinations Explorer-export.png
WIREFRAME 3 (Packages list): Travel Packages-export.png
WIREFRAME 4 (Package detail): Package Detail-export.png
WIREFRAME 5 (Spaceships list): Spaceships Fleet-export.png

Still generate and insert these four (missing from the folder right now):

WIREFRAME 6 (Spaceship detail): save as Spaceship Detail-export.png
WIREFRAME 7 (Booking): save as Booking Inquiry-export.png
WIREFRAME 8 (About): save as About Agency-export.png
WIREFRAME 9 (Terms): save as Terms Conditions-export.png


Appendix: Prompts

Prompt 1 — Home (index.html)
Create a low-fidelity grayscale desktop wireframe that matches this exact homepage structure for Interstellar Agency / Orion Apex. Fixed top header: left logo ORION APEX, center nav Home Destinations Packages Spaceships Book Journey About (Home active), right circular theme toggle. Full-viewport hero with headline EXPLORE THE UNKNOWN, subtitle, two outline buttons EXPLORE DESTINATIONS and VIEW PACKAGES, and SCROLL TO EXPLORE at bottom. Below: three stat boxes 90 Destinations, 15 Curated Packages, 6 Cosmic Categories. Then section title FREQUENTLY VISITED TRAVEL PACKAGES AND PLACES and a 3-column card grid. Footer with four columns and a floating chat button bottom-right. Grayscale boxes only, no colour photos.

Prompt 2 — Destinations (destinations.html)
Create a low-fidelity grayscale desktop wireframe for Destinations Explorer. Same header with Destinations active. Left: H1 Destinations Explorer plus intro text; right: search box Search destinations. Filter pills: All (active), Nebulas, Stars, Natural Satellites, Non-Habitable Planets, Habitable Planets, Black Holes. Results line 90 destinations shown. 3-column cards with image, title, category badge, stars, description, Distance in Lightyears, Required Ship, price and Select button. Footer plus chat bubble. Grayscale only.

Prompt 3 — Packages list (packages.html)
Create a low-fidelity grayscale desktop wireframe for Travel Packages. Header with Packages active. H1 Travel Packages, short intro, no search or filters. 3-column package cards: image, title, Package badge, stars, description, Duration, Stops, price, Details button. Footer plus chat bubble. Grayscale only.

Prompt 4 — Package detail (package.html)
Create a low-fidelity grayscale desktop wireframe for Package Detail. Back link All packages. Two columns: left large image; right Curated Package badge, title, stars, description, Duration Destinations Price specs, Book This Journey button. Section Destinations On This Journey with stop cards. Section Frequently Asked Questions accordion rows. Footer plus chat bubble. Grayscale only.

Prompt 5 — Spaceships list (spaceships.html)
Create a low-fidelity grayscale desktop wireframe for Our Spaceships. Header with Spaceships active. H1 Our Spaceships, short intro, no filters. 3-column ship cards: image, title, class badge, stars, description, Passenger Capacity, Cruising Speed, fuel text, View Details button. Footer plus chat bubble. Grayscale only.

Prompt 6 — Spaceship detail (spaceship.html)  [STILL NEED THIS WIREFRAME]
Create a low-fidelity grayscale desktop wireframe for Spaceship Detail. Back link Back to the fleet. Two columns: left ship image; right class badge, title, stars, description, Book This Ship button. Specifications table rows: Class, Hull and Materials, Onboard Experience, Passenger Capacity, Cruising Speed, Range, Fuel Source. Footer plus chat bubble. Grayscale only.

Prompt 7 — Booking (booking.html)  [STILL NEED THIS WIREFRAME]
Create a low-fidelity grayscale desktop wireframe for Booking Inquiry. Header with Book Journey active. H1 Booking Inquiry plus intro. Form card Passenger Request Details with step 1 Traveler Name and Contact Address; step 2 Preferred Spacecraft dropdown and Class of Travel radios Economy Business First Class; step 3 add-on checkboxes and Special Requirements textarea; Submit Inquiry button. Footer plus chat bubble. Grayscale only.

Prompt 8 — About (about.html)  [STILL NEED THIS WIREFRAME]
Create a low-fidelity grayscale desktop wireframe for About the Agency. Header with About active. Page header title and tagline. Sections Our Mission, Our Destinations with six bullets, Curated Packages, Our Fleet, Safety, then FAQ accordion. Footer plus chat bubble. Grayscale only.

Prompt 9 — Terms (terms.html)  [STILL NEED THIS WIREFRAME]
Create a low-fidelity grayscale desktop wireframe for Terms and Conditions. Page header Terms and Conditions. Numbered sections Booking and Reservation, Cancellation Policy, Travel Documents, Liability, Safety and Conduct, Privacy. Text-heavy single column, standard footer, chat bubble. Grayscale only.


Final packaging checklist (before 12:00)

Student IDs/name filled on cover
All YOU MUST ADD screenshots pasted
Wireframes + prompts in Appendix
Export / save as one PDF
Zip site folder + PDF with student number in the filename
Test unzip, then open index.html offline
Upload to Moodle

End of draft — paste into the official Word template, then add your screenshots.
