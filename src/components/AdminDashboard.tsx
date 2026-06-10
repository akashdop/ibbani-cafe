import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, TrendingUp, Users, Calendar, Sliders, Plus, Edit2, Trash2, 
  Check, X, DollarSign, Clock, MessageSquare, Tag, Eye, Heart, BarChart3, List, AlertTriangle
} from 'lucide-react';
import { MenuItem, Reservation, PromotionOffer, FeedbackMessage, AnalyticsStats } from '../types';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  onUpdateMenu: (updated: MenuItem[]) => void;
  
  reservations: Reservation[];
  onUpdateReservations: (updated: Reservation[]) => void;
  
  offers: PromotionOffer[];
  onUpdateOffers: (updated: PromotionOffer[]) => void;
  
  messages: FeedbackMessage[];
  onUpdateMessages: (updated: FeedbackMessage[]) => void;
  
  analytics: AnalyticsStats;
}

export default function AdminDashboard({
  menuItems, onUpdateMenu,
  reservations, onUpdateReservations,
  offers, onUpdateOffers,
  messages, onUpdateMessages,
  analytics
}: AdminDashboardProps) {
  
  // Dashboard navigation sub-tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'menu' | 'reservations' | 'offers' | 'messages'>('analytics');

  // Menu Modal CRUD details
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  // Menu Form states
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(149);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCat, setNewItemCat] = useState<'coffee' | 'tea' | 'dessert' | 'savory'>('coffee');
  const [newItemSub, setNewItemSub] = useState<'hot' | 'cold' | 'signature' | 'pastry' | 'cake' | 'plated'>('hot');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemAvailable, setNewItemAvailable] = useState(true);
  const [newItemVeg, setNewItemVeg] = useState(true);
  const [newItemCaff, setNewItemCaff] = useState<'high' | 'medium' | 'low' | 'none'>('high');

  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuSaving, setMenuSaving] = useState(false);
  const [menuMessage, setMenuMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Offer Form States
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDisc, setNewOfferDisc] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferImage, setNewOfferImage] = useState('');

  // Table numbering for approvals
  const [selectedResForTable, setSelectedResForTable] = useState<string | null>(null);
  const [tempTableNumber, setTempTableNumber] = useState('Table G1');
  const [dbReservations, setDbReservations] = useState<Reservation[]>(reservations);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [reservationsError, setReservationsError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getAdminToken = () => localStorage.getItem('ibbani_admin_token');

  const fetchMenuItems = async () => {
    setLoadingMenu(true);
    setMenuMessage(null);

    try {
      const response = await fetch('/api/menu');
      if (!response.ok) {
        throw new Error('Unable to load menu items.');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Menu payload invalid.');
      }
      const list = data.map((item: any) => ({
        ...item,
        id: item.id ?? item._id ?? String(item._id ?? item.name),
        available: item.available ?? true,
      }));
      onUpdateMenu(list);
      setMenuMessage({ type: 'success', text: 'Menu refreshed from MongoDB.' });
    } catch (error) {
      console.error('Menu load failed:', error);
      setMenuMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not load menu items.' });
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'menu') {
      fetchMenuItems();
    }
  }, [activeTab]);

  const handleOpenAddMenu = () => {
    setEditingMenuItem(null);
    setNewItemName('');
    setNewItemPrice(149);
    setNewItemDesc('');
    setNewItemCat('coffee');
    setNewItemSub('hot');
    setNewItemImage('https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600');
    setNewItemAvailable(true);
    setNewItemVeg(true);
    setNewItemCaff('high');
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setNewItemName(item.name);
    setNewItemPrice(item.price);
    setNewItemDesc(item.description);
    setNewItemCat(item.category);
    setNewItemSub(item.subCategory);
    setNewItemImage(item.image);
    setNewItemAvailable(item.available ?? true);
    setNewItemVeg(!!item.isVegetarian);
    setNewItemCaff(item.caffeineLevel ?? 'high');
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setMenuSaving(true);
    setMenuMessage(null);

    const token = getAdminToken();
    if (!token) {
      setMenuMessage({ type: 'error', text: 'Admin token is missing. Please login again.' });
      setMenuSaving(false);
      return;
    }

    const payload = {
      name: newItemName,
      description: newItemDesc,
      category: newItemCat,
      subCategory: newItemSub,
      price: Number(newItemPrice),
      image: newItemImage,
      available: newItemAvailable,
      isVegetarian: newItemVeg,
      caffeineLevel: newItemCaff,
    };

    try {
      const url = editingMenuItem ? `/api/menu/${editingMenuItem.id}` : '/api/menu';
      const method = editingMenuItem ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Unable to save menu item.');
      }

      const savedItem = await response.json();
      const normalizedItem = {
        ...savedItem,
        id: savedItem.id ?? savedItem._id ?? editingMenuItem?.id ?? `menu-${Date.now()}`,
        available: savedItem.available ?? true,
      };

      if (editingMenuItem) {
        onUpdateMenu(menuItems.map((item) => (item.id === editingMenuItem.id ? normalizedItem : item)));
        setMenuMessage({ type: 'success', text: 'Menu item updated successfully.' });
      } else {
        onUpdateMenu([normalizedItem, ...menuItems]);
        setMenuMessage({ type: 'success', text: 'New menu item added successfully.' });
      }

      setIsMenuModalOpen(false);
    } catch (error) {
      console.error('Save menu failed:', error);
      setMenuMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save item.' });
    } finally {
      setMenuSaving(false);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    const confirmed = confirm('Delete this menu item permanently? This cannot be undone.');
    if (!confirmed) return;

    setMenuSaving(true);
    setMenuMessage(null);

    try {
      const token = getAdminToken();
      if (!token) {
        throw new Error('Admin token is missing. Please login again.');
      }

      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Unable to delete menu item.');
      }

      onUpdateMenu(menuItems.filter((item) => item.id !== id));
      setMenuMessage({ type: 'success', text: 'Menu item removed successfully.' });
    } catch (error) {
      console.error('Delete menu failed:', error);
      setMenuMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to delete item.' });
    } finally {
      setMenuSaving(false);
    }
  };

  const handleToggleMenuAvailability = async (item: MenuItem) => {
    setMenuSaving(true);
    setMenuMessage(null);

    try {
      const token = getAdminToken();
      if (!token) {
        throw new Error('Admin token is missing. Please login again.');
      }

      const response = await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available: !item.available }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Unable to update availability.');
      }

      const updatedItem = await response.json();
      const normalizedItem = {
        ...updatedItem,
        id: updatedItem.id ?? updatedItem._id ?? item.id,
        available: updatedItem.available ?? false,
      };
      onUpdateMenu(menuItems.map((menuItem) => (menuItem.id === item.id ? normalizedItem : menuItem)));
      setMenuMessage({ type: 'success', text: `Item marked ${normalizedItem.available ? 'available' : 'unavailable'}.` });
    } catch (error) {
      console.error('Availability update failed:', error);
      setMenuMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to update availability.' });
    } finally {
      setMenuSaving(false);
    }
  };

  const patchReservationStatus = async (id: string, payload: { status: Reservation['status']; tableNumber?: string }) => {
    const token = localStorage.getItem('ibbani_admin_token');
    
    const response = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || 'Unable to update reservation.');
    }

    return response.json();
  };

  useEffect(() => {
    const loadReservations = async () => {
      setLoadingReservations(true);
      setReservationsError(null);

      try {
        const response = await fetch('/api/reservations');
        if (!response.ok) {
          throw new Error('Unable to fetch reservations.');
        }

        const data = await response.json();
        setDbReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Reservations fetch error:', error);
        setReservationsError('Unable to load reservations from MongoDB.');
        setDbReservations(reservations);
      } finally {
        setLoadingReservations(false);
      }
    };

    loadReservations();
  }, [reservations]);

  const reservationsToDisplay = [...(dbReservations.length ? dbReservations : reservations)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const currentReservations = dbReservations.length ? dbReservations : reservations;
  const updateReservationsState = (updated: Reservation[]) => {
    setDbReservations(updated);
    onUpdateReservations(updated);
  };

  // Helper inside chart math to make graphs responsive
  const maxRevenue = Math.max(...analytics.weeklyRevenue.map(r => r.amount));
  const maxHourlyCount = Math.max(...analytics.hourlyActivity.map(h => h.count));

  // --- RESERVATION STATUS INTERACTIONS ---
  const handleApproveReservation = (id: string) => {
    setSelectedResForTable(id);
    const pref = currentReservations.find((r) => r.id === id)?.tablePreference;
    setTempTableNumber(
      'Table ' + (pref ? pref.substring(0, 1).toUpperCase() : 'S') + Math.floor(1 + Math.random() * 9)
    );
  };

  const handleConfirmReservationWithTable = async () => {
    if (!selectedResForTable) return;
    setActionLoading(true);

    try {
      const result = await patchReservationStatus(selectedResForTable, {
        status: 'confirmed',
        tableNumber: tempTableNumber,
      });

      const updated = currentReservations.map((res) =>
        res.id === selectedResForTable
          ? { ...res, status: 'confirmed' as const, tableNumber: result.tableNumber ?? tempTableNumber }
          : res
      );

      updateReservationsState(updated);
      setSelectedResForTable(null);
    } catch (error) {
      console.error('Confirm reservation update failed:', error);
      setReservationsError(error instanceof Error ? error.message : 'Unable to confirm reservation.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSeated = async (id: string) => {
    setActionLoading(true);

    try {
      await patchReservationStatus(id, { status: 'seated' });
      const updated = currentReservations.map((res) =>
        res.id === id ? { ...res, status: 'seated' as const } : res
      );
      updateReservationsState(updated);
    } catch (error) {
      console.error('Seat reservation update failed:', error);
      setReservationsError(error instanceof Error ? error.message : 'Unable to mark reservation seated.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    setActionLoading(true);

    try {
      await patchReservationStatus(id, { status: 'cancelled' });
      const updated = currentReservations.map((res) =>
        res.id === id ? { ...res, status: 'cancelled' as const } : res
      );
      updateReservationsState(updated);
    } catch (error) {
      console.error('Cancel reservation update failed:', error);
      setReservationsError(error instanceof Error ? error.message : 'Unable to cancel reservation.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- PROMO CODE INTERACTIONS ---
  const handleAddNewOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle || !newOfferCode) return;

    const offerObj: PromotionOffer = {
      id: 'offer-' + Date.now(),
      title: newOfferTitle,
      description: 'Exclusive seasonal offer valid only in Bangalore.',
      code: newOfferCode.toUpperCase().replace(/\s+/g, ''),
      discount: newOfferDisc || '15% OFF',
      expiryDate: '2026-08-31',
      active: true,
      image: newOfferImage || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400'
    };

    onUpdateOffers([offerObj, ...offers]);
    setNewOfferTitle('');
    setNewOfferCode('');
    setNewOfferDisc('');
  };

  const handleToggleOfferActive = (id: string) => {
    const updated = offers.map(off => 
      off.id === id ? { ...off, active: !off.active } : off
    );
    onUpdateOffers(updated);
  };

  const handleDeleteOffer = (id: string) => {
    onUpdateOffers(offers.filter(off => off.id !== id));
  };

  // --- MESSAGES INBOX ACTIONS ---
  const handleToggleMessageRead = (id: string) => {
    const updated = messages.map(msg => 
      msg.id === id ? { ...msg, status: (msg.status === 'new' ? 'read' : 'new') as 'new'|'read' } : msg
    );
    onUpdateMessages(updated);
  };

  const handleDeleteMessage = (id: string) => {
    onUpdateMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <div className="space-y-12 pb-24 fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* 1. APPLET LOCK BANNER */}
      <div className="bg-gold-950 text-white rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between text-left gap-4 shadow-md border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-dew-800/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-3 relative z-10">
          <div className="bg-gold-500 text-gold-950 p-2.5 rounded-2xl">
            <Sliders className="h-6 w-6" id="dashboard-icon" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">Ibbani Admin Desk & Controls</h1>
            <p className="text-xs text-gold-200/80 font-sans mt-0.5">EST. 2026 Admin Workspace • Integrated Bengaluru Central Ledger</p>
          </div>
        </div>

        {/* Navigation Selector Tabs */}
        <div className="flex flex-wrap gap-1 bg-white/10 p-1.5 rounded-2xl relative z-10 border border-white/10 max-w-full">
          {[
            { id: 'analytics', label: '🗠 Insights Tab', icon: TrendingUp },
            { id: 'menu', label: '☕ Menu Management', icon: List },
            { id: 'reservations', label: `📅 Bookings (${reservationsToDisplay.filter(r => r.status === 'pending').length})`, icon: Calendar },
            { id: 'offers', label: '🎁 Special Coupons', icon: Tag },
            { id: 'messages', label: `💬 Inquiries (${messages.filter(m=>m.status==='new').length})`, icon: MessageSquare }
          ].map((subTab) => {
            const ActiveIcon = subTab.icon;
            const current = activeTab === subTab.id;
            return (
              <button
                key={subTab.id}
                onClick={() => setActiveTab(subTab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer ${
                  current
                    ? 'bg-gold-500 text-gold-950 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <ActiveIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB CONTROLLER LAYOUTS */}

      {/* ========================================================= */}
      {/* 2.1 TAB: ANALYTICS & INSIGHTS (HIGH RECONSTITUTIVE GRAPHICS) */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-10 fade-in text-left">
          
          {/* Visual statistics grid rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Visitors metric */}
            <div className="bg-white p-6 rounded-3xl border border-gold-200/50 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gold-500 uppercase tracking-wider block font-bold">TODAY VISITORS</span>
                <span className="text-3xl font-serif font-bold text-gold-950">{analytics.visitorsToday}</span>
                <span className="text-[10px] text-emerald-600 block font-sans font-medium">↑ 14% vs yesterday</span>
              </div>
              <div className="bg-dew-100 text-dew-700 p-3.5 rounded-2xl">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* Total reservations */}
            <div className="bg-white p-6 rounded-3xl border border-gold-200/50 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gold-500 uppercase tracking-wider block font-bold">TOTAL RESERVATIONS</span>
                <span className="text-3xl font-serif font-bold text-gold-950">
                  {reservationsToDisplay.length}
                </span>
                <span className="text-[10px] text-gold-600 block font-sans font-medium">
                  {reservationsToDisplay.filter((r) => r.status === 'pending').length} Pending Approval
                </span>
              </div>
              <div className="bg-dew-100 text-dew-700 p-3.5 rounded-2xl">
                <Calendar className="h-6 w-6" />
              </div>
            </div>

            {/* Estimated daily revenue */}
            <div className="bg-white p-6 rounded-3xl border border-gold-200/50 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gold-500 uppercase tracking-wider block font-bold">EST DAILY REVENUE</span>
                <span className="text-3xl font-serif font-bold text-gold-950">₹25,840</span>
                <span className="text-[10px] text-emerald-600 block font-sans font-semibold">100% Transactions secure</span>
              </div>
              <div className="bg-gold-100 text-gold-700 p-3.5 rounded-2xl">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            {/* Messages inbox tally */}
            <div className="bg-white p-6 rounded-3xl border border-gold-200/50 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gold-500 uppercase tracking-wider block font-bold">CUSTOMER MESSAGES</span>
                <span className="text-3xl font-serif font-bold text-gold-950">{messages.length}</span>
                <span className="text-[10px] text-amber-600 block font-sans font-semibold">
                  {messages.filter(m => m.status === 'new').length} unread emails
                </span>
              </div>
              <div className="bg-gold-100 text-gold-700 p-3.5 rounded-2xl">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>

          </div>

          {/* Interactive SVG dynamic graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Financial Revenue Chart */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gold-200/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-gold-950">Weekly Sales Analytics (INR)</h3>
                <span className="text-[10px] font-mono border border-gold-200 px-2.5 py-1 rounded-full uppercase text-gold-650">Updated Hourly</span>
              </div>
              
              {/* Custom SVG Bar Graphic charts */}
              <div className="flex items-end justify-between h-48 pt-6 px-2">
                {analytics.weeklyRevenue.map((rev) => {
                  const percentHeight = (rev.amount / maxRevenue) * 80; // Scale 80% max
                  return (
                    <div key={rev.day} className="flex flex-col items-center flex-1 space-y-2 group">
                      <span className="text-[10px] font-mono font-bold text-gold-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        ₹{(rev.amount/1000).toFixed(1)}k
                      </span>
                      {/* Bar columns */}
                      <div className="w-8 sm:w-10 bg-dew-100 hover:bg-dew-600 rounded-lg transition-all relative overflow-hidden" style={{ height: `${percentHeight}%` }}>
                        {/* Highlight strip */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-gold-600">{rev.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Peak Hour Activity log */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gold-200/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-gold-950">Peak Hours Guest Traffic</h3>
                <span className="text-[10px] font-mono border border-gold-200 px-2.5 py-1 rounded-full uppercase text-gold-650">Avg Occupancy</span>
              </div>

              {/* Custom SVG Peak Line Representation */}
              <div className="flex items-end justify-between h-48 pt-6 px-2">
                {analytics.hourlyActivity.map((hr) => {
                  const percentHeight = (hr.count / maxHourlyCount) * 80;
                  return (
                    <div key={hr.hour} className="flex flex-col items-center flex-1 space-y-2 group">
                      <span className="text-[9px] font-mono font-bold text-dew-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {hr.count} visits
                      </span>
                      {/* Column block reflecting hourly curve */}
                      <div className="w-1.5 bg-gold-200 group-hover:bg-gold-500 rounded-full transition-all relative" style={{ height: `${percentHeight}%` }}>
                        <div className="w-3.5 h-3.5 bg-gold-900 border-2 border-white rounded-full absolute -top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
                      </div>
                      <span className="text-[8px] font-mono font-bold text-gold-500 uppercase tracking-widest">{hr.hour.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Product Category splits represent table progress bar */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gold-200/50 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-gold-950">Specialty Category Sales Distribution</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.popularCategorySales.map((cat) => (
                <div key={cat.category} className="bg-gold-50/50 p-4 rounded-2xl border border-gold-150 space-y-2 text-left">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-bold text-gold-900">{cat.category}</span>
                    <span className="font-mono text-gold-600">{cat.percentage}%</span>
                  </div>
                  {/* Progress segment */}
                  <div className="w-full bg-gold-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-dew-600 h-full rounded-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-gold-500 uppercase tracking-wider block font-medium">
                    {cat.sales} items booked
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2.2 TAB: MANAGE MENU (CRUD LIST & PRICING CONTROLS) */}
      {/* ========================================================= */}
      {activeTab === 'menu' && (
        <div className="space-y-6 fade-in text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-gold-950">Specialty Catalog Directory</h3>
              <p className="text-xs text-gold-600 font-sans mt-0.5">Control live listings, pricing charts, and availability directly from the admin portal.</p>
            </div>
            
            <button
              onClick={handleOpenAddMenu}
              className="bg-dew-600 hover:bg-dew-700 text-white text-xs font-mono font-bold px-4 py-2.5 rounded-xl inline-flex items-center space-x-1.5 self-start cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Specialty</span>
            </button>
          </div>

          {menuMessage && (
            <div className={`rounded-3xl p-4 text-sm font-sans ${menuMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
              {menuMessage.text}
            </div>
          )}

          {loadingMenu && (
            <div className="rounded-3xl p-4 bg-gold-50 border border-gold-200 text-gold-700 text-sm font-sans">
              Refreshing menu items from the database…
            </div>
          )}

          <div className="bg-white border border-gold-200/50 rounded-[32px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gold-50 border-b border-gold-200/60 font-mono text-gold-700 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Dish Preview / Code</th>
                    <th className="py-4 px-6">Name & Description</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Unit Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Dietary</th>
                    <th className="py-4 px-6 text-center">Desk Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-100 font-sans">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gold-50/20 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gold-200" />
                          <span className="font-mono text-[10px] text-gold-500 font-bold block bg-gold-150 px-1.5 py-0.5 rounded uppercase">
                            {item.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <strong className="text-sm font-serif font-bold text-gold-950 block">{item.name}</strong>
                          <span className="text-[11px] text-gold-600 line-clamp-1 max-w-xs block mt-0.5">{item.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap uppercase font-mono text-[10px] text-gold-650 font-bold">
                        {item.category} • {item.subCategory}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-mono font-bold text-gold-950">
                        ₹{item.price}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleMenuAvailability(item)}
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-semibold transition ${
                            item.available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-[10px]">
                        <span className={`px-2.5 py-1 rounded-full border ${
                          item.isVegetarian 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {item.isVegetarian ? '✓ Vegetar.' : '🥚 Eggs-In'}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenEditMenu(item)}
                            className="bg-gold-100 hover:bg-gold-200 text-gold-800 p-2 rounded-lg"
                            aria-label="Edit catalog item"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg"
                            aria-label="Delete catalog item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2.3 TAB: RESERVATIONS ROSTER (APPROVED SEATS CONTROLLERS) */}
      {/* ========================================================= */}
      {activeTab === 'reservations' && (
        <div className="space-y-6 fade-in text-left">
          
          <div>
            <h3 className="font-serif text-xl font-bold text-gold-950">Active Reservations Registry</h3>
            <p className="text-xs text-gold-600 font-sans mt-0.5">Maintain guest tables, pending confirmation requests, and seat occupancy markers.</p>
            {loadingReservations && (
              <p className="text-[10px] mt-2 text-dew-700">Loading reservations from MongoDB…</p>
            )}
            {reservationsError && (
              <p className="text-[10px] mt-2 text-rose-600">{reservationsError}</p>
            )}
          </div>

          <div className="bg-white border border-gold-200/50 rounded-[32px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gold-50 border-b border-gold-200/60 font-mono text-gold-700 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">ID / Voucher</th>
                    <th className="py-4 px-6">Guest Details</th>
                    <th className="py-4 px-6">Schedule Time</th>
                    <th className="py-4 px-6">Table Zone</th>
                    <th className="py-4 px-6">Occasion Notes</th>
                    <th className="py-4 px-6 text-center">Status Action Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-100 font-sans">
                  {reservationsToDisplay.map((res) => (
                    <tr key={res.id} className="hover:bg-gold-50/20 transition-colors">
                      
                      {/* Ticket id */}
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-xs font-bold text-gold-650">
                        {res.id}
                      </td>

                      {/* Guest details contact name */}
                      <td className="py-4 px-6 text-left">
                        <div>
                          <strong className="text-sm font-serif font-bold text-gold-950 block">{res.customerName}</strong>
                          <span className="text-[10px] text-gold-500 font-mono tracking-normal block mt-0.5">{res.phone} • {res.email}</span>
                        </div>
                      </td>

                      {/* Timig schedule */}
                      <td className="py-4 px-6 whitespace-nowrap text-left">
                        <span className="font-mono font-semibold text-gold-900 block">{res.date}</span>
                        <span className="text-[10px] text-dew-700 font-mono uppercase tracking-widest font-bold mt-0.5 block">{res.time} AM/PM</span>
                      </td>

                      {/* Preferences */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-serif text-xs font-medium text-gold-800 block capitalize">{res.tablePreference}</span>
                        <span className="text-[10px] font-mono text-dew-600 block leading-tight font-bold">
                          {res.tableNumber || '(Unassigned)'}
                        </span>
                      </td>

                      {/* Memo notes */}
                      <td className="py-4 px-6 text-left">
                        <p className="text-[11px] text-gold-600 font-sans italic line-clamp-2 max-w-xs leading-normal">
                          {res.specialRequest ? `"${res.specialRequest}"` : 'No specific requests logged.'}
                        </p>
                      </td>

                      {/* Current Status and Toggle controllers */}
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center space-y-1.5 justify-center md:flex-row md:space-y-0 md:space-x-2">
                          
                          {/* Live Badges display */}
                          {res.status === 'confirmed' && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-mono text-[9px] font-bold block">
                              ✓ CONFIRMED
                            </span>
                          )}
                          {res.status === 'seated' && (
                            <span className="bg-dew-600 text-white px-2.5 py-1 rounded-full font-mono text-[9px] font-bold block">
                              🛋️ SEATED ACTIVE
                            </span>
                          )}
                          {res.status === 'cancelled' && (
                            <span className="bg-dashed border border-rose-300 text-rose-500 px-2.5 py-1 rounded-full font-mono text-[9px] font-bold block">
                              ✕ CANCELLET
                            </span>
                          )}

                          {/* Action state triggers targets */}
                          {res.status === 'pending' && (
                            <button
                              onClick={() => handleApproveReservation(res.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold"
                            >
                              Approve Voucher
                            </button>
                          )}

                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => handleToggleSeated(res.id)}
                              className="bg-gold-900 hover:bg-gold-800 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg"
                            >
                              Mark Seated
                            </button>
                          )}

                          {res.status !== 'cancelled' && res.status !== 'seated' && (
                            <button
                              onClick={() => handleCancelReservation(res.id)}
                              className="hover:bg-rose-100 text-rose-500 font-mono text-[9px] p-1.5 rounded-lg"
                              title="Cancel Reservation"
                            >
                              ✕ Cancel
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2.4 TAB: ACTIVE OFFERS & COUPONS */}
      {/* ========================================================= */}
      {activeTab === 'offers' && (
        <div className="space-y-8 fade-in text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Create Offer Input form (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-gold-200/50 p-6 rounded-3xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-950 flex items-center">
                <Tag className="h-4 w-4 mr-1.5 text-gold-600" /> Create Promotion Promo
              </h3>
              
              <form onSubmit={handleAddNewOffer} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-semibold text-gold-700">CAMPAGIN TITLE:</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Rainy Friday Mocha Deal"
                    value={newOfferTitle}
                    onChange={(e) => setNewOfferTitle(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 rounded-lg p-2 focus:outline-none focus:border-dew-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-semibold text-gold-700">PROMO CODE (NO SPACES):</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. MOCHAMIST"
                    value={newOfferCode}
                    onChange={(e) => setNewOfferCode(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 rounded-lg p-2 focus:outline-none focus:border-dew-500 uppercase font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-mono font-semibold text-gold-700">RATE:</label>
                    <input
                      type="text"
                      placeholder="E.g. 20% OFF"
                      value={newOfferDisc}
                      onChange={(e) => setNewOfferDisc(e.target.value)}
                      className="w-full bg-gold-50/50 border border-gold-200 rounded-lg p-2 focus:outline-none focus:border-dew-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-mono font-semibold text-gold-700">EXPIRY DATE:</label>
                    <span className="w-full h-[32px] border border-gold-200 bg-gold-50/50 p-2 rounded-lg flex items-center text-gold-500 font-mono">
                      2026-08-31
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-semibold text-gold-700">PROMO CORNER IMAGE:</label>
                  <input
                    type="text"
                    placeholder="Provide image URL..."
                    value={newOfferImage}
                    onChange={(e) => setNewOfferImage(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 rounded-lg p-2 focus:outline-none focus:border-dew-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-dew-600 hover:bg-dew-700 text-white font-mono font-bold py-2 px-4 rounded-xl shadow cursor-pointer mt-3 h-[38px] block"
                >
                  Publish Active Code
                </button>
              </form>
            </div>

            {/* List Active Offers (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-gold-200/50 rounded-3xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-950">Active Campaigns Feed</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((off) => (
                  <div key={off.id} className="border border-gold-200/80 p-4 rounded-2xl flex flex-col justify-between space-y-4 bg-gold-50/20 text-left">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                          off.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {off.active ? 'ACTIVE' : 'PAUSED'}
                        </span>
                        
                        <button
                          onClick={() => handleDeleteOffer(off.id)}
                          className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-xl transition-all"
                          aria-label="Delete campaign"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <h4 className="font-serif font-bold text-gold-900 mt-2">{off.title}</h4>
                      <p className="font-mono text-xs text-dew-700 font-semibold mt-1">Code: {off.code} ({off.discount})</p>
                      <span className="text-[10px] font-mono text-gold-500 mt-0.5 block">Expires: {off.expiryDate}</span>
                    </div>

                    <div className="pt-2 border-t border-gold-100 flex items-center justify-between">
                      <span className="text-[10px] text-gold-600 font-sans italic">Propagates to home page</span>
                      <button
                        onClick={() => handleToggleOfferActive(off.id)}
                        className={`text-[10px] font-mono px-3 py-1.5 rounded-lg border font-semibold ${
                          off.active ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {off.active ? 'Pause Campaign' : 'Unpause'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2.5 TAB: FEEDBACK INBOX & SUBMISSIONS */}
      {/* ========================================================= */}
      {activeTab === 'messages' && (
        <div className="space-y-6 fade-in text-left">
          
          <div>
            <h3 className="font-serif text-xl font-bold text-gold-950">Customer Inquiries Inbox</h3>
            <p className="text-xs text-gold-600 font-sans mt-0.5">Interact with story submissions, special space layout hires, and feedback dispatches.</p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`border rounded-3xl p-6 transition-all relative ${
                  msg.status === 'new' 
                    ? 'border-dew-300 bg-dew-50/20 shadow-xs' 
                    : 'border-gold-200 bg-white'
                }`}
              >
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-100/60 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-dew-700 bg-dew-100/50 px-2.5 py-1 rounded-full">
                      {msg.subject}
                    </span>
                    <h4 className="font-serif text-base font-bold text-gold-950 mt-1.5">{msg.name}</h4>
                    <span className="text-[11px] font-mono text-gold-500 font-medium block mt-0.5">{msg.email} • Received {new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-center">
                    <button
                      onClick={() => handleToggleMessageRead(msg.id)}
                      className={`text-[10px] font-mono px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        msg.status === 'new'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-205'
                          : 'bg-gold-50 text-gold-700 border-gold-200'
                      }`}
                    >
                      {msg.status === 'new' ? 'Mark Read' : 'Mark Unread'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="bg-rose-50 text-rose-600 p-2 rounded-xl hover:bg-rose-100"
                      aria-label="Delete message"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 text-xs text-gold-800 font-sans leading-relaxed">
                  <p className="whitespace-pre-line">"{msg.message}"</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-gold-950/80 backdrop-blur-sm flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[36px] max-w-3xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-gold-100">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-dew-600 font-bold block">Menu Management</span>
                <h4 className="font-serif text-2xl font-bold text-gold-950">{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h4>
                <p className="text-xs text-gold-600 mt-1 font-sans">Update pricing, availability, and image URLs for the live menu catalog.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="bg-gold-50 text-gold-900 rounded-full p-3 transition hover:bg-gold-100"
                aria-label="Close menu form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-gold-700">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Dewy Rose Affogato"
                    className="w-full bg-gold-50 border border-gold-200 rounded-3xl px-4 py-3 text-sm font-sans text-gold-950 focus:outline-none focus:ring-2 focus:ring-dew-300"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-gold-700">Price (INR)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full bg-gold-50 border border-gold-200 rounded-3xl px-4 py-3 text-sm font-sans text-gold-950 focus:outline-none focus:ring-2 focus:ring-dew-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-gold-700">Category</label>
                  <select
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value as any)}
                    className="w-full bg-gold-50 border border-gold-200 rounded-3xl px-4 py-3 text-sm font-sans text-gold-950 focus:outline-none focus:ring-2 focus:ring-dew-300"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="dessert">Dessert</option>
                    <option value="savory">Savory</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-gold-700">Subcategory</label>
                  <select
                    value={newItemSub}
                    onChange={(e) => setNewItemSub(e.target.value as any)}
                    className="w-full bg-gold-50 border border-gold-200 rounded-3xl px-4 py-3 text-sm font-sans text-gold-950 focus:outline-none focus:ring-2 focus:ring-dew-300"
                  >
                    <option value="hot">Hot</option>
                    <option value="cold">Cold</option>
                    <option value="signature">Signature</option>
                    <option value="pastry">Pastry</option>
                    <option value="cake">Cake</option>
                    <option value="plated">Plated</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-gold-700">Availability</label>
                  <div className="flex items-center space-x-3">
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newItemAvailable}
                        onChange={(e) => setNewItemAvailable(e.target.checked)}
                        className="h-4 w-4 rounded border-gold-300 text-gold-600 focus:ring-gold-500"
                      />
                      <span className="text-sm font-sans text-gold-900">Live on menu</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-mono text-[10px] uppercase tracking-widest text-gold-700">Image URL</label>
                <input
                  type="url"
                  required
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  placeholder="https://example.com/menu-image.jpg"
                  className="w-full bg-gold-50 border border-gold-200 rounded-3xl px-4 py-3 text-sm font-sans text-gold-950 focus:outline-none focus:ring-2 focus:ring-dew-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-gold-700">Description</label>
                  <textarea
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    rows={4}
                    placeholder="Describe the dish. Include taste notes and signature highlights."
                    className="w-full bg-gold-50 border border-gold-200 rounded-3xl px-4 py-3 text-sm font-sans text-gold-950 focus:outline-none focus:ring-2 focus:ring-dew-300"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-gold-700">Dietary / Caffeine</label>
                  <div className="flex flex-col gap-3">
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newItemVeg}
                        onChange={(e) => setNewItemVeg(e.target.checked)}
                        className="h-4 w-4 rounded border-gold-300 text-gold-600 focus:ring-gold-500"
                      />
                      <span className="text-sm font-sans text-gold-900">Vegetarian</span>
                    </label>
                    <select
                      value={newItemCaff}
                      onChange={(e) => setNewItemCaff(e.target.value as any)}
                      className="w-full bg-gold-50 border border-gold-200 rounded-3xl px-4 py-3 text-sm font-sans text-gold-950 focus:outline-none focus:ring-2 focus:ring-dew-300"
                    >
                      <option value="high">High Caffeine</option>
                      <option value="medium">Medium Caffeine</option>
                      <option value="low">Low Caffeine</option>
                      <option value="none">No Caffeine</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="w-full sm:w-auto border border-gold-200 text-gold-700 rounded-3xl px-4 py-3 text-sm font-semibold hover:bg-gold-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={menuSaving}
                  className="w-full sm:w-auto bg-dew-600 hover:bg-dew-700 text-white rounded-3xl px-6 py-3 text-sm font-semibold shadow transition disabled:opacity-60"
                >
                  {menuSaving ? 'Saving…' : editingMenuItem ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TABLE ASSIGNMENT SUB-MODAL FOR CONFIRMATIONS */}
      {/* ========================================================= */}
      {selectedResForTable && (
        <div className="fixed inset-0 z-50 bg-gold-950/70 backdrop-blur-sm flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-dew-600 font-bold block">Table Dispatch</span>
              <h4 className="font-serif text-lg font-bold text-gold-950">Assign Guest Table Number</h4>
              <p className="text-xs text-gold-650 leading-relaxed font-sans">
                Review guest table zone preference. Assign standard table coordinate (e.g. Table G3) to complete reservation approval.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gold-700 block uppercase font-bold">TABLE NUMBER:</label>
              <input
                type="text"
                required
                value={tempTableNumber}
                onChange={(e) => setTempTableNumber(e.target.value)}
                placeholder="E.g. Table G3"
                className="w-full bg-gold-50 border border-gold-250 p-2.5 rounded-xl text-xs font-mono font-bold text-gold-950 focus:outline-none"
              />
            </div>

            <div className="flex border-t pt-4 space-x-2">
              <button
                type="button"
                onClick={() => setSelectedResForTable(null)}
                className="flex-1 border text-gold-700 rounded-xl py-2 text-xs font-mono font-bold hover:bg-gold-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReservationWithTable}
                className="flex-1 bg-dew-600 hover:bg-dew-700 text-white rounded-xl py-2 text-xs font-mono font-bold cursor-pointer"
              >
                Approve Seat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
