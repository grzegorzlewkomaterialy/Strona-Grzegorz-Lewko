import { BookingRecord } from '../types';
import { deleteCalendarAppointment } from './googleCalendarService';

const STORAGE_KEY = 'fp_salon_bookings_v1';

// Initial preloaded bookings for demo / testing
const INITIAL_DEMO_BOOKINGS: BookingRecord[] = [
  {
    id: 'FP-482910',
    cancellationSecret: 'sec_karmelicka_demo1',
    serviceId: 'strzyzenie-meskie',
    serviceName: 'Strzyżenie męskie',
    servicePrice: '60 zł',
    barberId: 'grzegorz',
    barberName: 'Grzegorz Lewko',
    dateStr: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    dayLabel: 'Jutro',
    time: '12:00',
    clientName: 'Marek Wiśniewski',
    clientPhone: '501234567',
    clientNotes: 'Cięcie nożyczkami, boki średnie',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];

const loadFromStorage = (): BookingRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
      return INITIAL_DEMO_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Błąd odczytu rezerwacji z localStorage:', e);
    return INITIAL_DEMO_BOOKINGS;
  }
};

const saveToStorage = (bookings: BookingRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Błąd zapisu rezerwacji do localStorage:', e);
  }
};

// Listeners for store changes
type Listener = () => void;
const listeners: Listener[] = [];

export const subscribeToBookingStore = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
};

const notify = () => {
  listeners.forEach((l) => l());
};

export const getAllBookings = (): BookingRecord[] => {
  return loadFromStorage();
};

export const getBookingById = (id: string, secret?: string): BookingRecord | null => {
  const all = loadFromStorage();
  const match = all.find((b) => b.id.toLowerCase() === id.trim().toLowerCase());
  if (!match) return null;
  // If secret provided, verify
  if (secret && match.cancellationSecret !== secret) {
    return null;
  }
  return match;
};

export const saveBooking = (booking: BookingRecord): void => {
  const all = loadFromStorage();
  const existingIdx = all.findIndex((b) => b.id === booking.id);
  if (existingIdx > -1) {
    all[existingIdx] = booking;
  } else {
    all.unshift(booking);
  }
  saveToStorage(all);
  notify();
};

export const cancelBooking = async (
  id: string,
  secret: string
): Promise<{ success: boolean; message: string }> => {
  const all = loadFromStorage();
  const index = all.findIndex((b) => b.id.toLowerCase() === id.trim().toLowerCase());

  if (index === -1) {
    return { success: false, message: 'Nie znaleziono rezerwacji o podanym numerze.' };
  }

  const booking = all[index];
  if (booking.cancellationSecret !== secret) {
    return {
      success: false,
      message: 'Nieprawidłowy token bezpieczeństwa do odwołania tej wizyty.',
    };
  }

  if (booking.status === 'cancelled') {
    return { success: true, message: 'Wizyta została już wcześniej odwołana.' };
  }

  // If connected to Google Calendar and has event ID, delete from Google Calendar
  if (booking.googleCalendarEventId) {
    try {
      await deleteCalendarAppointment(booking.googleCalendarEventId);
    } catch (err) {
      console.warn('Nie udało się usunąć wydarzenia z Google Calendar:', err);
    }
  }

  // Mark as cancelled
  all[index] = {
    ...booking,
    status: 'cancelled',
  };

  saveToStorage(all);
  notify();

  return {
    success: true,
    message: 'Wizyta została pomyślnie odwołana. Termin w salonie został zwolniony.',
  };
};

/**
 * Check if a specific slot is already occupied (confirmed status)
 */
export const isSlotTaken = (
  barberId: string,
  dateStr: string,
  time: string
): boolean => {
  const all = loadFromStorage();
  return all.some((b) => {
    if (b.status === 'cancelled') return false;
    if (b.dateStr !== dateStr) return false;
    if (b.time !== time) return false;
    // If barber is specified, match barber; if 'any', it occupies this barber
    if (barberId !== 'any' && b.barberId !== 'any' && b.barberId !== barberId) {
      return false;
    }
    return true;
  });
};

/**
 * Generate a random booking reference: FP-XXXXXX
 */
export const generateBookingId = (): string => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `FP-${num}`;
};

/**
 * Generate a cryptographically secure random token for cancellation link
 */
export const generateCancellationSecret = (): string => {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return 'sec_' + Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
};
