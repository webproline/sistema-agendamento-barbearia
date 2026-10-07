import React, { useState } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import { DailyTimelineView } from './DailyTimelineView';
import { RemindersManagement } from './RemindersManagement';
import { ClientsCRM } from './ClientsCRM';
import { ServicesManagement } from './ServicesManagement';
import { TeamManagement } from './TeamManagement';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import { QuickBookingModal } from './QuickBookingModal';
import {
  Calendar,
  BellRing,
  Users,
  Scissors,
  TrendingUp,
  Settings,
  Plus,
  ShieldCheck,
  Monitor,
  Smartphone,
} from 'lucide-react';

interface AdminDashboardProps {
  isQuickBookingOpen: boolean;
  setIsQuickBookingOpen: (open: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isQuickBookingOpen,
  setIsQuickBookingOpen,
}) => {
  const { adminTab, setAdminTab, appointments, config } = useBarbershop();

  // Params when clicking an empty slot
  const [modalDate, setModalDate] = useState<string | undefined>();
  const [modalTime, setModalTime] = useState<string | undefined>();
  const [modalBarberId, setModalBarberId] = useState<string | undefined>();

  const handleOpenFromSlot = (date: string, time: string, barberId: string) => {
    setModalDate(date);
    setModalTime(time);
    setModalBarberId(barberId);
    setIsQuickBookingOpen(true);
  };

  const handleCloseModal = () => {
    setIsQuickBookingOpen(false);
    setModalDate(undefined);
    setModalTime(undefined);
    setModalBarberId(undefined);
  };

  const pendingRemindersCount = appointments.filter(
    a => a.reminderStatus === 'pendente' && a.status !== 'cancelado'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Subheader & Tab bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold uppercase tracking-wider mb-1">
            <Monitor className="w-3.5 h-3.5" />
            <span>Painel Central da Barbearia · PC & Balcão</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Gestão Operacional de Agendamentos
          </h1>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setModalDate(undefined);
              setModalTime(undefined);
              setModalBarberId(undefined);
              setIsQuickBookingOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Nova Marcação (Balcão / Telefone)</span>
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-800/80 scrollbar-none">
        <button
          onClick={() => setAdminTab('agenda')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            adminTab === 'agenda'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agenda Diária (PC)</span>
        </button>

        <button
          onClick={() => setAdminTab('reminders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative ${
            adminTab === 'reminders'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Lembretes & Anti-Faltas</span>
          {pendingRemindersCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              adminTab === 'reminders'
                ? 'bg-stone-950 text-amber-400'
                : 'bg-amber-500 text-stone-950'
            }`}>
              {pendingRemindersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('clients')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            adminTab === 'clients'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ficha de Clientes (CRM)</span>
        </button>

        <button
          onClick={() => setAdminTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            adminTab === 'services'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Preçário & Serviços</span>
        </button>

        <button
          onClick={() => setAdminTab('team')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            adminTab === 'team'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Equipa & Horários</span>
        </button>

        <button
          onClick={() => setAdminTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            adminTab === 'analytics'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Caixa & Estatísticas</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            adminTab === 'settings'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {adminTab === 'agenda' && (
          <DailyTimelineView
            onOpenQuickBookingWithParams={handleOpenFromSlot}
          />
        )}
        {adminTab === 'reminders' && <RemindersManagement />}
        {adminTab === 'clients' && <ClientsCRM />}
        {adminTab === 'services' && <ServicesManagement />}
        {adminTab === 'team' && <TeamManagement />}
        {adminTab === 'analytics' && <AnalyticsView />}
        {adminTab === 'settings' && <SettingsView />}
      </div>

      {/* Quick Walk-In / Phone Booking Modal */}
      <QuickBookingModal
        isOpen={isQuickBookingOpen}
        onClose={handleCloseModal}
        defaultDate={modalDate}
        defaultTime={modalTime}
        defaultBarberId={modalBarberId}
      />
    </div>
  );
};
