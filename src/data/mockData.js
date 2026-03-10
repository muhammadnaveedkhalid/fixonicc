export const DUMMY_USERS = [
  { id: 1, email: 'admin@repair.com', password: 'admin123', role: 'admin', name: 'Super Admin' },
  { id: 2, email: 'user@gmail.com', password: 'user123', role: 'client', name: 'John Client' },
  { id: 3, email: 'fixer@tech.com', password: 'fixer123', role: 'vendor', name: 'Quick Fixers Inc.' }
];

export const DUMMY_REPAIRS = [
  { 
    id: 'REP-001', 
    customer: 'John Client', 
    device: 'Laptop', 
    brand: 'Dell', 
    model: 'XPS 15', 
    issue: 'Screen Flickering', 
    address: 'House 42, Street 5, Blue Area, Islamabad',
    status: 'On the Way', 
    date: '2024-03-20',
    vendor: 'Quick Fixers Inc.',
    history: ['Pending', 'Accepted', 'On the Way']
  },
  { 
    id: 'REP-002', 
    customer: 'Sarah Smith', 
    device: 'Mobile', 
    brand: 'Apple', 
    model: 'iPhone 13', 
    issue: 'Battery Replacement', 
    address: 'Apartment 12B, Ocean Tower, Karachi',
    status: 'Completed', 
    date: '2024-03-18',
    vendor: 'Elite Repairs',
    history: ['Pending', 'Accepted', 'On the Way', 'Ready', 'Completed']
  },
  { 
    id: 'REP-003', 
    customer: 'Mike Ross', 
    device: 'Mobile', 
    brand: 'Samsung', 
    model: 'Galaxy S22', 
    issue: 'Charging Port issue', 
    address: 'Office 301, Tech Park, Lahore',
    status: 'Pending', 
    date: '2024-03-24',
    vendor: null,
    history: ['Pending']
  },
  { 
    id: 'REP-004', 
    customer: 'John Client', 
    device: 'Laptop', 
    brand: 'Lenovo', 
    model: 'ThinkPad T14', 
    issue: 'Keyboard not working', 
    address: 'House 42, Street 5, Blue Area, Islamabad',
    status: 'Accepted', 
    date: '2024-03-22',
    vendor: 'Quick Fixers Inc.',
    history: ['Pending', 'Accepted']
  },
  { 
    id: 'REP-005', 
    customer: 'Emma Wilson', 
    device: 'Mobile', 
    brand: 'Oppo', 
    model: 'Reno 7', 
    issue: 'Front Camera Blur', 
    address: 'Village Sector D, Block 4, Rawalpindi',
    status: 'Rejected', 
    date: '2024-03-21',
    vendor: 'Flash Fix',
    history: ['Pending', 'Rejected']
  }
];

export const INITIAL_BLOGS = [
  { 
    id: 1, 
    title: 'How to save your phone from water damage', 
    category: 'Mobile', 
    date: 'March 15, 2024', 
    content: 'Accidents happen. If your phone takes a dive, the first thing to do is turn it off immediately. Do not try to charge it...',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' 
  },
  { 
    id: 2, 
    title: '5 signs your laptop battery is dying', 
    category: 'Laptop', 
    date: 'March 10, 2024', 
    content: 'Is your laptop suddenly shutting down at 20%? Or does the fan run constantly? These are clear signs your battery might need replacement...',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80' 
  },
  { 
    id: 3, 
    title: 'Why your computer is running slow', 
    category: 'Desktop', 
    date: 'March 5, 2024', 
    content: 'A slow computer can be frustrating. Before you rush to buy a new one, try these simple tips to speed up your system...',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80' 
  },
];

export const INITIAL_REVIEWS = [
  { id: 1, name: 'Sarah J.', text: 'Best service! My iPhone screen was replaced in 30 minutes right at my home.', stars: 5, date: '2024-03-20' },
  { id: 2, name: 'David M.', text: 'Professional and transparent pricing. My Dell laptop is working perfectly now.', stars: 5, date: '2024-03-18' },
  { id: 3, name: 'Emma W.', text: 'Quick response and very polite technicians. Highly recommended.', stars: 4, date: '2024-03-15' },
];

export const SERVICE_CATEGORIES = [
    {
      title: 'Mobile Repair',
      iconKey: 'smartphone',
      color: 'bg-lime-50 text-lime-600',
      features: ['Screen Replacement', 'Battery Swapping', 'Charging Port Fix', 'Camera Repair'],
      price: 'Starting from ₨ 2,500'
    },
    {
      title: 'Laptop Repair',
      iconKey: 'laptop',
      color: 'bg-navy-50 text-navy-600',
      features: ['Keyboard Replacement', 'RAM/SSD Upgrade', 'Liquid Damage Fix', 'OS Installation'],
      price: 'Starting from ₨ 5,000'
    },
    {
      title: 'Tablet Repair',
      iconKey: 'tablet',
      color: 'bg-purple-100 text-purple-600',
      features: ['Glass Replacement', 'Motherboard Repair', 'Software Decrypt', 'Button Fix'],
      price: 'Starting from ₨ 3,500'
    },
    {
      title: 'Smartwatch',
      iconKey: 'watch',
      color: 'bg-amber-100 text-amber-600',
      features: ['Sensor Cleaning', 'Strap Replacement', 'Screen Repair', 'Battery Service'],
      price: 'Starting from ₨ 2,000'
    },
    {
      title: 'Home Audio',
      iconKey: 'speaker',
      color: 'bg-green-100 text-green-600',
      features: ['Component Repair', 'Wiring Overhaul', 'Bluetooth Modules', 'Firmware Update'],
      price: 'Starting from ₨ 4,000'
    },
    {
      title: 'Desktop/Monitors',
      iconKey: 'monitor',
      color: 'bg-red-100 text-red-600',
      features: ['Monitor Panel Fix', 'PC Dusting', 'Power Supply Repair', 'Cooling System'],
      price: 'Starting from ₨ 4,500'
    }
];

export const BRANDS = {
  Laptop: ['Dell', 'HP', 'Lenovo', 'Acer', 'Apple', 'Asus', 'Microsoft Surface'],
  Mobile: ['Apple', 'Samsung', 'Infinix', 'Huawei', 'Techno', 'Oppo', 'Vivo', 'Xiaomi', 'Google Pixel']
};

// Mock accessories for when backend is unavailable (category: Mobile | Laptop | Tablet)
export const MOCK_ACCESSORIES = {
  Mobile: [
    { _id: 'acc-m1', name: 'Phone Case - Premium Silicone', description: 'Shockproof silicone case for most smartphones.', price: 12.99, category: 'Mobile', image: 'https://images.unsplash.com/photo-1601593346740-9238e5a1b2ad?w=400&q=80', stock: 50 },
    { _id: 'acc-m2', name: 'Tempered Glass Screen Protector', description: '9H hardness, bubble-free installation.', price: 8.99, category: 'Mobile', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', stock: 100 },
    { _id: 'acc-m3', name: 'Fast Charging Cable (Type-C)', description: 'Durable braided cable, 2m length.', price: 14.99, category: 'Mobile', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', stock: 75 },
    { _id: 'acc-m4', name: 'Wireless Charging Pad', description: '15W fast wireless charger, Qi compatible.', price: 24.99, category: 'Mobile', image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&q=80', stock: 30 },
  ],
  Laptop: [
    { _id: 'acc-l1', name: 'Laptop Sleeve 15.6"', description: 'Padded neoprene sleeve with front pocket.', price: 22.99, category: 'Laptop', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80', stock: 40 },
    { _id: 'acc-l2', name: 'USB-C Hub (7-in-1)', description: 'HDMI, USB 3.0, SD card, PD charging.', price: 49.99, category: 'Laptop', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80', stock: 25 },
    { _id: 'acc-l3', name: 'Laptop Stand Aluminum', description: 'Ergonomic stand for better airflow.', price: 34.99, category: 'Laptop', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80', stock: 20 },
    { _id: 'acc-l4', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse, long battery.', price: 19.99, category: 'Laptop', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80', stock: 60 },
  ],
  Tablet: [
    { _id: 'acc-t1', name: 'Tablet Keyboard Folio', description: 'Detachable keyboard with protective cover.', price: 39.99, category: 'Tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', stock: 35 },
    { _id: 'acc-t2', name: 'Tablet Stand Adjustable', description: 'Multi-angle stand for viewing and typing.', price: 18.99, category: 'Tablet', image: 'https://images.unsplash.com/photo-1585792160161-cd381ff6061e?w=400&q=80', stock: 45 },
    { _id: 'acc-t3', name: 'Stylus Pen', description: 'Precision stylus for drawing and notes.', price: 29.99, category: 'Tablet', image: 'https://images.unsplash.com/photo-1585792160161-cd381ff6061e?w=400&q=80', stock: 3 },
    { _id: 'acc-t4', name: 'Tablet Screen Protector', description: 'Matte anti-glare screen protector.', price: 11.99, category: 'Tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', stock: 55 },
  ],
};
