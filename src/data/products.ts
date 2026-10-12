import type { Product } from '../lib/types'

export const products: Product[] = [
  {
    id: 'phone01',
    name: 'Nova Air 12',
    brand: 'Nova',
    category: 'smartphones',
    price: 429,
    rating: 4.6,
    reviewCount: 2140,
    image: 'indigo',
    description:
      'A lightweight flagship killer with an all day battery and a bright 6.5 inch display tuned for everyday use.',
    features: ['6.5 inch OLED display', '5000 mAh battery', 'Triple camera system', '128 GB storage'],
    tags: ['budget', 'battery', 'everyday', 'compact'],
    featured: true
  },
  {
    id: 'phone02',
    name: 'Pulse Edge Pro',
    brand: 'Pulse',
    category: 'smartphones',
    price: 899,
    rating: 4.8,
    reviewCount: 1788,
    image: 'violet',
    description:
      'A premium phone with a pro grade camera, high refresh display and fast silicon for demanding users.',
    features: ['6.7 inch 120 Hz display', 'Pro triple camera', 'Flagship chipset', '256 GB storage'],
    tags: ['premium', 'camera', 'performance', 'gaming'],
    featured: true
  },
  {
    id: 'phone03',
    name: 'Cobalt Lite 5',
    brand: 'Cobalt',
    category: 'smartphones',
    price: 299,
    rating: 4.3,
    reviewCount: 3421,
    image: 'sky',
    description:
      'An affordable phone that keeps the essentials sharp with a clean interface and dependable battery life.',
    features: ['6.3 inch display', '4500 mAh battery', 'Dual camera', '64 GB storage'],
    tags: ['budget', 'value', 'everyday'],
    featured: false
  },
  {
    id: 'phone04',
    name: 'Nova Fold X',
    brand: 'Nova',
    category: 'smartphones',
    price: 1299,
    rating: 4.5,
    reviewCount: 642,
    image: 'teal',
    description:
      'A foldable phone that opens into a tablet sized canvas for multitasking and media on the move.',
    features: ['Foldable 7.6 inch display', 'Multi window apps', 'Flagship chipset', '512 GB storage'],
    tags: ['premium', 'foldable', 'multitasking', 'productivity'],
    featured: false
  },
  {
    id: 'laptop01',
    name: 'Vertex Book 14',
    brand: 'Vertex',
    category: 'laptops',
    price: 949,
    rating: 4.7,
    reviewCount: 1203,
    image: 'indigo',
    description:
      'A thin and light notebook built for coding and writing with a crisp display and long runtime.',
    features: ['14 inch 2K display', '16 GB memory', '512 GB solid state drive', '18 hour battery'],
    tags: ['coding', 'portable', 'developer', 'productivity', 'student'],
    featured: true
  },
  {
    id: 'laptop02',
    name: 'Aeon Studio 16',
    brand: 'Aeon',
    category: 'laptops',
    price: 1799,
    rating: 4.8,
    reviewCount: 884,
    image: 'violet',
    description:
      'A creator workstation with a color accurate panel and discrete graphics for editing and rendering.',
    features: ['16 inch color accurate display', '32 GB memory', 'Dedicated graphics', '1 TB solid state drive'],
    tags: ['creator', 'video', 'design', 'performance', 'rendering'],
    featured: true
  },
  {
    id: 'laptop03',
    name: 'Flux Air 13',
    brand: 'Flux',
    category: 'laptops',
    price: 699,
    rating: 4.4,
    reviewCount: 2051,
    image: 'sky',
    description:
      'A compact everyday laptop for browsing, study and light work that slips easily into any bag.',
    features: ['13 inch display', '8 GB memory', '256 GB solid state drive', 'Fanless design'],
    tags: ['budget', 'student', 'portable', 'everyday', 'coding'],
    featured: false
  },
  {
    id: 'laptop04',
    name: 'Vertex Game Blade',
    brand: 'Vertex',
    category: 'laptops',
    price: 1499,
    rating: 4.6,
    reviewCount: 1320,
    image: 'rose',
    description:
      'A high refresh gaming laptop with strong cooling and powerful graphics for fast paced titles.',
    features: ['15 inch 165 Hz display', '16 GB memory', 'High end graphics', 'Advanced cooling'],
    tags: ['gaming', 'performance', 'graphics', 'desktop replacement'],
    featured: false
  },
  {
    id: 'audio01',
    name: 'Halo Quiet 700',
    brand: 'Halo',
    category: 'headphones',
    price: 329,
    rating: 4.8,
    reviewCount: 4102,
    image: 'indigo',
    description:
      'Over ear headphones with deep active noise cancelling and plush comfort for long travel days.',
    features: ['Active noise cancelling', '30 hour battery', 'Multipoint connection', 'Travel case included'],
    tags: ['travel', 'noise cancelling', 'comfort', 'premium', 'flight'],
    featured: true
  },
  {
    id: 'audio02',
    name: 'Pulse Buds Air',
    brand: 'Pulse',
    category: 'headphones',
    price: 149,
    rating: 4.5,
    reviewCount: 5230,
    image: 'teal',
    description:
      'Compact wireless earbuds with secure fit and clear calls for workouts and daily commutes.',
    features: ['Wireless earbuds', 'Noise reduction', 'Sweat resistant', '24 hour case battery'],
    tags: ['workout', 'commute', 'compact', 'budget', 'calls'],
    featured: false
  },
  {
    id: 'audio03',
    name: 'Lumen Over Ear Studio',
    brand: 'Lumen',
    category: 'headphones',
    price: 219,
    rating: 4.6,
    reviewCount: 1890,
    image: 'violet',
    description:
      'Studio tuned headphones with balanced sound and a detachable cable for home listening sessions.',
    features: ['Balanced studio sound', 'Detachable cable', 'Memory foam cushions', 'Wired and wireless'],
    tags: ['studio', 'music', 'comfort', 'home'],
    featured: false
  },
  {
    id: 'audio04',
    name: 'Zephyr Sport Open',
    brand: 'Zephyr',
    category: 'headphones',
    price: 129,
    rating: 4.2,
    reviewCount: 2760,
    image: 'amber',
    description:
      'Open design sport headphones that stay aware of surroundings while running outdoors.',
    features: ['Open ear design', 'Secure hook fit', 'Water resistant', '8 hour battery'],
    tags: ['running', 'fitness', 'outdoor', 'sport', 'awareness'],
    featured: false
  },
  {
    id: 'watch01',
    name: 'Orbit Fit 2',
    brand: 'Orbit',
    category: 'smartwatches',
    price: 199,
    rating: 4.5,
    reviewCount: 3310,
    image: 'teal',
    description:
      'A fitness focused smartwatch with accurate tracking, sleep insights and a weeklong battery.',
    features: ['Heart rate tracking', 'Built in GPS', 'Sleep insights', '7 day battery'],
    tags: ['fitness', 'running', 'health', 'tracking', 'budget'],
    featured: true
  },
  {
    id: 'watch02',
    name: 'Pulse Watch Pro',
    brand: 'Pulse',
    category: 'smartwatches',
    price: 379,
    rating: 4.7,
    reviewCount: 1452,
    image: 'indigo',
    description:
      'A premium smartwatch with a bright always on display and deep training metrics for athletes.',
    features: ['Always on display', 'Advanced training metrics', 'Dual band GPS', 'Water resistant'],
    tags: ['fitness', 'premium', 'athlete', 'training', 'health'],
    featured: false
  },
  {
    id: 'watch03',
    name: 'Lumen Style Watch',
    brand: 'Lumen',
    category: 'smartwatches',
    price: 159,
    rating: 4.1,
    reviewCount: 980,
    image: 'rose',
    description:
      'A fashion first smartwatch that pairs everyday notifications with interchangeable bands.',
    features: ['Notifications', 'Interchangeable bands', 'Step tracking', '5 day battery'],
    tags: ['style', 'everyday', 'fashion', 'budget'],
    featured: false
  },
  {
    id: 'tablet01',
    name: 'Aeon Tab 11',
    brand: 'Aeon',
    category: 'tablets',
    price: 499,
    rating: 4.6,
    reviewCount: 1670,
    image: 'sky',
    description:
      'A versatile tablet with a smooth display and optional keyboard for note taking and streaming.',
    features: ['11 inch 120 Hz display', 'Stylus support', 'Keyboard ready', '10 hour battery'],
    tags: ['note taking', 'streaming', 'student', 'productivity'],
    featured: true
  },
  {
    id: 'tablet02',
    name: 'Nova Slate Mini',
    brand: 'Nova',
    category: 'tablets',
    price: 329,
    rating: 4.3,
    reviewCount: 1240,
    image: 'violet',
    description:
      'A compact tablet sized for reading and travel that fits comfortably in one hand.',
    features: ['8 inch display', 'Light and compact', 'Expandable storage', 'All day battery'],
    tags: ['reading', 'travel', 'compact', 'budget'],
    featured: false
  },
  {
    id: 'tablet03',
    name: 'Vertex Canvas Pro',
    brand: 'Vertex',
    category: 'tablets',
    price: 899,
    rating: 4.7,
    reviewCount: 760,
    image: 'indigo',
    description:
      'A pro tablet for artists and designers with a laminated display and low latency stylus.',
    features: ['12 inch laminated display', 'Low latency stylus', 'Pro color range', 'Fast charging'],
    tags: ['art', 'design', 'creator', 'premium', 'drawing'],
    featured: false
  },
  {
    id: 'acc01',
    name: 'Flux Power Bank 20k',
    brand: 'Flux',
    category: 'accessories',
    price: 59,
    rating: 4.5,
    reviewCount: 4810,
    image: 'amber',
    description:
      'A high capacity power bank that recharges phones and tablets several times on a single charge.',
    features: ['20000 mAh capacity', 'Fast charging output', 'Dual ports', 'Compact body'],
    tags: ['travel', 'charging', 'budget', 'everyday'],
    featured: false
  },
  {
    id: 'acc02',
    name: 'Cobalt Wireless Charger',
    brand: 'Cobalt',
    category: 'accessories',
    price: 39,
    rating: 4.3,
    reviewCount: 2210,
    image: 'teal',
    description:
      'A tidy wireless charging pad that tops up compatible phones and earbuds on any desk.',
    features: ['Wireless charging', 'Case friendly', 'Status light', 'Non slip base'],
    tags: ['desk', 'charging', 'budget', 'home'],
    featured: false
  },
  {
    id: 'acc03',
    name: 'Zephyr Travel Hub',
    brand: 'Zephyr',
    category: 'accessories',
    price: 79,
    rating: 4.6,
    reviewCount: 1530,
    image: 'slate',
    description:
      'A compact hub that adds display output, data ports and card reading to thin laptops.',
    features: ['Display output', 'Multiple data ports', 'Card reader', 'Pass through power'],
    tags: ['laptop', 'travel', 'productivity', 'developer'],
    featured: false
  },
  {
    id: 'acc04',
    name: 'Lumen Desk Stand',
    brand: 'Lumen',
    category: 'accessories',
    price: 49,
    rating: 4.4,
    reviewCount: 990,
    image: 'rose',
    description:
      'An adjustable aluminum stand that lifts laptops to eye level for a healthier posture.',
    features: ['Adjustable height', 'Aluminum body', 'Cable channel', 'Foldable design'],
    tags: ['desk', 'ergonomic', 'home', 'office'],
    featured: false
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
