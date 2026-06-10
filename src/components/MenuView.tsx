import React, { useState } from 'react';
import { Search, SlidersHorizontal, Eye, X, Coffee, Clock, Sparkles, Filter, Leaf, Heart } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuViewProps {
  menuItems: MenuItem[];
  onNavigate: (view: string) => void;
}

export default function MenuView({ menuItems, onNavigate }: MenuViewProps) {
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [isGlutenFreeOnly, setIsGlutenFreeOnly] = useState<boolean>(false);
  const [selectedCaffeine, setSelectedCaffeine] = useState<string>('all');
  
  // Modal State
  const [activeDetailedItem, setActiveDetailedItem] = useState<MenuItem | null>(null);

  // Map Filter IDs to clean UI categories
  const categoryFilters = [
    { id: 'all', label: '📖 Complete Menu' },
    { id: 'hot', label: '☕ Hot Coffees' },
    { id: 'cold', label: '🧊 Chilled Coffee' },
    { id: 'dessert', label: '🍰 Plated Desserts' },
    { id: 'savory', label: '🥐 Artisanal Savory' },
  ];

  // Filtering Logic
  const filteredItems = menuItems.filter((item) => {
    // 1. Matches Category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'hot' && item.subCategory !== 'hot') return false;
      if (selectedCategory === 'cold' && item.subCategory !== 'cold' && item.subCategory !== 'signature') return false;
      if (selectedCategory === 'dessert' && item.category !== 'dessert') return false;
      if (selectedCategory === 'savory' && item.category !== 'savory') return false;
    }

    // 2. Matches Search
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesDesc = item.description.toLowerCase().includes(query);
      if (!matchesName && !matchesDesc) return false;
    }

    // 3. Matches Dietary Checkboxes
    if (isVegOnly && !item.isVegetarian) return false;
    if (isGlutenFreeOnly && item.isGlutenFree === false) return false;

    // 4. Matches Caffeine Filter
    if (selectedCaffeine !== 'all' && item.caffeineLevel !== selectedCaffeine) return false;

    return true;
  });

  const getCaffeineStrengthColor = (level?: string) => {
    switch (level) {
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-300';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default: return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  return (
    <div className="space-y-12 pb-24 fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* 1. HEADER HERO */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-dew-600 font-bold bg-dew-100 px-3 py-1.5 rounded-full inline-block">
          Bengaluru’s Brew Bible
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold-950 tracking-tight leading-tight">
          Sip, Savor & Reconnect
        </h1>
        <p className="text-sm font-sans text-gold-700 leading-relaxed">
          From full-bodied handpress espressos to slow-drilled overnight cold drips and gold-baked butter pastries. Every recipe carries a slice of our heritage.
        </p>
      </div>

      {/* 2. FILTERS AND SELECTION SYSTEM */}
      <div className="bg-white rounded-[32px] border border-gold-200/50 p-6 md:p-8 shadow-md space-y-6 text-left">
        
        {/* Search & Caffeine selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gold-500/70" />
            <input
              type="text"
              placeholder="Search by specialty name (e.g. Tiramisu, Latte, Flat White)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gold-50/50 hover:bg-gold-50 focus:bg-white text-gold-950 border border-gold-200 focus:border-dew-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-sans placeholder-gold-500/60 focus:outline-none focus:ring-2 focus:ring-dew-500/20 transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-4 top-4 hover:bg-gold-200 p-0.5 rounded-full text-gold-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Caffeine Multi-choice */}
          <div className="md:col-span-4 flex items-center space-x-3 bg-gold-50/50 border border-gold-200 rounded-2xl px-4 py-1.5">
            <span className="text-xs font-mono text-gold-700 shrink-0 font-bold uppercase">Caffeine:</span>
            <div className="flex bg-gold-200/50 p-1 rounded-xl w-full">
              {['all', 'high', 'medium', 'none'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedCaffeine(level)}
                  className={`text-[10px] font-sans font-bold capitalize py-1.5 px-2.5 rounded-lg flex-1 transition-all ${
                    selectedCaffeine === level
                      ? 'bg-gold-900 text-white shadow-sm'
                      : 'text-gold-800 hover:bg-gold-200'
                  }`}
                >
                  {level === 'none' ? 'zero' : level}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Filters Button */}
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setIsVegOnly(false);
                setIsGlutenFreeOnly(false);
                setSelectedCaffeine('all');
              }}
              className="w-full h-full text-xs font-mono font-bold text-gold-700 hover:text-gold-950 hover:bg-gold-100 border border-gold-200 py-3.5 rounded-2xl transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Categories Scroller row */}
        <div className="border-t border-gold-100 pt-6 flex flex-wrap gap-2 items-center justify-start">
          <span className="text-xs font-mono font-bold text-gold-600 tracking-wider uppercase mr-2 flex items-center">
            <Filter className="h-3 w-3 mr-1" /> Category:
          </span>
          <div className="flex flex-wrap gap-2 items-center">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl font-sans text-xs font-medium transition-all transform hover:-translate-y-0.2 active:translate-y-0 ${
                  selectedCategory === cat.id
                    ? 'bg-dew-600 text-white shadow shadow-dew-600/30 font-semibold'
                    : 'bg-gold-100 text-gold-850 hover:bg-gold-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Checkbox Toggles */}
        <div className="pt-2 border-t border-gold-100/60 flex flex-wrap gap-4 items-center">
          <span className="text-xs font-mono font-bold text-gold-600 tracking-wider uppercase mr-1">
            Preferences Choices:
          </span>
          
          <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none group bg-emerald-50 hover:bg-emerald-100/50 border border-emerald-100 px-3.5 py-1.5 rounded-full transition-colors font-sans text-xs">
            <input
              type="checkbox"
              checked={isVegOnly}
              onChange={(e) => setIsVegOnly(e.target.checked)}
              className="rounded-full border-emerald-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <span className="text-emerald-800 font-semibold flex items-center">
              <Leaf className="h-3 w-3 mr-1 text-emerald-600 fill-current" /> Vegetarian (Green dot)
            </span>
          </label>

          <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none group bg-amber-50 hover:bg-amber-100/50 border border-amber-100 px-3.5 py-1.5 rounded-full transition-colors font-sans text-xs">
            <input
              type="checkbox"
              checked={isGlutenFreeOnly}
              onChange={(e) => setIsGlutenFreeOnly(e.target.checked)}
              className="rounded-full border-amber-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
            />
            <span className="text-amber-800 font-semibold">
              🌾 Gluten-Free (GF) Only
            </span>
          </label>
        </div>

      </div>

      {/* 3. MENU RESULTS COUNTER */}
      <div className="flex items-center justify-between text-left">
        <p className="text-xs font-mono text-gold-600">
          Showing <span className="font-bold text-gold-950">{filteredItems.length}</span> specialties of {menuItems.length}
        </p>
        {filteredItems.length === 0 && (
          <span className="text-xs text-rose-500 font-medium">Try resetting your queries above.</span>
        )}
      </div>

      {/* 4. SELECTION CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[32px] border border-gold-200/40 relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group text-left h-full"
          >
            {/* Header image background */}
            <div className="h-52 relative overflow-hidden bg-gold-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Best Seller ribbon */}
              {item.isBestSeller && (
                <div className="absolute top-4 left-4 bg-dew-600 hover:bg-dew-700 text-white font-mono text-[9px] tracking-widest font-bold px-2.5 py-1 rounded-full uppercase shadow">
                  ★ Best Seller
                </div>
              )}

              {/* Dietary markers */}
              <div className="absolute top-4 right-4 flex items-center space-x-1">
                {item.isVegetarian && (
                  <span className="bg-white/95 backdrop-blur-sm shadow p-1 rounded-full border border-emerald-200" title="Vegetarian">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600 fill-current" />
                  </span>
                )}
                {item.isGlutenFree && (
                  <span className="bg-white/95 backdrop-blur-sm shadow px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-amber-700 border border-amber-200" title="Gluten Free">
                    GF
                  </span>
                )}
              </div>

              {/* Float pricing */}
              <div className="absolute bottom-4 right-4 bg-gold-950 text-gold-100 text-sm font-mono font-bold px-3 py-1 rounded-full shadow-lg">
                ₹{item.price}
              </div>
            </div>

            {/* Core Info */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-500 font-bold block">
                  {item.category} • {item.subCategory}
                </span>
                <h3 className="font-serif text-lg font-bold text-gold-950 group-hover:text-dew-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-gold-600 leading-relaxed font-sans line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Footer interactive choices */}
              <div className="pt-4 border-t border-gold-100/80 flex items-center justify-between">
                <button
                  onClick={() => setActiveDetailedItem(item)}
                  className="bg-gold-50 hover:bg-gold-100 text-gold-800 hover:text-gold-950 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all inline-flex items-center space-x-1"
                >
                  <Eye className="h-3 w-3" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => onNavigate('reservations')}
                  className="bg-transparent hover:bg-dew-50 text-dew-700 px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all inline-flex items-center space-x-1"
                >
                  <span>Order</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. FULL SCREEN ITEM STORY DETAILED MODAL */}
      {activeDetailedItem && (
        <div className="fixed inset-0 z-50 bg-gold-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[36px] max-w-2xl w-full overflow-hidden shadow-2xl border border-gold-200/80 max-h-[90vh] flex flex-col scrollbar-thin text-left">
            
            {/* Header image banner */}
            <div className="h-64 relative bg-gold-100 shrink-0">
              <img
                src={activeDetailedItem.image}
                alt={activeDetailedItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gold-950/80 via-black/20 to-transparent" />
              
              <button
                onClick={() => setActiveDetailedItem(null)}
                className="absolute top-4 right-4 bg-gold-950/80 hover:bg-gold-950 text-white rounded-full p-2 border border-white/20 hover:scale-105 transition-all"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-6 left-6 text-white text-left">
                <span className="text-xs font-mono font-bold text-gold-300 uppercase tracking-widest block mb-1">
                  {activeDetailedItem.category} • {activeDetailedItem.subCategory}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                  {activeDetailedItem.name}
                </h2>
              </div>

              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur shadow-md px-4 py-1.5 rounded-full text-gold-950 font-mono font-bold text-base">
                ₹{activeDetailedItem.price}
              </div>
            </div>

            {/* Scrollable details */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              
              {/* Recipe narrative (Where every sip tells a story) */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-dew-600 tracking-wider flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> Recipe Legend & Story
                </span>
                <p className="font-serif text-base italic text-gold-800 bg-gold-50/70 rounded-2xl p-4 border-l-4 border-gold-300 leading-relaxed">
                  "At Ibbani, {activeDetailedItem.description}"
                </p>
              </div>

              {/* Profiles - Caffeine, Ingredients, Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gold-100">
                
                {/* Visual caffeine indicator */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase font-bold text-gold-550 block">Origin Brew Profile</span>
                  <div className="bg-gold-50/50 border border-gold-150 p-4 rounded-2xl flex flex-col justify-center space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-gold-700 font-medium">Caffeine Intensity</span>
                      <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border ${getCaffeineStrengthColor(activeDetailedItem.caffeineLevel)}`}>
                        {activeDetailedItem.caffeineLevel || 'none'}
                      </span>
                    </div>

                    {/* Fun progress bar representation */}
                    <div className="w-full bg-gold-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          activeDetailedItem.caffeineLevel === 'high' ? 'bg-rose-500 w-[100%]' :
                          activeDetailedItem.caffeineLevel === 'medium' ? 'bg-amber-500 w-[60%]' :
                          activeDetailedItem.caffeineLevel === 'low' ? 'bg-emerald-500 w-[20%]' : 'bg-slate-300 w-0'
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Dietary details */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase font-bold text-gold-550 block">Dietary & Allergens Choices</span>
                  <div className="bg-gold-50/50 border border-gold-150 p-4 rounded-2xl flex flex-wrap gap-2.5 items-center h-[76px]">
                    <span className={`text-xs font-sans font-medium px-3 py-1 rounded-full flex items-center ${
                      activeDetailedItem.isVegetarian ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}>
                      {activeDetailedItem.isVegetarian ? '✓ 100% Vegetarian (Pure Veg)' : 'Contains Eggs/Gelato'}
                    </span>
                    <span className={`text-xs font-sans font-medium px-3 py-1 rounded-full flex items-center ${
                      activeDetailedItem.isGlutenFree ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {activeDetailedItem.isGlutenFree ? '🌾 Gluten-Free friendly' : 'Contains Gluten crust'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Recommended Pairings */}
              <div className="pt-4 border-t border-gold-100 space-y-3">
                <span className="text-xs font-mono uppercase font-bold text-gold-550 block">Serving & Pairing Suggestions</span>
                <div className="bg-dew-50/50 p-4 rounded-2xl border border-dew-100 text-sm font-sans text-dew-900 leading-relaxed">
                  Best enjoyed sitting in our <strong className="text-dew-700">Green Courtyard</strong> during early evening hours. We recommend pairing this specialty with standard hand-kneaded shortbread or our premium butter croissants.
                </div>
              </div>

            </div>

            {/* Modal action bar footer */}
            <div className="p-6 border-t border-gold-100 bg-gold-50/30 flex justify-end space-x-3 shrink-0">
              <button
                onClick={() => setActiveDetailedItem(null)}
                className="bg-transparent hover:bg-gold-100 text-gold-800 px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  setActiveDetailedItem(null);
                  onNavigate('reservations');
                }}
                className="bg-dew-600 hover:bg-dew-700 text-white px-6 py-2.5 rounded-full text-xs font-serif font-bold tracking-wide shadow transition-all transform hover:-translate-y-0.2"
              >
                Book Table to Experience
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
  