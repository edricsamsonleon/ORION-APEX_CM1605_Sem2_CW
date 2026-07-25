/* =========================================================================
   app.js — Interstellar Agency
   - Builds the shared header (theme toggle) + footer (social icons) + chatbot.
   - Parses the XML embedded in data/destinations.js (works from file://).
   - Renders: destinations, packages, package details, spaceships,
     spaceship details, homepage featured mix.
   - Prices are shown in US dollars; every item has a user star rating.
   ========================================================================= */

const PLACEHOLDER_IMAGE = 'assets/example.jpg';

/* Category images used as the fallback for destination cards, so every card
   shows an image that suits its category even before real per-item images
   are added. */
const CATEGORY_IMAGE = {
    'Black Holes':           'assets/images/cat-black-holes.jpg',
    'Habitable Planets':     'assets/images/cat-habitable-planets.jpg',
    'Non-Habitable Planets': 'assets/images/cat-non-habitable-planets.jpg',
    'Natural Satellites':    'assets/images/cat-natural-satellites.jpg',
    'Stars':                 'assets/images/cat-stars.jpg',
    'Nebulas':               'assets/images/cat-nebulas.jpg',
};
function categoryImage(cat) { return CATEGORY_IMAGE[cat] || PLACEHOLDER_IMAGE; }
function journeyImage(i) { return 'assets/images/journey' + String((i % 4) + 1).padStart(2, '0') + '.jpg'; }

/* Curated mix shown on the homepage "Frequently Visited" section */
const FEATURED_MIX = [
    { type: 'destination', id: 'BLK-01' },
    { type: 'package',     id: 'PKG-01' },
    { type: 'destination', id: 'HAB-01' },
    { type: 'package',     id: 'PKG-12' },
    { type: 'destination', id: 'NEB-01' },
    { type: 'package',     id: 'PKG-06' },
];


/* -----------------------------------------------------------------------
   HEADER / NAVIGATION
----------------------------------------------------------------------- */
function buildNavigation() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
        <div class="nav-container">
            <a href="index.html" class="nav-logo" aria-label="Interstellar Agency home"></a>
            <div class="nav-actions">
                <nav class="nav-menu" role="navigation">
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="destinations.html">Destinations</a></li>
                        <li><a href="packages.html">Packages</a></li>
                        <li><a href="spaceships.html">Spaceships</a></li>
                        <li><a href="booking.html">Book Journey</a></li>
                        <li><a href="about.html">About</a></li>
                    </ul>
                </nav>
                <button class="theme-toggle" aria-label="Switch between dark and light theme">
                    <span class="icon-sun" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-13a1 1 0 0 1-1-1V1a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zm0 20a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zm11-11a1 1 0 0 1-1 1h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1zM4 12a1 1 0 0 1-1 1H1a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1zm15.07-7.07a1 1 0 0 1 0 1.41l-1.41 1.42a1 1 0 1 1-1.42-1.42l1.42-1.41a1 1 0 0 1 1.41 0zM7.76 16.24a1 1 0 0 1 0 1.42l-1.42 1.41a1 1 0 0 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0zm11.31 2.83a1 1 0 0 1-1.41 0l-1.42-1.41a1 1 0 0 1 1.42-1.42l1.41 1.42a1 1 0 0 1 0 1.41zM7.76 7.76a1 1 0 0 1-1.42 0L4.93 6.34a1 1 0 0 1 1.41-1.41l1.42 1.41a1 1 0 0 1 0 1.42z"/></svg></span>
                    <span class="icon-moon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></span>
                </button>
                <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
                    <span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>
                </button>
            </div>
        </div>`;

    const logoLink = header.querySelector('.nav-logo');
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/logo.png';
    logoImg.alt = 'Interstellar Agency';
    logoImg.className = 'nav-logo-img';
    logoImg.decoding = 'async';
    markImagePending(logoImg);
    logoImg.addEventListener('load', () => markImageReady(logoImg));
    logoImg.addEventListener('error', () => markImageReady(logoImg));
    logoLink.appendChild(logoImg);

    const toggleBtn = header.querySelector('.nav-toggle');
    const navMenu = header.querySelector('.nav-menu');
    toggleBtn.addEventListener('click', () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        navMenu.classList.toggle('nav-menu--open');
        document.body.classList.toggle('nav-open');
    });
    navMenu.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-menu--open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        });
    });
    header.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

    // Active link. Detail pages map back to their listing page.
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const map = { 'package.html': 'packages.html', 'spaceship.html': 'spaceships.html' };
    const effective = map[currentPage] || currentPage;
    navMenu.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href.includes('#') && href === effective) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    return header;
}


/* -----------------------------------------------------------------------
   FOOTER
----------------------------------------------------------------------- */
function buildFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    const social = `
        <div class="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.51.01-4.75.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71C3.21 8.49 3.2 8.86 3.2 12s.01 3.51.07 4.75c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.19-1.39-.32-1.71a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.51 4.01 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06zm0 1.8A3.14 3.14 0 1 0 15.14 12 3.14 3.14 0 0 0 12 8.86zm5.14-3.24a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15z"/></svg></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V23h-4V8z"/></svg></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><svg viewBox="0 0 24 24"><path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.5h7.59l5.24 6.93L18.9 1.5zm-1.29 18.8h2.04L6.48 3.6H4.29l13.32 16.7z"/></svg></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>
        </div>`;
    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-col"><h3 class="footer-heading">Destinations</h3><ul class="footer-links">
                    <li><a href="destinations.html">Nebulas &amp; Stars</a></li>
                    <li><a href="destinations.html">Habitable Planets</a></li>
                    <li><a href="destinations.html">Natural Satellites</a></li>
                    <li><a href="destinations.html">Black Holes</a></li></ul></div>
                <div class="footer-col"><h3 class="footer-heading">Explore</h3><ul class="footer-links">
                    <li><a href="packages.html">Travel Packages</a></li>
                    <li><a href="spaceships.html">Our Spaceships</a></li>
                    <li><a href="booking.html">Book a Journey</a></li>
                    <li><a href="about.html">About the Fleet</a></li></ul></div>
                <div class="footer-col"><h3 class="footer-heading">Resources</h3><ul class="footer-links">
                    <li><a href="booking.html">Booking Guidelines</a></li>
                    <li><a href="about.html">Safety Record</a></li>
                    <li><a href="about.html#faq">FAQ &amp; Support</a></li>
                    <li><a href="about.html">Contact</a></li></ul></div>
                <div class="footer-col"><h3 class="footer-heading">Legal &amp; Transit</h3><ul class="footer-links">
                    <li><a href="terms.html">Terms of Service</a></li>
                    <li><a href="terms.html">Liability Waivers</a></li>
                    <li><a href="terms.html">Refund Policies</a></li>
                    <li><a href="terms.html">Privacy Registry</a></li></ul></div>
            </div>
            ${social}
            <div class="footer-bottom">
                <p>&copy; 2145 Interstellar Agency. All systems operational.</p>
                <p>System Status: Nominal &nbsp;·&nbsp; Version 4.8.1</p>
            </div>
        </div>`;
    return footer;
}


/* -----------------------------------------------------------------------
   THEME
----------------------------------------------------------------------- */
function toggleTheme() {
    const isLight = document.documentElement.classList.toggle('light');
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
}


/* -----------------------------------------------------------------------
   XML DATA (parse embedded string — no fetch, works on file://)
----------------------------------------------------------------------- */
let cachedData = null;
function getData() {
    if (cachedData) return cachedData;
    if (typeof DESTINATIONS_XML === 'undefined') { console.error('destinations.js missing'); return { destinations: [], packages: [], spaceships: [] }; }
    const xmlDoc = new DOMParser().parseFromString(DESTINATIONS_XML.trim(), 'text/xml');
    if (xmlDoc.querySelector('parsererror')) { console.error('XML parse error'); return { destinations: [], packages: [], spaceships: [] }; }

    const destinations = [];
    xmlDoc.querySelectorAll('destinations > destination').forEach(n => destinations.push({
        id: n.getAttribute('id') || '', name: t(n, 'name'), category: t(n, 'category'),
        description: t(n, 'description'), lightYears: t(n, 'lightYearsFromEarth'),
        requiredShip: t(n, 'requiredShip'), cost: t(n, 'cost'), imagePath: t(n, 'imagePath'),
        rating: t(n, 'rating'), reviews: t(n, 'reviews'),
    }));

    const packages = [];
    xmlDoc.querySelectorAll('packages > package').forEach(n => {
        const stops = [];
        n.querySelectorAll('destinationRef').forEach(r => stops.push({ category: r.getAttribute('category') || '', id: r.getAttribute('id') || '' }));
        packages.push({
            id: n.getAttribute('id') || '', name: t(n, 'packageName'), description: t(n, 'description'),
            totalDuration: t(n, 'totalDuration'), price: t(n, 'price'), stops: stops,
            imagePath: t(n, 'imagePath'), rating: t(n, 'rating'), reviews: t(n, 'reviews'),
        });
    });

    const spaceships = [];
    xmlDoc.querySelectorAll('spaceships > spaceship').forEach(n => spaceships.push({
        id: n.getAttribute('id') || '', name: t(n, 'name'), shipClass: t(n, 'shipClass'),
        material: t(n, 'material'), experience: t(n, 'experience'), capacity: t(n, 'capacity'),
        range: t(n, 'range'), speed: t(n, 'speed'), fuelSource: t(n, 'fuelSource'), description: t(n, 'description'),
        imagePath: t(n, 'imagePath'), rating: t(n, 'rating'), reviews: t(n, 'reviews'),
    }));

    cachedData = { destinations, packages, spaceships };
    return cachedData;
}
function t(parent, tag) { const el = parent.querySelector(tag); return el ? el.textContent.trim() : ''; }

/* Format a number as US dollars, humanised: 1000000 -> "$1 million". */
function formatPrice(v) {
    const n = parseInt(v, 10);
    if (isNaN(n)) return v;
    if (n >= 1000000) { const m = n / 1000000; return '$' + (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + ' million'; }
    return '$' + n.toLocaleString();
}

/* Build a star-rating block (monochrome ★ / ☆ + number + review count). */
function starRating(rating, reviews) {
    const r = parseFloat(rating) || 0;
    const full = Math.round(r);
    let stars = '';
    for (let i = 1; i <= 5; i++) stars += (i <= full ? '★' : '☆');
    return `<div class="rating"><span class="stars" aria-hidden="true">${stars}</span>
        <span class="rating-num">${r.toFixed(1)}</span>${reviews ? ` <span class="rating-count">(${reviews} reviews)</span>` : ''}</div>`;
}

/* Mark an image invisible until a real bitmap has loaded (stops alt-text flash). */
function markImagePending(img) {
    img.classList.add('img-pending');
    img.classList.remove('img-ready');
}

function markImageReady(img) {
    img.classList.remove('img-pending');
    img.classList.add('img-ready');
    img.dispatchEvent(new Event('img-settled'));
}

/* Create an <img> with a fallback chain. Uses addEventListener('error') —
   never inline onerror — so HTML stays free of JavaScript handlers.
   Stays hidden until a source in the chain loads successfully. */
function createImageWithFallback(primary, fallback, alt) {
    const img = document.createElement('img');
    img.alt = alt || '';
    /* Eager: load while the page is still hidden behind app-ready */
    img.loading = 'eager';
    img.decoding = 'async';
    markImagePending(img);

    const first = primary && primary.length ? primary : fallback;
    const chain = [];
    if (first) chain.push(first);
    if (fallback && fallback !== first) chain.push(fallback);
    if (PLACEHOLDER_IMAGE !== first && PLACEHOLDER_IMAGE !== fallback) chain.push(PLACEHOLDER_IMAGE);
    if (!chain.length) chain.push(PLACEHOLDER_IMAGE);

    let step = 0;
    img.addEventListener('load', () => markImageReady(img));
    img.addEventListener('error', () => {
        step += 1;
        if (step < chain.length) {
            markImagePending(img);
            img.src = chain[step];
        } else {
            /* Last resort failed — still settle so the page can reveal */
            markImageReady(img);
        }
    });
    img.src = chain[0];
    return img;
}

/* Wait until every <img> has settled (loaded or exhausted fallbacks), or timeout.
   For images using the fallback helper, only 'img-settled' counts — not the first error. */
function whenImagesReady(root, timeoutMs) {
    const imgs = Array.from((root || document).querySelectorAll('img'));
    if (!imgs.length) return Promise.resolve();

    const waits = imgs.map(img => new Promise(resolve => {
        if (img.classList.contains('img-ready')) return resolve();
        if (img.complete && img.naturalWidth > 0) {
            markImageReady(img);
            return resolve();
        }
        img.addEventListener('img-settled', () => resolve(), { once: true });
        /* Plain <img> (not in a fallback chain): settle on first load/error */
        if (!img.classList.contains('img-pending')) {
            img.addEventListener('load', () => { markImageReady(img); resolve(); }, { once: true });
            img.addEventListener('error', () => { markImageReady(img); resolve(); }, { once: true });
        }
    }));

    return Promise.race([
        Promise.all(waits),
        new Promise(resolve => setTimeout(resolve, timeoutMs || 4000)),
    ]);
}


/* -----------------------------------------------------------------------
   CARDS
----------------------------------------------------------------------- */
function createDestinationCard(dest) {
    const card = document.createElement('article');
    card.className = 'destination-card';
    card.setAttribute('data-category', dest.category);

    const imgWrap = document.createElement('div');
    imgWrap.className = 'card-img';
    imgWrap.appendChild(createImageWithFallback(dest.imagePath, categoryImage(dest.category), dest.name));

    const body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = `
            <div class="card-head"><h3>${dest.name}</h3><span class="card-badge">${dest.category}</span></div>
            ${starRating(dest.rating, dest.reviews)}
            <p class="card-desc">${dest.description}</p>
            <ul class="card-specs">
                <li><span class="spec-label">Distance in Lightyears</span><span class="spec-value">${dest.lightYears} LY</span></li>
                <li><span class="spec-label">Required Ship</span><span class="spec-value">${dest.requiredShip}</span></li>
            </ul>
            <div class="card-foot"><span class="card-price">${formatPrice(dest.cost)}<small>per traveller</small></span>
                <a href="booking.html" class="card-select">Select</a></div>`;

    card.appendChild(imgWrap);
    card.appendChild(body);
    return card;
}

function createPackageCard(pkg, i) {
    const card = document.createElement('article');
    card.className = 'destination-card';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'card-img';
    imgWrap.appendChild(createImageWithFallback(pkg.imagePath, journeyImage(i), pkg.name));

    const body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = `
            <div class="card-head"><h3>${pkg.name}</h3><span class="card-badge">Package</span></div>
            ${starRating(pkg.rating, pkg.reviews)}
            <p class="card-desc">${pkg.description}</p>
            <ul class="card-specs">
                <li><span class="spec-label">Duration</span><span class="spec-value">${pkg.totalDuration}</span></li>
                <li><span class="spec-label">Stops</span><span class="spec-value">${pkg.stops.length} destinations</span></li>
            </ul>
            <div class="card-foot"><span class="card-price">${formatPrice(pkg.price)}<small>full journey</small></span>
                <a href="package.html?id=${pkg.id}" class="card-select">Details</a></div>`;

    card.appendChild(imgWrap);
    card.appendChild(body);
    return card;
}

function createSpaceshipCard(ship, i) {
    const card = document.createElement('article');
    card.className = 'destination-card';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'card-img';
    imgWrap.appendChild(createImageWithFallback(ship.imagePath, PLACEHOLDER_IMAGE, ship.name));

    const body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = `
            <div class="card-head"><h3>${ship.name}</h3><span class="card-badge">${ship.shipClass}</span></div>
            ${starRating(ship.rating, ship.reviews)}
            <p class="card-desc">${ship.description}</p>
            <ul class="card-specs">
                <li><span class="spec-label">Passenger Capacity</span><span class="spec-value">${Number(ship.capacity).toLocaleString()}</span></li>
                <li><span class="spec-label">Cruising Speed</span><span class="spec-value">${ship.speed} ly / hour</span></li>
            </ul>
            <div class="card-foot"><span class="card-price" style="font-size:.8rem;letter-spacing:1px">${ship.fuelSource}</span>
                <a href="spaceship.html?id=${ship.id}" class="card-select">View Details</a></div>`;

    card.appendChild(imgWrap);
    card.appendChild(body);
    return card;
}


/* -----------------------------------------------------------------------
   DESTINATIONS PAGE
----------------------------------------------------------------------- */
function renderDestinations(destinations, state) {
    const grid = document.getElementById('destinations-grid');
    if (!grid) return;
    const term = state.search.trim().toLowerCase();
    const filtered = destinations.filter(d => {
        const cat = state.category === 'all' || d.category === state.category;
        const s = term === '' || d.name.toLowerCase().includes(term) || d.category.toLowerCase().includes(term) || d.requiredShip.toLowerCase().includes(term);
        return cat && s;
    });
    const counter = document.getElementById('results-count');
    if (counter) counter.textContent = `${filtered.length} destination${filtered.length === 1 ? '' : 's'} shown`;
    grid.innerHTML = '';
    if (!filtered.length) { grid.innerHTML = `<p class="grid-message">No destinations match your search. Try another category.</p>`; return; }
    filtered.forEach(d => grid.appendChild(createDestinationCard(d)));
}
function initDestinationsPage() {
    const filterBar = document.getElementById('filter-bar');
    const grid = document.getElementById('destinations-grid');
    if (!filterBar || !grid) return;
    const data = getData();
    const state = { category: 'all', search: '' };
    renderDestinations(data.destinations, state);
    filterBar.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.category = btn.getAttribute('data-category');
        renderDestinations(data.destinations, state);
    }));
    const search = document.getElementById('search-input');
    if (search) search.addEventListener('input', () => { state.search = search.value; renderDestinations(data.destinations, state); });
}


/* -----------------------------------------------------------------------
   HOMEPAGE — "Frequently Visited" curated mix
----------------------------------------------------------------------- */
function initFeatured() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    const data = getData();
    FEATURED_MIX.forEach((item, i) => {
        if (item.type === 'destination') {
            const d = data.destinations.find(x => x.id === item.id);
            if (d) grid.appendChild(createDestinationCard(d));
        } else {
            const p = data.packages.find(x => x.id === item.id);
            if (p) grid.appendChild(createPackageCard(p, i));
        }
    });
}


/* -----------------------------------------------------------------------
   PACKAGES PAGE (all 15)
----------------------------------------------------------------------- */
function initPackagesPage() {
    const grid = document.getElementById('packages-grid');
    if (!grid) return;
    getData().packages.forEach((p, i) => grid.appendChild(createPackageCard(p, i)));
}


/* -----------------------------------------------------------------------
   PACKAGE DETAIL PAGE  (package.html?id=PKG-XX)
----------------------------------------------------------------------- */
function initPackageDetail() {
    const root = document.getElementById('package-detail');
    if (!root) return;
    const data = getData();
    const id = new URLSearchParams(window.location.search).get('id');
    const pkg = data.packages.find(p => p.id === id);
    if (!pkg) { root.innerHTML = `<p class="grid-message">Package not found. <a href="packages.html">Back to all packages</a>.</p>`; return; }

    const stops = pkg.stops.map(s => data.destinations.find(d => d.id === s.id)).filter(Boolean);

    const faqs = [
        ['How long does this expedition take?', `The full journey lasts <strong>${pkg.totalDuration}</strong>.`],
        ['Which destinations will I visit?', `This package visits <strong>${stops.length} destinations</strong>: ${stops.map(d => d.name).join(', ')}.`],
        ['How much does it cost?', `The all-inclusive price is <strong>${formatPrice(pkg.price)}</strong> per traveller.`],
        ['Do I need prior spaceflight experience?', 'No — every journey is fully crewed and guided, and first-time travellers are welcome.'],
        ['Is cryo-sleep required?', 'For the longer routes we recommend the optional Cryo-Sleep Pod add-on, but it is never mandatory.'],
        ['What is the cancellation policy?', 'Full refunds are available up to 60 days before departure — see our <a href="terms.html">Terms &amp; Conditions</a>.'],
    ];
    const faqHtml = faqs.map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join('');

    document.title = pkg.name + ' | Interstellar Agency';
    root.innerHTML = `
        <a href="packages.html" class="back-link">← All packages</a>
        <div class="detail-hero">
            <div class="detail-media"></div>
            <div class="detail-info">
                <span class="card-badge">Curated Package</span>
                <h1>${pkg.name}</h1>
                ${starRating(pkg.rating, pkg.reviews)}
                <p class="detail-desc">${pkg.description}</p>
                <ul class="card-specs">
                    <li><span class="spec-label">Duration</span><span class="spec-value">${pkg.totalDuration}</span></li>
                    <li><span class="spec-label">Destinations</span><span class="spec-value">${stops.length}</span></li>
                    <li><span class="spec-label">Price</span><span class="spec-value">${formatPrice(pkg.price)} per traveller</span></li>
                </ul>
                <a href="booking.html" class="btn">Book This Journey</a>
            </div>
        </div>
        <section class="detail-section">
            <h2 class="section-title">Destinations On This Journey</h2>
            <div class="stops-grid"></div>
        </section>
        <section class="detail-section">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <div class="faq-list">${faqHtml}</div>
        </section>`;

    root.querySelector('.detail-media').appendChild(
        createImageWithFallback(pkg.imagePath, journeyImage(0), pkg.name)
    );

    const stopsGrid = root.querySelector('.stops-grid');
    stops.forEach(d => {
        const stop = document.createElement('article');
        stop.className = 'stop-card';

        const stopImg = document.createElement('div');
        stopImg.className = 'stop-img';
        stopImg.appendChild(createImageWithFallback(d.imagePath, categoryImage(d.category), d.name));

        const stopBody = document.createElement('div');
        stopBody.className = 'stop-body';
        stopBody.innerHTML = `
                <div class="card-head"><h4>${d.name}</h4><span class="card-badge">${d.category}</span></div>
                <p class="stop-meta">${d.lightYears} LY · ${d.requiredShip} · ${formatPrice(d.cost)}</p>`;

        stop.appendChild(stopImg);
        stop.appendChild(stopBody);
        stopsGrid.appendChild(stop);
    });
}


/* -----------------------------------------------------------------------
   SPACESHIPS PAGE (all 15)
----------------------------------------------------------------------- */
function initSpaceshipsPage() {
    const grid = document.getElementById('spaceships-grid');
    if (!grid) return;
    getData().spaceships.forEach((s, i) => grid.appendChild(createSpaceshipCard(s, i)));
}


/* -----------------------------------------------------------------------
   SPACESHIP DETAIL PAGE  (spaceship.html?id=SHIP-XX)
----------------------------------------------------------------------- */
function initSpaceshipDetail() {
    const root = document.getElementById('spaceship-detail');
    if (!root) return;
    const id = new URLSearchParams(window.location.search).get('id');
    const ship = getData().spaceships.find(s => s.id === id);
    if (!ship) { root.innerHTML = `<p class="grid-message">Spaceship not found. <a href="spaceships.html">Back to the fleet</a>.</p>`; return; }

    document.title = ship.name + ' | Interstellar Agency';
    root.innerHTML = `
        <a href="spaceships.html" class="back-link">← Back to the fleet</a>
        <div class="detail-hero">
            <div class="detail-media"></div>
            <div class="detail-info">
                <span class="card-badge">${ship.shipClass}</span>
                <h1>${ship.name}</h1>
                ${starRating(ship.rating, ship.reviews)}
                <p class="detail-desc">${ship.description}</p>
                <a href="booking.html" class="btn">Book This Ship</a>
            </div>
        </div>
        <section class="detail-section">
            <h2 class="section-title">Specifications</h2>
            <table class="spec-table">
                <tr><th>Class</th><td>${ship.shipClass}</td></tr>
                <tr><th>Hull &amp; Materials</th><td>${ship.material}</td></tr>
                <tr><th>Onboard Experience</th><td>${ship.experience}</td></tr>
                <tr><th>Passenger Capacity</th><td>${Number(ship.capacity).toLocaleString()} passengers</td></tr>
                <tr><th>Cruising Speed</th><td>${Number(ship.speed).toLocaleString()} light-years / hour</td></tr>
                <tr><th>Range on a Single Fuel Load</th><td>${ship.range}</td></tr>
                <tr><th>Fuel Source</th><td>${ship.fuelSource}</td></tr>
            </table>
        </section>`;

    root.querySelector('.detail-media').appendChild(
        createImageWithFallback(ship.imagePath, PLACEHOLDER_IMAGE, ship.name)
    );
}


/* -----------------------------------------------------------------------
   CHATBOT (front-end only)
----------------------------------------------------------------------- */
function buildChatbot() {
    const launcher = document.createElement('button');
    launcher.className = 'chat-launcher';
    launcher.setAttribute('aria-label', 'Open chat assistant');
    launcher.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2z"/></svg>`;
    const panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.innerHTML = `
        <div class="chat-head"><h4>Ask Orion</h4><button class="chat-close" aria-label="Close chat">&times;</button></div>
        <div class="chat-msgs" id="chat-msgs"></div>
        <form class="chat-input-row" id="chat-form">
            <input type="text" id="chat-input" name="chat-input"
                   placeholder="Ask about destinations, ships, prices…" autocomplete="off"
                   aria-label="Ask Orion about destinations, ships, or booking">
            <button type="submit" class="chat-send">Send</button>
        </form>`;
    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const msgs = panel.querySelector('#chat-msgs');
    const form = panel.querySelector('#chat-form');
    const input = panel.querySelector('#chat-input');
    function add(text, who) { const b = document.createElement('div'); b.className = 'chat-msg ' + who; b.textContent = text; msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight; }
    function reply(text) {
        const t = text.toLowerCase();
        if (/(^|\b)(hi|hello|hey|greetings)\b/.test(t)) return 'Hello, traveller! Ask me about destinations, packages, spaceships, prices or booking.';
        if (t.includes('ship') || t.includes('spacecraft') || t.includes('vessel') || t.includes('fleet')) return 'We operate 15 spaceships — from the luxury Solar Sailer to the Deep Void Dreadnought. Visit the Spaceships page for full specs.';
        if (t.includes('package') || t.includes('tour') || t.includes('journey')) return 'We offer 15 curated packages. Open the Packages page, then click Details on any package for its stops and FAQs.';
        if (t.includes('destination') || t.includes('planet') || t.includes('where')) return 'There are 90 destinations across 6 categories. The Destinations page lets you filter and search them.';
        if (t.includes('book') || t.includes('reserve') || t.includes('inquiry')) return 'Head to Book Journey and complete the inquiry form — a licensed advisor reviews every request.';
        if (t.includes('price') || t.includes('cost') || t.includes('dollar') || t.includes('how much')) return 'Prices are shown in US dollars on every card, from a few thousand dollars up to tens of millions for grand tours.';
        if (t.includes('rating') || t.includes('review') || t.includes('star')) return 'Every destination, package and ship shows a user star rating and review count to help you choose.';
        if (t.includes('safe') || t.includes('danger')) return 'All journeys follow Galactic Transit Authority safety protocols. See the Terms page for details.';
        if (t.includes('thank')) return "You're welcome — safe travels among the stars!";
        return "I'm a demo assistant for this site. Try asking about destinations, packages, spaceships, prices or booking.";
    }
    launcher.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) { if (!msgs.hasChildNodes()) add("Hi! I'm Orion, your travel assistant. How can I help you explore the cosmos?", 'bot'); input.focus(); }
    });
    panel.querySelector('.chat-close').addEventListener('click', () => panel.classList.remove('open'));
    form.addEventListener('submit', e => { e.preventDefault(); const v = input.value.trim(); if (!v) return; add(v, 'user'); input.value = ''; setTimeout(() => add(reply(v), 'bot'), 350); });
}


/* -----------------------------------------------------------------------
   HERO VIDEO — attach the large MP4 only after first paint
----------------------------------------------------------------------- */
function initHeroVideo() {
    const video = document.querySelector('.hero-video[data-src]');
    if (!video) return;
    const src = video.getAttribute('data-src');
    if (!src) return;
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.removeAttribute('data-src');
    video.load();
    const play = () => video.play().catch(() => {});
    if (video.readyState >= 2) play();
    else video.addEventListener('loadeddata', play, { once: true });
}


/* -----------------------------------------------------------------------
   START
----------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    /* 1) Build chrome + catalogue UI while body is still hidden */
    document.body.insertBefore(buildNavigation(), document.body.firstChild);
    document.body.appendChild(buildFooter());
    buildChatbot();
    initDestinationsPage();
    initFeatured();
    initPackagesPage();
    initPackageDetail();
    initSpaceshipsPage();
    initSpaceshipDetail();

    /* 2) Wait for images (or fallbacks) so alt-text never flashes on reveal */
    whenImagesReady(document, 4000).then(() => {
        document.documentElement.classList.add('app-ready');
        /* 3) Heavy hero video only after the page is visible with images in place */
        requestAnimationFrame(() => initHeroVideo());
    });
});
