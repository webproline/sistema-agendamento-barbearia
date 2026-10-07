export type ServiceCategory = 'cabelo' | 'barba' | 'combo' | 'especial';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number; // in Euros €
  durationMin: number; // e.g. 30, 45, 60
  description: string;
  popular?: boolean;
  active: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  rating: number;
  cutsCount: number;
  phone: string;
  active: boolean;
  specialties: string[];
  workingHours: {
    start: string; // "09:00"
    end: string; // "19:30"
    lunchStart?: string; // "13:00"
    lunchEnd?: string; // "14:00"
  };
  workingDays: number[]; // 0: Sun, 1: Mon, ... 6: Sat
}

export type AppointmentStatus = 'agendado' | 'confirmado' | 'concluido' | 'cancelado' | 'faltou';
export type ReminderStatus = 'pendente' | 'lembrete_enviado' | 'confirmado_cliente';
export type BookingSource = 'online' | 'balcao_walkin' | 'telefone';

export interface Appointment {
  id: string; // e.g. "DPV-8492"
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientNotes?: string;
  serviceIds: string[];
  barberId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  durationMin: number;
  totalPrice: number;
  status: AppointmentStatus;
  reminderStatus: ReminderStatus;
  reminderSentAt?: string;
  source: BookingSource;
  createdAt: string;
  completedAt?: string;
}

export interface ClientProfile {
  phone: string;
  name: string;
  email?: string;
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: string;
  noShowCount: number;
  preferredBarberId?: string;
  notes?: string;
  firstVisitDate: string;
}

export interface BarbershopConfig {
  name: string;
  subtitle: string;
  instagramHandle: string;
  instagramUrl: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  slotIntervalMin: number;
  autoRemindersEnabled: boolean;
  reminderHoursBefore: number;
  whatsappMessageTemplate: string;
}
