# Student Setup Co. — Student-Run Ecommerce Store

A clean, fully customizable ecommerce storefront built with plain HTML, CSS, and JavaScript. No frameworks, no build tools — just open the files in a browser or host on any static server (GitHub Pages, Netlify, Vercel).

---

## Quick Start

1. Open `index.html` in your browser to see the customer storefront.
2. Open `admin.html` to access the admin/dev panel.
3. Everything saves automatically in your browser's `localStorage`.

---

## File Structure

```
├── index.html          ← Customer-facing storefront
├── admin.html          ← Admin / dev panel
├── store.css           ← All storefront styles (light theme)
├── admin.css           ← Admin panel styles
├── data.js             ← Default product and settings data
├── store.js            ← Storefront logic (cart, modal, search, render)
├── admin.js            ← Admin logic (auth, CRUD, export/import)
└── images/
    └── placeholder.svg ← Default product image placeholder
```

---

## Admin / Dev Panel

**URL:** `admin.html`

**Default password:** `admin123`

> ⚠️ The password is hardcoded in `admin.js` and visible in source code. This is fine for a local prototype but **do not use this for a real store with real customers or payment data.**

### What you can change in the admin panel:

| Tab | What it does |
|---|---|
| **Settings** | Store name, hero text, announcement bar, footer, social links |
| **Theme** | Colors, border radius, card style — with a live preview |
| **Products** | Add, edit, delete products — all fields editable |
| **Categories** | Add, rename, delete categories; toggle navbar visibility |
| **Homepage** | Show/hide sections, reorder them, rename them |
| **Promotions** | Sale banner text, featured tag for the "Sale" nav link |
| **Data** | Export JSON backup, import JSON, reset to demo defaults |

---

## How to Export / Import Data

**Export:**
1. Go to Admin → Data tab
2. Click **Export JSON**
3. A `.json` file downloads to your computer

**Import:**
1. Go to Admin → Data tab
2. Click **Import JSON**
3. Select your previously exported `.json` file
4. Refresh the store tab to see the changes

---

## How to Reset to Demo Products

1. Go to Admin → Data tab
2. Click **Reset to Demo Data**
3. Confirm the prompt — this restores all 10 default products, 7 categories, and original settings

---

## Default Products

| Product | Price |
|---|---|
| Student Desk Reset Kit | $24.99 (sale $19.99) |
| Magnetic Locker Calendar | $12.99 |
| Weekly Study Planner Pad | $8.99 (sale $6.99) |
| Cable Management Kit | $14.99 |
| Mini Clear Desk Drawers | $18.99 (sale $15.99) |
| Under-Desk Storage Drawer | $22.99 |
| Dorm Bedside Caddy | $16.99 |
| Dry-Erase Monthly Calendar | $11.99 (sale $9.99) |
| Pencil & Sticky Note Organizer | $9.99 |
| Student Command Center Bundle | $34.99 (sale $28.99) |

---

## Customizing the Store Name

1. Open `admin.html`
2. Go to the **Settings** tab
3. Change **Store Name** and **Logo Text**
4. Click **Save Settings**
5. Refresh the store

---

## Adding Real Product Images

In the **Products** tab, edit any product and paste a full image URL (e.g. from Unsplash, your own hosting, or an Amazon product image) into the **Image URL** field.

---

## Hosting on GitHub Pages

1. Push this repo to GitHub
2. Go to Settings → Pages
3. Set source to `main` branch, root `/`
4. Your store will be live at `https://yourusername.github.io/yourrepo/`

---

## Tech Notes

- All data is stored in `localStorage` under the `s1-` prefix
- No backend, no database, no payment processing (checkout shows a placeholder)
- Designed to work by opening `index.html` directly — no server needed for local use
- Mobile responsive — tested at 375px, 768px, and 1200px
- Script loading order: `data.js` → `store.js` → `admin.js` (admin only)

---

*Student-run ecommerce project — built to test products and learn how online stores work.*
