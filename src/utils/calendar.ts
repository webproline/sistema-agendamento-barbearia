import { Appointment, Barber, Service } from '../types/barbershop';
import { DEMO_MODE } from '../data/contact';

export function formatDatePT(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatDateShortPT(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-PT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateAppointmentId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DPV-${rand}`;
}

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Constrói um link wa.me.
// Em modo demonstração não usa números reais (podiam pertencer a pessoas verdadeiras):
// o WhatsApp abre com a mensagem pronta e a pessoa escolhe o destinatário.
export function getWhatsAppUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.length === 9 ? `351${digits}` : digits;
  const base = !DEMO_MODE && normalized ? `https://wa.me/${normalized}` : 'https://wa.me/';
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Generate WhatsApp reminder link
export function getWhatsAppReminderUrl(
  appointment: Appointment,
  barberName: string,
  servicesNames: string,
  shopPhone: string,
  shopName: string = 'Barbearia'
): string {
  const cleanPhone = appointment.clientPhone.replace(/\D/g, '');
  // Format for Portugal if 9 digits: add 351
  const destinationPhone = cleanPhone.length === 9 ? `351${cleanPhone}` : cleanPhone;

  const dateFormatted = formatDatePT(appointment.date);
  const message = `💈 *${shopName}* 💈
Olá ${appointment.clientName}! 

Lembramos a sua marcação:
🗓️ *Data:* ${dateFormatted}
⏰ *Hora:* ${appointment.time}
✂️ *Serviço(s):* ${servicesNames}
👤 *Barbeiro:* ${barberName}
📍 *Local:* ${shopName}

Por favor, responda *CONFIRMAR* para garantir o seu horário ou avise com antecedência se necessitar reagendar.

Agradecemos a sua preferência e até breve!`;

  return getWhatsAppUrl(destinationPhone, message);
}

// Generate client WhatsApp confirmation link (to send to barbershop directly)
export function getClientWhatsAppConfirmationUrl(
  appointment: Appointment,
  barberName: string,
  servicesNames: string,
  shopPhone: string,
  shopName: string = 'Barbearia'
): string {
  const cleanPhone = shopPhone.replace(/\D/g, '');
  const destinationPhone = cleanPhone.length === 9 ? `351${cleanPhone}` : cleanPhone;

  const dateFormatted = formatDatePT(appointment.date);
  const message = `Olá! Acabei de marcar pelo site na *${shopName}*:
🎟️ *Código:* ${appointment.id}
👤 *Nome:* ${appointment.clientName}
📱 *Contacto:* ${appointment.clientPhone}
🗓️ *Data:* ${dateFormatted}
⏰ *Hora:* ${appointment.time}
✂️ *Serviço:* ${servicesNames}
💈 *Barbeiro:* ${barberName}

Confirmam a receção? Obrigado!`;

  return getWhatsAppUrl(destinationPhone, message);
}

// Generate .ics file download for calendar apps (Apple, Google, Outlook)
export function downloadICSFile(
  appointment: Appointment,
  barber: Barber,
  services: Service[],
  shopName: string = 'Barbearia'
): void {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [hours, minutes] = appointment.time.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + appointment.durationMin * 60000);

  const formatICSDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const serviceNames = services.map(s => s.name).join(' + ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${shopName}//Agendamento//PT`,
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@agendamento.demo`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:Corte na ${shopName} (${serviceNames})`,
    `DESCRIPTION:Marcação com o barbeiro ${barber.name}. Código da reserva: ${appointment.id}. Serviços: ${serviceNames}.`,
    `LOCATION:${shopName}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `agendamento-${appointment.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
