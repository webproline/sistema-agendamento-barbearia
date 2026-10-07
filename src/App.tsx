import React, { useState } from 'react';
import { BarbershopProvider, useBarbershop } from './context/BarbershopContext';
import { Header } from './components/common/Header';
import { ClientBookingFlow } from './components/client/ClientBookingFlow';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { QuickBookingModal } from './components/admin/QuickBookingModal';
import {
  Calendar,
  LayoutDashboard,
  Instagram,
  MapPin,
  Phone,
  Clock,
  Scissors,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setActiveView, config } = useBarbershop();
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <Header onOpenQuickBooking={() => setIsQuickBookingOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'client' ? (
          <ClientBookingFlow />
        ) : (
          <AdminDashboard
            isQuickBookingOpen={isQuickBookingOpen}
            setIsQuickBookingOpen={setIsQuickBookingOpen}
          />
        )}
      </main>

      {/* Persistent floating switcher helper for presentation */}
      <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-2 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 shadow-2xl">
        <span className="text-[11px] font-medium text-stone-400 pl-2">Modo Atual:</span>
        <button
          onClick={() => setActiveView('client')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeView === 'client'
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          Vista do Cliente (Marcar)
        </button>
        <button
          onClick={() => setActiveView('admin')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeView === 'admin'
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          Vista PC Barbearia (Gestão)
        </button>
      </div>

      {/* Global Quick Booking Modal if triggered from header in client view */}
      {activeView === 'client' && (
        <QuickBookingModal
          isOpen={isQuickBookingOpen}
          onClose={() => setIsQuickBookingOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950/95 py-8 px-4 sm:px-6 lg:px-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 -rotate-45" />
            </div>
            <span className="font-display font-bold text-stone-300 text-sm">
              {config.name}
            </span>
            <span className="text-stone-600">·</span>
            <span>{config.address}, {config.city}</span>
          </div>

          <div className="flex items-center gap-6 text-stone-400 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-stone-500" />
              {config.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-stone-500" />
              Seg - Sáb: {config.openingHours.weekdays}
            </span>
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-pink-400 hover:underline"
            >
              <Instagram className="w-3 h-3" />
              <span>@{config.instagramHandle}</span>
            </a>
          </div>

          <div className="text-[11px] text-stone-600">
            Sistema de Agendamento Autónomo & Gestão Integrada
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BarbershopProvider>
      <MainContent />
    </BarbershopProvider>
  );
}
