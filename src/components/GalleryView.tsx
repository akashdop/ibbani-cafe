import React, { useState } from 'react';
import { Image as ImageIcon, Camera, Eye, X, BookOpen, Heart, Compass } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryViewProps {
  galleryItems: GalleryItem[];
}

export default function GalleryView({ galleryItems }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: '📷 All Frames' },
    { id: 'coffee', label: '☕ Espresso Art' },
    { id: 'desserts', label: '🥐 Gold Pastries' },
    { id: 'atmosphere', label: '🌿 Misty Glasshouse' },
    { id: 'brewing', label: '🔬 Slow Chemistry' }
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening lightbox on hit
    setLikedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-12 pb-24 fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* 1. HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-dew-600 font-bold bg-dew-100 px-3 py-1.5 rounded-full inline-block">
          An Editorial Photo Journal
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold-950 tracking-tight leading-tight">
          Where Every Sip Tells a Story
        </h1>
        <p className="text-sm font-sans text-gold-700 leading-relaxed">
          Step into our visual diaries. Capturing misty early mornings in Bengaluru, Chikmagalur plantations, bubbling nitro brews, and the smiles that light up our corner.
        </p>
      </div>

      {/* 2. CATEGORIES FILTER BAR ROW */}
      <div className="flex flex-wrap gap-2.5 justify-center border-b border-gold-200/50 pb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-2xl font-sans text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-gold-900 text-white shadow font-semibold'
                : 'bg-white hover:bg-gold-100 text-gold-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. BENTO GALLERY GRID FRAME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[250px]">
        {filteredItems.map((item, index) => {
          // Create an alternating rich editorial grid with different weights
          const isLarge = index % 5 === 0 || index % 7 === 0;
          const isTall = index % 3 === 0;

          return (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className={`bg-white rounded-3xl border border-gold-200/40 overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-lg transition-all duration-350 flex flex-col justify-end ${
                isLarge ? 'md:col-span-2 md:row-span-2' : isTall ? 'md:row-span-2' : ''
              }`}
            >
              {/* Dynamic Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                referrerPolicy="no-referrer"
              />

              {/* Shading gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-gold-950 via-black/10 to-black/25 opacity-70 group-hover:opacity-85 transition-opacity" />

              {/* On-Hover Action Panel */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => toggleLike(item.id, e)}
                  className={`p-2 rounded-full border shadow backdrop-blur-sm transition-all hover:scale-110 ${
                    likedItems[item.id]
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white/90 text-gold-800 hover:text-rose-500'
                  }`}
                  aria-label="Like story frame"
                >
                  <Heart className={`h-3.5 w-3.5 ${likedItems[item.id] ? 'fill-current' : ''}`} />
                </button>
                <div className="bg-white/90 text-gold-900 shadow rounded-full p-2 border border-gold-200">
                  <Eye className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Item category bubble (top) */}
              <span className="absolute top-4 left-4 text-[9px] font-mono font-bold uppercase py-1 px-2.5 rounded-full bg-dew-600 border border-dew-500 text-white tracking-widest leading-none shadow">
                {item.category}
              </span>

              {/* Visual story text */}
              <div className="relative p-6 space-y-2 text-left text-white z-10 pointer-events-none">
                <h3 className="font-serif text-lg md:text-xl font-bold leading-tight group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gold-100/80 font-sans line-clamp-2 md:line-clamp-3">
                  {item.description}
                </p>
                <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-gold-300 tracking-wider">
                  <BookOpen className="h-3 w-3" />
                  <span>Read full bio</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. METRICS / EXPLORE BANNER */}
      <section className="bg-gold-100 rounded-3xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between text-left gap-6 shadow-sm border border-gold-200/50">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2 text-dew-700">
            <Compass className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">Our Open Invitation</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-gold-950">Do you have a story chunk to submit?</h3>
          <p className="text-xs text-gold-700 leading-relaxed max-w-xl">
            We regularly select stories we hear in-house to document on our photo journals. If you have an inspiring meeting, an accidental artwork sketched under our glass dome, or standard sunset memory, share it on our contact page.
          </p>
        </div>
        <div className="shrink-0 flex items-center">
          <span className="text-xs font-mono font-bold text-gold-600 bg-white/80 border border-gold-200 px-4 py-2.5 rounded-2xl block shadow-sm">
            🌾 Submit via "Contact Us" Tab
          </span>
        </div>
      </section>

      {/* 5. LIGHTBOX MODAL */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 bg-gold-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-3xl w-full overflow-hidden shadow-2xl border border-gold-200 flex flex-col md:flex-row text-left max-h-[90vh]">
            
            {/* Left Image block */}
            <div className="w-full md:w-[50%] h-64 md:h-auto bg-black relative">
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActiveLightboxItem(null)}
                className="absolute top-4 left-4 bg-gold-950/80 hover:bg-gold-950 text-white rounded-full p-2 border border-white/20 hover:scale-105 transition-all md:hidden"
                aria-label="Close Lightbox"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Right Story details block */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-dew-600 uppercase tracking-widest">
                    Photo Story • {activeLightboxItem.category}
                  </span>
                  
                  {/* Close button for desktop */}
                  <button
                    onClick={() => setActiveLightboxItem(null)}
                    className="hidden md:block bg-gold-50 hover:bg-gold-100 text-gold-900 rounded-full p-2 border border-gold-150 transition-all hover:scale-105"
                    aria-label="Close details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <hr className="border-gold-100 my-4" />

                <h3 className="font-serif text-2xl font-bold text-gold-950 leading-tight">
                  {activeLightboxItem.title}
                </h3>

                <p className="text-sm text-gold-700 leading-relaxed font-sans mt-4">
                  {activeLightboxItem.description}
                </p>

                <div className="p-4 bg-gold-50 border border-gold-200/85 rounded-2xl text-xs font-sans text-gold-600 leading-relaxed mt-4 italic">
                  "Every frame we capture tells a simple human truth. We believe in providing spaces where people disconnect from the server and connect with their soul."
                </div>
              </div>

              {/* Footer specs */}
              <div className="pt-4 border-t border-gold-100 flex items-center justify-between text-xs shrink-0 bg-white">
                <span className="font-mono text-gold-500 font-semibold tracking-wider">
                  Shot in Bengaluru 
                </span>
                
                <button
                  onClick={() => setActiveLightboxItem(null)}
                  className="bg-gold-900 hover:bg-gold-800 text-white font-mono px-4 py-2 rounded-xl text-xs"
                >
                  Return to Journal
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
