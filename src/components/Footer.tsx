import React, { useState } from 'react';
import { Coffee, Mail, Send, Heart, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="bg-gold-950 text-white rounded-t-[50px] overflow-hidden border-t border-white/5 relative z-10 text-left">
      <div className="absolute inset-0 bg-radial-at-b from-dew-950/40 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        
        {/* Row 1: Brand Wordmark block (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center space-x-2.5 cursor-pointer block" onClick={() => onNavigate('home')}>
            <div className="bg-dew-600 text-white p-2 rounded-full">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white block">
                Ibbani Cafe
              </span>
              <span className="block text-[8px] font-sans text-gold-400 uppercase tracking-widest font-semibold">
                Est. 2026 • Bengaluru
              </span>
            </div>
          </div>

          <p className="text-xs text-gold-150/70 leading-relaxed font-sans font-light">
            An earthy forest greenhouse nestled in Bengaluru's busiest corridors, inviting coffee purists and creators to pause, rest, and reconnect.
          </p>

          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-[9px] font-mono uppercase text-gold-400 block tracking-widest font-bold">Our Philosophy</span>
            <p className="font-serif text-sm italic text-gold-100 font-light mt-1">
              "Where Every Sip Tells a Story."
            </p>
          </div>
        </div>

        {/* Row 2: Location Quick access (3 cols) */}
        <div className="md:col-span-3 space-y-4 text-xs font-sans">
          <h4 className="font-serif text-sm font-bold text-gold-300 uppercase tracking-widest">Our Sanctuary</h4>
          
          <ul className="space-y-3 font-light text-gold-150/80">
            <li className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
              <span>
                Ibbani House, 64/A, Indiranagar, <br />
                near Metro Metro Pillar 138, <br />
                Bengaluru, KA - 560038
              </span>
            </li>
            
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gold-500 shrink-0" />
              <span className="font-mono">+91 80 4256 0038</span>
            </li>

            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gold-500 shrink-0" />
              <span className="font-mono">akashvishwanath29@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Row 3: Pages Nav (2 cols) */}
        <div className="md:col-span-2 space-y-4 text-xs">
          <h4 className="font-serif text-sm font-bold text-gold-300 uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-2.5 font-sans font-medium text-gold-150/80">
            {['Home', 'Menu', 'Gallery', 'Reservations', 'Contact'].map((pg) => (
              <li key={pg}>
                <button
                  onClick={() => onNavigate(pg.toLowerCase() === 'contact' ? 'contact' : pg.toLowerCase())}
                  className="hover:text-gold-300 transition-colors"
                >
                  {pg} {pg === 'Contact' ? 'Us' : ''}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Row 4: Newsletter Box (3 cols) */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h4 className="font-serif text-sm font-bold text-gold-300 uppercase tracking-widest">Misty Letters</h4>
          <p className="text-xs text-gold-150/70 font-sans leading-relaxed">
            Subscribe below to receive notifications on masterclasses, coffee cupping sessions, and limited seasonal roasts.
          </p>

          {subscribed ? (
            <div className="bg-dew-600 border border-dew-500 text-white rounded-xl p-3 text-xs font-sans text-center">
              ✓ Subscribed! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2 shrink-0">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="E.g.aditi@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 hover:border-white/30 text-xs font-sans text-white p-2.5 rounded-xl focus:outline-none placeholder-white/40"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-dew-600 hover:bg-dew-700 text-white p-1.5 rounded-lg transition-transform hover:scale-105"
                  aria-label="Subscribe"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      <hr className="border-white/10 my-2" />

      {/* Row 5: Fineprint credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-gold-200/50">
        <span>© 2026 Ibbani Cafe Pvt Ltd. All rights reserved. Managed in Bengaluru.</span>
        
        <span className="flex items-center space-x-1 mt-2 sm:mt-0 uppercase tracking-widest font-mono text-[9px]">
          <span>Brewed with</span>
          <Heart className="h-3 w-3 text-rose-500 fill-current mx-0.5" />
          <span>Coffee beans and dews</span>
        </span>
      </div>

    </footer>
  );
}
