import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import MenuView from './components/MenuView';
import GalleryView from './components/GalleryView';
import ReservationsView from './components/ReservationsView';
import ContactView from './components/ContactView';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';

import { MenuItem, Reservation, PromotionOffer, FeedbackMessage, AnalyticsStats } from './types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_GALLERY_ITEMS, 
  INITIAL_RESERVATIONS, 
  INITIAL_OFFERS, 
  INITIAL_MESSAGES, 
  INITIAL_ANALYTICS 
} from './data';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const getViewFromPath = (path: string) => {
    const normalized = path.replace(/\/+$|^\//g, '') || '';
    switch (normalized) {
      case 'menu': return 'menu';
      case 'gallery': return 'gallery';
      case 'reservations': return 'reservations';
      case 'contact': return 'contact';
      case 'admin-login': return 'admin-login';
      case 'admin': return 'admin';
      default: return 'home';
    }
  };

  const getPathFromView = (view: string) => {
    switch (view) {
      case 'menu': return '/menu';
      case 'gallery': return '/gallery';
      case 'reservations': return '/reservations';
      case 'contact': return '/contact';
      case 'admin-login': return '/admin-login';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  const navigateTo = (view: string, replace = false) => {
    const path = getPathFromView(view);
    setCurrentView(view);

    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initialView = getViewFromPath(window.location.pathname);
    navigateTo(initialView, true);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      setCurrentView(getViewFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Unified persistent memory states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [offers, setOffers] = useState<PromotionOffer[]>([]);
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsStats>(INITIAL_ANALYTICS);

  // 1. Initial State Seed from MongoDB or Static Data
  useEffect(() => {
    const token = localStorage.getItem('ibbani_admin_token');
    if (token) {
      fetch('/api/admin/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setIsAdminLoggedIn(true);
          } else {
            localStorage.removeItem('ibbani_admin_token');
            localStorage.removeItem('ibbani_admin_logged_in');
            setIsAdminLoggedIn(false);
          }
        })
        .catch(() => {
          setIsAdminLoggedIn(true);
        });
    }

    const loadMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Unable to load menu items from backend.');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setMenuItems(
            data.map((item: any) => ({
              ...item,
              id: item.id ?? item._id ?? item.name,
              available: item.available ?? true,
            }))
          );
        } else {
          setMenuItems(INITIAL_MENU_ITEMS);
        }
      } catch (error) {
        console.error('Failed to load menu from backend.', error);
        setMenuItems(INITIAL_MENU_ITEMS);
      }
    };

    const loadReservations = async () => {
      try {
        const response = await fetch('/api/reservations');
        if (!response.ok) {
          console.error('Failed to load reservations from backend.');
          setReservations([]);
          return;
        }
        const data = await response.json();
        setReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load reservations from backend.', error);
        setReservations([]);
      }
    };

    loadMenuItems();
    loadReservations();

    const savedOffers = localStorage.getItem('ibbani_offers');
    const savedMessages = localStorage.getItem('ibbani_messages');

    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    } else {
      setOffers(INITIAL_OFFERS);
      localStorage.setItem('ibbani_offers', JSON.stringify(INITIAL_OFFERS));
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(INITIAL_MESSAGES);
      localStorage.setItem('ibbani_messages', JSON.stringify(INITIAL_MESSAGES));
    }
  }, []);

  // 2. recalculate Analytics dynamically as states mutate
  useEffect(() => {
    if (menuItems.length === 0 || reservations.length === 0) return;

    // Categorized sales estimates based on count of reservations in system
    const coffeeHotCount = menuItems.filter(i=>i.subCategory==='hot').length;
    const coffeeColdCount = menuItems.filter(i=>i.subCategory==='cold'||i.subCategory==='signature').length;
    const dessertsPlated = menuItems.filter(i=>i.category==='dessert').length;
    const savoryPastry = menuItems.filter(i=>i.category==='savory').length;

    const baseCount = reservations.length * 12; // simulated scales multiplier
    const totalSimulatedSales = baseCount * 14;

    const hotScore = Math.floor(baseCount * 5.2);
    const coldScore = Math.floor(baseCount * 3.4);
    const dessertScore = Math.floor(baseCount * 2.8);
    const savoryScore = Math.floor(baseCount * 1.6);
    const combinedScore = hotScore + coldScore + dessertScore + savoryScore;

    const updatedStats: AnalyticsStats = {
      visitorsToday: 342 + (reservations.filter(r=>r.status === 'confirmed'||r.status==='seated').length * 4),
      reservationsCount: {
        pending: reservations.filter(r => r.status === 'pending').length,
        confirmed: reservations.filter(r => r.status === 'confirmed').length,
        seated: reservations.filter(r => r.status === 'seated').length,
        cancelled: reservations.filter(r => r.status === 'cancelled').length
      },
      popularCategorySales: [
        { category: 'Hot Coffee Brews', sales: hotScore, percentage: Math.round((hotScore/combinedScore)*100) },
        { category: 'Cold Blended Coffees', sales: coldScore, percentage: Math.round((coldScore/combinedScore)*100) },
        { category: 'Premium Plated Desserts', sales: dessertScore, percentage: Math.round((dessertScore/combinedScore)*100) },
        { category: 'Artisanal Savories', sales: savoryScore, percentage: Math.round((savoryScore/combinedScore)*100) }
      ],
      weeklyRevenue: INITIAL_ANALYTICS.weeklyRevenue.map(day => {
        // Boost revenue slightly on weekend days if we have active bookings
        if (day.day === 'Sat' || day.day === 'Sun') {
          return { day: day.day, amount: day.amount + (reservations.filter(r=>r.status==='confirmed').length * 450) };
        }
        return day;
      }),
      hourlyActivity: INITIAL_ANALYTICS.hourlyActivity
    };

    setAnalytics(updatedStats);

  }, [menuItems, reservations]);

  // --- LOCAL PERSISTENCE HELPERS ---
  const handleUpdateMenu = (updated: MenuItem[]) => {
    setMenuItems(updated);
  };

  const handleUpdateReservations = (updated: Reservation[]) => {
    setReservations(updated);
  };

  const handleUpdateOffers = (updated: PromotionOffer[]) => {
    setOffers(updated);
    localStorage.setItem('ibbani_offers', JSON.stringify(updated));
  };

  const handleUpdateMessages = (updated: FeedbackMessage[]) => {
    setMessages(updated);
    localStorage.setItem('ibbani_messages', JSON.stringify(updated));
  };

  // --- EVENT TRIGGERS (ADD RES FROM CLIENT) ---
  const handleAddReservationState = (reservation: Reservation) => {
    setReservations((prev) => [reservation, ...prev]);
  };

  // --- EVENT TRIGGERS (ADD MSG FROM CLIENT) ---
  const handleAddMessageState = (msg: Omit<FeedbackMessage, 'id' | 'createdAt' | 'status'>) => {
    const newRecord: FeedbackMessage = {
      id: 'msg-' + Date.now(),
      ...msg,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    const nextList = [newRecord, ...messages];
    setMessages(nextList);
    localStorage.setItem('ibbani_messages', JSON.stringify(nextList));
  };

  // --- ADMIN LOGIN HANDLER ---
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('ibbani_admin_logged_in', 'true');
    navigateTo('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('ibbani_admin_token');
    localStorage.removeItem('ibbani_admin_logged_in');
    navigateTo('home');
  };

  // Switch navigation page renderer
  const renderCurrentView = () => {
    // Protect admin route - redirect to login if not authenticated
    if (currentView === 'admin' && !isAdminLoggedIn) {
      return (
        <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <HomeView
            featuredItems={menuItems.filter((item) => item.available !== false && item.isBestSeller).slice(0, 3)}
            activeOffers={offers.filter((o) => o.active)}
            onNavigate={navigateTo}
          />
        );
      case 'menu':
        return (
          <MenuView
            menuItems={menuItems.filter((item) => item.available !== false)}
            onNavigate={navigateTo}
          />
        );
      case 'gallery':
        return <GalleryView galleryItems={INITIAL_GALLERY_ITEMS} />;
      case 'reservations':
        return <ReservationsView onAddReservation={handleAddReservationState} />;
      case 'contact':
        return <ContactView onAddMessage={handleAddMessageState} />;
      case 'admin-login':
        return (
          <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
        );
      case 'admin':
        return (
          <AdminDashboard
            menuItems={menuItems}
            onUpdateMenu={handleUpdateMenu}
            reservations={reservations}
            onUpdateReservations={handleUpdateReservations}
            offers={offers}
            onUpdateOffers={handleUpdateOffers}
            messages={messages}
            onUpdateMessages={handleUpdateMessages}
            analytics={analytics}
          />
        );
      default:
        return <div className="text-center py-20 font-sans text-xs">Error: View Not Found.</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gold-50/50 scrollbar-thin">
      
      {/* 1. STICKY GLASSMORPHIC HEADER */}
      <Navbar 
        currentView={currentView} 
        onNavigate={navigateTo}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={handleAdminLogout}
      />

      {/* 2. DYNAMICAL ROUTE CANVAS */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* 3. SOLID TYPOGRAPHIC FOOTER */}
      <Footer 
        onNavigate={navigateTo} 
      />

    </div>
  );
}
