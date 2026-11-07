import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Appointment,
  Barber,
  BarbershopConfig,
  ClientProfile,
  Service,
  AppointmentStatus,
  ReminderStatus,
} from '../types/barbershop';
import {
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_CONFIG,
  INITIAL_CLIENTS,
  DEFAULT_BARBER_PHOTOS,
  DEFAULT_INSTAGRAM_HANDLE,
  getInitialAppointments,
} from '../data/initialData';
import {
  generateAppointmentId,
  getTodayDateString,
  addDays,
  timeToMinutes,
  minutesToTime,
  getWhatsAppReminderUrl,
} from '../utils/calendar';
import { DEMO_MODE } from '../data/contact';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface CreateAppointmentPayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientNotes?: string;
  serviceIds: string[];
  barberId: string;
  date: string;
  time: string;
  source?: 'online' | 'balcao_walkin' | 'telefone';
}

interface BarbershopContextType {
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  clients: ClientProfile[];
  config: BarbershopConfig;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeView: 'welcome' | 'client' | 'admin';
  setActiveView: (view: 'welcome' | 'client' | 'admin') => void;
  adminTab: 'agenda' | 'reminders' | 'clients' | 'services' | 'team' | 'analytics' | 'settings';
  setAdminTab: (tab: 'agenda' | 'reminders' | 'clients' | 'services' | 'team' | 'analytics' | 'settings') => void;
  
  // Actions
  createAppointment: (payload: CreateAppointmentPayload) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string, newBarberId?: string) => void;
  sendReminder: (id: string, method?: 'whatsapp' | 'sms' | 'auto') => { success: boolean; url?: string };
  sendAllDueReminders: () => number;
  addOrEditService: (service: Service) => void;
  deleteService: (id: string) => void;
  addOrEditBarber: (barber: Barber) => void;
  updateClientNotes: (phone: string, notes: string) => void;
  updateConfig: (newConfig: Partial<BarbershopConfig>) => void;
  getAvailableSlots: (date: string, barberId: string, durationMin: number) => string[];
  resetDataToSample: () => void;
  
  // Notifications
  toasts: ToastMessage[];
  addToast: (msg: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const BarbershopContext = createContext<BarbershopContextType | undefined>(undefined);

const STORAGE_KEY_SERVICES = 'dpv_services_v1';
const STORAGE_KEY_BARBERS = 'dpv_barbers_v1';
const STORAGE_KEY_APPOINTMENTS = 'dpv_appointments_v1';
const STORAGE_KEY_CLIENTS = 'dpv_clients_v1';
const STORAGE_KEY_CONFIG = 'dpv_config_v1';

export const BarbershopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [barbers, setBarbers] = useState<Barber[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BARBERS);
    if (!saved) return INITIAL_BARBERS;

    const savedBarbers: Barber[] = JSON.parse(saved);
    return savedBarbers.map(barber => ({
      ...barber,
      // Refresh the built-in photos so older browser data cannot keep broken paths.
      photoUrl: DEFAULT_BARBER_PHOTOS[barber.id] ?? barber.photoUrl,
      // The demo does not publish personal phone numbers for sample barbers.
      phone: DEFAULT_BARBER_PHOTOS[barber.id] ? '' : barber.phone,
    }));
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    return saved ? JSON.parse(saved) : getInitialAppointments();
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [config, setConfig] = useState<BarbershopConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!saved) return INITIAL_CONFIG;

    const savedConfig: BarbershopConfig = JSON.parse(saved);
    const normalizeIdentity = (value: string) => value
      .toLocaleLowerCase('pt-PT')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    const savedName = normalizeIdentity(savedConfig.name);
    const savedHandle = normalizeIdentity(savedConfig.instagramHandle);
    const savedInstagramUrl = normalizeIdentity(savedConfig.instagramUrl);
    const oldBrand = 'barbeariadpedrov';
    const oldDemoBrand = 'barbeariaexemplo';
    const oldInstagram = [savedHandle, savedInstagramUrl].some(value =>
      value.includes(oldBrand) || value.includes(oldDemoBrand)
    );
    const oldBusinessName = [oldBrand, oldDemoBrand].includes(savedName);
    const oldSamplePhone = savedConfig.phone.replace(/\D/g, '') === '351912345678';
    const oldTemplate = /barbearia\s+(?:d\.?\s*pedro\s*v|exemplo)/i.test(savedConfig.whatsappMessageTemplate);
    if (!oldInstagram && !oldBusinessName && !oldSamplePhone && !oldTemplate) return savedConfig;

    return {
      ...savedConfig,
      name: oldBusinessName ? INITIAL_CONFIG.name : savedConfig.name,
      phone: oldInstagram || oldBusinessName || oldSamplePhone ? '' : savedConfig.phone,
      instagramHandle: oldInstagram ? DEFAULT_INSTAGRAM_HANDLE : savedConfig.instagramHandle,
      instagramUrl: oldInstagram ? '' : savedConfig.instagramUrl,
      whatsappMessageTemplate: oldTemplate
        ? savedConfig.whatsappMessageTemplate.replace(/barbearia\s+(?:d\.?\s*pedro\s*v|exemplo)/gi, INITIAL_CONFIG.name)
        : savedConfig.whatsappMessageTemplate,
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeView, setActiveView] = useState<'welcome' | 'client' | 'admin'>('welcome');
  const [adminTab, setAdminTab] = useState<'agenda' | 'reminders' | 'clients' | 'services' | 'team' | 'analytics' | 'settings'>('agenda');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BARBERS, JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }, [config]);

  const addToast = (msg: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...msg, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper to calculate duration & price from service IDs
  const getSelectedServicesInfo = (serviceIds: string[]) => {
    const selected = services.filter(s => serviceIds.includes(s.id));
    const totalDuration = selected.reduce((sum, s) => sum + s.durationMin, 0);
    const totalPrice = selected.reduce((sum, s) => sum + s.price, 0);
    return {
      selected,
      totalDuration: totalDuration > 0 ? totalDuration : 30,
      totalPrice,
    };
  };

  // Check available slots for a given barber, date and duration
  const getAvailableSlots = (date: string, barberId: string, durationMin: number): string[] => {
    const targetBarber = barbers.find(b => b.id === barberId);
    if (!targetBarber || !targetBarber.active) return [];

    // Check weekday (0: Sun, 1: Mon, etc.)
    const [y, m, d] = date.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    if (!targetBarber.workingDays.includes(dayOfWeek)) {
      return []; // Not working that day
    }

    const startMin = timeToMinutes(targetBarber.workingHours.start);
    const endMin = timeToMinutes(targetBarber.workingHours.end);
    const lunchStart = targetBarber.workingHours.lunchStart ? timeToMinutes(targetBarber.workingHours.lunchStart) : null;
    const lunchEnd = targetBarber.workingHours.lunchEnd ? timeToMinutes(targetBarber.workingHours.lunchEnd) : null;

    // Get existing bookings on that date for this barber that aren't cancelled
    const activeBookings = appointments.filter(
      app => app.date === date && app.barberId === barberId && app.status !== 'cancelado'
    );

    const stepMin = config.slotIntervalMin || 30;
    const availableSlots: string[] = [];

    for (let slot = startMin; slot + durationMin <= endMin; slot += stepMin) {
      const slotEnd = slot + durationMin;

      // Overlap with lunch?
      if (lunchStart !== null && lunchEnd !== null) {
        if (slot < lunchEnd && slotEnd > lunchStart) {
          continue;
        }
      }

      // Overlap with existing appointment?
      const hasConflict = activeBookings.some(app => {
        const appStart = timeToMinutes(app.time);
        const appEnd = appStart + app.durationMin;
        return slot < appEnd && slotEnd > appStart;
      });

      if (!hasConflict) {
        availableSlots.push(minutesToTime(slot));
      }
    }

    return availableSlots;
  };

  // Create appointment
  const createAppointment = (payload: CreateAppointmentPayload): Appointment => {
    const { totalDuration, totalPrice } = getSelectedServicesInfo(payload.serviceIds);

    const newAppointment: Appointment = {
      id: generateAppointmentId(),
      clientName: payload.clientName.trim(),
      clientPhone: payload.clientPhone.trim(),
      clientEmail: payload.clientEmail?.trim(),
      clientNotes: payload.clientNotes?.trim(),
      serviceIds: payload.serviceIds,
      barberId: payload.barberId,
      date: payload.date,
      time: payload.time,
      durationMin: totalDuration,
      totalPrice,
      status: 'confirmado', // Automatically confirmed in integrated system
      reminderStatus: 'pendente',
      source: payload.source || 'online',
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Update CRM Client profile
    const cleanPhone = payload.clientPhone.replace(/\D/g, '');
    setClients(prev => {
      const existing = prev.find(c => c.phone.replace(/\D/g, '') === cleanPhone);
      if (existing) {
        return prev.map(c =>
          c.phone.replace(/\D/g, '') === cleanPhone
            ? {
                ...c,
                name: payload.clientName,
                email: payload.clientEmail || c.email,
                lastVisitDate: payload.date,
                preferredBarberId: payload.barberId,
              }
            : c
        );
      } else {
        const newClient: ClientProfile = {
          phone: payload.clientPhone,
          name: payload.clientName,
          email: payload.clientEmail,
          totalVisits: 1,
          totalSpent: 0,
          lastVisitDate: payload.date,
          noShowCount: 0,
          preferredBarberId: payload.barberId,
          notes: payload.clientNotes || '',
          firstVisitDate: payload.date,
        };
        return [newClient, ...prev];
      }
    });

    addToast({
      type: 'success',
      title: 'Marcação Confirmada!',
      description: `Código ${newAppointment.id} agendado para ${payload.time}.`,
    });

    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(app => {
        if (app.id !== id) return app;
        const updated = {
          ...app,
          status: newStatus,
          completedAt: newStatus === 'concluido' ? new Date().toISOString() : app.completedAt,
        };
        return updated;
      })
    );

    // If completed or no-show, update client stats
    const app = appointments.find(a => a.id === id);
    if (app) {
      const cleanPhone = app.clientPhone.replace(/\D/g, '');
      if (newStatus === 'concluido') {
        setClients(prev =>
          prev.map(c => {
            if (c.phone.replace(/\D/g, '') === cleanPhone) {
              return {
                ...c,
                totalVisits: c.totalVisits + 1,
                totalSpent: c.totalSpent + app.totalPrice,
                lastVisitDate: app.date,
              };
            }
            return c;
          })
        );
        addToast({
          type: 'success',
          title: 'Serviço Concluído',
          description: `Marcação ${id} finalizada e registada na faturação (€${app.totalPrice.toFixed(2)}).`,
        });
      } else if (newStatus === 'faltou') {
        setClients(prev =>
          prev.map(c => {
            if (c.phone.replace(/\D/g, '') === cleanPhone) {
              return {
                ...c,
                noShowCount: (c.noShowCount || 0) + 1,
              };
            }
            return c;
          })
        );
        addToast({
          type: 'warning',
          title: 'Falta Registada',
          description: `Cliente marcado como Não Compareceu (${id}).`,
        });
      } else if (newStatus === 'cancelado') {
        addToast({
          type: 'info',
          title: 'Marcação Cancelada',
          description: `Horário das ${app.time} libertado na agenda.`,
        });
      }
    }
  };

  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newTime: string,
    newBarberId?: string
  ) => {
    setAppointments(prev =>
      prev.map(app => {
        if (app.id !== id) return app;
        return {
          ...app,
          date: newDate,
          time: newTime,
          barberId: newBarberId || app.barberId,
          reminderStatus: 'pendente',
        };
      })
    );
    addToast({
      type: 'success',
      title: 'Reagendamento Concluído',
      description: `Marcação alterada para ${newDate} às ${newTime}.`,
    });
  };

  const sendReminder = (id: string, method: 'whatsapp' | 'sms' | 'auto' = 'whatsapp') => {
    const app = appointments.find(a => a.id === id);
    if (!app) return { success: false };

    const barber = barbers.find(b => b.id === app.barberId);
    const barberName = barber ? barber.name : config.name;
    const srvNames = services
      .filter(s => app.serviceIds.includes(s.id))
      .map(s => s.name)
      .join(', ');

    const waUrl = getWhatsAppReminderUrl(app, barberName, srvNames, config.phone, config.name);

    // Update appointment reminder status
    setAppointments(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              reminderStatus: 'lembrete_enviado',
              reminderSentAt: new Date().toISOString(),
            }
          : a
      )
    );

    addToast({
      type: 'success',
      title: 'Mensagem de lembrete pronta',
      description: DEMO_MODE
        ? 'Em modo demonstração nada é enviado. Escolha um contacto no WhatsApp para ver a mensagem.'
        : `Mensagem preparada para ${app.clientName}. Carregue em enviar no WhatsApp para concluir.`,
    });

    if (method === 'whatsapp') {
      window.open(waUrl, '_blank');
    }

    return { success: true, url: waUrl };
  };

  const sendAllDueReminders = (): number => {
    const today = getTodayDateString();
    const pending = appointments.filter(
      app =>
        (app.date === today || app.date === addDays(today, 1)) &&
        app.status !== 'cancelado' &&
        app.reminderStatus === 'pendente'
    );

    if (pending.length === 0) {
      addToast({
        type: 'info',
        title: 'Sem lembretes pendentes',
        description: 'Todos os clientes de hoje e amanhã já foram notificados.',
      });
      return 0;
    }

    setAppointments(prev =>
      prev.map(a => {
        if (pending.some(p => p.id === a.id)) {
          return {
            ...a,
            reminderStatus: 'lembrete_enviado',
            reminderSentAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    addToast({
      type: 'success',
      title: `${pending.length} lembretes marcados como enviados`,
      description: 'Apenas atualiza o estado: os lembretes são enviados um a um por WhatsApp.',
    });

    return pending.length;
  };

  const addOrEditService = (service: Service) => {
    setServices(prev => {
      const idx = prev.findIndex(s => s.id === service.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = service;
        return copy;
      }
      return [...prev, service];
    });
    addToast({
      type: 'success',
      title: 'Serviço Guardado',
      description: `${service.name} atualizado no preçário.`,
    });
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    addToast({
      type: 'info',
      title: 'Serviço Removido',
    });
  };

  const addOrEditBarber = (barber: Barber) => {
    setBarbers(prev => {
      const idx = prev.findIndex(b => b.id === barber.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = barber;
        return copy;
      }
      return [...prev, barber];
    });
    addToast({
      type: 'success',
      title: 'Perfil de Barbeiro Atualizado',
      description: barber.name,
    });
  };

  const updateClientNotes = (phone: string, notes: string) => {
    const clean = phone.replace(/\D/g, '');
    setClients(prev =>
      prev.map(c => (c.phone.replace(/\D/g, '') === clean ? { ...c, notes } : c))
    );
    addToast({
      type: 'success',
      title: 'Notas do Cliente Guardadas',
    });
  };

  const updateConfig = (newConfig: Partial<BarbershopConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    addToast({
      type: 'success',
      title: 'Configurações Atualizadas',
    });
  };

  const resetDataToSample = () => {
    setServices(INITIAL_SERVICES);
    setBarbers(INITIAL_BARBERS);
    setAppointments(getInitialAppointments());
    setClients(INITIAL_CLIENTS);
    setConfig(INITIAL_CONFIG);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_BARBERS);
    localStorage.removeItem(STORAGE_KEY_APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEY_CLIENTS);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    addToast({
      type: 'info',
      title: 'Dados Restaurados',
      description: 'Agenda e preçário repostos com valores originais.',
    });
  };

  return (
    <BarbershopContext.Provider
      value={{
        services,
        barbers,
        appointments,
        clients,
        config,
        selectedDate,
        setSelectedDate,
        activeView,
        setActiveView,
        adminTab,
        setAdminTab,
        createAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        sendReminder,
        sendAllDueReminders,
        addOrEditService,
        deleteService,
        addOrEditBarber,
        updateClientNotes,
        updateConfig,
        getAvailableSlots,
        resetDataToSample,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </BarbershopContext.Provider>
  );
};

export const useBarbershop = (): BarbershopContextType => {
  const context = useContext(BarbershopContext);
  if (!context) {
    throw new Error('useBarbershop must be used within a BarbershopProvider');
  }
  return context;
};
