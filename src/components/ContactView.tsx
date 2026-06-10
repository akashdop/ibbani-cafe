import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, CheckSquare, Sparkles, Navigation, Globe, Smile, AlertCircle } from 'lucide-react';
import { FeedbackMessage } from '../types';

interface ContactViewProps {
  onAddMessage: (message: Omit<FeedbackMessage, 'id' | 'createdAt' | 'status'>) => void;
}

export default function ContactView({ onAddMessage }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('opinion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Map starting coordinates for transit directions
  const [startPoint, setStartPoint] = useState('koramangala');
  const routesInfo = {
    koramangala: { dist: '7.8 km', duration: '22 mins', directions: 'Head North past Indiranagar 100ft road. Turn left at the misty glass dome.' },
    whitefield: { dist: '16.4 km', duration: '45 mins', directions: 'Take Outer Ring Rd towards K.R. Puram, exit near Indiranagar, follow dewy botanical signs.' },
    airport: { dist: '38.2 km', duration: '65 mins', directions: 'Take Hebbal Flyover south. Continue past Cubbon park onto our quiet conservatory lane.' }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    // Call state seed to push message into admin feed
    onAddMessage({
      name,
      email,
      subject: subject === 'story' ? 'Dewy Coffee Story Submission' : subject === 'hire' ? 'Event Space Hiring Inquiry' : 'General Café Feedback',
      message
    });

    setSubmitted(true);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="space-y-16 pb-24 fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* 1. HEADER HERO */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-dew-600 font-bold bg-dew-100 px-3 py-1.5 rounded-full inline-block">
          Let’s Form a Connection
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold-950 tracking-tight leading-tight">
          Contact Us & Submit Stories
        </h1>
        <p className="text-sm font-sans text-gold-750 leading-relaxed">
          Have an inquiry about hosting an event inside our glass sanctuary? Or perhaps a coffee-inspired piece of writing to share? We read every journal record.
        </p>
      </div>

      {/* 2. CONTACT DETAILS & FORMS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        
        {/* Left: Contact Info grid card (5 cols) */}
        <div className="lg:col-span-5 space-y-8 bg-gold-950 text-white p-8 rounded-[36px] relative overflow-hidden shadow-xl border border-white/5">
          {/* Suttle mist circles */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-dew-600/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-2 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />

          <div className="space-y-4 relative z-10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gold-300 font-bold">The Head Office</span>
            <h3 className="font-serif text-2xl font-bold">Ibbani Greenhouse Sanctuary</h3>
            <p className="text-xs text-gold-100/60 leading-relaxed font-sans">
              Located in the heart of Bengaluru's botanical boulevard, our geodesic dome houses tropical flora, coffee research apparatus, and warm seating arches.
            </p>
          </div>

          <hr className="border-white/10 relative z-10" />

          <div className="space-y-6 relative z-10 text-sm font-sans">
            
            {/* Address */}
            <div className="flex items-start space-x-3.5">
              <div className="bg-white/10 p-2.5 rounded-xl text-gold-300 border border-white/10 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-bold text-gold-200">Our Address</span>
                <p className="text-xs text-gold-100/70 mt-1leading-relaxed">
                  Ibbani House, 64/A, Misty Glass Arches Road, <br />
                  Stage 2, Indiranagar, near Metro, <br />
                  Bengaluru, Karnataka - 560038
                </p>
              </div>
            </div>

            {/* Hotlines */}
            <div className="flex items-start space-x-3.5">
              <div className="bg-white/10 p-2.5 rounded-xl text-gold-300 border border-white/10 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-bold text-gold-200">Say Hello / Book Group events</span>
                <p className="text-xs text-gold-100/70 mt-1 leading-normal font-mono">
                  General: +91 80 4256 0038 <br />
                  Events: +91 99000 89256
                </p>
              </div>
            </div>

            {/* Email letters */}
            <div className="flex items-start space-x-3.5">
              <div className="bg-white/10 p-2.5 rounded-xl text-gold-300 border border-white/10 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-bold text-gold-200">Corporate & Inquiries Box</span>
                <p className="text-xs text-gold-100/70 mt-1 leading-normal font-mono">
                  Journal: brews@ibbanicafe.com <br />
                  Careers: team@ibbanicafe.com
                </p>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start space-x-3.5">
              <div className="bg-white/10 p-2.5 rounded-xl text-gold-300 border border-white/10 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-bold text-gold-200">Open Hours Schedule</span>
                <p className="text-xs text-gold-100/70 mt-1 leading-normal">
                  Everyday: 8:00 AM – 10:30 PM <br />
                  Monsoon morning hours: 7:30 AM early opening <br />
                </p>
              </div>
            </div>

          </div>

          <hr className="border-white/10 relative z-10" />

          {/* Social icons */}
          <div className="relative z-10 text-xs">
            <span className="block text-gold-300 text-[10px] font-mono uppercase tracking-wider mb-2">Connect in the mist:</span>
            <div className="flex space-x-2">
              {['Instagram', 'Twitter', 'CoffeeUnion', 'Facebook'].map((social) => (
                <span 
                  key={social}
                  className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-[9px] hover:bg-white/10 cursor-pointer text-gold-100 transition-colors"
                >
                  #{social}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Submission Form card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[36px] border border-gold-200/50 p-6 md:p-8 shadow-md">
          {submitted ? (
            <div className="py-12 text-center space-y-6">
              <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 w-16 h-16 flex items-center justify-center mx-auto">
                <CheckSquare className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-gold-950">Message Sent Successfully!</h3>
                <p className="text-xs text-gold-700 max-w-sm mx-auto font-sans">
                  Thank you for submitting your enquiry. We have routed your record directly to our **Admin Desk Messages feed**.
                </p>
              </div>
              <button
                type="button"
                className="bg-gold-950 hover:bg-gold-900 text-white font-mono text-xs font-bold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
                onClick={handleResetForm}
              >
                Send Another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-mono text-dew-600 uppercase tracking-widest font-bold">Feedback Dispatch</span>
                <h3 className="font-serif text-xl font-bold text-gold-950">Inquire or Submit Your Story</h3>
              </div>

              {/* Name and Email input row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-700 tracking-wider uppercase block">Your Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Priya Sharma"
                    value={name}
                    id="feedback-name-field"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 focus:border-dew-500 rounded-xl px-3.5 py-2.5 text-xs text-gold-950 focus:outline-none focus:ring-1 focus:ring-dew-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-700 tracking-wider uppercase block">Email Address:</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g. priya@gmail.com"
                    value={email}
                    id="feedback-email-field"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 focus:border-dew-500 rounded-xl px-3.5 py-2.5 text-xs text-gold-950 focus:outline-none focus:ring-1 focus:ring-dew-500/20"
                  />
                </div>
              </div>

              {/* Inquiry Reason Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gold-700 tracking-wider uppercase block">Reason for Contact:</label>
                <div className="flex bg-gold-50 border border-gold-200 p-1 rounded-xl justify-around items-center h-[38px]">
                  {[
                    { id: 'opinion', label: '💭 general feedback' },
                    { id: 'story', label: '📖 submit a story' },
                    { id: 'hire', label: '🏰 space hiring/event' }
                  ].map((sub) => (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => setSubject(sub.id)}
                      className={`text-[10px] font-sans font-bold py-1.5 px-3 rounded-lg flex-1 transition-all ${
                        subject === sub.id
                          ? 'bg-gold-900 text-white shadow-sm'
                          : 'text-gold-800 hover:bg-gold-200'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message text area */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gold-700 tracking-wider uppercase block">Message body or story manuscript:</label>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  placeholder={
                    subject === 'story' 
                      ? 'Write your beautiful narrative piece of caffeine moments or sketchbook interactions here...' 
                      : 'How can we help you? What is your team dreaming up?'
                  }
                  value={message}
                  id="feedback-message-field"
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gold-50/50 border border-gold-200 focus:border-dew-500 rounded-xl p-3.5 text-xs text-gold-950 focus:outline-none focus:ring-1 focus:ring-dew-500/20 placeholder-gold-500/50"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-dew-600 hover:bg-dew-700 text-white p-3.5 rounded-2xl font-serif font-bold text-sm tracking-wide shadow flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Dispatch to Admin Log Desk</span>
              </button>

            </form>
          )}
        </div>

      </div>

      {/* 3. INTERACTIVE CUSTOM MAP COMPONENT */}
      <section className="bg-white rounded-[36px] border border-gold-200/50 p-6 md:p-8 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Map info */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-dew-600 font-bold block">Interactive Navigation</span>
              <h3 className="font-serif text-2xl font-bold text-gold-950">Visual Map of our sanctuary</h3>
              <p className="text-xs text-gold-750 leading-relaxed font-sans">
                Due to typical iframe limitations, we built a beautiful vector-mapped compass of **Bengaluru**. Pinpoint where we roast and steep.
              </p>
            </div>

            <div className="bg-gold-50 p-4 rounded-2xl border border-gold-150 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-gold-500 font-bold uppercase block">Directions Engine:</span>
                <div className="flex bg-gold-200/50 p-1 rounded-xl">
                  {['koramangala', 'whitefield', 'airport'].map((pt) => (
                    <button
                      key={pt}
                      onClick={() => setStartPoint(pt)}
                      className={`text-[9px] font-mono uppercase font-bold py-1 px-2.5 rounded-lg flex-1 capitalize transition-all ${
                        startPoint === pt ? 'bg-gold-900 text-white shadow-xs' : 'text-gold-700 hover:bg-gold-200'
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-gold-500">EST DISTANCE:</span>
                  <span className="font-bold text-gold-950">{routesInfo[startPoint as keyof typeof routesInfo].dist}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-gold-500">EST TIME TRAFFIC:</span>
                  <span className="font-bold text-dew-700">{routesInfo[startPoint as keyof typeof routesInfo].duration}</span>
                </div>
                <p className="text-[11px] text-gold-800 leading-normal border-t pt-2 border-gold-200/60 font-sans italic">
                  <strong>Path:</strong> {routesInfo[startPoint as keyof typeof routesInfo].directions}
                </p>
              </div>
            </div>
            
            <span className="text-[10px] text-gold-550 border border-dashed border-gold-200 px-3 py-1.5 rounded-lg flex items-center font-mono">
              <Navigation className="h-4 w-4 mr-1 text-gold-500 animate-spin" /> GPS: 12.9716° N, 77.5946° E (Metro Pillar 138-Right)
            </span>
          </div>

          {/* Styled Vector Map (7 cols) */}
          <div className="lg:col-span-7 h-80 bg-dew-100 rounded-[28px] overflow-hidden border border-gold-200 relative shadow-inner">
            
            {/* Custom SVG Map Grid with landmarks, roads, and active dewy style */}
            <svg className="w-full h-full text-dew-800" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#e2ece7" />
              
              {/* Grid Lines representing high-tech layout */}
              <path d="M 0,50 L 500,50 M 0,100 L 500,100 M 0,150 L 500,150 M 0,200 L 500,200 M 0,250 L 500,250" stroke="#c0daca" strokeWidth="0.5" strokeDasharray="3,3" />
              <path d="M 100,0 L 100,300 M 200,0 L 200,300 M 300,0 L 300,300 M 400,0 L 400,300" stroke="#c0daca" strokeWidth="0.5" strokeDasharray="3,3" />

              {/* Major Ring Roads */}
              <path d="M 50,0 C 150,120 300,180 500,220" stroke="#a7bfb2" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 0,250 C 180,240 320,130 350,0" stroke="#a7bfb2" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 50,300 L 450,0" stroke="#9bb6a7" strokeWidth="1.5" fill="none" />

              {/* Metro Line (Purple Representation) */}
              <path d="M 0,140 L 500,140" stroke="#aa7cb5" strokeWidth="4" strokeDasharray="6,4" fill="none" />

              {/* Lake representation (Ulsoor water) */}
              <circle cx="410" cy="80" r="30" fill="#a6c8b9" opacity="0.6" stroke="#87af9e" strokeWidth="1" />
              <text x="410" y="84" fill="#325244" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">ULSOOR LAKE</text>

              {/* Cubbon Park represent */}
              <rect x="80" y="60" width="80" height="50" rx="10" fill="#8cb59a" opacity="0.6" stroke="#669c78" />
              <text x="120" y="88" fill="#245133" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">CUBBON PARK</text>

              {/* Indiranagar 100ft road indicator */}
              <text x="320" y="210" fill="#4a675b" fontSize="8" fontFamily="monospace" transform="rotate(-15, 320, 210)" fontWeight="semibold">INDIRANAGAR 100FT RD</text>

              {/* Bouncing Pointer Spot represent: Ibbani Cafe */}
              <g className="animate-bounce">
                {/* Outter glowing dew circles */}
                <circle cx="280" cy="140" r="28" fill="#cca053" opacity="0.12" />
                <circle cx="280" cy="140" r="16" fill="#cca053" opacity="0.25" />
                <circle cx="280" cy="140" r="6" fill="#936224" />
                
                {/* Location Icon vector */}
                <path d="M 280,140 L 280,124" stroke="#553313" strokeWidth="3" strokeLinecap="round" />
                <circle cx="280" cy="120" r="8" fill="#b48135" stroke="#211105" strokeWidth="1.5" />
                <circle cx="280" cy="120" r="3" fill="#ffffff" />
              </g>

              {/* Core Pin Flag Label */}
              <rect x="290" y="105" width="90" height="25" rx="6" fill="#211105" stroke="#ffffff" strokeWidth="1" />
              <text x="335" y="118" fill="#dfc187" fontSize="8" fontFamily="serif" textAnchor="middle" fontWeight="bold">IBBANI CAFE</text>
              <text x="335" y="126" fill="#e2ece7" fontSize="6" fontFamily="sans-serif" textAnchor="middle">★ Metro Arc Pillar 138</text>

              {/* Direction compass graphic at bottom left */}
              <circle cx="40" cy="260" r="15" fill="#f2f7f5" stroke="#a7bfb2" />
              <line x1="40" y1="248" x2="40" y2="272" stroke="#553313" strokeWidth="1.5" />
              <line x1="28" y1="260" x2="52" y2="260" stroke="#553313" strokeWidth="1.5" />
              <text x="40" y="246" fill="#553313" fontSize="7" fontWeight="bold" textAnchor="middle">N</text>

            </svg>

            {/* Float HUD banner */}
            <div className="absolute bottom-4 left-4 right-4 bg-gold-950/90 text-white rounded-xl p-2.5 backdrop-blur-xs flex items-center justify-between text-xs">
              <span className="font-mono text-gold-300">Live Directions:</span>
              <span className="font-sans font-bold capitalize">From {startPoint} ({routesInfo[startPoint as keyof typeof routesInfo].dist})</span>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
