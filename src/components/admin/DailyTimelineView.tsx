import React, { useState } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import {
  formatDatePT,
  getTodayDateString,
  addDays,
  timeToMinutes,
  minutesToTime,
} from '../../utils/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Plus,
  Scissors,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Appointment, Barber } from '../../types/barbershop';

interface DailyTimelineViewProps {
  onOpenQuickBookingWithParams: (date: string, time: string, barberId: string) => void;
}

export const DailyTimelineView: React.FC<DailyTimelineViewProps> = ({
  onOpenQuickBookingWithParams,
}) => {
  const {
    barbers,
    services,
    appointments,
    selectedDate,
    setSelectedDate,
    updateAppointmentStatus,
    sendReminder,
  } = useBarbershop();

  const [viewMode, setViewMode] = useState<'columns' | 'list'>('columns');

  // Filter appointments for the selected date
  const dayAppointments = appointments.filter(a => a.date === selectedDate);

  // Time grid slots (from 09:00 to 19:30)
  const timeSlots: string[] = [];
  for (let min = 9 * 60; min <= 19.5 * 60; min += 30) {
    timeSlots.push(minutesToTime(min));
  }

  const todayStr = getTodayDateString();

  return (
    <div className="space-y-4">
      {/* Date Navigation & View Mode Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors"
            title="Dia Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedDate === todayStr
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setSelectedDate(addDays(todayStr, 1))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedDate === addDays(todayStr, 1)
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Amanhã
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors"
            title="Dia Seguinte"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative ml-2">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Current date title & quick stats */}
        <div className="text-center md:text-left">
          <h2 className="font-display text-lg font-bold text-white capitalize">
            {formatDatePT(selectedDate)}
          </h2>
          <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5 justify-center md:justify-start">
            <span className="font-mono text-amber-400 font-semibold">
              {dayAppointments.length} marcações
            </span>
            <span>·</span>
            <span>
              Faturação prevista:{' '}
              <strong className="text-white font-mono">
                €{dayAppointments.reduce((sum, a) => a.status !== 'cancelado' && a.status !== 'faltou' ? sum + a.totalPrice : sum, 0).toFixed(2)}
              </strong>
            </span>
          </div>
        </div>

        {/* View mode toggle (Columns for PC / List for compact) */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setViewMode('columns')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'columns'
                ? 'bg-stone-800 text-amber-400 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Grelha por Barbeiro
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-stone-800 text-amber-400 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Lista de Atendimentos
          </button>
        </div>
      </div>

      {/* VIEW 1: Barbershop Columns Timeline (Fresha/Booksy-style for Desktop PC) */}
      {viewMode === 'columns' ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Barber Column Headers */}
          <div className="grid grid-cols-[70px_repeat(3,minmax(260px,1fr))] border-b border-stone-800 bg-stone-950/80 sticky top-0 z-20 overflow-x-auto">
            <div className="p-3 text-[11px] font-mono text-stone-500 flex items-center justify-center border-r border-stone-800">
              HORA
            </div>
            {barbers.map(barber => {
              const barberDayApps = dayAppointments.filter(
                a => a.barberId === barber.id && a.status !== 'cancelado'
              );
              return (
                <div
                  key={barber.id}
                  className="p-3 border-r border-stone-800 last:border-r-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={barber.photoUrl}
                      alt={barber.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl object-cover border border-stone-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-display text-xs sm:text-sm font-bold text-white truncate">
                        {barber.name}
                      </h4>
                      <p className="text-[10px] text-amber-500 truncate">
                        {barber.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800 shrink-0">
                    {barberDayApps.length} cortes
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time Slots Table */}
          <div className="overflow-x-auto max-h-[720px] overflow-y-auto divide-y divide-stone-800/60">
            {timeSlots.map(time => {
              return (
                <div
                  key={time}
                  className="grid grid-cols-[70px_repeat(3,minmax(260px,1fr))] min-h-[68px]"
                >
                  {/* Time label */}
                  <div className="p-2 border-r border-stone-800/80 bg-stone-950/40 text-[11px] font-mono font-medium text-stone-400 flex items-start justify-center pt-3">
                    {time}
                  </div>

                  {/* Each Barber Column */}
                  {barbers.map(barber => {
                    // Find if there is an appointment starting at this time or spanning this time
                    const targetApp = dayAppointments.find(a => {
                      if (a.barberId !== barber.id) return false;
                      const aStart = timeToMinutes(a.time);
                      const aEnd = aStart + a.durationMin;
                      const slotMin = timeToMinutes(time);
                      return a.time === time; // We anchor card on starting slot
                    });

                    // Check if it's during lunch
                    const slotMin = timeToMinutes(time);
                    const isLunch =
                      barber.workingHours.lunchStart &&
                      barber.workingHours.lunchEnd &&
                      slotMin >= timeToMinutes(barber.workingHours.lunchStart) &&
                      slotMin < timeToMinutes(barber.workingHours.lunchEnd);

                    return (
                      <div
                        key={barber.id}
                        className={`p-1.5 border-r border-stone-800/60 last:border-r-0 relative transition-colors ${
                          isLunch ? 'bg-stone-950/60' : 'hover:bg-stone-850/40'
                        }`}
                      >
                        {targetApp ? (
                          <div
                            className={`p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between h-full shadow-md ${
                              targetApp.status === 'concluido'
                                ? 'bg-stone-950 border-emerald-600/40 text-stone-300'
                                : targetApp.status === 'faltou'
                                ? 'bg-red-950/40 border-red-800/50 text-red-200 opacity-70'
                                : targetApp.status === 'cancelado'
                                ? 'bg-stone-950 border-stone-800 text-stone-500 line-through'
                                : 'bg-stone-850/95 border-amber-500/40 text-stone-100 hover:border-amber-500'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-white truncate text-xs">
                                  {targetApp.clientName}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-amber-400 shrink-0">
                                  €{targetApp.totalPrice.toFixed(2)}
                                </span>
                              </div>

                              <div className="text-[11px] text-stone-400 line-clamp-1">
                                {services
                                  .filter(s => targetApp.serviceIds.includes(s.id))
                                  .map(s => s.name)
                                  .join(', ')}
                              </div>

                              <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                                <span className="text-stone-400 flex items-center gap-1 font-mono">
                                  <Phone className="w-2.5 h-2.5 text-stone-500" />
                                  {targetApp.clientPhone}
                                </span>
                                <span className="text-stone-600">·</span>
                                <span className="font-mono text-stone-400">
                                  {targetApp.durationMin}m
                                </span>
                              </div>
                            </div>

                            {/* Status & Quick Action Buttons */}
                            <div className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1">
                                {targetApp.status === 'concluido' ? (
                                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Concluído
                                  </span>
                                ) : targetApp.status === 'faltou' ? (
                                  <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Faltou
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => updateAppointmentStatus(targetApp.id, 'concluido')}
                                    className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded border border-emerald-600/50 transition-colors"
                                    title="Marcar como Concluído e Registar Pagamento"
                                  >
                                    Concluir
                                  </button>
                                )}

                                {targetApp.status !== 'concluido' && targetApp.status !== 'faltou' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(targetApp.id, 'faltou')}
                                    className="px-1.5 py-0.5 text-[10px] text-stone-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                                    title="Registar Falta (No-Show)"
                                  >
                                    Falta
                                  </button>
                                )}
                              </div>

                              {/* WhatsApp Reminder Button */}
                              {targetApp.status !== 'concluido' && targetApp.status !== 'cancelado' && (
                                <button
                                  onClick={() => sendReminder(targetApp.id, 'whatsapp')}
                                  className={`p-1 rounded text-[10px] transition-colors flex items-center gap-1 ${
                                    targetApp.reminderStatus === 'lembrete_enviado'
                                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800'
                                      : 'text-stone-300 hover:text-emerald-400 hover:bg-stone-800'
                                  }`}
                                  title="Enviar Lembrete por WhatsApp"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  {targetApp.reminderStatus === 'lembrete_enviado' && (
                                    <span className="text-[9px]">Enviado</span>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : isLunch ? (
                          <div className="h-full flex items-center justify-center text-[10px] text-stone-600 font-medium">
                            Pausa Almoço
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              onOpenQuickBookingWithParams(selectedDate, time, barber.id)
                            }
                            className="w-full h-full min-h-[50px] rounded-lg border border-dashed border-stone-800/80 hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors flex items-center justify-center text-stone-700 hover:text-amber-400 group"
                            title={`Marcar neste horário (${time}) para ${barber.name}`}
                          >
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: List View (Compact & Ideal for Mobile) */
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 divide-y divide-stone-800">
          {dayAppointments.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm">
              Nenhuma marcação registada para este dia.
            </div>
          ) : (
            dayAppointments
              .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
              .map(app => {
                const barber = barbers.find(b => b.id === app.barberId);
                return (
                  <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 text-center shrink-0 pt-0.5">
                        <span className="font-mono text-sm font-bold text-amber-400 block">
                          {app.time}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">
                          {app.durationMin}m
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">
                            {app.clientName}
                          </h4>
                          <span className="text-[10px] text-stone-400 font-mono">
                            ({app.clientPhone})
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            app.status === 'concluido'
                              ? 'bg-emerald-950 text-emerald-400'
                              : app.status === 'faltou'
                              ? 'bg-red-950 text-red-400'
                              : 'bg-stone-800 text-stone-300'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-stone-400 mt-0.5">
                          {services.filter(s => app.serviceIds.includes(s.id)).map(s => s.name).join(', ')}
                          <span className="text-amber-500 font-semibold ml-2">
                            Barbeiro: {barber?.name}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="font-mono font-bold text-sm text-white mr-2">
                        €{app.totalPrice.toFixed(2)}
                      </span>

                      {app.status !== 'concluido' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'concluido')}
                          className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        >
                          Concluir
                        </button>
                      )}

                      <button
                        onClick={() => sendReminder(app.id, 'whatsapp')}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-400 rounded-lg transition-colors"
                        title="Lembrete WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
};
