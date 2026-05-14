// ============================================================
// admin.js — Student Setup Co. Admin Panel Logic
//
// SECURITY NOTE: The password below is hardcoded and visible
// in source code. This is intentional for a demo/prototype.
// DO NOT use this for a real store with real customers.
// ============================================================

const ADMIN_PASSWORD = 'admin123'; // Change this, but know it's still visible in source

// ── Auth ─────────────────────────────────────────────────────
function checkAuth() {
  if (sessionStorage.getItem('s1-admin-auth') === '1') {
    showAdminPanel();
  } else {
    showPasswordGate();
  }
}

function showPasswordGate() {
  document.getElementById('a-auth-gate').style.display = 'flex';
  document.getElementById('a-shell').classList.remove('visible');
}

function showAdminPanel() {
  document.getElementById('a-auth-gate').style.display = 'none';
  document.getElementById('a-shell').classList.add('visible');
  loadState();
  renderAll();
  switchTab('settings');
}

function attemptLogin() {
  const input = document.getElementById('a-password-input');
  const error = document.getElementById('a-login-error');
  if (input.value === ADMIN_PASSWORD) {
    sessionStorage.setItem('s1-admin-auth', '1');
    error.textContent = '';
    showAdminPanel();
  } else {
    error.textContent = 'Incorrect password. Try: admin123';
    input.value = '';
    input.focus();
  }
}

function logout() {
  sessionStorage.removeItem('s1-admin-auth');
  showPasswordGate();
}

// ── Tab switching ─────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.a-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.a-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tabId));

  // Refresh panel content when switching to it
  if (tabId === 'products')    renderProductTable();
  if (tabId === 'categories')  renderCategoryList();
  if (tabId === 'sections')    renderSectionList();
  if (tabId === 'settings')    populateSettingsForm();
  if (tabId === 'promotions')  populatePromotionsForm();
  if (tabId === 'theme')       populateThemeForm();
}

// ── Toast notification ────────────────────────────────────────
function showToast(msg, type) {
  const toast = document.getElementById('a-toast');
  toast.textContent = msg;
  toast.className = 'a-toast show ' + (type || 'success');
  setTimeout(() => { toast.className = 'a-toast'; }, 2800);
}

// ── Render all panels ─────────────────────────────────────────
function renderAll() {
  populateSettingsForm();
  populateThemeForm();
  populatePromotionsForm();
  renderProductTable();
  renderCategoryList();
  renderSectionList();
  populateCategoryDropdown();
}

// ── Settings tab ──────────────────────────────────────────────
function populateSettingsForm() {
  const s = State.settings;
  const fields = [
    'storeName','logoText','storeTagline',
    'heroHeading','heroSubtitle','heroCta',
    'announceText',
    'footerAbout','footerContact','footerInstagram','footerTiktok'
  ];
  fields.forEach(f => {
    const el = document.getElementById('s-setting-' + f);
    if (el) el.value = s[f] || '';
  });
  const announceCheck = document.getElementById('s-setting-announceVisible');
  if (announceCheck) announceCheck.checked = !!s.announceVisible;
}

function saveSettings() {
  const s = State.settings;
  const fields = [
    'storeName','logoText','storeTagline',
    'heroHeading','heroSubtitle','heroCta',
    'announceText',
    'footerAbout','footerContact','footerInstagram','footerTiktok'
  ];
  fields.forEach(f => {
    const el = document.getElementById('s-setting-' + f);
    if (el) s[f] = el.value.trim();
  });
  const announceCheck = document.getElementById('s-setting-announceVisible');
  if (announceCheck) s.announceVisible = announceCheck.checked;

  window.saveSettings();
  showToast('Settings saved! Refresh the store to see changes.');
}

// ── Theme tab ─────────────────────────────────────────────────
const THEME_FIELDS = [
  { key: 'themeAccent',       id: 't-accent',    label: 'Accent Color',       type: 'color', prop: '--s-accent' },
  { key: 'themeSale',         id: 't-sale',      label: 'Sale Color',         type: 'color', prop: '--s-sale'   },
  { key: 'themeStar',         id: 't-star',      label: 'Star Color',         type: 'color', prop: '--s-star'   },
  { key: 'themeBgSubtle',     id: 't-bgsubtle',  label: 'Subtle Background',  type: 'color', prop: '--s-bg-subtle' },
  { key: 'themeHeroBg',       id: 't-herobg',    label: 'Hero Background',    type: 'color', prop: '--s-hero-bg' },
  { key: 'themeBorderRadius', id: 't-radius',    label: 'Border Radius',      type: 'text'  }
];

function populateThemeForm() {
  const s = State.settings;
  THEME_FIELDS.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) el.value = s[f.key] || '';
  });
  const cardStyle = document.getElementById('t-cardstyle');
  if (cardStyle) cardStyle.value = s.themeCardStyle || 'shadow';
}

function applyPreviewTheme() {
  const iframe = document.getElementById('a-preview-frame');
  if (!iframe || !iframe.contentDocument) return;
  const root = iframe.contentDocument.documentElement;
  THEME_FIELDS.forEach(f => {
    if (f.prop) {
      const el = document.getElementById(f.id);
      if (el && el.value) root.style.setProperty(f.prop, el.value);
    }
  });
  const radius = document.getElementById('t-radius');
  if (radius && radius.value) {
    root.style.setProperty('--s-border-radius', radius.value);
  }
  const cardStyle = document.getElementById('t-cardstyle');
  if (cardStyle) root.dataset.cardStyle = cardStyle.value;
}

function saveTheme() {
  const s = State.settings;
  THEME_FIELDS.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) s[f.key] = el.value;
  });
  const cardStyle = document.getElementById('t-cardstyle');
  if (cardStyle) s.themeCardStyle = cardStyle.value;

  window.saveSettings();
  showToast('Theme saved! Refresh the store to see changes.');
}

// ── Promotions tab ────────────────────────────────────────────
function populatePromotionsForm() {
  const s = State.settings;
  const bannerText   = document.getElementById('promo-banner-text');
  const bannerActive = document.getElementById('promo-banner-active');
  const featuredTag  = document.getElementById('promo-featured-tag');
  if (bannerText)   bannerText.value     = s.saleBannerText || '';
  if (bannerActive) bannerActive.checked = !!s.saleBannerActive;
  if (featuredTag)  featuredTag.value    = s.featuredTag || 'bestseller';
}

function savePromotions() {
  const s = State.settings;
  const bannerText   = document.getElementById('promo-banner-text');
  const bannerActive = document.getElementById('promo-banner-active');
  const featuredTag  = document.getElementById('promo-featured-tag');
  if (bannerText)   s.saleBannerText   = bannerText.value.trim();
  if (bannerActive) s.saleBannerActive = bannerActive.checked;
  if (featuredTag)  s.featuredTag      = featuredTag.value;

  window.saveSettings();
  showToast('Promotions saved!');
}

// ── Products tab ──────────────────────────────────────────────
function renderProductTable() {
  const tbody = document.getElementById('a-product-tbody');
  if (!tbody) return;

  if (!State.products.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:#94a3b8;">No products yet. Click "Add Product" to start.</td></tr>';
    return;
  }

  tbody.innerHTML = State.products.map(p => {
    const cat    = State.categories.find(c => c.id === p.category);
    const price  = p.salePrice ? `<del style="color:#94a3b8">$${p.price.toFixed(2)}</del> <strong style="color:#dc2626">$${p.salePrice.toFixed(2)}</strong>` : `$${p.price.toFixed(2)}`;
    const status = p.inStock ? '<span class="a-tag a-tag-green">In Stock</span>' : '<span class="a-tag a-tag-red">Out of Stock</span>';
    const tags   = (p.tags || []).map(t => `<span class="a-tag a-tag-blue">${t}</span>`).join(' ');
    return `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${cat ? cat.name : '—'}</td>
        <td>${price}</td>
        <td>${tags || '—'}</td>
        <td>${status}</td>
        <td>
          <div class="a-table-actions">
            <button class="a-btn a-btn-ghost a-btn-sm" onclick="openProductForm('${p.id}')">Edit</button>
            <button class="a-btn a-btn-danger a-btn-sm" onclick="deleteProduct('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function populateCategoryDropdown() {
  const sel = document.getElementById('pf-category');
  if (!sel) return;
  sel.innerHTML = State.categories.map(c =>
    `<option value="${c.id}">${c.name}</option>`
  ).join('');
}

// Open product form (null = add new, id = edit existing)
function openProductForm(productId) {
  const isNew = !productId;
  const p     = isNew ? null : State.products.find(x => x.id === productId);

  document.getElementById('pf-title').textContent   = isNew ? 'Add Product' : 'Edit Product';
  document.getElementById('pf-id').value             = productId || '';
  document.getElementById('pf-name').value           = p ? p.name           : '';
  document.getElementById('pf-description').value    = p ? p.description    : '';
  document.getElementById('pf-features').value       = p ? (p.features || []).join('\n') : '';
  document.getElementById('pf-problemSolved').value  = p ? p.problemSolved  : '';
  document.getElementById('pf-price').value          = p ? p.price          : '';
  document.getElementById('pf-salePrice').value      = p ? (p.salePrice || '') : '';
  document.getElementById('pf-image').value          = p ? p.image          : 'images/placeholder.svg';
  document.getElementById('pf-rating').value         = p ? p.rating         : '4.5';
  document.getElementById('pf-reviewCount').value    = p ? p.reviewCount    : '0';
  document.getElementById('pf-inStock').checked      = p ? p.inStock        : true;

  populateCategoryDropdown();
  if (p && document.getElementById('pf-category')) {
    document.getElementById('pf-category').value = p.category;
  }

  // Tags checkboxes
  ['bestseller','new','under15','studentpick'].forEach(tag => {
    const cb = document.getElementById('pf-tag-' + tag);
    if (cb) cb.checked = p ? (p.tags || []).includes(tag) : false;
  });

  document.getElementById('a-product-modal').classList.add('open');
}

function closeProductForm() {
  document.getElementById('a-product-modal').classList.remove('open');
}

function saveProduct() {
  const id          = document.getElementById('pf-id').value;
  const name        = document.getElementById('pf-name').value.trim();
  const description = document.getElementById('pf-description').value.trim();
  const featuresRaw = document.getElementById('pf-features').value.trim();
  const problemSolved = document.getElementById('pf-problemSolved').value.trim();
  const price       = parseFloat(document.getElementById('pf-price').value);
  const salePriceRaw = document.getElementById('pf-salePrice').value.trim();
  const salePrice   = salePriceRaw ? parseFloat(salePriceRaw) : null;
  const image       = document.getElementById('pf-image').value.trim() || 'images/placeholder.svg';
  const category    = document.getElementById('pf-category').value;
  const rating      = parseFloat(document.getElementById('pf-rating').value) || 4.5;
  const reviewCount = parseInt(document.getElementById('pf-reviewCount').value) || 0;
  const inStock     = document.getElementById('pf-inStock').checked;
  const features    = featuresRaw ? featuresRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

  const tags = ['bestseller','new','under15','studentpick'].filter(tag => {
    const cb = document.getElementById('pf-tag-' + tag);
    return cb && cb.checked;
  });

  if (!name)       { showToast('Product name is required.', 'error'); return; }
  if (isNaN(price)) { showToast('Price must be a number.', 'error'); return; }

  const productData = {
    name, description, features, problemSolved,
    price, salePrice, image, category, tags,
    rating, reviewCount, inStock,
    createdAt: Date.now()
  };

  if (id) {
    // Edit existing
    const idx = State.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      State.products[idx] = { ...State.products[idx], ...productData };
    }
  } else {
    // Add new
    productData.id = 'prod_' + Date.now();
    State.products.push(productData);
  }

  window.saveProducts();
  renderProductTable();
  closeProductForm();
  showToast(id ? 'Product updated!' : 'Product added!');
}

function deleteProduct(productId) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  State.products = State.products.filter(p => p.id !== productId);
  // Also remove from any manual sections
  State.sections.forEach(sec => {
    if (sec.productIds) {
      sec.productIds = sec.productIds.filter(id => id !== productId);
    }
  });
  window.saveProducts();
  window.saveSections();
  renderProductTable();
  showToast('Product deleted.');
}

// ── Categories tab ────────────────────────────────────────────
function renderCategoryList() {
  const list = document.getElementById('a-cat-list');
  if (!list) return;

  if (!State.categories.length) {
    list.innerHTML = '<p style="color:#94a3b8;font-size:13px;">No categories yet.</p>';
    return;
  }

  list.innerHTML = [...State.categories]
    .sort((a, b) => a.order - b.order)
    .map(c => `
      <div class="a-cat-item">
        <span class="a-cat-item-name">${c.name}</span>
        <label class="a-toggle" title="Show in navbar">
          <input type="checkbox" ${c.showInNav ? 'checked' : ''} onchange="toggleCatNav('${c.id}', this.checked)">
          <span class="a-toggle-slider"></span>
        </label>
        <span class="a-toggle-label" style="font-size:11px;color:#94a3b8;">In nav</span>
        <button class="a-btn a-btn-ghost a-btn-sm" onclick="renameCat('${c.id}')">Rename</button>
        <button class="a-btn a-btn-danger a-btn-sm" onclick="deleteCat('${c.id}')">Delete</button>
      </div>`
    ).join('');
}

function addCategory() {
  const input = document.getElementById('a-new-cat-name');
  const name  = input ? input.value.trim() : '';
  if (!name) { showToast('Enter a category name.', 'error'); return; }
  if (State.categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
    showToast('Category already exists.', 'error'); return;
  }
  const slug = name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  const order = Math.max(...State.categories.map(c => c.order), -1) + 1;
  State.categories.push({ id: 'cat_' + Date.now(), name, slug, showInNav: true, order });
  window.saveCategories();
  if (input) input.value = '';
  renderCategoryList();
  showToast('Category added!');
}

function renameCat(catId) {
  const cat = State.categories.find(c => c.id === catId);
  if (!cat) return;
  const newName = prompt('Rename category:', cat.name);
  if (!newName || !newName.trim()) return;
  cat.name = newName.trim();
  window.saveCategories();
  renderCategoryList();
  showToast('Category renamed!');
}

function toggleCatNav(catId, visible) {
  const cat = State.categories.find(c => c.id === catId);
  if (cat) { cat.showInNav = visible; window.saveCategories(); }
}

function deleteCat(catId) {
  const cat = State.categories.find(c => c.id === catId);
  if (!cat) return;
  if (!confirm(`Delete category "${cat.name}"? Products in this category won't be removed, but their category will be unset.`)) return;
  State.categories = State.categories.filter(c => c.id !== catId);
  window.saveCategories();
  renderCategoryList();
  showToast('Category deleted.');
}

// ── Sections tab ──────────────────────────────────────────────
function renderSectionList() {
  const list = document.getElementById('a-section-list');
  if (!list) return;

  const sections = [...State.sections].sort((a, b) => a.order - b.order);

  list.innerHTML = sections.map((sec, idx) => {
    const typeLabel = sec.type === 'manual' ? 'Manual'
                    : sec.type === 'auto-tag' ? `Auto: ${sec.autoTag || 'tag'}`
                    : `Auto: ${sec.autoCategory || 'category'}`;
    return `
      <div class="a-section-item">
        <div class="a-section-header">
          <label class="a-toggle">
            <input type="checkbox" ${sec.visible ? 'checked' : ''} onchange="toggleSectionVisible('${sec.id}', this.checked)">
            <span class="a-toggle-slider"></span>
          </label>
          <span class="a-section-title-text">${sec.title}</span>
          <span class="a-tag a-tag-gray" style="font-size:10px;">${typeLabel}</span>
          <div class="a-section-order-btns">
            ${idx > 0 ? `<button class="a-order-btn" onclick="moveSectionUp('${sec.id}')" title="Move up">↑</button>` : '<span style="width:26px"></span>'}
            ${idx < sections.length-1 ? `<button class="a-order-btn" onclick="moveSectionDown('${sec.id}')" title="Move down">↓</button>` : '<span style="width:26px"></span>'}
          </div>
          <button class="a-btn a-btn-ghost a-btn-sm" onclick="editSectionTitle('${sec.id}')">Rename</button>
        </div>
      </div>`;
  }).join('');
}

function toggleSectionVisible(sectionId, visible) {
  const sec = State.sections.find(s => s.id === sectionId);
  if (sec) { sec.visible = visible; window.saveSections(); showToast(visible ? 'Section shown.' : 'Section hidden.'); }
}

function moveSectionUp(sectionId) {
  const sections = [...State.sections].sort((a, b) => a.order - b.order);
  const idx = sections.findIndex(s => s.id === sectionId);
  if (idx <= 0) return;
  const tmp = sections[idx].order;
  sections[idx].order = sections[idx - 1].order;
  sections[idx - 1].order = tmp;
  State.sections = sections;
  window.saveSections();
  renderSectionList();
}

function moveSectionDown(sectionId) {
  const sections = [...State.sections].sort((a, b) => a.order - b.order);
  const idx = sections.findIndex(s => s.id === sectionId);
  if (idx >= sections.length - 1) return;
  const tmp = sections[idx].order;
  sections[idx].order = sections[idx + 1].order;
  sections[idx + 1].order = tmp;
  State.sections = sections;
  window.saveSections();
  renderSectionList();
}

function editSectionTitle(sectionId) {
  const sec = State.sections.find(s => s.id === sectionId);
  if (!sec) return;
  const newTitle = prompt('Section title:', sec.title);
  if (!newTitle || !newTitle.trim()) return;
  sec.title = newTitle.trim();
  window.saveSections();
  renderSectionList();
  showToast('Section title updated!');
}

// ── Data tab ──────────────────────────────────────────────────
function exportData() {
  const data = {
    products:   State.products,
    categories: State.categories,
    sections:   State.sections,
    settings:   State.settings,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'studentsetupcostorage-' + Date.now() + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported as JSON!');
}

function importData() {
  const input = document.getElementById('a-import-file');
  if (!input) return;
  input.click();
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (parsed.products)   State.products   = parsed.products;
      if (parsed.categories) State.categories = parsed.categories;
      if (parsed.sections)   State.sections   = parsed.sections;
      if (parsed.settings)   State.settings   = parsed.settings;
      window.saveAll();
      renderAll();
      showToast('Data imported! Refresh the store tab to see changes.');
    } catch (err) {
      showToast('Invalid JSON file. Import failed.', 'error');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

function resetToDefaults() {
  if (!confirm('Reset everything to the default demo products, categories, and settings? This will delete any changes you made.')) return;
  const D      = window.STORE_DEFAULTS;
  State.products   = JSON.parse(JSON.stringify(D.products));
  State.categories = JSON.parse(JSON.stringify(D.categories));
  State.sections   = JSON.parse(JSON.stringify(D.sections));
  State.settings   = JSON.parse(JSON.stringify(D.settings));
  window.saveAll();
  renderAll();
  showToast('Reset to demo defaults!');
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();

  // Login form — allow Enter key
  const pwInput = document.getElementById('a-password-input');
  if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptLogin(); });

  // Theme pickers: update preview iframe live
  document.querySelectorAll('.a-theme-input').forEach(el => {
    el.addEventListener('input', applyPreviewTheme);
  });

  // Import file input
  const importFile = document.getElementById('a-import-file');
  if (importFile) importFile.addEventListener('change', handleImport);

  // Preview iframe: reapply theme once loaded
  const iframe = document.getElementById('a-preview-frame');
  if (iframe) {
    iframe.addEventListener('load', () => {
      // Small delay to let the iframe's store.js init first
      setTimeout(applyPreviewTheme, 300);
    });
  }
});
