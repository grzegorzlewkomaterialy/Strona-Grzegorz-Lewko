import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Scissors, CheckCircle, ChevronRight, Phone, AlertCircle } from 'lucide-react';
import { SERVICES, BARBERS, SALON_INFO } from '../data/salonData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialBarberId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialBarberId,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || 'strzyzenie-meskie'
  );
  const [selectedBarberId, setSelectedBarberId] = useState<string>(
    initialBarberId || 'grzegorz-lewko'
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [bookingRef, setBookingRef] = useState<string>('');

  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  useEffect(() => {
    if (initialBarberId) {
      setSelectedBarberId(initialBarberId);
    }
  }, [initialBarberId]);

  // Generate the next 7 available dates (skipping Sunday if needed)
  const availableDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.getDay();
      // Skip Sunday (0)
      if (dayOfWeek !== 0) {
        dates.push({
          raw: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('pl-PL', { weekday: 'short' }),
          dayNumber: d.getDate(),
          monthName: d.toLocaleDateString('pl-PL', { month: 'short' }),
          isToday: i === 0,
        });
      }
    }
    return dates;
  }, []);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].raw);
    }
  }, [availableDates, selectedDate]);

  const timeSlots = [
    '08:30',
    '09:15',
    '10:00',
    '11:00',
    '12:00',
    '13:15',
    '14:30',
    '15:30',
    '16:45',
    '17:30',
    '18:15',
  ];

  const currentService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const currentBarber = BARBERS.find((b) => b.id === selectedBarberId) || BARBERS[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || clientPhone.length < 9) return;
    const ref = 'FP-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(ref);
    setStep(4);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-neutral-800 text-white rounded-none max-w-xl w-full p-6 sm:p-8 relative shadow-2xl my-8 animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-none bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Zamknij"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs uppercase font-semibold text-[#d4af37] tracking-widest">
            <Scissors className="w-3.5 h-3.5" />
            <span>Fryzjer Polski · Karmelicka 25 Kraków</span>
          </div>
          <h3 className="font-sans text-2xl font-bold mt-1 text-white">
            {step === 4 ? 'Wizyta została zarezerwowana!' : 'Rezerwacja wizyty online'}
          </h3>

          {/* Stepper indicators */}
          {step < 4 && (
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-neutral-400">
              <span className={`px-2.5 py-1 rounded-none ${step === 1 ? 'bg-[#d4af37] text-black font-bold' : 'bg-neutral-800 text-neutral-300'}`}>
                1. Usługa
              </span>
              <span>→</span>
              <span className={`px-2.5 py-1 rounded-none ${step === 2 ? 'bg-[#d4af37] text-black font-bold' : 'bg-neutral-800 text-neutral-300'}`}>
                2. Barber
              </span>
              <span>→</span>
              <span className={`px-2.5 py-1 rounded-none ${step === 3 ? 'bg-[#d4af37] text-black font-bold' : 'bg-neutral-800 text-neutral-300'}`}>
                3. Termin & Dane
              </span>
            </div>
          )}
        </div>

        {/* STEP 1: Wybór Usługi */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
              Wybierz usługę z cennika:
            </label>
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedServiceId(s.id)}
                  className={`p-3.5 rounded-none border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedServiceId === s.id
                      ? 'bg-neutral-900 border-[#d4af37] shadow-sm'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">{s.name}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-1">{s.description}</p>
                    <span className="text-[11px] text-neutral-500 mt-1 block">
                      Czas trwania: {s.duration}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#d4af37] block">
                      {s.price}
                    </span>
                    {selectedServiceId === s.id && (
                      <span className="text-[10px] text-emerald-400 font-medium">Wybrano ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="btn-gold px-6 py-2.5 rounded-none text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <span>Dalej: Wybierz barbera</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Wybór Barbera */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
              Wybierz mistrza fryzjerstwa lub stylistę:
            </label>
            <div className="space-y-3">
              {BARBERS.map((barber) => (
                <div
                  key={barber.id}
                  onClick={() => setSelectedBarberId(barber.id)}
                  className={`p-4 rounded-none border transition-all cursor-pointer flex items-center gap-4 ${
                    selectedBarberId === barber.id
                      ? 'bg-neutral-900 border-[#d4af37]'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-none bg-neutral-800 border border-[#d4af37]/40 flex items-center justify-center font-sans text-base font-bold text-[#d4af37] shrink-0">
                    {barber.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{barber.name}</h4>
                      {selectedBarberId === barber.id && (
                        <span className="text-xs text-[#d4af37] font-semibold">Wybrano ✓</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 font-light mt-0.5">{barber.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">{barber.specialty}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-none text-xs font-medium text-neutral-400 hover:text-white"
              >
                ← Wróć do usług
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-gold px-6 py-2.5 rounded-none text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <span>Dalej: Termin & Dane</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Termin & Dane Klienta */}
        {step === 3 && (
          <form onSubmit={handleConfirmBooking} className="space-y-5">
            {/* Summary preview badge */}
            <div className="p-3 rounded-none bg-neutral-900 border border-neutral-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-neutral-400">Usługa: </span>
                <strong className="text-white">{currentService.name}</strong>
              </div>
              <div className="text-[#d4af37] font-bold">{currentService.price}</div>
            </div>

            {/* Date Picker Grid */}
            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                Wybierz dzień:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableDates.map((d) => (
                  <button
                    key={d.raw}
                    type="button"
                    onClick={() => setSelectedDate(d.raw)}
                    className={`p-2 rounded-none border text-center transition-all cursor-pointer ${
                      selectedDate === d.raw
                        ? 'bg-[#d4af37] text-neutral-950 font-bold border-[#d4af37]'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-[10px] block uppercase">{d.dayName}</span>
                    <span className="text-base font-bold">{d.dayNumber}</span>
                    <span className="text-[9px] block text-neutral-500">{d.monthName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                Wybierz godzinę:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-1.5 px-2 rounded-none border text-xs font-semibold transition-all cursor-pointer ${
                      selectedTime === time
                        ? 'bg-[#d4af37] text-neutral-950 font-bold border-[#d4af37]'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {!selectedTime && (
                <p className="text-[11px] text-amber-400 mt-1.5">
                  Wybierz preferowaną godzinę powyżej.
                </p>
              )}
            </div>

            {/* Client Inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Imię i nazwisko"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-none bg-neutral-900 border border-neutral-700 text-white text-xs focus:ring-1 focus:ring-[#d4af37] focus:outline-none placeholder:text-neutral-500"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-2.5 text-xs text-neutral-400">🇵🇱 +48</div>
                <input
                  type="tel"
                  required
                  placeholder="Numer telefonu (np. 600 000 000)"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className="w-full pl-16 pr-3.5 py-2.5 rounded-none bg-neutral-900 border border-neutral-700 text-white text-xs focus:ring-1 focus:ring-[#d4af37] focus:outline-none placeholder:text-neutral-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Uwagi do wizyty (opcjonalnie: preferencje, model cięcia)"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-none bg-neutral-900 border border-neutral-700 text-white text-xs focus:ring-1 focus:ring-[#d4af37] focus:outline-none placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-none text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
              >
                ← Wróć do barbera
              </button>
              <button
                type="submit"
                disabled={!selectedTime || !clientName.trim() || clientPhone.length < 9}
                className="btn-gold px-6 py-2.5 rounded-none text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Potwierdź rezerwację
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Potwierdzenie */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-none bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h4 className="text-lg font-bold text-white mb-1">
              Dziękujemy, {clientName}!
            </h4>
            <p className="text-xs text-neutral-300 font-light max-w-sm mx-auto mb-6">
              Twoja wizyta w salonie <strong className="text-white">Fryzjer Polski — Grzegorz Lewko</strong> została pomyślnie zarejestrowana.
            </p>

            <div className="p-4 rounded-none bg-neutral-900 border border-neutral-800 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Numer rezerwacji:</span>
                <span className="text-[#d4af37] font-bold">{bookingRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Usługa:</span>
                <span className="text-white font-medium">{currentService.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Barber:</span>
                <span className="text-white font-medium">{currentBarber.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Data i godzina:</span>
                <span className="text-white font-bold">{selectedDate} o godz. {selectedTime}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Adres:</span>
                <span className="text-neutral-200">Kraków, ul. Karmelicka 25</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-light mb-6">
              Wysłaliśmy potwierdzenie SMS pod numer <span className="text-white font-medium">+48 {clientPhone}</span>. W razie potrzeby zmiany terminu prosimy o kontakt pod numerem: <span className="text-[#d4af37] font-medium">{SALON_INFO.phonePrimary}</span>.
            </p>

            <button
              onClick={() => {
                onClose();
                setStep(1);
              }}
              className="btn-gold w-full py-3 rounded-none text-xs font-semibold cursor-pointer"
            >
              Gotowe — zamknij okno
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
