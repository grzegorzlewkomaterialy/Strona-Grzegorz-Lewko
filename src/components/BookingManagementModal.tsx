import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { BookingRecord } from '../types';
import { getBookingById, cancelBooking } from '../services/bookingStore';
import { SALON_INFO } from '../data/salonData';

interface BookingManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBookingId?: string;
  initialSecret?: string;
}

export const BookingManagementModal: React.FC<BookingManagementModalProps> = ({
  isOpen,
  onClose,
  initialBookingId = '',
  initialSecret = '',
}) => {
  const [bookingIdInput, setBookingIdInput] = useState(initialBookingId);
  const [secretInput, setSecretInput] = useState(initialSecret);
  const [currentBooking, setCurrentBooking] = useState<BookingRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (initialBookingId) {
      setBookingIdInput(initialBookingId);
      setSecretInput(initialSecret);
      const found = getBookingById(initialBookingId, initialSecret || undefined);
      if (found) {
        setCurrentBooking(found);
        setErrorMessage(null);
      } else {
        setErrorMessage('Nie znaleziono rezerwacji lub nieprawidłowy link.');
      }
    }
  }, [initialBookingId, initialSecret, isOpen]);

  if (!isOpen) return null;

  const handleSearchBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const found = getBookingById(bookingIdInput, secretInput || undefined);
    if (found) {
      setCurrentBooking(found);
    } else {
      setErrorMessage(
        'Nie znaleziono rezerwacji o numerze ' +
          bookingIdInput.toUpperCase() +
          '. Upewnij się, że wpisujesz poprawny kod (np. FP-482910).'
      );
    }
  };

  const handleExecuteCancel = async () => {
    if (!currentBooking) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const res = await cancelBooking(currentBooking.id, currentBooking.cancellationSecret);
    setIsProcessing(false);
    setIsConfirmingCancel(false);

    if (res.success) {
      setSuccessMessage(res.message);
      // Refresh state
      const updated = getBookingById(currentBooking.id, currentBooking.cancellationSecret);
      if (updated) setCurrentBooking(updated);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleCopyLink = () => {
    if (!currentBooking) return;
    const url = `${window.location.origin}/#wizyta?id=${encodeURIComponent(
      currentBooking.id
    )}&token=${encodeURIComponent(currentBooking.cancellationSecret)}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Google Calendar add link for client
  const getGoogleCalendarTemplateUrl = (booking: BookingRecord) => {
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-neutral-800 text-white rounded-none max-w-xl w-full p-6 sm:p-8 relative shadow-2xl my-8 animate-in zoom-in-95">
        {/* Close button */}
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
            Zarządzanie wizytą w salonie
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Sprawdź szczegóły swojej rezerwacji lub odwołaj termin online.
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/60 rounded-none flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-950/60 border border-emerald-500/60 rounded-none flex items-start gap-2.5 text-xs text-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Search by ID Form (if no booking currently loaded) */}
        {!currentBooking && (
          <form onSubmit={handleSearchBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Wpisz numer rezerwacji (np. FP-482910):
              </label>
              <input
                type="text"
                required
                placeholder="np. FP-482910"
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value)}
                className="w-full px-4 py-3 rounded-none bg-neutral-900 border border-neutral-700 text-white text-sm font-mono uppercase focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-gold w-full py-3 rounded-none text-xs font-semibold cursor-pointer"
              >
                Szukaj rezerwacji
              </button>
            </div>

            <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-none text-xs text-neutral-400 font-light space-y-1">
              <p>
                💡 Numer rezerwacji otrzymałeś na ekranie potwierdzenia po zapisie na wizytę.
              </p>
              <p>
                W razie problemów możesz również zadzwonić bezpośrednio do salonu:{' '}
                <strong className="text-white">{SALON_INFO.phonePrimary}</strong>.
              </p>
            </div>
          </form>
        )}

        {/* Loaded Booking Details */}
        {currentBooking && (
          <div className="space-y-5">
            {/* Status Strip */}
            <div
              className={`p-3.5 rounded-none border flex items-center justify-between gap-3 ${
                currentBooking.status === 'confirmed'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentBooking.status === 'confirmed' ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                />
                <span className="text-xs uppercase tracking-wider font-bold">
                  Status: {currentBooking.status === 'confirmed' ? 'Potwierdzona' : 'Odwołana'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-200">
                {currentBooking.id}
              </span>
            </div>

            {/* Visit Details Card */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-none p-4 text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Usługa:</span>
                <span className="text-white font-bold">{currentBooking.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Cena:</span>
                <span className="text-[#d4af37] font-semibold">{currentBooking.servicePrice}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Mistrz fryzjerstwa:</span>
                <span className="text-white font-medium">{currentBooking.barberName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Termin wizyty:</span>
                <span className="text-white font-bold">
                  {currentBooking.dateStr} o godz. {currentBooking.time}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Klient:</span>
                <span className="text-white">
                  {currentBooking.clientName} (+48 {currentBooking.clientPhone})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Adres salonu:</span>
                <span className="text-neutral-200">Kraków, ul. Karmelicka 25</span>
              </div>
            </div>

            {/* Action Tools for Confirmed Booking */}
            {currentBooking.status === 'confirmed' && (
              <div className="space-y-3 pt-1">
                {/* Copy Link & Add to Calendar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-2.5 px-3 rounded-none bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Skopiowano link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Kopiuj link do wizyty</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getGoogleCalendarTemplateUrl(currentBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-none bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>Dodaj do Google Calendar</span>
                  </a>
                </div>

                {/* Cancel Confirmation Prompt */}
                {!isConfirmingCancel ? (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingCancel(true)}
                    className="w-full py-3 rounded-none border border-red-500/50 text-red-300 hover:bg-red-950/40 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Chcę odwołać tę wizytę online</span>
                  </button>
                ) : (
                  <div className="p-4 bg-red-950/50 border border-red-500 rounded-none space-y-3 animate-in fade-in">
                    <p className="text-xs text-red-200 font-medium">
                      Czy na pewno chcesz odwołać wizytę{' '}
                      <strong>{currentBooking.dateStr} o {currentBooking.time}</strong>?
                      Termin zostanie natychmiast zwolniony dla innych klientów.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleExecuteCancel}
                        className="flex-1 py-2 rounded-none bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isProcessing ? 'Odwoływanie...' : 'Tak, odwołaj wizytę'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingCancel(false)}
                        className="px-4 py-2 rounded-none bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium cursor-pointer"
                      >
                        Wróć
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If Cancelled */}
            {currentBooking.status === 'cancelled' && (
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-none text-center space-y-2">
                <p className="text-xs text-neutral-400">
                  Ta rezerwacja została odwołana. Termin w salonie jest wolny.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('rezerwacja');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-gold px-5 py-2 rounded-none text-xs font-semibold cursor-pointer"
                >
                  Zarezerwuj nowy termin
                </button>
              </div>
            )}

            {/* Search another booking button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentBooking(null);
                  setBookingIdInput('');
                  setSecretInput('');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
              >
                ← Sprawdź inną rezerwację
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
