// ============================================================
// data.js — Default seed data for Student Setup Co.
// Edit STORE_DEFAULTS to change starter products, categories,
// sections, and settings. The admin panel also lets you change
// everything without touching code.
// ============================================================

window.STORE_DEFAULTS = {

  // ── Store settings ──────────────────────────────────────────
  settings: {
    storeName:        'Student Setup Co.',
    storeTagline:     'Student-run. Budget-friendly. Actually useful.',
    logoText:         'Student Setup Co.',
    logoImage:        null,

    // Hero banner
    heroHeading:      'Upgrade Your Study Space',
    heroSubtitle:     'Simple organizers, calendars, and desk essentials made for students.',
    heroCta:          'Shop Student Essentials',
    heroCtaLink:      '#shop',

    // Announcement bar
    announceVisible:  true,
    announceText:     '🎒 Student-run store — Free shipping on orders over $35!',

    // Footer
    footerAbout:      'A student-run store selling products we actually use every day.',
    footerContact:    'hello@studentsetupco.com',
    footerInstagram:  '',
    footerTiktok:     '',

    // Policies (text only for now)
    policyReturn:     '30-day returns on all orders.',
    policyShipping:   'Free shipping on orders over $35.',
    policyPrivacy:    "We never sell your data.",

    // Promotions
    saleBannerText:   'Back-to-School Sale — Up to 30% Off!',
    saleBannerActive: true,
    featuredTag:      'bestseller',

    // Theme — maps 1-to-1 to CSS custom properties in store.css
    themeAccent:       '#2563eb',
    themeSale:         '#dc2626',
    themeStar:         '#f59e0b',
    themeBgSubtle:     '#f8f9fa',
    themeHeroBg:       '#eef2ff',
    themeBorderRadius: '10px',
    themeCardStyle:    'shadow'   // 'shadow' | 'border' | 'flat'
  },

  // ── Categories ───────────────────────────────────────────────
  categories: [
    { id: 'cat_all',    name: 'Shop All',              slug: 'all',       showInNav: true, order: 0 },
    { id: 'cat_desk',   name: 'Desk Organization',     slug: 'desk',      showInNav: true, order: 1 },
    { id: 'cat_cal',    name: 'Calendars & Planners',  slug: 'calendars', showInNav: true, order: 2 },
    { id: 'cat_dorm',   name: 'Dorm Essentials',       slug: 'dorm',      showInNav: true, order: 3 },
    { id: 'cat_locker', name: 'Locker Organization',   slug: 'locker',    showInNav: true, order: 4 },
    { id: 'cat_kits',   name: 'Study Kits',            slug: 'kits',      showInNav: true, order: 5 },
    { id: 'cat_deals',  name: 'Deals',                 slug: 'deals',     showInNav: true, order: 6 }
  ],

  // ── Products ─────────────────────────────────────────────────
  // tags: 'bestseller' | 'new' | 'under15' | 'studentpick'
  products: [
    {
      id:           'prod_001',
      name:         'Student Desk Reset Kit',
      description:  'Everything you need to transform a cluttered desk into a clean study zone in minutes. Includes a pencil cup, sticky note holder, cable clips, and a small tray.',
      features:     ['Includes 5 organizer pieces', 'Fits any standard desk', 'Easy to rearrange', 'Lightweight and durable', 'Cable management included'],
      problemSolved: 'Clutter kills focus. This kit gives you one clean system so you spend less time searching and more time studying.',
      price:        24.99,
      salePrice:    19.99,
      image:        'images/placeholder.svg',
      category:     'cat_desk',
      tags:         ['bestseller', 'studentpick'],
      rating:       4.8,
      reviewCount:  142,
      inStock:      true,
      createdAt:    1715000000000
    },
    {
      id:           'prod_002',
      name:         'Magnetic Locker Calendar',
      description:  'A dry-erase monthly calendar that sticks directly to your locker. Plan your week, mark test dates, and stay organized between classes.',
      features:     ['Dry-erase surface', 'Strong magnetic backing', 'Monthly grid layout', 'Fits standard school lockers', 'Includes 1 dry-erase marker'],
      problemSolved: 'Stop relying on your phone in class. This calendar keeps your schedule visible all day long.',
      price:        12.99,
      salePrice:    null,
      image:        'images/placeholder.svg',
      category:     'cat_locker',
      tags:         ['new', 'under15'],
      rating:       4.5,
      reviewCount:  67,
      inStock:      true,
      createdAt:    1715500000000
    },
    {
      id:           'prod_003',
      name:         'Weekly Study Planner Pad',
      description:  'A tear-off weekly planner pad with sections for each class, a homework tracker, and a daily priorities list. 50 sheets per pad.',
      features:     ['50 tear-off sheets', 'Sections for 6 classes', 'Daily priority list', 'Homework tracker column', 'Undated — start any week'],
      problemSolved: 'Remembering every assignment is exhausting. Write it down once, glance at it all week.',
      price:        8.99,
      salePrice:    6.99,
      image:        'images/placeholder.svg',
      category:     'cat_cal',
      tags:         ['under15', 'studentpick'],
      rating:       4.7,
      reviewCount:  203,
      inStock:      true,
      createdAt:    1714000000000
    },
    {
      id:           'prod_004',
      name:         'Cable Management Kit',
      description:  'Keep charging cables and headphones untangled with this compact clip-and-wrap system. Includes 8 cable clips and 3 velcro ties.',
      features:     ['8 adhesive cable clips', '3 velcro cable ties', 'Works on desks and walls', 'Reusable and repositionable', 'Fits all cable sizes'],
      problemSolved: 'Tangled cables waste time and look messy. This kit takes under 5 minutes to install.',
      price:        14.99,
      salePrice:    null,
      image:        'images/placeholder.svg',
      category:     'cat_desk',
      tags:         ['new'],
      rating:       4.4,
      reviewCount:  89,
      inStock:      true,
      createdAt:    1715600000000
    },
    {
      id:           'prod_005',
      name:         'Mini Clear Desk Drawers',
      description:  'Stack two small clear plastic drawers on your desk for extra storage. Perfect for pens, sticky notes, erasers, and small supplies.',
      features:     ['2-drawer stackable unit', 'Clear front panels', 'Smooth gliding drawers', 'Compact footprint (6" wide)', 'BPA-free plastic'],
      problemSolved: 'Desk supplies go missing when they have no home. These drawers keep small items visible and within reach.',
      price:        18.99,
      salePrice:    15.99,
      image:        'images/placeholder.svg',
      category:     'cat_desk',
      tags:         ['bestseller'],
      rating:       4.6,
      reviewCount:  118,
      inStock:      true,
      createdAt:    1713000000000
    },
    {
      id:           'prod_006',
      name:         'Under-Desk Storage Drawer',
      description:  'An adhesive sliding drawer that mounts under your desk — no screws needed. Holds a phone, earbuds, and small essentials out of sight.',
      features:     ['No-drill adhesive mount', 'Sliding drawer mechanism', 'Holds up to 3 lbs', 'Matte finish', 'Removable without damage'],
      problemSolved: 'Your desk surface is prime real estate. Store everyday items underneath instead.',
      price:        22.99,
      salePrice:    null,
      image:        'images/placeholder.svg',
      category:     'cat_desk',
      tags:         ['bestseller'],
      rating:       4.5,
      reviewCount:  95,
      inStock:      true,
      createdAt:    1712000000000
    },
    {
      id:           'prod_007',
      name:         'Dorm Bedside Caddy',
      description:  'A hanging caddy that attaches to your dorm bed frame or loft. Holds your phone, glasses, water bottle, remote, and more.',
      features:     ['5 pockets + 1 cup holder', 'Fits bed frames and lofts', 'Machine washable fabric', 'Phone slot with cable hole', 'No-slip grip strips'],
      problemSolved: 'Dorm beds have no nightstand. This caddy creates one instantly — no furniture needed.',
      price:        16.99,
      salePrice:    null,
      image:        'images/placeholder.svg',
      category:     'cat_dorm',
      tags:         ['new', 'studentpick'],
      rating:       4.7,
      reviewCount:  156,
      inStock:      true,
      createdAt:    1715400000000
    },
    {
      id:           'prod_008',
      name:         'Dry-Erase Monthly Calendar',
      description:  'A reusable wall calendar with a dry-erase surface. Write your entire month, erase, and start fresh — works all year.',
      features:     ['Dry-erase laminated surface', 'Monthly grid format', 'Includes 2 markers and eraser', 'Wall mount included', '15" x 12" size'],
      problemSolved: 'Paper calendars run out. This one works forever — great for tracking test dates all semester.',
      price:        11.99,
      salePrice:    9.99,
      image:        'images/placeholder.svg',
      category:     'cat_cal',
      tags:         ['bestseller', 'under15'],
      rating:       4.6,
      reviewCount:  178,
      inStock:      true,
      createdAt:    1711000000000
    },
    {
      id:           'prod_009',
      name:         'Pencil & Sticky Note Organizer',
      description:  'A compact desk organizer with two pen holders and sticky note slots. Keeps your most-used tools at arm\'s reach at all times.',
      features:     ['2 cylindrical pen cups', '3 sticky note slots', 'Non-slip rubber base', 'Compact (fits any corner)', 'Easy to clean'],
      problemSolved: 'Reaching across the desk for a pen wastes tiny moments that add up. Keep everything right here.',
      price:        9.99,
      salePrice:    null,
      image:        'images/placeholder.svg',
      category:     'cat_desk',
      tags:         ['under15', 'studentpick'],
      rating:       4.3,
      reviewCount:  74,
      inStock:      true,
      createdAt:    1710000000000
    },
    {
      id:           'prod_010',
      name:         'Student Command Center Bundle',
      description:  'The complete student setup: desk reset kit + weekly planner pad + pencil organizer + magnetic locker strip. Everything in one bundle, priced to save.',
      features:     ['4-product bundle', 'Desk organizer set included', 'Weekly planner pad included', 'Locker magnetic strip included', 'Saves vs. buying separately'],
      problemSolved: 'Stop buying things one at a time. This bundle covers your desk, planner, and locker in one order.',
      price:        34.99,
      salePrice:    28.99,
      image:        'images/placeholder.svg',
      category:     'cat_kits',
      tags:         ['bestseller', 'studentpick'],
      rating:       4.9,
      reviewCount:  231,
      inStock:      true,
      createdAt:    1714500000000
    }
  ],

  // ── Homepage sections ────────────────────────────────────────
  // type: 'manual' | 'auto-tag' | 'auto-category'
  sections: [
    {
      id: 'sec_loved', title: 'Loved by Students',
      visible: true, order: 0,
      type: 'auto-tag', productIds: [], autoTag: 'studentpick', autoCategory: null, maxItems: 6
    },
    {
      id: 'sec_trending', title: 'New & Trending',
      visible: true, order: 1,
      type: 'auto-tag', productIds: [], autoTag: 'new', autoCategory: null, maxItems: 6
    },
    {
      id: 'sec_desk', title: 'Desk Reset Essentials',
      visible: true, order: 2,
      type: 'auto-category', productIds: [], autoTag: null, autoCategory: 'cat_desk', maxItems: 6
    },
    {
      id: 'sec_cal', title: 'Calendar & Planning Tools',
      visible: true, order: 3,
      type: 'auto-category', productIds: [], autoTag: null, autoCategory: 'cat_cal', maxItems: 6
    },
    {
      id: 'sec_under20', title: 'Under $20 Finds',
      visible: true, order: 4,
      type: 'manual', productIds: ['prod_002','prod_003','prod_008','prod_009'], autoTag: null, autoCategory: null, maxItems: 6
    },
    {
      id: 'sec_best', title: 'Best Sellers',
      visible: true, order: 5,
      type: 'auto-tag', productIds: [], autoTag: 'bestseller', autoCategory: null, maxItems: 6
    }
  ]
};
