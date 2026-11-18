import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Check,
  User,
  Scissors,
  Calendar,
  Clock,
  X,
  ExternalLink,
  Copy,
  CheckCircle,
  RefreshCw,
  CalendarDays,
  ShieldCheck,
} from 'lucide-react';
import { SERVICES, BARBERS, SALON_INFO } from '../data/salonData';
import { ServiceItem, BookingRecord } from '../types';
import {
  saveBooking,
  isSlotTaken,
  generateBookingId,
  generateCancellationSecret,
  subscribeToBookingStore,
} from '../services/bookingStore';
import {
  signInGoogleCalendar,
  signOutGoogleCalendar,
  subscribeToGoogleAuth,
  getGoogleAccessToken,
} from '../services/googleAuth';
import {
  createCalendarAppointment,
  fetchCalendarEventsForDay,
  getBusyHoursFromEvents,
} from '../services/googleCalendarService';

interface Specialist {
  id: string;
  name: string;
  title: string;
  avatar: string;
  photo?: string;
}

const SPECIALISTS: Specialist[] = [
  {
    id: 'any',
    name: 'Dowolny dostępny fryzjer',
    title: 'Najbliższy wolny termin',
    avatar: '★',
    photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'grzegorz',
    name: 'Grzegorz Lewko',
    title: 'Mistrz rzemiosła / Barber',
    avatar: 'G',
    photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'piotr',
    name: 'Piotr',
    title: 'Barber & Stylista męski',
    avatar: 'P',
    photo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'stasia',
    name: 'Stasia',
    title: 'Fryzjerka & Stylistka',
    avatar: 'S',
    photo: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'olga',
    name: 'Olga',
    title: 'Fryzjerka & Stylistka',
    avatar: 'O',
    photo: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=300&q=80',
  },
];

interface BookingCalendarSectionProps {
  selectedServiceId?: string;
  onSelectServiceId?: (id: string) => void;
  onOpenManagement?: (bookingId?: string, secret?: string) => void;
}

export const BookingCalendarSection: React.FC<BookingCalendarSectionProps> = ({
  selectedServiceId: externalSelectedServiceId,
  onOpenManagement,
}) => {
  // Selected Specialist & Service
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(SPECIALISTS[1]); // Default Grzegorz Lewko
  const [selectedService, setSelectedService] = useState<ServiceItem>(
    SERVICES.find((s) => s.id === externalSelectedServiceId) || SERVICES[0]
  );

  // Modals for changing specialist & service
  const [isChangingSpecialist, setIsChangingSpecialist] = useState(false);
  const [isChangingService, setIsChangingService] = useState(false);

  // Calendar week offset (0 = current week, 1 = next week, etc.)
  const [weekOffset, setWeekOffset] = useState(0);

  // Selected Slot: date string + time string
  const [selectedSlot, setSelectedSlot] = useState<{
    dateStr: string;
    time: string;
    dayLabel: string;
  } | null>(null);

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Google Calendar Integration State
  const [googleUserEmail, setGoogleUserEmail] = useState<string | null>(null);
  const [isConnectingCalendar, setIsConnectingCalendar] = useState(false);
  const [calendarBusyMap, setCalendarBusyMap] = useState<Record<string, string[]>>({});
  const [, setStoreRevision] = useState(0);

  // Listen to Google Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToGoogleAuth((user) => {
      setGoogleUserEmail(user?.email || null);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Booking Store changes (for real-time cancellation/booking updates)
  useEffect(() => {
    const unsubscribe = subscribeToBookingStore(() => {
      setStoreRevision((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  // Update selected service when external prop changes
  useEffect(() => {
    if (externalSelectedServiceId) {
      const match = SERVICES.find((s) => s.id === externalSelectedServiceId);
      if (match) setSelectedService(match);
    }
  }, [externalSelectedServiceId]);

  // Generate 7 days for current weekOffset
  const weekDays = useMemo(() => {
    const days = [];
    const baseDate = new Date();
    const currentDay = baseDate.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + diffToMonday + weekOffset * 7);

    const monthNamesPl = [
      'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
      'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru',
    ];
    const dayNamesPl = [
      'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa',
      'Czwartek', 'Piątek', 'Sobota',
    ];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dayOfWeekIdx = d.getDay();
      const isSunday = dayOfWeekIdx === 0;
      const isSaturday = dayOfWeekIdx === 6;

      let times: string[] = [];
      if (!isSunday) {
        if (isSaturday) {
          times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
        } else {
          times = [
            '08:00', '09:00', '10:00', '11:00', '12:00',
            '14:00', '15:00', '16:00', '17:00', '18:00',
          ];
        }
      }

      days.push({
        date: d,
        dayName: dayNamesPl[dayOfWeekIdx],
        dayNum: d.getDate(),
        monthName: monthNamesPl[d.getMonth()],
        fullDateStr: d.toISOString().split('T')[0],
        isSunday,
        times,
      });
    }

    return days;
  }, [weekOffset]);

  // Query Google Calendar if connected
  useEffect(() => {
    const token = getGoogleAccessToken();
    if (!token) return;

    let isMounted = true;
    const fetchWeekEvents = async () => {
      const busyMap: Record<string, string[]> = {};
      for (const day of weekDays) {
        if (!day.isSunday) {
          const events = await fetchCalendarEventsForDay(day.fullDateStr);
          busyMap[day.fullDateStr] = getBusyHoursFromEvents(events);
        }
      }
      if (isMounted) {
        setCalendarBusyMap(busyMap);
      }
    };

    fetchWeekEvents();
    return () => {
      isMounted = false;
    };
  }, [googleUserEmail, weekDays]);

  const handleSelectTime = (dayObj: (typeof weekDays)[0], time: string) => {
    setSelectedSlot({
      dateStr: dayObj.fullDateStr,
      time,
      dayLabel: `${dayObj.dayName}, ${dayObj.dayNum} ${dayObj.monthName}`,
    });
    setCreatedBooking(null);
  };

  const handleGoogleCalendarConnect = async () => {
    try {
      setIsConnectingCalendar(true);
      await signInGoogleCalendar();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnectingCalendar(false);
    }
  };

  const handleGoogleCalendarDisconnect = async () => {
    await signOutGoogleCalendar();
    setCalendarBusyMap({});
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || clientPhone.length < 9 || !selectedSlot) return;

    setIsSubmitting(true);

    const bookingId = generateBookingId();
    const cancellationSecret = generateCancellationSecret();

    const newBooking: BookingRecord = {
      id: bookingId,
      cancellationSecret,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      barberId: selectedSpecialist.id,
      barberName: selectedSpecialist.name,
      dateStr: selectedSlot.dateStr,
      dayLabel: selectedSlot.dayLabel,
      time: selectedSlot.time,
      clientName: clientName.trim(),
      clientPhone: clientPhone.replace(/\D/g, '').slice(0, 9),
      clientEmail: clientEmail.trim() || undefined,
      clientNotes: clientNotes.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Attempt to sync with Google Calendar if connected
    try {
      const eventId = await createCalendarAppointment(newBooking);
      if (eventId) {
        newBooking.googleCalendarEventId = eventId;
      }
    } catch (err) {
      console.warn('Google Calendar sync error:', err);
    }

    // Save to persistent storage
    saveBooking(newBooking);

    setIsSubmitting(false);
    setCreatedBooking(newBooking);
  };

  const handleCopyCancellationLink = () => {
    if (!createdBooking) return;
    const url = `${window.location.origin}/#wizyta?id=${encodeURIComponent(
      createdBooking.id
    )}&token=${encodeURIComponent(createdBooking.cancellationSecret)}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getClientGoogleCalendarUrl = (booking: BookingRecord) => {
    const [h, m] = booking.time.split(':');
    const startD = new Date(`${booking.dateStr}T00:00:00`);
    startD.setHours(parseInt(h, 10), parseInt(m, 10), 0);
    const endD = new Date(startD.getTime() + 45 * 60000);

    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${fmt(startD)}/${fmt(endD)}`;
    const text = encodeURIComponent(`Fryzjer Kraków - ${booking.serviceName}`);
    const details = encodeURIComponent(
      `Wizyta u ${booking.barberName} w salonie Fryzjer Polski.\nNumer rezerwacji: ${booking.id}\nAdres: Karmelicka 25 Kraków`
    );
    const location = encodeURIComponent('Karmelicka 25, 31-131 Kraków');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <section id="rezerwacja" className="bg-[#faf8f5] text-neutral-900 py-16 sm:py-20 border-t border-neutral-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs sm:text-sm text-neutral-500 font-medium block mb-2">
              Rezerwujesz wizytę w:
            </span>
            <div className="pl-3.5 border-l-3 border-[#a67a22]">
              <h3 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950 tracking-tight">
                Lewko Grzegorz — Salon Fryzjerski
              </h3>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-600 mt-1 font-light">
                <MapPin className="w-4 h-4 text-[#a67a22] shrink-0" />
                <span>Karmelicka 25, 31-131 Kraków</span>
              </div>
            </div>
          </div>

          {/* Google Calendar Real-Time Sync Status Pill */}
          <div className="p-2.5 sm:p-3 bg-white border border-neutral-300 rounded-none shadow-xs text-xs flex items-center justify-between gap-3 self-start md:self-auto">
            {googleUserEmail ? (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0 animate-pulse" />
                <div>
                  <span className="font-semibold text-neutral-900 block">
                    Kalendarz Google salonu: Połączono
                  </span>
                  <span className="text-neutral-500 text-[11px] block truncate max-w-[200px]">
                    {googleUserEmail}
                  </span>
                </div>
                <button
                  onClick={handleGoogleCalendarDisconnect}
                  className="ml-2 text-[11px] text-neutral-400 hover:text-neutral-700 underline cursor-pointer"
                  title="Rozłącz kalendarz"
                >
                  rozłącz
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-[#0284c7] shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-800 block">
                    Dwustronna synchronizacja
                  </span>
                  <span className="text-neutral-500 text-[11px] block">
                    Terminarz Google Calendar
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleCalendarConnect}
                  disabled={isConnectingCalendar}
                  className="px-2.5 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-semibold rounded-none cursor-pointer flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  {isConnectingCalendar ? (
                    'Łączenie...'
                  ) : (
                    <>
                      <span>Połącz Kalendarz</span>
                      <ExternalLink className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2 Selector Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Box 1: Selected Specialist */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-neutral-800 block mb-2">
              Wybrany specjalista
            </label>
            <div className="bg-white rounded-none border border-neutral-300 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-none overflow-hidden bg-neutral-100 border border-neutral-300 shrink-0">
                  {selectedSpecialist.photo ? (
                    <img
                      src={selectedSpecialist.photo}
                      alt={selectedSpecialist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-neutral-700 bg-neutral-200">
                      {selectedSpecialist.avatar}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 truncate">
                    {selectedSpecialist.name}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light truncate">
                    {selectedSpecialist.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChangingSpecialist(true)}
                className="text-[#0284c7] hover:text-[#0369a1] text-xs sm:text-sm font-semibold cursor-pointer shrink-0 transition-colors px-2 py-1"
              >
                zmień
              </button>
            </div>
          </div>

          {/* Box 2: Selected Service */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-neutral-800 block mb-2">
              Wybrana usługa
            </label>
            <div className="bg-white rounded-none border border-neutral-300 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-neutral-900 truncate">
                  {selectedService.name}
                </h4>
                <p className="text-xs text-neutral-500 font-light truncate mt-0.5">
                  {selectedService.duration} ·{' '}
                  <span className="font-medium text-neutral-800">{selectedService.price}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsChangingService(true)}
                className="text-[#0284c7] hover:text-[#0369a1] text-xs sm:text-sm font-semibold cursor-pointer shrink-0 transition-colors px-2 py-1"
              >
                zmień
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Week Table */}
        <div className="bg-white rounded-none border border-neutral-300 shadow-sm overflow-hidden mb-8">
          {/* Header Row with Chevrons and Day Columns */}
          <div className="flex items-center border-b border-neutral-200 bg-neutral-50/50">
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
              disabled={weekOffset === 0}
              className={`p-3 sm:p-4 text-neutral-600 hover:text-neutral-950 transition-colors shrink-0 ${
                weekOffset === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-neutral-100'
              }`}
              title="Poprzedni tydzień"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-7 flex-1 text-center py-4">
              {weekDays.map((day, idx) => (
                <div key={idx} className="px-1">
                  <span className="block text-[11px] sm:text-xs text-neutral-500 font-normal">
                    {day.dayName}
                  </span>
                  <span className="block text-sm sm:text-base lg:text-lg font-bold text-neutral-950 mt-0.5">
                    {day.dayNum} {day.monthName}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="p-3 sm:p-4 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors shrink-0 cursor-pointer"
              title="Następny tydzień"
            >
              <ChevronRight className="w-5 h-5 text-[#0284c7]" />
            </button>
          </div>

          {/* Time Slots Grid */}
          <div className="px-4 sm:px-12 py-6 sm:py-8 overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 sm:gap-3 min-w-[580px]">
              {weekDays.map((day, dIdx) => (
                <div key={dIdx} className="flex flex-col items-center gap-2">
                  {day.isSunday ? (
                    <div className="py-8 text-center text-xs text-neutral-400 font-light select-none">
                      —
                    </div>
                  ) : day.times.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400 font-light select-none">
                      brak
                    </div>
                  ) : (
                    day.times.map((time) => {
                      // Check if slot taken in local store OR Google Calendar busy map
                      const isTakenInStore = isSlotTaken(
                        selectedSpecialist.id,
                        day.fullDateStr,
                        time
                      );
                      const isTakenInGoogle =
                        calendarBusyMap[day.fullDateStr]?.includes(time) ?? false;
                      const isOccupied = isTakenInStore || isTakenInGoogle;

                      const isSelected =
                        selectedSlot?.dateStr === day.fullDateStr &&
                        selectedSlot?.time === time;

                      if (isOccupied) {
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled
                            className="w-full py-1.5 px-1 sm:px-2 rounded-none text-xs sm:text-sm bg-neutral-200/80 text-neutral-400 cursor-not-allowed line-through select-none"
                            title="Termin zajęty"
                          >
                            {time}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleSelectTime(day, time)}
                          className={`w-full py-1.5 px-1 sm:px-2 rounded-none text-xs sm:text-sm transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 text-white font-bold ring-2 ring-[#a67a22] shadow-sm'
                              : 'bg-neutral-100/90 hover:bg-[#faeed6] text-neutral-800 font-medium hover:text-[#805a10]'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Confirmation / Booking Form */}
        {selectedSlot && !createdBooking && (
          <div className="bg-white rounded-none border-2 border-[#d4af37] p-6 sm:p-8 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 mb-6">
              <div>
                <span className="text-xs uppercase font-bold text-[#a67a22] tracking-wider block mb-1">
                  Krok 2: Potwierdź dane rezerwacji
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-neutral-950">
                  {selectedSlot.dayLabel} o godzinie {selectedSlot.time}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Usługa: <strong className="text-neutral-900">{selectedService.name}</strong> (
                  {selectedService.price}) · Fryzjer:{' '}
                  <strong className="text-neutral-900">{selectedSpecialist.name}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="text-xs text-neutral-400 hover:text-neutral-700 underline self-start sm:self-auto cursor-pointer"
              >
                Anuluj wybór terminu
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="np. Jan Kowalski"
                  className="w-full px-3.5 py-2.5 rounded-none border border-neutral-300 text-sm focus:outline-none focus:border-[#a67a22] focus:ring-1 focus:ring-[#a67a22]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Numer telefonu *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-neutral-500 font-medium">🇵🇱 +48</span>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    placeholder="600 000 000"
                    className="w-full pl-16 pr-3.5 py-2.5 rounded-none border border-neutral-300 text-sm focus:outline-none focus:border-[#a67a22] focus:ring-1 focus:ring-[#a67a22]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Adres e-mail (opcjonalnie do potwierdzenia)
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="np. jan@example.com"
                  className="w-full px-3.5 py-2.5 rounded-none border border-neutral-300 text-sm focus:outline-none focus:border-[#a67a22] focus:ring-1 focus:ring-[#a67a22]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Uwagi do wizyty (opcjonalnie)
                </label>
                <input
                  type="text"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="np. pierwsze strzyżenie, cięcie klasyczne"
                  className="w-full px-3.5 py-2.5 rounded-none border border-neutral-300 text-sm focus:outline-none focus:border-[#a67a22] focus:ring-1 focus:ring-[#a67a22]"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-neutral-500 font-light">
                  Płatność na miejscu w salonie: gotówka, karta lub BLIK.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !clientName.trim() || clientPhone.length < 9}
                  className="w-full sm:w-auto btn-gold px-8 py-3 rounded-none text-sm font-semibold tracking-wide cursor-pointer transition-transform hover:scale-[1.02] shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Zapisywanie w terminarzu...' : 'Potwierdź rezerwację wizyty'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Confirmation Card with Cancellation Link & Google Calendar Buttons */}
        {createdBooking && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-none p-6 sm:p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-none bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <h4 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-2">
              Dziękujemy, {createdBooking.clientName}! Twoja wizyta została zarezerwowana.
            </h4>

            <p className="text-sm text-neutral-700 max-w-lg mx-auto mb-4">
              Czekamy na Ciebie <strong className="text-neutral-900">{createdBooking.dayLabel} o godz. {createdBooking.time}</strong> w salonie przy ul. Karmelickiej 25 w Krakowie.
            </p>

            {/* Booking Details Box */}
            <div className="max-w-md mx-auto bg-white border border-neutral-300 rounded-none p-4 text-xs text-left mb-6 space-y-2 shadow-xs">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Numer rezerwacji:</span>
                <span className="font-mono font-bold text-[#a67a22] text-sm">{createdBooking.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Usługa i cena:</span>
                <span className="font-semibold text-neutral-900">{createdBooking.serviceName} ({createdBooking.servicePrice})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Mistrz fryzjerstwa:</span>
                <span className="font-medium text-neutral-800">{createdBooking.barberName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Status w kalendarzu:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {createdBooking.googleCalendarEventId
                    ? 'Zapisano w Google Calendar salonu'
                    : 'Zatwierdzona w terminarzu'}
                </span>
              </div>
            </div>

            {/* Quick Actions: Manage/Cancel Online + Copy Link + Add to Personal Calendar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {onOpenManagement && (
                <button
                  type="button"
                  onClick={() => onOpenManagement(createdBooking.id, createdBooking.cancellationSecret)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-none cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>Zarządzaj wizytą / Odwołaj online</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyCancellationLink}
                className="px-4 py-2.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs sm:text-sm font-medium rounded-none cursor-pointer transition-colors flex items-center gap-1.5"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Skopiowano link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-500" />
                    <span>Kopiuj link do odwołania</span>
                  </>
                )}
              </button>

              <a
                href={getClientGoogleCalendarUrl(createdBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs sm:text-sm font-medium rounded-none transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4 text-[#1a73e8]" />
                <span>Dodaj do swojego Kalendarza Google</span>
              </a>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSlot(null);
                  setCreatedBooking(null);
                }}
                className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
              >
                Zarezerwuj kolejną wizytę
              </button>
            </div>
          </div>
        )}

        {/* Change Specialist Modal */}
        {isChangingSpecialist && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-neutral-900 rounded-none max-w-md w-full p-6 shadow-2xl border border-neutral-300">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
                <h4 className="text-lg font-bold">Wybierz specjalistę</h4>
                <button
                  onClick={() => setIsChangingSpecialist(false)}
                  className="text-neutral-400 hover:text-neutral-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {SPECIALISTS.map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => {
                      setSelectedSpecialist(spec);
                      setIsChangingSpecialist(false);
                    }}
                    className={`w-full p-3 rounded-none border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      selectedSpecialist.id === spec.id
                        ? 'border-[#a67a22] bg-amber-50/50 ring-1 ring-[#a67a22]'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-none overflow-hidden bg-neutral-100 border border-neutral-300 shrink-0">
                      {spec.photo ? (
                        <img src={spec.photo} alt={spec.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-neutral-700 bg-neutral-200">
                          {spec.avatar}
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-neutral-900">{spec.name}</h5>
                      <p className="text-xs text-neutral-500 font-light">{spec.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Change Service Modal */}
        {isChangingService && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-neutral-900 rounded-none max-w-lg w-full p-6 shadow-2xl border border-neutral-300">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
                <h4 className="text-lg font-bold">Wybierz usługę</h4>
                <button
                  onClick={() => setIsChangingService(false)}
                  className="text-neutral-400 hover:text-neutral-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {SERVICES.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(srv);
                      setIsChangingService(false);
                    }}
                    className={`w-full p-3.5 rounded-none border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      selectedService.id === srv.id
                        ? 'border-[#a67a22] bg-amber-50/50 ring-1 ring-[#a67a22]'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div>
                      <h5 className="text-sm font-bold text-neutral-900">{srv.name}</h5>
                      <p className="text-xs text-neutral-500 font-light mt-0.5">{srv.duration}</p>
                    </div>
                    <span className="text-sm font-bold text-neutral-950 shrink-0 tabular-nums">
                      {srv.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
