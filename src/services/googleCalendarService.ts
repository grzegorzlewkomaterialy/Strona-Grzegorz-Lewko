import { getGoogleAccessToken } from './googleAuth';
import { BookingRecord } from '../types';

export interface CalendarEventItem {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  description?: string;
}

/**
 * Fetch events for a given day (YYYY-MM-DD) from the connected Google Calendar
 */
export const fetchCalendarEventsForDay = async (
  dateStr: string
): Promise<CalendarEventItem[]> => {
  const token = getGoogleAccessToken();
  if (!token) {
    return [];
  }

  const timeMin = new Date(`${dateStr}T00:00:00+01:00`).toISOString();
  const timeMax = new Date(`${dateStr}T23:59:59+01:00`).toISOString();

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    timeMin
  )}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.warn('Google Calendar token wygasł lub jest nieprawidłowy.');
      }
      return [];
    }

    const data = await res.json();
    return (data.items || []) as CalendarEventItem[];
  } catch (err) {
    console.error('Błąd pobierania wydarzeń z Google Calendar:', err);
    return [];
  }
};

/**
 * Extract booked hour strings (e.g. ["09:00", "14:00"]) from calendar events for that day
 */
export const getBusyHoursFromEvents = (events: CalendarEventItem[]): string[] => {
  const busyHours: string[] = [];
  for (const ev of events) {
    const startIso = ev.start?.dateTime;
    if (startIso) {
      const d = new Date(startIso);
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      busyHours.push(`${hours}:${minutes}`);
    }
  }
  return busyHours;
};

/**
 * Create a new event in Google Calendar for the appointment
 */
export const createCalendarAppointment = async (
  booking: BookingRecord
): Promise<string | null> => {
  const token = getGoogleAccessToken();
  if (!token) {
    // If salon hasn't linked Google Calendar yet, return null (booking is still saved locally)
    return null;
  }

  // Parse start time
  const [hourStr, minStr] = booking.time.split(':');
  const startObj = new Date(`${booking.dateStr}T00:00:00`);
  startObj.setHours(parseInt(hourStr, 10), parseInt(minStr, 10), 0, 0);

  // Approximate duration: 45 minutes default
  const endObj = new Date(startObj.getTime() + 45 * 60 * 1000);

  // Cancellation link
  const origin = window.location.origin;
  const cancellationUrl = `${origin}/#wizyta?id=${encodeURIComponent(
    booking.id
  )}&token=${encodeURIComponent(booking.cancellationSecret)}`;

  const eventPayload = {
    summary: `[FP Wizyta] ${booking.serviceName} - ${booking.clientName}`,
    location: 'Karmelicka 25, 31-131 Kraków (Salon Fryzjer Polski)',
    description: [
      `✂️ USŁUGA: ${booking.serviceName} (${booking.servicePrice})`,
      `💈 FRYZJER: ${booking.barberName}`,
      `👤 KLIENT: ${booking.clientName}`,
      `📞 TELEFON: +48 ${booking.clientPhone}`,
      booking.clientEmail ? `✉️ E-MAIL: ${booking.clientEmail}` : '',
      booking.clientNotes ? `📝 UWAGI: ${booking.clientNotes}` : '',
      `🔖 NUMER REZERWACJI: ${booking.id}`,
      `\n🌐 ZARZĄDZAJ WIZYTĄ LUB ODWOŁAJ ONLINE:`,
      cancellationUrl,
    ]
      .filter(Boolean)
      .join('\n'),
    start: {
      dateTime: startObj.toISOString(),
      timeZone: 'Europe/Warsaw',
    },
    end: {
      dateTime: endObj.toISOString(),
      timeZone: 'Europe/Warsaw',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
  };

  try {
    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      }
    );

    if (!res.ok) {
      console.error('Błąd tworzenia wydarzenia w Google Calendar:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.id || null;
  } catch (err) {
    console.error('Błąd wysyłania do Google Calendar:', err);
    return null;
  }
};

/**
 * Delete an event from Google Calendar (used when client cancels visit)
 */
export const deleteCalendarAppointment = async (eventId: string): Promise<boolean> => {
  const token = getGoogleAccessToken();
  if (!token) return true;

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(
        eventId
      )}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.ok || res.status === 404 || res.status === 410;
  } catch (err) {
    console.error('Błąd usuwania wydarzenia z Google Calendar:', err);
    return false;
  }
};
