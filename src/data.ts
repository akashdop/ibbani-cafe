import { MenuItem, GalleryItem, Reservation, PromotionOffer, FeedbackMessage } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- HOT COFFEES ---
  {
    id: 'm1',
    name: 'Cappuccino',
    description: 'Perfect harmony of heavy double espresso, velvety steamed organic milk, and a dense, luxurious layer of micro-foam, dusted with artisan cocoa.',
    price: 149,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true,
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm2',
    name: 'Espresso',
    description: 'The pure soul of our roasted beans. Intensely aromatic, full-bodied single origin shot with a flawless, tiger-striped golden crema.',
    price: 99,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1510591509382-7434f3133a15?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm3',
    name: 'Americano',
    description: 'Double espresso shot gracefully diluted with precisely tempered hot mountain water, presenting a clean profile with lingering cocoa notes.',
    price: 119,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1551046713-b45a9992224b?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm4',
    name: 'Café Latte',
    description: 'Rich, gentle espresso paired with sweet, silky steamed milk and topped with a clean layer of micro-foam. Mild and satisfying.',
    price: 159,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'medium'
  },
  {
    id: 'm5',
    name: 'Mocha',
    description: 'An indulgent, velvety blend of our espresso, steamed creamy milk, and rich melted Belgian dark chocolate, finished with gourmet cocoa shavings.',
    price: 179,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm6',
    name: 'Flat White',
    description: 'Crafted in the true Antipodean style. Steamed whole milk folded into a double ristretto, resulting in a rich texture with strong coffee character.',
    price: 169,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm7',
    name: 'Espresso Macchiato',
    description: 'Our robust signature espresso shot gently marked or "stained" with just a single spoonful of warm, velvety milk foam.',
    price: 139,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1581442111051-a968a3c86f78?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm8',
    name: 'Cortado',
    description: 'A beautiful 1:1 balance of strong espresso and warm steamed milk, cutting the acidity while highlighting complex roasted undertones.',
    price: 149,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm9',
    name: 'Turkish Coffee',
    description: 'Traditional finely ground coffee beans boiled in a copper cezve pot. Intensely bold, spiced with green cardamom, and served unfiltered.',
    price: 179,
    category: 'coffee',
    subCategory: 'hot',
    image: 'https://images.unsplash.com/photo-1573059103212-db3e47953258?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },

  // --- COLD COFFEES ---
  {
    id: 'm10',
    name: 'Cold Coffee with Ice Cream',
    description: 'A decadent, frosty local specialty. Creamy blended espresso shake topped with a rich scoop of signature premium vanilla bean gelato.',
    price: 199,
    category: 'coffee',
    subCategory: 'cold',
    image: 'https://images.unsplash.com/photo-1594911774802-8822a707c935?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true,
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm11',
    name: 'Slow Cold Brew',
    description: 'Beans steeped in cold pure organic dewy-water for 18 slow hours. Exceptionally smooth, low in acidity, with natural tasting notes of ripe berries and molasses.',
    price: 169,
    category: 'coffee',
    subCategory: 'cold',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm12',
    name: 'Iced Americano',
    description: 'Espresso double shots poured over ice and chilled filtered spring water – a brisk, refreshing, and deeply revitalizing treat.',
    price: 139,
    category: 'coffee',
    subCategory: 'cold',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm13',
    name: 'Iced Latte',
    description: 'Chilled premium milk, double espresso, and ice combined to create a smooth, beautifully layered, dairy-sweet refreshment.',
    price: 179,
    category: 'coffee',
    subCategory: 'cold',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'medium'
  },
  {
    id: 'm14',
    name: 'Signature Frappé',
    description: 'Blended espresso, dense cream, sweet vanilla bean, and crushed ice, finished with generous whipped cream and premium caramel drizzle.',
    price: 219,
    category: 'coffee',
    subCategory: 'cold',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'medium'
  },
  {
    id: 'm15',
    name: 'Nitro Cold Brew',
    description: 'Our slow cold brew shot with high-pressure nitrogen gas. Pours like a fine stout, cascade-foamed, naturally sweet with a velvet-bubble mouthfeel.',
    price: 249,
    category: 'coffee',
    subCategory: 'cold',
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'high'
  },
  {
    id: 'm16',
    name: 'Dewy Rose Affogato',
    description: 'Creamy cold vanilla bean ice cream drenched with a hot double espresso shot and infused with a touch of local dewy rose water.',
    price: 199,
    category: 'coffee',
    subCategory: 'signature',
    image: 'https://images.unsplash.com/photo-1598214886806-c87b2a370944?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isGlutenFree: true,
    caffeineLevel: 'medium'
  },

  // --- DESSERTS ---
  {
    id: 'm17',
    name: 'Artisanal Tiramisu',
    description: 'Layers of delicate feather-soft ladyfinger sponge biscuit soaked in single-origin cold brew espresso and premium orange zest, layered with sweet zabaglione-cream mascarpone.',
    price: 249,
    category: 'dessert',
    subCategory: 'plated',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true,
    isVegetarian: true,
    isGlutenFree: false,
    caffeineLevel: 'low'
  },
  {
    id: 'm18',
    name: 'Belgian Liege Waffle',
    description: 'Baked to golden crisp pearl-sugar perfection, accompanied by our homemade warm rich chocolate ganache and premium cold whipping cream.',
    price: 219,
    category: 'dessert',
    subCategory: 'pastry',
    image: 'https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    caffeineLevel: 'none'
  },
  {
    id: 'm19',
    name: 'New York Cheesecake',
    description: 'Ultra-creamy baked cheesecake resting on a perfect buttery graham cracker crust, topped with fresh Bengaluru strawberry coulis.',
    price: 229,
    category: 'dessert',
    subCategory: 'cake',
    image: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    caffeineLevel: 'none'
  },
  {
    id: 'm20',
    name: 'Fudge Brownie with Gelato',
    description: 'Warm, gooey, decadent dark Belgian chocolate walnut brownie served with vanilla ice cream and hot chocolate lava.',
    price: 179,
    category: 'dessert',
    subCategory: 'pastry',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    caffeineLevel: 'none'
  },

  // --- SAVORY ---
  {
    id: 'm21',
    name: 'Paneer Tikka Croissant',
    description: 'A French butter-puffed flaky croissant filled with clay-oven roasted cottage cheese, charred capsicum, and premium mint chutney.',
    price: 169,
    category: 'savory',
    subCategory: 'pastry',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    caffeineLevel: 'none'
  },
  {
    id: 'm22',
    name: 'Spinach Corn Quiche',
    description: 'Crusty, savory shortcrust pastry tart filled with creamy, cheese-baked local baby spinach, sweet corn, and nutmeg-infused custard.',
    price: 159,
    category: 'savory',
    subCategory: 'pastry',
    image: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    caffeineLevel: 'none'
  },
  {
    id: 'm23',
    name: 'Chicken Club Sandwich',
    description: 'Tri-layered toasted sour-levain bread with roasted chicken breast strips, organic fresh lettuce, field tomatoes, and signature garlic aioli.',
    price: 199,
    category: 'savory',
    subCategory: 'plated',
    image: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&q=80&w=600',
    isVegetarian: false,
    caffeineLevel: 'none'
  }
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'The Dew-Drop Pour',
    description: 'Captured in the quiet mystical Bengaluru morning as dawn dews rest on caffeine leaves. Our slow barista pours microfoam with high artistic precision, forming a signature dewy fern pattern.',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600',
    category: 'coffee'
  },
  {
    id: 'g2',
    title: 'Artisanal Baked Bliss',
    description: 'Each sourdough and croissant is rolled meticulously before sunrise, allowing local organic butter to laminate beautifully into countless delicate golden layers.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    category: 'desserts'
  },
  {
    id: 'g3',
    title: 'Warm Nooks & Dewy Glass',
    description: 'Our greenhouse-inspired glass dome in Bengaluru, allowing misty natural morning sunlight to bathe our lush leaf climbers while soft ambient music warms the space.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
    category: 'atmosphere'
  },
  {
    id: 'g4',
    title: 'The Sinking Gelato',
    description: 'A close shot of the spectacular moment our piping-hot single estate espresso melts the core of our handcrafted madagascar vanilla-bean gelato cream.',
    image: 'https://images.pexels.com/photos/16526140/pexels-photo-16526140.jpeg',
    category: 'coffee'
  },
  {
    id: 'g5',
    title: 'Slow Chemistry Brewing',
    description: 'Hour 14 of our vacuum cold drip extraction. Slowly dripping, cold, oxygen-rich dewy water absorbs the subtle jasmine and honey essences of Chikmagalur Arabica.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    category: 'brewing'
  },
  {
    id: 'g6',
    title: 'Rustic Sweet Earth',
    description: 'An aerial view of the preparation of our layered Tiramisu, topped with fresh cocoa ground directly from Coorg estate cacao pods.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
    category: 'desserts'
  },
  {
    id: 'g7',
    title: 'Sunset Coffee Community',
    description: 'Bengaluru residents gather in our courtyard under old banyan arches, exchanging design ideas and laughter while holding a warm cup of Ibbani brew.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
    category: 'atmosphere'
  },
  {
    id: 'g8',
    title: 'The Perfect Roast Science',
    description: 'Evaluating color points on our artisanal drum roaster. Capturing the second crack when origin oils release their rich chocolatey and nutty aromas.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=600',
    category: 'brewing'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'r-101',
    reservationId: 'r-101',
    customerName: 'Ananya Sharma',
    email: 'ananya@bengalurulink.in',
    phone: '+91 98450 12345',
    date: '2026-06-15',
    time: '09:30',
    guests: 2,
    tablePreference: 'garden',
    specialRequest: 'Celebrating our anniversary. Would love a quiet spot near the misting unit.',
    status: 'confirmed',
    createdAt: '2026-06-08T10:00:00Z',
    tableNumber: 'Table G3'
  },
  {
    id: 'r-102',
    reservationId: 'r-102',
    customerName: 'Rohan Deshmukh',
    email: 'rohan.d@techspace.com',
    phone: '+91 80956 78901',
    date: '2026-06-16',
    time: '16:00',
    guests: 4,
    tablePreference: 'lounge',
    specialRequest: 'Brief business meeting. Need power outlet nearby to charge devices.',
    status: 'pending',
    createdAt: '2026-06-08T11:15:00Z'
  },
  {
    id: 'r-103',
    reservationId: 'r-103',
    customerName: 'Maya Krishnan',
    email: 'maya.krish@designstudio.org',
    phone: '+91 99001 22334',
    date: '2026-06-12',
    time: '11:00',
    guests: 1,
    tablePreference: 'window',
    specialRequest: 'Solo sketchbook/writing session. Close to natural light please.',
    status: 'seated',
    createdAt: '2026-06-07T09:30:00Z',
    tableNumber: 'Table W1'
  },
  {
    id: 'r-104',
    reservationId: 'r-104',
    customerName: 'Vikram & Friends',
    email: 'vikram.roy@hustlepay.com',
    phone: '+91 88844 55112',
    date: '2026-06-10',
    time: '19:30',
    guests: 6,
    tablePreference: 'standard',
    specialRequest: 'No specific request.',
    status: 'cancelled',
    createdAt: '2026-06-06T15:20:00Z'
  }
];

export const INITIAL_OFFERS: PromotionOffer[] = [
  {
    id: 'o1',
    title: 'Misty Monsoon Morning Discount',
    description: 'Sip on any hot brew between 8:00 AM and 11:00 AM on weekdays and get 15% off. Let Bengaluru’s misty morning blend with premium espresso.',
    code: 'IBBANIMIST',
    discount: '15% OFF',
    expiryDate: '2026-07-31',
    active: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'o2',
    title: 'First Sip Special Code',
    description: 'We welcome you to the Ibbani family. Enjoy a complimentary artisanal fudge brownie with your first premium cappuccino/macchiato combo purchase.',
    code: 'FIRSTSIP26',
    discount: 'FREE BROWNIE',
    expiryDate: '2026-12-31',
    active: true,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_MESSAGES: FeedbackMessage[] = [
  {
    id: 'msg1',
    name: 'Karthik Rao',
    email: 'karthik.rao@bengaluruhustle.net',
    subject: 'Flawless Cortado and Acoustics',
    message: 'Visited the cafe yesterday and I must say, the Cortado was perfectly balanced! Also, the acoustic treatment in your greenhouse dome makes it incredibly peaceful to take calls. Kudos to the design team!',
    createdAt: '2026-06-08T09:45:00Z',
    status: 'new'
  },
  {
    id: 'msg2',
    name: 'Priyamvada Sen',
    email: 'priya09@gmail.com',
    subject: 'Vegan/Cow Milk Alternative questions',
    message: 'Hello, do you offer oat milk or almond milk as alternatives for the standard Café Latte? Looking forward to visiting next Saturday with my group.',
    createdAt: '2026-06-07T14:10:00Z',
    status: 'read'
  }
];

export const INITIAL_ANALYTICS = {
  visitorsToday: 342,
  reservationsCount: {
    pending: 1,
    confirmed: 1,
    seated: 1,
    cancelled: 1
  },
  popularCategorySales: [
    { category: 'Hot Coffee Brews', sales: 184, percentage: 42 },
    { category: 'Cold Blended Coffees', sales: 112, percentage: 26 },
    { category: 'Premium Plated Desserts', sales: 98, percentage: 22 },
    { category: 'Artisanal Savories', sales: 44, percentage: 10 }
  ],
  weeklyRevenue: [
    { day: 'Mon', amount: 12400 },
    { day: 'Tue', amount: 14200 },
    { day: 'Wed', amount: 13900 },
    { day: 'Thu', amount: 15100 },
    { day: 'Fri', amount: 19800 },
    { day: 'Sat', amount: 26500 },
    { day: 'Sun', amount: 28900 }
  ],
  hourlyActivity: [
    { hour: '08:00 AM', count: 32 },
    { hour: '10:00 AM', count: 54 },
    { hour: '12:00 PM', count: 41 },
    { hour: '02:00 PM', count: 28 },
    { hour: '04:00 PM', count: 68 },
    { hour: '06:00 PM', count: 85 },
    { hour: '08:00 PM', count: 72 }
  ]
};
