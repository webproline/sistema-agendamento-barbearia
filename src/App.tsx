import React, { useState } from 'react';
import { BarbershopProvider, useBarbershop } from './context/BarbershopContext';
import { Header } from './components/common/Header';
import { DemoBanner } from './components/common/DemoBanner';
import { getContactUrl } from './data/contact';
import { ClientBookingFlow } from './components/client/ClientBookingFlow';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { QuickBookingModal } from './components/admin/QuickBookingModal';
import { ExperienceChooser } from './components/common/ExperienceChooser';
import {
  Instagram,
  MapPin,
  Phone,
  Clock,
  Scissors,
  MessageCircle,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setActiveView, config } = useBarbershop();
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const contactUrl = getContactUrl();

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-black">
      <DemoBanner />

      {activeView === 'welcome' ? (
        <main className="flex-1">
          <ExperienceChooser shopName={config.name} onChoose={setActiveView} />
        </main>
      ) : (
        <>
          <Header onOpenQuickBooking={() => setIsQuickBookingOpen(true)} />

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

        </>
      )}

      {activeView === 'client' && (
        <QuickBookingModal
          isOpen={isQuickBookingOpen}
          onClose={() => setIsQuickBookingOpen(false)}
        />
      )}

      <footer className="border-t border-stone-900 bg-stone-950/95 py-6 px-4 sm:px-6 lg:px-8 text-xs text-stone-500">
        {activeView === 'welcome' ? (
          <p className="text-center">Demonstração do sistema de marcações e gestão · Dados fictícios</p>
        ) : (
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
            {config.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-stone-500" />
                {config.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-stone-500" />
              Seg - Sáb: {config.openingHours.weekdays}
            </span>
            {config.instagramHandle && config.instagramUrl && (
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-pink-400 hover:underline"
              >
                <Instagram className="w-3 h-3" />
                <span>@{config.instagramHandle}</span>
              </a>
            )}
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-[11px] text-stone-500">
            <span>Demonstração do sistema de marcações e gestão</span>
            {contactUrl && (
              <a
                href={contactUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Saber mais
              </a>
            )}
          </div>
          </div>
        )}
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
