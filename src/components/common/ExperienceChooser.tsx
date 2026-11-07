import React from 'react';
import { ArrowRight, CalendarDays, Clock3, LayoutDashboard, Scissors, Users } from 'lucide-react';

interface ExperienceChooserProps {
  shopName: string;
  onChoose: (view: 'client' | 'admin') => void;
}

const BookingPreview = () => (
  <div className="relative flex h-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,rgba(245,158,11,0.16),transparent_58%),linear-gradient(135deg,#292524,#0c0a09)] p-6">
    <div className="absolute left-8 top-10 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
    <div className="relative w-[188px] rounded-[2rem] border border-stone-600 bg-stone-950 p-2 shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-1">
      <div className="overflow-hidden rounded-[1.55rem] border border-stone-800 bg-stone-900 px-3 pb-3 pt-4">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-stone-700" />
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-stone-950"><Scissors className="h-4 w-4 -rotate-45" /></div>
          <div><p className="text-[8px] font-bold text-white">{`Marcação online`}</p><p className="text-[7px] text-stone-500">Escolha o seu serviço</p></div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-amber-500/40 bg-amber-500/10 p-2">
          <div><p className="text-[8px] font-semibold text-white">Corte clássico</p><p className="mt-0.5 text-[7px] text-stone-400">30 min · 14 €</p></div>
          <span className="h-3.5 w-3.5 rounded-full bg-amber-500" />
        </div>
        <div className="mt-2 rounded-lg border border-stone-800 bg-stone-950 p-2">
          <p className="text-[7px] font-medium text-stone-300">Escolha uma data</p>
          <div className="mt-2 grid grid-cols-4 gap-1 text-center">
            {['SEG', 'TER', 'QUA', 'QUI'].map((day, index) => <div key={day} className={`rounded-md py-1.5 ${index === 1 ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-500'}`}><span className="block text-[5px]">{day}</span><span className="text-[8px] font-bold">{12 + index}</span></div>)}
          </div>
        </div>
        <div className="mt-2 flex gap-1.5">
          <span className="flex-1 rounded-md bg-stone-800 py-1.5 text-center text-[7px] text-stone-300">10:30</span>
          <span className="flex-1 rounded-md bg-stone-800 py-1.5 text-center text-[7px] text-stone-300">11:00</span>
          <span className="flex-1 rounded-md bg-amber-500 py-1.5 text-center text-[7px] font-bold text-stone-950">11:30</span>
        </div>
        <div className="mt-3 rounded-md bg-amber-500 py-2 text-center text-[7px] font-bold text-stone-950">Continuar</div>
      </div>
    </div>
    <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-stone-700/80 bg-stone-950/80 px-3 py-2 text-[10px] text-stone-300 backdrop-blur">
      <CalendarDays className="h-3.5 w-3.5 text-amber-400" /> Marcação em poucos passos
    </div>
  </div>
);

const ManagementPreview = () => (
  <div className="relative flex h-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_80%_20%,rgba(245,158,11,0.12),transparent_50%),linear-gradient(135deg,#1c1917,#0c0a09)] p-5 sm:p-7">
    <div className="w-full rounded-xl border border-stone-700 bg-stone-950/95 p-3 shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:-translate-y-1">
      <div className="mb-3 flex items-center justify-between border-b border-stone-800 pb-2.5">
        <div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15 text-amber-400"><LayoutDashboard className="h-3.5 w-3.5" /></div><div><p className="text-[9px] font-bold text-white">Agenda da equipa</p><p className="text-[7px] text-stone-500">Quarta-feira, 14 de maio</p></div></div>
        <span className="rounded-md bg-amber-500 px-2 py-1 text-[7px] font-bold text-stone-950">+ Marcação</span>
      </div>
      <div className="mb-1 grid grid-cols-[42px_repeat(4,minmax(0,1fr))] gap-1 text-center">
        <span />
        {['JOÃO', 'DIOGO', 'TIAGO', 'EQUIPA'].map(name => <span key={name} className="truncate py-1 text-[6px] font-semibold text-stone-500">{name}</span>)}
      </div>
      <div className="space-y-1">
        {[
          ['09:00', 'Corte', '', 'Barba', ''],
          ['10:00', '', 'Corte + barba', '', 'Corte'],
          ['11:00', 'Corte + barba', '', 'Corte', ''],
          ['12:00', '', 'Corte', 'Corte + barba', ''],
        ].map((row, rowIndex) => (
          <div key={row[0]} className="grid grid-cols-[42px_repeat(4,minmax(0,1fr))] gap-1">
            <span className="py-2 text-center font-mono text-[7px] text-stone-600">{row[0]}</span>
            {row.slice(1).map((item, columnIndex) => item ? (
              <div key={columnIndex} className={`min-h-8 rounded-md border px-1 py-1 ${rowIndex % 2 === columnIndex % 2 ? 'border-amber-500/20 bg-amber-500/10' : 'border-stone-700 bg-stone-800/80'}`}>
                <span className="block truncate text-[6px] font-semibold text-stone-200">{item}</span>
                <span className="mt-0.5 block truncate text-[5px] text-stone-500">Cliente · 30 min</span>
              </div>
            ) : <div key={columnIndex} className="min-h-8 rounded-md border border-dashed border-stone-800/80" />)}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-stone-800 pt-2 text-[7px] text-stone-500"><span className="flex items-center gap-1"><Users className="h-3 w-3 text-amber-400" /> Equipa</span><span className="flex items-center gap-1"><Clock3 className="h-3 w-3 text-amber-400" /> Horários</span><span className="flex items-center gap-1"><Scissors className="h-3 w-3 text-amber-400" /> Serviços</span></div>
    </div>
  </div>
);

export const ExperienceChooser: React.FC<ExperienceChooserProps> = ({ shopName, onChoose }) => (
  <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
    <div className="mb-8 text-center sm:mb-10">
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Demonstração
      </span>
      <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        Uma experiência completa para a sua barbearia.
      </h1>
      <p className="mt-3 text-sm text-stone-400 sm:text-base">Escolha a área que pretende explorar.</p>
      <p className="mt-1 text-xs text-stone-600">{shopName}</p>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
      <article className="group overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/70 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-950/20">
        <div className="h-64 sm:h-72"><BookingPreview /></div>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="font-display text-xl font-bold text-white">Marcar Online</h2><p className="mt-1 text-sm text-stone-400">Uma forma simples de escolher serviços, barbeiro e horário.</p></div>
            <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
          </div>
          <button onClick={() => onChoose('client')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-stone-900">
            Explorar experiência de marcação <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </article>

      <article className="group overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/70 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-950/20">
        <div className="h-64 sm:h-72"><ManagementPreview /></div>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="font-display text-xl font-bold text-white">Painel de Gestão</h2><p className="mt-1 text-sm text-stone-400">Organize marcações, serviços e equipa num só lugar.</p></div>
            <LayoutDashboard className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
          </div>
          <button onClick={() => onChoose('admin')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm font-bold text-stone-100 transition-colors hover:border-amber-500/50 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-stone-900">
            Explorar gestão da barbearia <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
        </div>
      </article>
    </div>
    <p className="mt-7 text-center text-[11px] text-stone-600">Os dados apresentados nesta demonstração são fictícios.</p>
  </section>
);
