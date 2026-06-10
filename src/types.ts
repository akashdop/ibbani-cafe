export interface MenuItem {
  _id?: string;
  id: string;
  name: string;
  description: string;
  category: 'coffee' | 'tea' | 'dessert' | 'savory';
  subCategory: 'hot' | 'cold' | 'signature' | 'pastry' | 'cake' | 'plated';
  price: number;
  image: string;
  available?: boolean;
  createdAt?: string;
  isBestSeller?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  caffeineLevel?: 'high' | 'medium' | 'low' | 'none';
}

export interface Reservation {
  id: string;
  reservationId: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tablePreference: 'window' | 'garden' | 'lounge' | 'standard';
  specialRequest?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled';
  createdAt: string;
  tableNumber?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'coffee' | 'desserts' | 'atmosphere' | 'brewing';
}

export interface PromotionOffer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  expiryDate: string;
  active: boolean;
  image: string;
}

export interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface AnalyticsStats {
  visitorsToday: number;
  reservationsCount: {
    pending: number;
    confirmed: number;
    seated: number;
    cancelled: number;
  };
  popularCategorySales: { category: string; sales: number; percentage: number }[];
  weeklyRevenue: { day: string; amount: number }[];
  hourlyActivity: { hour: string; count: number }[];
}
