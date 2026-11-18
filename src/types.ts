export interface ServiceItem {
  id: string;
  name: string;
  category: 'meskie' | 'broda' | 'combo' | 'damskie' | 'dodatki';
  price: string;
  priceValue: number;
  duration: string;
  description: string;
  popular?: boolean;
}

export interface BarberStaff {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialty: string;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'fade' | 'klasyka' | 'broda' | 'dlugie';
  image: string;
  description: string;
  stylist: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  source: 'Google' | 'Booksy';
  content: string;
}

export interface BookingState {
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes?: string;
}

export interface BookingRecord {
  id: string;
  cancellationSecret: string;
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  barberId: string;
  barberName: string;
  dateStr: string;
  dayLabel: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientNotes?: string;
  googleCalendarEventId?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
