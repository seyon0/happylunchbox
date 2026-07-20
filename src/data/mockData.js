export const CATEGORIES = [
  { id: 'starter', name: 'Starters', description: 'Warm soups & crunchy kebabs', maxAllowed: 5 },
  { id: 'main', name: 'Mains', description: 'Rich curries & slow-cooked dal', maxAllowed: 5 },
  { id: 'side', name: 'Sides', description: 'Phulkas, basmati rice & fresh raita', maxAllowed: 5 },
  { id: 'drink', name: 'Drinks', description: 'Chilled chaas, mango lassi & sherbets', maxAllowed: 5 },
];

// ─── SHOPS ─────────────────────────────────────────────────────────────────
export const MOCK_SHOPS = [
  {
    id: 'shop-1',
    name: 'Jaffna Roots',
    tagline: 'Authentic Sri Lankan & South Indian homestyle food',
    logoUrl: '/source/683754474_17858463000690543_8878656858934875981_n.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&auto=format&fit=crop&q=80',
    cuisineType: 'Sri Lankan / South Indian',
    rating: 4.8,
    reviewCount: 214,
    deliveryTime: '11am – 1pm',
    deliveryArea: 'Gatwick & South West London',
    minOrder: 8.00,
    isActive: true,
    description: 'Jaffna Roots is one of the finest food delivery services in Gatwick and suburbs. We are committed to deliver good food in neat, insulated, re-usable, metal Indian dabbas. Every meal is freshly prepared that morning using authentic ground spices and seasonal vegetables — no shortcuts, no preservatives.',
  },
  {
    id: 'shop-2',
    name: 'Spice Garden',
    tagline: 'North Indian homestyle cooking at its finest',
    logoUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200&auto=format&fit=crop&q=80',
    cuisineType: 'North Indian',
    rating: 4.6,
    reviewCount: 128,
    deliveryTime: '12pm – 2pm',
    deliveryArea: 'Croydon, Sutton & Kingston',
    minOrder: 10.00,
    isActive: true,
    description: 'Spice Garden brings the richness of North Indian cuisine to your doorstep. From slow-cooked dals to fragrant biryanis, every dish is crafted with love using traditional family recipes passed down through generations.',
  },
  {
    id: 'shop-3',
    name: 'Kerala Kitchen',
    tagline: 'Coastal flavours of God\'s Own Country',
    logoUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=1200&auto=format&fit=crop&q=80',
    cuisineType: 'Keralan / South Indian',
    rating: 4.7,
    reviewCount: 89,
    deliveryTime: '11:30am – 1:30pm',
    deliveryArea: 'Wimbledon, Raynes Park & Morden',
    minOrder: 9.00,
    isActive: true,
    description: 'Kerala Kitchen celebrates the vibrant coastal cuisine of Kerala. Coconut milk curries, appam, fish molee, and puttu — all crafted fresh daily with ingredients sourced from trusted South Asian suppliers across London.',
  },
];

// ─── MENU ITEMS ────────────────────────────────────────────────────────────
export const MOCK_MENU_ITEMS = [
  // ── SHOP-1: JAFFNA ROOTS ─────────────────────────
  // Starters
  {
    id: 's1', shopId: 'shop-1',
    name: 'Moong Dal Soup',
    description: 'Lightly spiced yellow lentil broth tempered with cumin & curry leaves.',
    price: 3.99, basePrice: 3.20, calories: 120, dietType: 'veg', category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 's2', shopId: 'shop-1',
    name: 'Hara Bhara Kebab',
    description: 'Crispy pan-seared patties of spinach, peas, and paneer with mint chutney.',
    price: 4.99, basePrice: 4.00, calories: 180, dietType: 'veg', category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  {
    id: 's3', shopId: 'shop-1',
    name: 'Multigrain Roti & Pickle',
    description: 'Freshly rolled rotis on jowar-wheat blend with homemade mango pickle.',
    price: 2.99, basePrice: 2.40, calories: 160, dietType: 'veg', category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1565558175992-eaeebfad7cd5?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 's4', shopId: 'shop-1',
    name: 'Paya Broth Soup',
    description: 'Slow-cooked lamb trotter broth with aromatic whole spices & coriander.',
    price: 5.49, basePrice: 4.40, calories: 200, dietType: 'non-veg', category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  {
    id: 's5', shopId: 'shop-1',
    name: 'Sabudana Khichdi',
    description: 'Light tapioca pearls with roasted peanuts, curry leaves & green chilli.',
    price: 4.25, basePrice: 3.40, calories: 190, dietType: 'jain', category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  // Mains
  {
    id: 'm1', shopId: 'shop-1',
    name: 'Maa Ki Dal',
    description: 'Whole black lentils slow-cooked overnight with creamy butter & ginger.',
    price: 7.99, basePrice: 6.40, calories: 320, dietType: 'veg', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  {
    id: 'm2', shopId: 'shop-1',
    name: 'Chicken Handi Curry',
    description: 'Tender chicken pieces in thick onion-tomato gravy finished with kasuri methi.',
    price: 9.99, basePrice: 8.00, calories: 420, dietType: 'non-veg', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Spicy', available: true,
  },
  {
    id: 'm3', shopId: 'shop-1',
    name: 'Palak Paneer',
    description: 'Fresh cottage cheese cubes in a velvety spinach gravy infused with garlic.',
    price: 8.49, basePrice: 6.80, calories: 350, dietType: 'veg', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  {
    id: 'm4', shopId: 'shop-1',
    name: 'Mutton Keema Matar',
    description: 'Minced lamb with tender sweet peas cooked in robust ground spices.',
    price: 10.99, basePrice: 8.80, calories: 450, dietType: 'non-veg', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Spicy', available: true,
  },
  {
    id: 'm5', shopId: 'shop-1',
    name: 'Arbi Masala',
    description: 'Colocasia roots tossed in tangy amchur and ajwain roasted masala.',
    price: 7.49, basePrice: 6.00, calories: 280, dietType: 'jain', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  // Sides
  {
    id: 'si1', shopId: 'shop-1',
    name: 'Steamed Basmati Rice',
    description: 'Aromatic long-grain basmati cooked with a pinch of sea salt & bay leaf.',
    price: 3.25, basePrice: 2.60, calories: 240, dietType: 'veg', category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'si2', shopId: 'shop-1',
    name: 'Jeera Aloo Potatoes',
    description: 'Baby potatoes roasted with cumin, coriander seeds and turmeric.',
    price: 3.99, basePrice: 3.20, calories: 190, dietType: 'veg', category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1630409346824-4f0e7b080087?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  {
    id: 'si3', shopId: 'shop-1',
    name: 'Boondi Raita',
    description: 'Chilled spiced yoghurt with crispy gram pearls & roasted jeera.',
    price: 2.99, basePrice: 2.40, calories: 140, dietType: 'veg', category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'si4', shopId: 'shop-1',
    name: 'Egg Bhurji Scramble',
    description: 'Spiced scrambled eggs with caramelized onions, tomatoes & green chillies.',
    price: 4.49, basePrice: 3.60, calories: 220, dietType: 'non-veg', category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1291311a?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  {
    id: 'si5', shopId: 'shop-1',
    name: 'Phulka Roti Basket (3)',
    description: 'Three flame-puffed whole wheat phulkas lightly brushed with organic ghee.',
    price: 2.75, basePrice: 2.20, calories: 180, dietType: 'veg', category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  // Drinks
  {
    id: 'd1', shopId: 'shop-1',
    name: 'Masala Chaas',
    description: 'Traditional churned buttermilk with roasted cumin, mint & black salt.',
    price: 2.49, basePrice: 2.00, calories: 60, dietType: 'veg', category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'd2', shopId: 'shop-1',
    name: 'Mango Lassi',
    description: 'Thick creamy yoghurt blended with Alphonso mango nectar.',
    price: 3.25, basePrice: 2.60, calories: 150, dietType: 'veg', category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'd3', shopId: 'shop-1',
    name: 'Rose & Basil Sharbat',
    description: 'Fragrant cooling rose extract drink infused with basil seeds.',
    price: 2.25, basePrice: 1.80, calories: 70, dietType: 'veg', category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'd4', shopId: 'shop-1',
    name: 'South Indian Filter Coffee',
    description: 'Authentic chicory drip coffee with thick hot milk.',
    price: 2.75, basePrice: 2.20, calories: 90, dietType: 'veg', category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'd5', shopId: 'shop-1',
    name: 'Fresh Nimbu Pani',
    description: 'Fresh lemon juice, mint, black salt and chilled sparkling water.',
    price: 1.99, basePrice: 1.60, calories: 40, dietType: 'jain', category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },

  // ── SHOP-2: SPICE GARDEN ──────────────────────────
  {
    id: 'sg-s1', shopId: 'shop-2',
    name: 'Samosa Chaat',
    description: 'Crispy golden samosas topped with tangy chutneys, yoghurt & sev.',
    price: 4.50, basePrice: 3.60, calories: 210, dietType: 'veg', category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  {
    id: 'sg-m1', shopId: 'shop-2',
    name: 'Dal Makhani',
    description: 'Slow simmered black lentils in rich tomato-butter-cream sauce.',
    price: 8.50, basePrice: 6.80, calories: 340, dietType: 'veg', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'sg-m2', shopId: 'shop-2',
    name: 'Butter Chicken',
    description: 'Succulent chicken in a velvety tomato-fenugreek butter sauce.',
    price: 10.50, basePrice: 8.40, calories: 440, dietType: 'non-veg', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Medium', available: true,
  },
  {
    id: 'sg-si1', shopId: 'shop-2',
    name: 'Garlic Naan',
    description: 'Fluffy tandoor-baked naan brushed with garlic butter & coriander.',
    price: 3.00, basePrice: 2.40, calories: 220, dietType: 'veg', category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1565558175992-eaeebfad7cd5?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'sg-d1', shopId: 'shop-2',
    name: 'Sweet Lassi',
    description: 'Chilled thick yoghurt drink sweetened with cardamom & rose water.',
    price: 2.99, basePrice: 2.40, calories: 130, dietType: 'veg', category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },

  // ── SHOP-3: KERALA KITCHEN ───────────────────────
  {
    id: 'kk-s1', shopId: 'shop-3',
    name: 'Prawn Pepper Fry',
    description: 'Juicy tiger prawns tossed in freshly cracked black pepper & curry leaves.',
    price: 7.50, basePrice: 6.00, calories: 200, dietType: 'non-veg', category: 'starter',
    imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Spicy', available: true,
  },
  {
    id: 'kk-m1', shopId: 'shop-3',
    name: 'Fish Molee Curry',
    description: 'Delicate white fish fillets simmered in a golden coconut milk & turmeric broth.',
    price: 11.50, basePrice: 9.20, calories: 380, dietType: 'non-veg', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'kk-m2', shopId: 'shop-3',
    name: 'Avial',
    description: 'Classic Kerala mixed vegetable stew cooked in coconut-yoghurt sauce.',
    price: 8.00, basePrice: 6.40, calories: 290, dietType: 'veg', category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'kk-si1', shopId: 'shop-3',
    name: 'Appam & Coconut Chutney',
    description: 'Lacy fermented rice crepes served with fresh coconut chutney.',
    price: 3.50, basePrice: 2.80, calories: 200, dietType: 'veg', category: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
  {
    id: 'kk-d1', shopId: 'shop-3',
    name: 'Tender Coconut Water',
    description: 'Fresh chilled coconut water — nature\'s own electrolyte drink.',
    price: 3.00, basePrice: 2.40, calories: 45, dietType: 'veg', category: 'drink',
    imageUrl: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=500&auto=format&fit=crop&q=80',
    spiceLevel: 'Mild', available: true,
  },
];

export const CURATED_COMBOS = [
  {
    id: 'combo-1',
    name: "The London Classic",
    description: 'Our signature homestyle combo cooked daily.',
    badge: 'Most Popular',
    items: ['s1', 'm1', 'si1', 'd1'],
    discountPrice: 14.99,
    shopId: 'shop-1',
  },
  {
    id: 'combo-2',
    name: 'The Royal Meat Feast',
    description: 'Rich, spicy chicken handi & hearty paya soup for high protein.',
    badge: 'Chef Special',
    items: ['s4', 'm2', 'si1', 'd4'],
    discountPrice: 18.99,
    shopId: 'shop-1',
  },
  {
    id: 'combo-3',
    name: 'The Fresh Green Box',
    description: 'Spinach paneer curry with crispy kebabs & cool raita.',
    badge: 'Healthy Choice',
    items: ['s2', 'm3', 'si3', 'd3'],
    discountPrice: 16.50,
    shopId: 'shop-1',
  },
  {
    id: 'combo-4',
    name: 'Pure Jain Box',
    description: 'Zero onion, zero garlic, 100% authentic homestyle taste.',
    badge: 'Jain Special',
    items: ['s5', 'm5', 'si2', 'd5'],
    discountPrice: 13.99,
    shopId: 'shop-1',
  },
];

export const SERVICEABLE_PINCODES = [
  'NW1 6XE', 'EC2N 4AG', 'W1D 3BF', 'SW1A 1AA', 'SE1 9SG', 'E1 6AN', 'WC2H 9JQ', 'M1 1AG', 'B1 1AA'
];

export const MOCK_USER = {
  id: 'usr-uk-1',
  name: 'Valued Customer',
  phone: '+44 7700 900077',
  email: 'customer@healthylunchbox.co.uk',
  pincode: 'NW1 6XE',
  preferences: {
    diet: 'veg',
    allergies: '',
  },
  paymentMethods: [
    { id: 'pm-1', type: 'card', brand: 'Visa', last4: '4242', isDefault: true }
  ],
  addresses: [
    {
      id: 'addr-uk-1',
      label: 'Home',
      flat: 'Apartment 12, Regency House',
      street: '24 Baker Street, Marylebone',
      city: 'London',
      pincode: 'NW1 6XE',
      isDefault: true,
      instructions: 'Ring flat 12 or leave with concierge.',
    },
    {
      id: 'addr-uk-2',
      label: 'Office',
      flat: 'Floor 4, Tech Hub',
      street: '100 Bishopsgate',
      city: 'London',
      pincode: 'EC2N 4AG',
      isDefault: false,
      instructions: 'Deliver to main reception desk.',
    }
  ]
};

export const MOCK_BOOKINGS = [
  {
    id: 'UK-LB-7710',
    shopId: 'shop-1',
    deliveryDate: '2026-07-02',
    deliverySlot: 'Lunch Slot (12:30 PM - 1:30 PM)',
    status: 'Confirmed',
    statusStep: 1,
    spiceLevel: 'Medium',
    totalPrice: 16.50,
    items: ['s1', 'm1', 'si1', 'd1'],
    address: '24 Baker Street, Marylebone, London NW1 6XE',
  },
  {
    id: 'UK-LB-7690',
    shopId: 'shop-1',
    deliveryDate: '2026-06-26',
    deliverySlot: 'Lunch Slot (12:30 PM - 1:30 PM)',
    status: 'Delivered',
    statusStep: 4,
    spiceLevel: 'Spicy',
    totalPrice: 18.99,
    items: ['s2', 'm2', 'si3', 'd3'],
    address: '24 Baker Street, Marylebone, London NW1 6XE',
  }
];

export const MOCK_SUBSCRIPTIONS = [
  {
    id: 'SUB-UK-991',
    planType: 'Weekly',
    status: 'Active',
    nextDelivery: '2026-07-03',
    comboId: 'combo-1',
    pricePerDay: 14.99,
  }
];

export const MOCK_TRANSACTIONS = [
  { id: 'txn_raz_8821', date: '2026-07-01', amount: 16.50, status: 'Success', method: 'UPI' },
  { id: 'txn_raz_8820', date: '2026-06-26', amount: 18.99, status: 'Success', method: 'Card' }
];

export const MOCK_CAMPAIGNS = [
  { id: 'camp-1', name: 'Summer Discount 20%', type: 'Push', sent: 450, conversions: 32 }
];
