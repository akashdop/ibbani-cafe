import React, { useState } from 'react';
import { Coffee, Menu as MenuIcon, X, Calendar, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  reservationsCount?: number;
  isAdminLoggedIn?: boolean;
  onAdminLogout?: () => void;
}

export default function Navbar({ 
  currentView, 
  onNavigate, 
  reservationsCount = 0,
  isAdminLoggedIn = false,
  onAdminLogout
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gold-50/90 backdrop-blur-md border-b border-gold-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleLinkClick('home')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="bg-dew-600 group-hover:bg-gold-600 text-white p-2.5 rounded-full shadow-md transition-colors duration-300">
              <Coffee className="h-6 w-6" id="logo-icon" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="font-serif text-2xl font-bold tracking-tight text-gold-900 group-hover:text-gold-700 transition-colors">
                  Ibbani
                </span>
                <span className="text-xs font-mono tracking-wider text-dew-600 font-semibold uppercase">
                  Cafe
                </span>
              </div>
              <span className="block text-[9px] font-sans text-gold-600/80 uppercase tracking-widest -mt-1 font-semibold">
                Est. 2026 • Bengaluru
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 relative ${
                  currentView === link.id
                    ? 'text-dew-700 bg-dew-100/80 scale-105'
                    : 'text-gold-900/80 hover:text-dew-600 hover:bg-gold-100/50'
                }`}
              >
                {link.label}
                {currentView === link.id && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-dew-600" />
                )}
              </button>
            ))}

            <div className="w-[1px] h-6 bg-gold-200/80 mx-2" />

            {isAdminLoggedIn && onAdminLogout ? (
              <button
                onClick={onAdminLogout}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-sans text-sm font-medium transition-all duration-350 text-rose-700 bg-rose-100/50 hover:bg-rose-200 hover:text-rose-950"
                title="Logout from admin"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            ) : null}
          </div>

          {/* Call to action & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleLinkClick('reservations')}
              className="hidden sm:inline-flex items-center space-x-2 bg-dew-600 hover:bg-dew-700 text-white px-5 py-2.5 rounded-full font-serif font-medium text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Table</span>
            </button>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-gold-900/80 hover:bg-gold-100 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" id="menu-close" />
              ) : (
                <MenuIcon className="h-6 w-6" id="menu-open" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-350 ease-in-out bg-gold-50/95 border-b border-gold-200/50 ${
          isOpen ? 'max-h-[380px] opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 space-y-2 pb-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`block w-full text-left px-5.5 py-2.5 rounded-xl font-sans text-base font-medium transition-all ${
                currentView === link.id
                  ? 'bg-dew-600 text-white shadow-sm'
                  : 'text-gold-950 hover:bg-gold-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <hr className="border-gold-200/60 my-2" />
          
          {isAdminLoggedIn && onAdminLogout ? (
            <button
              onClick={onAdminLogout}
              className="flex items-center justify-between w-full px-5.5 py-2.5 rounded-xl font-sans text-base font-medium transition-all text-rose-700 bg-rose-100/50 hover:bg-rose-200"
            >
              <span className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout Admin</span>
              </span>
            </button>
          ) : null}

          <button
            onClick={() => handleLinkClick('reservations')}
            className="w-full flex items-center justify-center space-x-2 bg-dew-600 hover:bg-dew-700 text-white py-3 rounded-xl font-serif text-sm font-medium shadow"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Table • 5 Secs</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
