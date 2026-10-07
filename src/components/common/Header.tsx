import React from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import {
  Calendar,
  LayoutDashboard,
  Scissors,
  Instagram,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
} from 'lucide-react';

interface HeaderProps {
  onOpenQuickBooking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickBooking }) => {
  const { activeView, setActiveView, config, toasts, removeToast } = useBarbershop();

  return (
    <>
      {/* Toast notifications container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all flex items-start gap-3 ${
              toast.type === 'success'
                ? 'bg-stone-900/95 border-emerald-500/40 text-emerald-100'
                : toast.type === 'warning'
                ? 'bg-stone-900/95 border-amber-500/40 text-amber-100'
                : 'bg-stone-900/95 border-stone-700 text-stone-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-wide text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Bar adhering to the strict 3-zone contract */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('client')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-stone-950 shadow-inner group-hover:from-amber-500 group-hover:to-amber-700 transition-colors">
                <Scissors className="w-5 h-5 text-stone-950 -rotate-45" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors block leading-tight">
                  {config.name}
                </span>
                <span className="text-[11px] text-stone-400 hidden sm:block tracking-wide">
                  Tradição & Estilo · Lisboa
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation / View Switcher */}
          <nav className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl">
            <button
              onClick={() => setActiveView('client')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeView === 'client'
                  ? 'bg-amber-600 text-stone-950 shadow-sm font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Marcar Online</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeView === 'admin'
                  ? 'bg-stone-800 text-amber-400 border border-amber-600/30 shadow-sm font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel de Gestão (PC / Balcão)</span>
            </button>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2.5">
            {activeView === 'admin' && onOpenQuickBooking && (
              <button
                onClick={onOpenQuickBooking}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Marcação</span>
              </button>
            )}

            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noreferrer"
              title="Instagram Oficial @barbearia_d.pedro_v"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden md:inline">@{config.instagramHandle}</span>
            </a>
          </div>

        </div>
      </header>
    </>
  );
};
