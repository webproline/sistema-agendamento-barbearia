import React, { useState } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import {
  formatDatePT,
  getTodayDateString,
  addDays,
} from '../../utils/calendar';
import {
  BellRing,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone,
  Check,
  AlertCircle,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { Appointment } from '../../types/barbershop';

export const RemindersManagement: React.FC = () => {
  const {
    appointments,
    barbers,
    services,
    config,
    updateConfig,
    sendReminder,
    sendAllDueReminders,
    updateAppointmentStatus,
  } = useBarbershop();

  const [simulatedFilter, setSimulatedFilter] = useState<'all' | 'pending' | 'sent'>('all');
  const [templateText, setTemplateText] = useState(config.whatsappMessageTemplate);
  const [isSavedTemplate, setIsSavedTemplate] = useState(false);

  const todayStr = getTodayDateString();
  const tomorrowStr = addDays(todayStr, 1);

  // Appointments for next 48 hours
  const upcomingAppointments = appointments.filter(
    a =>
      (a.date === todayStr || a.date === tomorrowStr) &&
      a.status !== 'cancelado' &&
      a.status !== 'faltou'
  );

  const pendingReminders = upcomingAppointments.filter(
    a => a.reminderStatus === 'pendente'
  );

  const filteredList = upcomingAppointments.filter(a => {
    if (simulatedFilter === 'pending') return a.reminderStatus === 'pendente';
    if (simulatedFilter === 'sent') return a.reminderStatus !== 'pendente';
    return true;
  });

  const handleSaveTemplate = () => {
    updateConfig({ whatsappMessageTemplate: templateText });
    setIsSavedTemplate(true);
    setTimeout(() => setIsSavedTemplate(false), 3000);
  };

  const handleSimulateClientConfirmation = (appId: string) => {
    // Simulate client replying "Sim, confirmo!" on WhatsApp
    const app = appointments.find(a => a.id === appId);
    if (app) {
      updateAppointmentStatus(appId, 'confirmado');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Anti-Falta Impact */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Menos faltas com lembretes</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Lembretes por WhatsApp com um toque
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              O principal motivo para clientes faltarem a cortes de cabelo é o esquecimento. Este módulo prepara a mensagem de lembrete pronta a enviar por WhatsApp, com um toque por cliente, para as marcações de hoje e de amanhã.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => sendAllDueReminders()}
              disabled={pendingReminders.length === 0}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>
                Marcar todos como enviados ({pendingReminders.length})
              </span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-800">
          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800/80">
            <span className="text-[11px] text-stone-400 block uppercase font-medium">Taxa de Assiduidade (exemplo)</span>
            <span className="text-xl font-mono font-bold text-emerald-400">96.4%</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">+4.2% vs mês anterior</span>
          </div>

          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800/80">
            <span className="text-[11px] text-stone-400 block uppercase font-medium">Faltas Evitadas (exemplo)</span>
            <span className="text-xl font-mono font-bold text-amber-400">22 este mês</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">~€410 em cortes protegidos</span>
          </div>

          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800/80">
            <span className="text-[11px] text-stone-400 block uppercase font-medium">Lembretes Pendentes</span>
            <span className="text-xl font-mono font-bold text-white">
              {pendingReminders.length} clientes
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Próximas 24/48 horas</span>
          </div>

          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800/80">
            <span className="text-[11px] text-stone-400 block uppercase font-medium">Canal Principal</span>
            <span className="text-xl font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              WhatsApp
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Taxa abertura 99%</span>
          </div>
        </div>
      </div>

      {/* Main Reminders Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Fila de Lembretes (Hoje e Amanhã)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Clientes com marcações próximas a aguardar confirmação de comparência
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setSimulatedFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                simulatedFilter === 'all'
                  ? 'bg-stone-800 text-white font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Todos ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setSimulatedFilter('pending')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                simulatedFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Pendentes ({pendingReminders.length})
            </button>
            <button
              onClick={() => setSimulatedFilter('sent')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                simulatedFilter === 'sent'
                  ? 'bg-emerald-950 text-emerald-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Enviados / Confirmados
            </button>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="py-12 text-center text-stone-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-300">
              Nenhum lembrete nesta lista.
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Todos os clientes nas próximas 48h já foram notificados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-800/80">
            {filteredList.map(app => {
              const barber = barbers.find(b => b.id === app.barberId);
              const srvs = services.filter(s => app.serviceIds.includes(s.id));
              const isToday = app.date === todayStr;

              return (
                <div
                  key={app.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-850/40 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 text-center shrink-0">
                      <span className={`text-[11px] font-bold block ${isToday ? 'text-amber-400' : 'text-stone-400'}`}>
                        {isToday ? 'HOJE' : 'AMANHÃ'}
                      </span>
                      <span className="font-mono text-base font-bold text-white">
                        {app.time}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {app.durationMin}m
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white">
                          {app.clientName}
                        </h4>
                        <span className="text-xs font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                          {app.clientPhone}
                        </span>

                        {/* Status indicator */}
                        {app.reminderStatus === 'confirmado_cliente' ? (
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                            <CheckCircle2 className="w-3 h-3" /> Confirmado pelo Cliente
                          </span>
                        ) : app.reminderStatus === 'lembrete_enviado' ? (
                          <span className="text-[11px] text-sky-400 font-medium flex items-center gap-1 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                            <Check className="w-3 h-3" /> Lembrete Enviado
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                            <Clock className="w-3 h-3" /> Pendente de Envio
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-400 mt-1">
                        {srvs.map(s => s.name).join(', ')} · Barbeiro: <strong className="text-stone-300">{barber?.name}</strong> · Total: <span className="font-mono text-white">€{app.totalPrice.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => sendReminder(app.id, 'whatsapp')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                      title="Abrir WhatsApp com mensagem preenchida"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{app.reminderStatus === 'pendente' ? 'Enviar WhatsApp' : 'Reenviar'}</span>
                    </button>

                    {app.reminderStatus === 'lembrete_enviado' && (
                      <button
                        onClick={() => handleSimulateClientConfirmation(app.id)}
                        className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl border border-stone-700 transition-colors"
                        title="Simular que o cliente respondeu ao WhatsApp confirmando a presença"
                      >
                        Simular Confirmação
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WhatsApp Message Template Config */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Modelo de Mensagem de Lembrete</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Personalize a mensagem enviada aos clientes. Variáveis disponíveis: <code className="text-amber-400 font-mono">{'{cliente}'}</code>, <code className="text-amber-400 font-mono">{'{data}'}</code>, <code className="text-amber-400 font-mono">{'{hora}'}</code>, <code className="text-amber-400 font-mono">{'{barbeiro}'}</code>.
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={templateText}
            onChange={e => setTemplateText(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-mono resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-500">
              {isSavedTemplate && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Modelo atualizado com sucesso!
                </span>
              )}
            </span>

            <button
              onClick={handleSaveTemplate}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold rounded-xl text-xs border border-stone-700 transition-colors"
            >
              Guardar Modelo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
