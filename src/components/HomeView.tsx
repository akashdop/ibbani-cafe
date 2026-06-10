import React, { useState } from 'react';
import { Coffee, ArrowRight, Sparkles, Copy, Check, Quote, Timer, Gift, Heart } from 'lucide-react';
import { MenuItem, PromotionOffer } from '../types';

interface HomeViewProps {
  featuredItems: MenuItem[];
  activeOffers: PromotionOffer[];
  onNavigate: (view: string) => void;
}

export default function HomeView({ featuredItems, activeOffers, onNavigate }: HomeViewProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Interactive Coffee Story Mood Selection
  const [selectedMood, setSelectedMood] = useState<string>('morning');
  const moodStories = {
    morning: {
      mood: 'Monsoon Mist (Misty & Reflective)',
      quote: 'The soft drizzle outside is a reminder that some of the best moments call for patience and premium slow-dripping brews.',
      recommendation: 'Slow Cold Brew (₹169)',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'
    },
    creative: {
      mood: 'Deep Workspace (Intense & Inspired)',
      quote: 'When lines of code start to flow or ideas begin to mesh, you need an earthy, clear-minded double ristretto.',
      recommendation: 'Flat White (₹169)',
      image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600'
    },
    celebration: {
      mood: 'Sunny Rendezvous (Warm & Playful)',
      quote: 'Life is too short to skip dessert. Laugh out loud and enjoy vanilla-scoop layers melting into Coorg cocoa.',
      recommendation: 'Cold Coffee with Ice Cream (₹199) & Tiramisu (₹249)',
      image: 'https://images.unsplash.com/photo-1594911774802-8822a707c935?auto=format&fit=crop&q=80&w=600'
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-20 pb-20 fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gold-950 text-white min-h-[85vh] flex items-center pt-10 rounded-b-[40px] md:rounded-b-[60px] shadow-2xl">
        {/* Soft glowing absolute vectors simulating coffee mist */}
        <div className="absolute inset-0 bg-radial-at-t from-dew-900/40 via-gold-950/95 to-gold-950 z-0" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-dew-600/10 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gold-500/10 blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero details */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 bg-dew-100/10 text-dew-300 px-4 py-2 rounded-full border border-dew-400/20">
              <Sparkles className="h-4 w-4 animate-spin text-gold-400" />
              <span className="text-xs font-mono tracking-widest uppercase font-semibold">Bengaluru's Forest-Glass Sanctuary</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Where Every Sip <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-200 to-dew-300">
                  Tells a Story.
                </span>
              </h1>
              <p className="text-gold-100/80 text-base sm:text-lg max-w-xl font-sans font-light leading-relaxed">
                Step away from the fast-paced silicon avenues into our misty greenhouse café. 
                Savor single-estate Chikmagalur coffee brewed slowly, paired with artisanal desserts, 
                and let the world wait outside.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('menu')}
                className="bg-gold-500 hover:bg-gold-600 text-gold-950 px-8 py-3.5 rounded-full font-serif font-semibold text-base transition-all duration-300 shadow-lg transform hover:-translate-y-1 inline-flex items-center space-x-2"
              >
                <span>Explore the Brews</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onNavigate('reservations')}
                className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-8 py-3.5 rounded-full font-sans font-medium text-base transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>Reserve a Table</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-md">
              <div>
                <span className="block text-2xl md:text-3xl font-serif font-bold text-gold-300">100%</span>
                <span className="text-xs text-white/60 font-mono tracking-wider uppercase">Arabica Bean</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-serif font-bold text-gold-300">18 Hrs</span>
                <span className="text-xs text-white/60 font-mono tracking-wider uppercase">Cold Steeping</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-serif font-bold text-gold-300">Est. 2026</span>
                <span className="text-xs text-white/60 font-mono tracking-wider uppercase">Bengaluru</span>
              </div>
            </div>
          </div>

          {/* Hero Image / Premium visual card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[360px] md:max-w-none">
              {/* Stack effect */}
              <div className="absolute inset-0 bg-dew-600 rounded-[30px] rotate-3 scale-102 opacity-40 blur-sm" />
              <div className="relative rounded-[30px] overflow-hidden border-4 border-gold-900 shadow-2xl bg-gold-900 group">
                <img 
                  src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=700" 
                  alt="Ibbani Cafe Pouring Experience" 
                  className="w-full h-[450px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gold-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="text-xs font-mono text-dew-300 uppercase letter tracking-widest font-semibold block mb-1">Weekly Masterclass</span>
                  <p className="font-serif text-lg text-white font-medium italic">"Misty Dew Hand-Pour technique"</p>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white text-gold-950 px-5 py-4 rounded-2xl shadow-xl border border-gold-100 flex items-center space-x-3 max-w-[240px] text-left">
                <div className="bg-gold-100 p-2 rounded-full text-gold-600">
                  <Quote className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex text-amber-500 text-xs mb-0.5">★★★★★</div>
                  <p className="text-xs font-sans font-medium text-gold-800 leading-tight">"A peaceful greenhouse oasis in Bengaluru. Best Cold Brew ever!"</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PROMOTIONS & ANNOUNCEMENTS SECTION */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-gold-900 font-bold tracking-tight">Today’s Stories & Special Offers</h2>
            <p className="text-sm font-sans text-gold-600 mt-2">Claim curated discounts designed for standard coffee lovers and dreamers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {activeOffers.map((offer) => (
              <div 
                key={offer.id}
                className="bg-white rounded-3xl border border-gold-200/60 overflow-hidden shadow-md flex flex-col sm:flex-row h-full transition-all hover:shadow-lg"
              >
                <div className="w-full sm:w-1/3 h-48 sm:h-auto relative bg-gold-100">
                  <img 
                    src={offer.image} 
                    alt={offer.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent sm:hidden" />
                  <div className="absolute top-3 left-3 bg-dew-600 text-white text-[11px] font-mono px-2.5 py-1 rounded-full uppercase tracking-widest font-semibold">
                    Promo Offer
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div>
                    <span className="text-sm font-mono font-bold text-dew-600 tracking-wider uppercase block">{offer.discount}</span>
                    <h3 className="font-serif text-lg font-bold text-gold-900 leading-tight mt-1">{offer.title}</h3>
                    <p className="text-xs text-gold-600 leading-relaxed mt-2">{offer.description}</p>
                  </div>

                  <div className="pt-2 border-t border-gold-100 flex items-center justify-between gap-2">
                    <div className="bg-gold-50 border border-gold-200/80 rounded-xl px-3 py-1.5 flex items-center space-x-1.5 flex-1 select-all cursor-pointer group">
                      <span className="text-xs font-mono font-bold text-gold-800 tracking-wider uppercase">{offer.code}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(offer.code)}
                      className="bg-gold-900 hover:bg-gold-800 text-white text-xs font-mono px-3 py-2 rounded-xl flex items-center space-x-1 transition-all h-[34px]"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. FEATURED SPECIALTIES */}
      <section className="bg-gold-100/50 py-16 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 rounded-[50px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 text-left">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-dew-600 font-bold">Chef's Recommendations</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gold-900 mt-1">Our Signature Best Sellers</h2>
              <p className="text-sm font-sans text-gold-700 max-w-xl mt-2">
                Handpicked, crafted flawlessly, and absolute customer favorites. Taste the core delicacies that made Ibbani a Bengaluru hallmark.
              </p>
            </div>
            <button
              onClick={() => onNavigate('menu')}
              className="mt-6 md:mt-0 text-dew-600 hover:text-dew-700 font-serif font-semibold text-base flex items-center space-x-2 group-hover:translate-x-1 transition-all"
            >
              <span>View Full Menu</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-[32px] border border-gold-200/40 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group text-left h-full"
              >
                <div className="h-56 relative overflow-hidden bg-gold-200">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-dew-600/90 backdrop-blur-sm text-white text-[10px] font-mono tracking-widest font-bold px-3 py-1 rounded-full uppercase">
                    Best Seller
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-gold-900 font-mono font-bold text-sm shadow-md">
                    ₹{item.price}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-bold text-gold-950 group-hover:text-dew-600 transition-colors">
                        {item.name}
                      </h3>
                      {item.isVegetarian && (
                        <span className="w-4 h-4 border border-emerald-600 p-[2px] flex items-center justify-center rounded-[2px]" title="Vegetarian">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gold-600 font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gold-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gold-500 uppercase tracking-wider">
                      Caffeine: <strong className="text-gold-700">{item.caffeineLevel}</strong>
                    </span>
                    <button 
                      onClick={() => onNavigate('reservations')}
                      className="text-xs font-mono font-bold text-dew-600 hover:text-dew-700 flex items-center space-x-1"
                    >
                      <Heart className="h-3 w-3 fill-current text-dew-500 mr-1" />
                      <span>Order in House</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE STORY (ABOUT) SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative group text-left">
          <div className="absolute inset-0 bg-dew-600 rounded-[40px] -rotate-3 scale-98 opacity-20 blur-md" />
          <div className="relative rounded-[40px] overflow-hidden shadow-xl border-8 border-white bg-gold-200">
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" 
              alt="Cozy interior inside Ibbani Cafe glasshouse"
              className="w-full h-[400px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-6 right-6 bg-gold-950 text-white px-5 py-3 rounded-2xl flex items-center space-x-2 shadow-lg border border-white/10">
            <span className="text-xs font-mono font-semibold text-gold-300">EST. 2026 • Bengaluru</span>
          </div>
        </div>

        <div className="space-y-6 text-left">
          <span className="text-xs font-mono tracking-widest text-dew-600 font-bold uppercase">The Legend of Ibbani</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gold-900 leading-tight">
            Dewdrops, Glass Roofs, and the Art of Coffee
          </h2>
          <p className="text-sm font-sans text-gold-700 leading-relaxed">
            In Kannada, <em className="text-dew-700 font-serif font-semibold">"Ibbani"</em> translates to the morning dew—that transient moment of profound purity when moisture kisses tea and coffee buds under the early Bengaluru fog. 
          </p>
          <p className="text-sm font-sans text-gold-700 leading-relaxed">
            Founded in 2026, Ibbani Cafe emerged as a passionate dream to integrate Bengaluru’s high-tech lifestyle with its traditional coffee roots. Housed inside a geodesic conservatory glasshouse design, our cafe shelters exotic coffee varieties, lush microclimates, and space to find yourself. We slow-roast artisan beans from selected estates in Chikmagalur and handcraft signature desserts that reflect our heritage of indulgence.
          </p>
          <div className="p-4 bg-dew-100/50 rounded-2xl border-l-4 border-dew-600">
            <p className="text-xs font-sans italic text-dew-800 leading-relaxed font-semibold">
              "We do not rush. Our cold brews steep for 18 hours, our croissants proof for three days, and our conversations last as long as they need to. Our space is yours to breathe."
            </p>
          </div>
          <div>
            <button
              onClick={() => onNavigate('gallery')}
              className="bg-gold-900 hover:bg-gold-800 text-white px-6 py-3 rounded-full text-sm font-sans font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>Explore Gallery Stories</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE COFFEE STORIES MOOD ENGINE */}
      <section className="bg-dew-600 text-white py-16 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 rounded-[50px] relative overflow-hidden shadow-inner">
        {/* Absolute decorative bubbles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-dew-100/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-dew-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-dew-200 font-bold">Interactive Experience</span>
            <h2 className="font-serif text-3xl font-bold">What is your story today?</h2>
            <p className="text-sm text-dew-100 font-sans leading-relaxed max-w-lg">
              We believe that the choice of coffee should reflect your current emotional space. Click below to describe your mindset, and Ibbani's brewmaster recommends the perfect cup.
            </p>

            {/* Selector Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => setSelectedMood('morning')}
                className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all ${
                  selectedMood === 'morning'
                    ? 'bg-white text-dew-800 shadow'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                🌿 Monsoon Mist
              </button>
              <button
                onClick={() => setSelectedMood('creative')}
                className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all ${
                  selectedMood === 'creative'
                    ? 'bg-white text-dew-800 shadow'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                💻 Deep Workspace
              </button>
              <button
                onClick={() => setSelectedMood('celebration')}
                className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all ${
                  selectedMood === 'celebration'
                    ? 'bg-white text-dew-800 shadow'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                🎉 Sunny Rendezvous
              </button>
            </div>

            {/* Dynamically Loaded Story Card */}
            <div className="bg-dew-800/60 backdrop-blur-sm border border-dew-500/20 p-6 rounded-3xl space-y-4 shadow-lg">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gold-300 block font-semibold">
                Brewmaster’s Choice • {moodStories[selectedMood as keyof typeof moodStories].mood}
              </span>
              <p className="font-serif text-base italic text-dew-100 leading-relaxed">
                "{moodStories[selectedMood as keyof typeof moodStories].quote}"
              </p>
              <div className="bg-dew-950/20 p-3.5 rounded-xl border border-dew-500/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-dew-300 block font-mono uppercase">Recommending</span>
                  <span className="text-sm font-sans font-bold text-white">
                    {moodStories[selectedMood as keyof typeof moodStories].recommendation}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('menu')}
                  className="bg-gold-500 hover:bg-gold-600 text-gold-950 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors"
                >
                  Order This
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden rounded-3xl border-4 border-dew-700/60 shadow-lg">
            <img 
              src={moodStories[selectedMood as keyof typeof moodStories].image} 
              alt={moodStories[selectedMood as keyof typeof moodStories].mood}
              className="w-full h-full object-cover transition-all duration-700 transform hover:scale-103"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="bg-gold-950 text-white rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden shadow-xl max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-radial-at-b from-dew-900/60 via-transparent to-transparent opacity-80" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="text-[11px] font-mono tracking-widest text-gold-300 uppercase font-semibold block">Experience Tranquility</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold">Headed to Ibbani Cafe today?</h2>
          <p className="text-sm text-gold-100/70 font-sans max-w-md mx-auto leading-relaxed">
            Reserve your favorite table under our high-glass conservatory arches or in our mist-drenched green courtyard. Let us prepare your coffee.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('reservations')}
              className="bg-dew-600 hover:bg-dew-700 text-white px-8 py-3.5 rounded-full font-serif font-medium shadow-md transition-all inline-flex items-center space-x-2"
            >
              <span>Secure Your Seat Instantly</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}
