// ============================================================
// store.js — Student Setup Co. Storefront Logic
// Handles: state, localStorage, rendering, cart, modal, search
// ============================================================

// ── State ────────────────────────────────────────────────────
const State = {
  products:   [],
  categories: [],
  sections:   [],
  settings:   {},
  cart:       [],
  ui: {
    cartOpen:      false,
    modalOpen:     false,
    searchOpen:    false,
    modalProduct:  null,
    searchQuery:   '',
    searchCategory:'all',
    searchMaxPrice: 999,
    searchTag:     'all',
    _escHandler:   null
  }
};

// localStorage key prefix — avoids conflicts with other sites
const LS = {
  products:   's1-products',
  categories: 's1-categories',
  sections:   's1-sections',
  settings:   's1-settings',
  cart:       's1-cart'
};

// ── localStorage helpers ─────────────────────────────────────
function loadState() {
  const D = window.STORE_DEFAULTS;
  State.products   = JSON.parse(localStorage.getItem(LS.products))   || D.products;
  State.categories = JSON.parse(localStorage.getItem(LS.categories)) || D.categories;
  State.sections   = JSON.parse(localStorage.getItem(LS.sections))   || D.sections;
  State.settings   = JSON.parse(localStorage.getItem(LS.settings))   || D.settings;
  State.cart       = JSON.parse(localStorage.getItem(LS.cart))       || [];
}

function saveCart()       { localStorage.setItem(LS.cart,       JSON.stringify(State.cart)); }
function saveSettings()   { localStorage.setItem(LS.settings,   JSON.stringify(State.settings)); }
function saveProducts()   { localStorage.setItem(LS.products,   JSON.stringify(State.products)); }
function saveCategories() { localStorage.setItem(LS.categories, JSON.stringify(State.categories)); }
function saveSections()   { localStorage.setItem(LS.sections,   JSON.stringify(State.sections)); }

function saveAll() {
  saveCart(); saveSettings(); saveProducts(); saveCategories(); saveSections();
}

// Expose for admin.js
window.State         = State;
window.loadState     = loadState;
window.saveCart      = saveCart;
window.saveSettings  = saveSettings;
window.saveProducts  = saveProducts;
window.saveCategories = saveCategories;
window.saveSections  = saveSections;
window.saveAll       = saveAll;

// ── Theme ────────────────────────────────────────────────────
// Maps settings keys to CSS custom property names
const THEME_MAP = {
  themeAccent:       '--s-accent',
  themeSale:         '--s-sale',
  themeStar:         '--s-star',
  themeBgSubtle:     '--s-bg-subtle',
  themeHeroBg:       '--s-hero-bg',
  themeBorderRadius: '--s-border-radius'
};

function applyTheme(settings) {
  const root = document.documentElement;
  for (const [key, prop] of Object.entries(THEME_MAP)) {
    if (settings[key]) root.style.setProperty(prop, settings[key]);
  }
  // Card style controls which CSS variant class is active
  root.dataset.cardStyle = settings.themeCardStyle || 'shadow';
}
window.applyTheme = applyTheme;

// ── HTML helpers ─────────────────────────────────────────────
function starHTML(rating) {
  const full = Math.floor(rating);
  const half = (rating % 1) >= 0.5;
  let s = '';
  for (let i = 0; i < 5; i++) {
    if (i < full)             s += '<span class="s-star s-star--full">★</span>';
    else if (i === full && half) s += '<span class="s-star s-star--half">★</span>';
    else                      s += '<span class="s-star s-star--empty">★</span>';
  }
  return s;
}

function badgeHTML(tags) {
  const MAP = {
    bestseller:  ['Best Seller',   's-badge--bestseller'],
    new:         ['New',           's-badge--new'],
    under15:     ['Under $15',     's-badge--under15'],
    studentpick: ['Student Pick',  's-badge--studentpick']
  };
  return (tags || []).slice(0, 2)
    .filter(t => MAP[t])
    .map(t => `<span class="s-badge ${MAP[t][1]}">${MAP[t][0]}</span>`)
    .join('');
}

function priceHTML(price, salePrice) {
  if (salePrice) {
    return `<span class="s-price-sale">$${salePrice.toFixed(2)}</span>`
         + `<span class="s-price-orig">$${price.toFixed(2)}</span>`;
  }
  return `<span class="s-price">$${price.toFixed(2)}</span>`;
}

// Renders a single product card as an HTML string
function renderCard(product) {
  const saleBadge = product.salePrice ? '<span class="s-badge s-badge--sale">Sale</span>' : '';
  return `
    <div class="s-card" data-id="${product.id}">
      <div class="s-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="s-card-badges">${badgeHTML(product.tags)}${saleBadge}</div>
      </div>
      <div class="s-card-body">
        <div class="s-card-rating">${starHTML(product.rating)} <span class="s-card-review-count">(${product.reviewCount})</span></div>
        <h3 class="s-card-name">${product.name}</h3>
        <p class="s-card-desc">${product.description.substring(0, 90)}…</p>
        <div class="s-card-prices">${priceHTML(product.price, product.salePrice)}</div>
        <button class="s-btn s-card-atc" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>`;
}
window.renderCard = renderCard;

// ── Section resolver ─────────────────────────────────────────
function resolveSection(section) {
  let products;
  if (section.type === 'manual') {
    products = (section.productIds || [])
      .map(id => State.products.find(p => p.id === id))
      .filter(Boolean);
  } else if (section.type === 'auto-tag') {
    products = State.products.filter(p => (p.tags || []).includes(section.autoTag));
  } else if (section.type === 'auto-category') {
    products = State.products.filter(p => p.category === section.autoCategory);
  } else {
    products = State.products;
  }
  return products.slice(0, section.maxItems || 6);
}

// ── Render pipeline ──────────────────────────────────────────
function renderAnnounceBar() {
  const bar = document.getElementById('s-announce-bar');
  if (!bar) return;
  if (State.settings.announceVisible) {
    bar.textContent = State.settings.announceText;
    bar.hidden = false;
  } else {
    bar.hidden = true;
  }
}

function renderNav() {
  const logo = document.getElementById('s-logo');
  if (logo) logo.textContent = State.settings.logoText || State.settings.storeName;

  const catNav = document.getElementById('s-cat-nav');
  const mobileMenu = document.getElementById('s-mobile-cats');
  if (!catNav) return;

  const cats = [...State.categories]
    .filter(c => c.showInNav)
    .sort((a, b) => a.order - b.order);

  const linksHTML = cats.map(c =>
    `<a class="s-cat-link" href="#" data-cat="${c.id}">${c.name}</a>`
  ).join('');

  catNav.innerHTML = linksHTML;
  if (mobileMenu) mobileMenu.innerHTML = linksHTML;
}

function renderHero() {
  const s = State.settings;
  const el = id => document.getElementById(id);
  if (el('s-hero-heading'))  el('s-hero-heading').textContent  = s.heroHeading;
  if (el('s-hero-subtitle')) el('s-hero-subtitle').textContent = s.heroSubtitle;
  if (el('s-hero-cta'))      el('s-hero-cta').textContent      = s.heroCta;
}

function renderSection(section) {
  const products = resolveSection(section);
  if (!products.length) return '';
  return `
    <section class="s-section" id="section-${section.id}">
      <div class="s-container">
        <div class="s-section-header">
          <h2 class="s-section-title">${section.title}</h2>
          <a class="s-section-link" href="#">View All →</a>
        </div>
        <div class="s-product-grid">
          ${products.map(renderCard).join('')}
        </div>
      </div>
    </section>`;
}

function renderSections() {
  const container = document.getElementById('s-sections');
  if (!container) return;
  const visible = [...State.sections]
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);
  container.innerHTML = visible.map(renderSection).join('');
}

function renderFooter() {
  const s = State.settings;
  const el = id => document.getElementById(id);
  if (el('s-footer-name'))    el('s-footer-name').textContent    = s.storeName;
  if (el('s-footer-name2'))   el('s-footer-name2').textContent   = s.storeName;
  if (el('s-footer-about'))   el('s-footer-about').textContent   = s.footerAbout;
  if (el('s-footer-contact')) el('s-footer-contact').textContent = s.footerContact;
  if (el('s-footer-ig'))      el('s-footer-ig').href             = s.footerInstagram || '#';
  if (el('s-footer-tt'))      el('s-footer-tt').href             = s.footerTiktok    || '#';
}

function renderCartCount() {
  const count  = State.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge  = document.getElementById('s-cart-count');
  if (badge) { badge.textContent = count; badge.hidden = count === 0; }
}

function renderCartDrawer() {
  const list      = document.getElementById('s-cart-list');
  const subtotalEl = document.getElementById('s-cart-subtotal');
  if (!list) return;

  if (!State.cart.length) {
    list.innerHTML = '<p class="s-cart-empty">Your cart is empty.</p>';
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    return;
  }

  list.innerHTML = State.cart.map(item => {
    const p         = item.product;
    const unitPrice = p.salePrice || p.price;
    const lineTotal = unitPrice * item.quantity;
    return `
      <div class="s-cart-item" data-id="${p.id}">
        <img class="s-cart-item-img" src="${p.image}" alt="${p.name}">
        <div class="s-cart-item-info">
          <p class="s-cart-item-name">${p.name}</p>
          <div class="s-cart-item-controls">
            <button class="s-qty-btn s-qty-minus" data-id="${p.id}">−</button>
            <span class="s-qty-val">${item.quantity}</span>
            <button class="s-qty-btn s-qty-plus" data-id="${p.id}">+</button>
          </div>
          <p class="s-cart-item-price">$${lineTotal.toFixed(2)}</p>
        </div>
        <button class="s-cart-remove" data-id="${p.id}" title="Remove">✕</button>
      </div>`;
  }).join('');

  const subtotal = State.cart.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0
  );
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// ── Cart operations ──────────────────────────────────────────
function addToCart(productId, quantity) {
  quantity = quantity || 1;
  const product  = State.products.find(p => p.id === productId);
  if (!product) return;
  const existing = State.cart.find(i => i.product.id === productId);
  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + quantity);
  } else {
    State.cart.push({ product, quantity });
  }
  saveCart();
  renderCartCount();
  renderCartDrawer();
  openCartDrawer();
}

function removeFromCart(productId) {
  State.cart = State.cart.filter(i => i.product.id !== productId);
  saveCart();
  renderCartCount();
  renderCartDrawer();
}

function updateCartQty(productId, delta) {
  const item = State.cart.find(i => i.product.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, Math.min(99, item.quantity + delta));
  saveCart();
  renderCartDrawer();
}

window.addToCart      = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQty  = updateCartQty;

// ── Cart drawer ──────────────────────────────────────────────
function openCartDrawer() {
  State.ui.cartOpen = true;
  document.getElementById('s-cart-drawer').classList.add('s-cart-drawer--open');
  document.getElementById('s-cart-overlay').classList.add('s-overlay--visible');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  State.ui.cartOpen = false;
  document.getElementById('s-cart-drawer').classList.remove('s-cart-drawer--open');
  document.getElementById('s-cart-overlay').classList.remove('s-overlay--visible');
  document.body.style.overflow = '';
}

// ── Product modal ────────────────────────────────────────────
function openModal(productId) {
  const product = State.products.find(p => p.id === productId);
  if (!product) return;
  State.ui.modalProduct = product;
  State.ui.modalOpen    = true;

  const saleBadge = product.salePrice ? '<span class="s-badge s-badge--sale">Sale</span>' : '';
  document.getElementById('s-modal-content').innerHTML = `
    <div class="s-modal-inner">
      <div class="s-modal-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="s-modal-details">
        <div class="s-card-badges">${badgeHTML(product.tags)}${saleBadge}</div>
        <h2 class="s-modal-name">${product.name}</h2>
        <div class="s-modal-prices">${priceHTML(product.price, product.salePrice)}</div>
        <div class="s-modal-rating">${starHTML(product.rating)} <span>(${product.reviewCount} reviews)</span></div>
        <p class="s-modal-desc">${product.description}</p>
        <div class="s-modal-problem"><strong>Why it helps:</strong> ${product.problemSolved}</div>
        <ul class="s-modal-features">
          ${(product.features || []).map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div class="s-modal-atc-row">
          <div class="s-qty-control">
            <button class="s-qty-btn" id="modal-minus">−</button>
            <input class="s-qty-input" id="modal-qty" type="number" value="1" min="1" max="99">
            <button class="s-qty-btn" id="modal-plus">+</button>
          </div>
          <button class="s-btn s-modal-atc" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    </div>`;

  document.getElementById('modal-minus').addEventListener('click', () => {
    const inp = document.getElementById('modal-qty');
    inp.value = Math.max(1, parseInt(inp.value) - 1);
  });
  document.getElementById('modal-plus').addEventListener('click', () => {
    const inp = document.getElementById('modal-qty');
    inp.value = Math.min(99, parseInt(inp.value) + 1);
  });

  document.getElementById('s-modal-overlay').classList.add('s-overlay--visible');
  document.body.style.overflow = 'hidden';

  State.ui._escHandler = e => { if (e.key === 'Escape') closeModal(); };
  document.addEventListener('keydown', State.ui._escHandler);
}

function closeModal() {
  State.ui.modalOpen    = false;
  State.ui.modalProduct = null;
  document.getElementById('s-modal-overlay').classList.remove('s-overlay--visible');
  document.body.style.overflow = '';
  if (State.ui._escHandler) {
    document.removeEventListener('keydown', State.ui._escHandler);
    State.ui._escHandler = null;
  }
}

window.openModal  = openModal;
window.closeModal = closeModal;

// ── Search / filter ──────────────────────────────────────────
let searchDebounce;

function filterProducts() {
  const query    = State.ui.searchQuery.toLowerCase().trim();
  const cat      = State.ui.searchCategory;
  const maxPrice = parseFloat(State.ui.searchMaxPrice) || 999;
  const tag      = State.ui.searchTag;

  return State.products.filter(p => {
    const price    = p.salePrice || p.price;
    const matchQ   = !query  || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    const matchCat = cat === 'all' || p.category === cat;
    const matchP   = price <= maxPrice;
    const matchTag = tag === 'all' || (p.tags || []).includes(tag);
    return matchQ && matchCat && matchP && matchTag;
  });
}

function renderSearchResults() {
  const grid = document.getElementById('s-search-results');
  if (!grid) return;
  const results = filterProducts();
  if (!results.length) {
    grid.innerHTML = '<p class="s-search-empty">No products found. Try different filters.</p>';
    return;
  }
  grid.innerHTML = `<div class="s-product-grid">${results.map(renderCard).join('')}</div>`;
}

function openSearch() {
  State.ui.searchOpen = true;
  document.getElementById('s-search-overlay').classList.add('s-overlay--visible');
  const inp = document.getElementById('s-search-input');
  if (inp) inp.focus();
  document.body.style.overflow = 'hidden';
  renderSearchResults();
}

function closeSearch() {
  State.ui.searchOpen = false;
  document.getElementById('s-search-overlay').classList.remove('s-overlay--visible');
  document.body.style.overflow = '';
}

window.openSearch  = openSearch;
window.closeSearch = closeSearch;

// ── Mobile nav ───────────────────────────────────────────────
function toggleMobileMenu() {
  document.getElementById('s-mobile-menu').classList.toggle('s-mobile-menu--open');
}

// ── Populate search category dropdown ────────────────────────
function populateSearchFilters() {
  const sel = document.getElementById('s-filter-cat');
  if (!sel) return;
  const catOptions = State.categories
    .map(c => `<option value="${c.id}">${c.name}</option>`)
    .join('');
  sel.innerHTML = '<option value="all">All Categories</option>' + catOptions;
}

// ── Delegated event listener ─────────────────────────────────
// One listener handles all clicks — survives innerHTML re-renders.
document.addEventListener('click', function(e) {

  // Add to cart (card button)
  const atcCard = e.target.closest('.s-card-atc');
  if (atcCard) { e.stopPropagation(); addToCart(atcCard.dataset.id); return; }

  // Add to cart (modal button)
  const atcModal = e.target.closest('.s-modal-atc');
  if (atcModal) {
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    addToCart(atcModal.dataset.id, qty);
    closeModal();
    return;
  }

  // Open modal (click on card but not on the Add to Cart button)
  const card = e.target.closest('.s-card');
  if (card && !e.target.closest('.s-card-atc')) { openModal(card.dataset.id); return; }

  // Cart icon
  if (e.target.closest('#s-cart-btn'))    { openCartDrawer(); return; }

  // Close cart via overlay or X button
  if (e.target.id === 's-cart-overlay')   { closeCartDrawer(); return; }
  if (e.target.closest('#s-cart-close'))  { closeCartDrawer(); return; }

  // Cart item remove
  const removeBtn = e.target.closest('.s-cart-remove');
  if (removeBtn) { removeFromCart(removeBtn.dataset.id); return; }

  // Cart quantity buttons
  const qMinus = e.target.closest('.s-qty-minus');
  if (qMinus) { updateCartQty(qMinus.dataset.id, -1); return; }
  const qPlus = e.target.closest('.s-qty-plus');
  if (qPlus)  { updateCartQty(qPlus.dataset.id,  +1); return; }

  // Close modal via overlay or X button
  if (e.target.id === 's-modal-overlay')  { closeModal(); return; }
  if (e.target.closest('#s-modal-close')) { closeModal(); return; }

  // Open search
  if (e.target.closest('#s-search-bar') || e.target.closest('#s-search-btn')) {
    openSearch(); return;
  }

  // Close search
  if (e.target.closest('#s-search-close')) { closeSearch(); return; }

  // Mobile hamburger
  if (e.target.closest('#s-hamburger')) { toggleMobileMenu(); return; }

  // Category links (open search pre-filtered)
  const catLink = e.target.closest('.s-cat-link');
  if (catLink) {
    e.preventDefault();
    State.ui.searchCategory = catLink.dataset.cat;
    State.ui.searchQuery    = '';
    const inp = document.getElementById('s-search-input');
    if (inp) inp.value = '';
    const sel = document.getElementById('s-filter-cat');
    if (sel) sel.value = catLink.dataset.cat;
    openSearch();
    return;
  }

  // Checkout placeholder
  if (e.target.closest('#s-checkout-btn')) {
    alert('Checkout coming soon — we\'re working on it! 🎒');
    return;
  }
});

// ── Search input events (wired after DOM ready) ───────────────
document.addEventListener('DOMContentLoaded', function() {
  const searchInput   = document.getElementById('s-search-input');
  const filterCat     = document.getElementById('s-filter-cat');
  const filterPrice   = document.getElementById('s-filter-price');
  const filterPriceVal = document.getElementById('s-filter-price-val');
  const filterTag     = document.getElementById('s-filter-tag');

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      State.ui.searchQuery = e.target.value;
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(renderSearchResults, 200);
    });
  }

  if (filterCat) {
    filterCat.addEventListener('change', e => {
      State.ui.searchCategory = e.target.value;
      renderSearchResults();
    });
  }

  if (filterPrice) {
    filterPrice.addEventListener('input', e => {
      State.ui.searchMaxPrice = e.target.value;
      if (filterPriceVal) filterPriceVal.textContent = `$${e.target.value}`;
      renderSearchResults();
    });
  }

  if (filterTag) {
    filterTag.addEventListener('change', e => {
      State.ui.searchTag = e.target.value;
      renderSearchResults();
    });
  }
});

// ── Re-render when admin saves data in another tab ───────────
window.addEventListener('storage', e => {
  if (e.key && e.key.startsWith('s1-')) {
    loadState();
    applyTheme(State.settings);
    renderAnnounceBar();
    renderNav();
    renderHero();
    renderSections();
    renderFooter();
    renderCartCount();
    populateSearchFilters();
  }
});

// ── Main init ────────────────────────────────────────────────
function initStore() {
  // If loaded inside admin.html, only expose utilities — don't render the storefront
  if (document.body && document.body.dataset.page === 'admin') return;

  loadState();
  applyTheme(State.settings);
  renderAnnounceBar();
  renderNav();
  renderHero();
  renderSections();
  renderFooter();
  renderCartCount();
  renderCartDrawer();
  populateSearchFilters();
}

document.addEventListener('DOMContentLoaded', initStore);
