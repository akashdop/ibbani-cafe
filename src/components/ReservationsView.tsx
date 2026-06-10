import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Calendar, Clock, Users, ArrowRight, CheckCircle2, MapPin, Sparkles, Smile, MessageSquare, Compass, Info, CreditCard } from 'lucide-react';
import { Reservation } from '../types';

interface ReservationsViewProps {
  onAddReservation: (reservation: Reservation) => void;
}

export default function ReservationsView({ onAddReservation }: ReservationsViewProps) {
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-06-15');
  const [time, setTime] = useState('09:30');
  const [guests, setGuests] = useState<number>(2);
  const [tablePreference, setTablePreference] = useState<'window' | 'garden' | 'lounge' | 'standard'>('garden');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Ticket Modal Success State
  const [generatedTicket, setGeneratedTicket] = useState<Reservation | null>(null);

  // Time Slot Options
  const timeSlots = [
    '08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '19:30', '21:00'
  ];

  // Areas metadata for interactive preview
  const preferenceDetails = {
    garden: {
      name: 'Misty Courtyard Garden',
      badge: '🌿 Outdoor',
      desc: 'Dine under lush banyan arches and giant fern climbers. Equipped with soft moisture-misting units.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400'
    },
    window: {
      name: 'Greenhouse Window Alcove',
      badge: '🪟 Soft Sun',
      desc: 'Flanked by floor-to-ceiling glass paneling looking out onto Bangalore mornings. Cozy and rich in light.',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400'
    },
    lounge: {
      name: 'Roaster Hearth Lounge',
      badge: '🛋️ Velvet Seats',
      desc: 'Deep plush sofa chairs close to our copper-plated roasting unit. Scent-rich and warm.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400'
    },
    standard: {
      name: 'Classic Bistro Arches',
      badge: '🧱 Solid Wood',
      desc: 'Traditional hand-planed teakwood chairs. Perfectly spaced for meetings, work, or dining.',
      image: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&q=80&w=400'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!customerName || !email || !phone) {
      setSubmitError('Please fill in Name, Email, and Phone.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          date,
          time,
          guests,
          tablePreference,
          specialRequest: specialRequest.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Reservation request failed.');
      }

      const savedReservation: Reservation = {
        id: result.id || result.reservationId || 'IBN-UNKNOWN',
        reservationId: result.reservationId || result.id || 'IBN-UNKNOWN',
        customerName: result.customerName,
        email: result.email,
        phone: result.phone,
        date: result.date,
        time: result.time,
        guests: result.guests,
        tablePreference: result.tablePreference,
        specialRequest: result.specialRequest || '',
        status: result.status || 'pending',
        createdAt: result.createdAt || new Date().toISOString(),
        tableNumber: result.tableNumber,
      };

      onAddReservation(savedReservation);
      setGeneratedTicket(savedReservation);

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        setSubmitError('Reservation saved, but EmailJS config is missing. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.');
        return;
      }

      await emailjs.send(serviceId, templateId, {
        customer_name: savedReservation.customerName,
        reservation_id: savedReservation.reservationId,
        reservation_date: savedReservation.date,
        reservation_time: savedReservation.time,
        reservation_guests: String(savedReservation.guests),
        table_preference: savedReservation.tablePreference,
        customer_email: savedReservation.email,
        to_email: savedReservation.email,
        user_email: savedReservation.email,
        reply_to: savedReservation.email,
        cafe_name: 'Ibbani Cafe',
        cafe_contact: 'contact@ibbanicafe.example | +91 12345 67890',
      }, publicKey);
    } catch (error) {
      console.error('EmailJS send failed:', error);
      setSubmitError(error instanceof Error ? error.message : 'Unable to complete reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form once close success dialog click
  const handleCloseSuccess = () => {
    setGeneratedTicket(null);
    setCustomerName('');
    setEmail('');
    setPhone('');
    setSpecialRequest('');
  };

  return (
    <div className="space-y-12 pb-24 fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      {/* 1. HEADER HERO */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-dew-600 font-bold bg-dew-100 px-3 py-1.5 rounded-full inline-block">
          Secure Your Sanctuary
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold-950 tracking-tight leading-tight">
          Reserve a Table
        </h1>
        <p className="text-sm font-sans text-gold-700 leading-relaxed">
          Book your private space inside our misty conservatory glasshouses. No ticketing fees, instant confirmation pending, and pristine Bengaluru hospitality.
        </p>
      </div>

      {/* 2. MAIN RESERVATIONS BUILDER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-start">
        
        {/* Left: Input Selection Card Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[36px] border border-gold-200/50 p-6 md:p-8 shadow-md relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex items-center space-x-2 text-dew-700 pb-2 border-b border-gold-100">
              <Compass className="h-5 w-5" />
              <h3 className="font-serif text-lg font-bold text-gold-950">1. Select Booking Details</h3>
            </div>

            {/* Date and Guests Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gold-800 tracking-wider uppercase block">
                  Select Date:
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3 h-4 w-4 text-gold-500" />
                  <input
                    type="date"
                    id="date-input"
                    value={date}
                    min="2026-06-08"
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-250 focus:border-dew-500 rounded-xl pl-11 pr-4 py-2.5 text-xs font-mono text-gold-950 focus:outline-none focus:ring-2 focus:ring-dew-500/20"
                    required
                  />
                </div>
              </div>

              {/* Number of Guests Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gold-800 tracking-wider uppercase block">
                  Number of Guests:
                </label>
                <div className="flex bg-gold-50 border border-gold-250 p-1 rounded-xl justify-around h-[38px] items-center">
                  {[1, 2, 3, 4, 6, 8].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setGuests(num)}
                      className={`text-xs font-mono font-bold w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        guests === num
                          ? 'bg-dew-600 text-white shadow-sm'
                          : 'text-gold-800 hover:bg-gold-200'
                      }`}
                    >
                      {num === 8 ? '8+' : num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Choose Time Slots Grid */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gold-800 tracking-wider uppercase block flex items-center justify-between">
                <span>Select Time Slot:</span>
                <span className="text-[10px] text-dew-600 lowercase tracking-normal">Open hours: 8am-10:30pm</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`text-xs font-mono font-bold py-2 rounded-xl transition-all border text-center ${
                      time === slot
                        ? 'bg-gold-950 text-white border-gold-950 shadow'
                        : 'bg-white hover:bg-gold-100 text-gold-800 border-gold-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Seating Area Preference Card Grid */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold text-gold-800 tracking-wider uppercase block">
                Select Table Preference Zone:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(preferenceDetails) as ('window' | 'garden' | 'lounge' | 'standard')[]).map((prefKey) => {
                  const active = tablePreference === prefKey;
                  const details = preferenceDetails[prefKey];
                  return (
                    <div
                      key={prefKey}
                      onClick={() => setTablePreference(prefKey)}
                      className={`border-2 rounded-2xl overflow-hidden cursor-pointer transition-all flex items-center space-x-3 p-3 select-none ${
                        active
                          ? 'border-dew-600 bg-dew-50/40 shadow-sm'
                          : 'border-gold-150 bg-white hover:bg-gold-50/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gold-200 shrink-0">
                        <img src={details.image} alt={details.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-serif font-bold text-gold-950 truncate">{details.name}</span>
                          <span className="text-[8px] font-mono shrink-0 bg-gold-200 text-gold-800 px-1 rounded uppercase font-semibold">{details.badge}</span>
                        </div>
                        <p className="text-[10px] text-gold-650 line-clamp-2 mt-0.5 leading-tight">{details.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inputs: Personal Contacts Block */}
            <div className="pt-4 border-t border-gold-100 space-y-6">
              <div className="flex items-center space-x-2 text-dew-700 pb-2 border-b border-gold-100">
                <Smile className="h-5 w-5" />
                <h3 className="font-serif text-lg font-bold text-gold-950">2. Customer Contact details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contact Name */}
                <div className="space-y-1.5Col">
                  <label className="text-[10px] font-mono font-bold text-gold-700 tracking-wider uppercase block">Full Name:</label>
                  <input
                    type="text"
                    required
                    maxLength={35}
                    placeholder="E.g. Karthik Rao"
                    value={customerName}
                    id="contact-name-input"
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 focus:border-dew-500 rounded-xl px-3.5 py-2.5 text-xs font-sans text-gold-950 focus:outline-none focus:ring-1 focus:ring-dew-500/20"
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-700 tracking-wider uppercase block">Email Address:</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g. karthik@spacemail.com"
                    value={email}
                    id="contact-email-input"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 focus:border-dew-500 rounded-xl px-3.5 py-2.5 text-xs font-sans text-gold-950 focus:outline-none focus:ring-1 focus:ring-dew-500/20"
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-700 tracking-wider uppercase block">Phone Number (WhatsApp):</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g. +91 99000 12345"
                    value={phone}
                    id="contact-phone-input"
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 focus:border-dew-500 rounded-xl px-3.5 py-2.5 text-xs font-sans text-gold-950 focus:outline-none focus:ring-1 focus:ring-dew-500/20"
                  />
                </div>
              </div>

              {/* Special Requests Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-gold-700 tracking-wider uppercase block flex items-center justify-between">
                  <span>Special Request notes / Occasion: (Optional)</span>
                  <span className="text-[9px] text-gold-500">Max 120 chars</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-gold-400" />
                  <input
                    type="text"
                    maxLength={120}
                    placeholder="E.g. Anniversary celebration / Sourdough allergen / quiet working spot..."
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="w-full bg-gold-50/50 border border-gold-200 focus:border-dew-500 rounded-xl pl-10 pr-4 py-3 text-xs font-sans text-gold-950 focus:outline-none focus:ring-1 focus:ring-dew-500/20"
                  />
                </div>
              </div>

            </div>

            {submitError && (
              <div className="rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm font-medium">
                {submitError}
              </div>
            )}

            {/* Submission CTA */}
            <div className="pt-4 border-t border-gold-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-1.5 text-gold-600 text-xs">
                <Info className="h-3.5 w-3.5" />
                <span>Pending check • Standard approvals in 10 mins</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-dew-600 ${isSubmitting ? 'bg-dew-400 cursor-not-allowed' : 'hover:bg-dew-700'} text-white px-8 py-3.5 rounded-full font-serif font-bold text-sm tracking-wide shadow-md ${isSubmitting ? '' : 'hover:shadow-lg hover:-translate-y-0.5'} transition-all inline-flex items-center space-x-2`}
              >
                <span>{isSubmitting ? 'Booking...' : 'Book This Seat'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </form>
        </div>

        {/* Right: Skeumorphic "Living Ticket" Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gold-950 p-6 rounded-t-[36px] text-white space-y-2 relative overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">Seat Projection</span>
            <h3 className="font-serif text-lg font-bold">Your Live Virtual Receipt</h3>
            <p className="text-[11px] font-sans text-gold-100/60 leading-normal">
              A real-time styled preview of your booking voucher. Observe the parameters lock as you enter details.
            </p>
            {/* Absolute mist circle */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-dew-600/20 rounded-full blur-xl pointer-events-none" />
          </div>

          <div className="bg-radial-at-t from-gold-100 to-white/90 border border-gold-200 p-6 rounded-b-[36px] shadow-md relative text-left">
            <div className="border-4 border-dashed border-gold-250/60 p-4 rounded-2xl relative space-y-5 bg-white">
              
              {/* Receipt Header logo brand */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-serif text-base font-bold text-gold-900 leading-tight">IBBANI CAFE</h4>
                  <span className="text-[9px] font-mono text-gold-550 uppercase tracking-widest block leading-none">BENGALURU • SANCTUARY</span>
                </div>
                <div className="bg-dew-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase">
                  VOUCHER
                </div>
              </div>

              {/* Receipt metrics */}
              <div className="space-y-3.5 text-xs">
                
                {/* Guest name */}
                <div className="flex justify-between items-baseline border-b border-gold-100 pb-1.5">
                  <span className="font-mono text-[10px] text-gold-500 uppercase tracking-wider">Guest Name:</span>
                  <span className="font-sans font-bold text-gold-950 truncate max-w-[160px]">
                    {customerName.trim() || '— Pend Name —'}
                  </span>
                </div>

                {/* Timing info */}
                <div className="grid grid-cols-2 gap-4 border-b border-gold-100 pb-1.5">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-gold-500 uppercase tracking-widest block font-bold">DATE:</span>
                    <span className="font-mono text-xs font-semibold text-gold-905">{date}</span>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="font-mono text-[9px] text-gold-500 uppercase tracking-widest block font-bold">TIME SLOT:</span>
                    <span className="font-mono text-xs font-semibold text-gold-905">{time} AM/PM</span>
                  </div>
                </div>

                {/* Preference Zone */}
                <div className="flex justify-between items-baseline border-b border-gold-100 pb-1.5">
                  <span className="font-mono text-[10px] text-gold-500 uppercase tracking-wider">Area Preference:</span>
                  <span className="font-sans font-bold text-dew-700">
                    {preferenceDetails[tablePreference].name}
                  </span>
                </div>

                {/* Party strength */}
                <div className="flex justify-between items-baseline border-b border-[#ebdcb9] pb-1.5">
                  <span className="font-mono text-[10px] text-gold-500 uppercase tracking-wider">Party size:</span>
                  <span className="font-mono font-bold text-gold-950">
                    {guests} {guests === 1 ? 'Individual' : 'Guests'}
                  </span>
                </div>

                {/* Requests */}
                <div className="space-y-1 bg-gold-50/60 p-2.5 rounded-xl border border-gold-100">
                  <span className="font-mono text-[9px] text-gold-500 uppercase tracking-widest block font-bold">SPECIAL MEMO STORIES:</span>
                  <p className="font-sans text-[11px] text-gold-700 italic max-h-[44px] overflow-hidden line-clamp-2">
                    {specialRequest.trim() ? `"${specialRequest}"` : '"No specific requests logged"'}
                  </p>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-3 flex flex-col items-center justify-center space-y-1 shrink-0">
                <div className="flex items-center space-x-[2px] h-9 opacity-75">
                  {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7].map((w, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gold-950 h-full" 
                      style={{ width: `${w}px` }} 
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono tracking-widest text-gold-500">
                  * 2026-IBBANI-RESV-PREVIEW *
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* 3. SUCCESS LIGHTBOX CONFIRMED OVERLAY */}
      {generatedTicket && (
        <div className="fixed inset-0 z-50 bg-gold-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[36px] max-w-md w-full p-6 md:p-8 text-center shadow-2xl border border-gold-200/80 space-y-6 fade-in text-left">
            
            <div className="flex flex-col items-center text-center space-y-3 shrink-0">
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gold-950">Table Booked Successfully!</h3>
              <p className="text-xs text-gold-700 font-sans max-w-sm">
                Your reservation is penciled in! We have locked your seat configuration in Ibbani's central journal. Present this ticket at checkout.
              </p>
            </div>

            {/* Render absolute beautiful ticket details */}
            <div className="bg-gold-50 border-2 border-gold-250 p-4 rounded-2xl relative space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-gold-500 font-bold">VOUCHER ID:</span>
                <span className="font-mono text-dew-700 font-bold text-sm select-all">{generatedTicket.id}</span>
              </div>
              
              <hr className="border-gold-200/80 border-dashed" />

              <div className="space-y-2.5 text-xs text-gold-800">
                <div className="flex justify-between">
                  <span className="font-mono font-bold text-gold-500">GUEST:</span>
                  <span className="font-sans font-bold text-gold-900">{generatedTicket.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono font-bold text-gold-500">SCHEDULE:</span>
                  <span className="font-mono text-gold-900 font-semibold">{generatedTicket.date} • {generatedTicket.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono font-bold text-gold-500">PARTY:</span>
                  <span className="font-sans font-semibold text-gold-900">{generatedTicket.guests} People</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono font-bold text-gold-500">ZONE:</span>
                  <span className="font-serif text-dew-700 font-bold">{preferenceDetails[generatedTicket.tablePreference].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono font-bold text-gold-500">SEAT ASSIGNED:</span>
                  <span className="font-mono bg-dew-600 text-white rounded px-1.5 py-0.5 text-[10px] font-bold">{generatedTicket.tableNumber}</span>
                </div>
              </div>

              {/* Real cutouts mimicking real tickets */}
              <div className="absolute top-1/2 -left-3.5 w-6 h-6 bg-white rounded-full border-r border-gold-200" />
              <div className="absolute top-1/2 -right-3.5 w-6 h-6 bg-white rounded-full border-l border-gold-200" />
            </div>

            <div className="flex items-center space-x-2 bg-dew-50 border border-dew-100 p-2.5 rounded-xl text-left">
              <CreditCard className="h-4 w-4 text-dew-600 shrink-0" />
              <span className="text-[10px] text-dew-900 leading-normal">
                No prepayment required. We will keep your table secured for up to <strong className="text-dew-700 font-semibold">15 minutes</strong> past your reservation time slot.
              </span>
            </div>

            <button
              onClick={handleCloseSuccess}
              className="w-full bg-gold-950 hover:bg-gold-900 text-white p-3 rounded-2xl font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              Done • Back to Reservations
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
