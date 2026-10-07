import React, { useState } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import { X, Clock, User, Phone, CheckCircle2, Scissors, Calendar } from 'lucide-react';
import { getTodayDateString } from '../../utils/calendar';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultBarberId?: string;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  defaultTime,
  defaultBarberId,
}) => {
  const { barbers, services, createAppointment, getAvailableSlots, selectedDate } = useBarbershop();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [barberId, setBarberId] = useState(defaultBarberId || barbers[0]?.id || 'barber-pedro');
  const [serviceId, setServiceId] = useState(services[0]?.id || 'srv-corte-classico');
  const [date, setDate] = useState(defaultDate || selectedDate || getTodayDateString());
  const [time, setTime] = useState(defaultTime || '11:00');
  const [source, setSource] = useState<'telefone' | 'balcao_walkin'>('telefone');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentService = services.find(s => s.id === serviceId) || services[0];
  const availableSlots = getAvailableSlots(date, barberId, currentService?.durationMin || 30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError('Insira o nome do cliente');
      return;
    }
    if (!clientPhone.trim()) {
      setError('Insira o telemóvel do cliente');
      return;
    }

    createAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientNotes: clientNotes.trim() || undefined,
      serviceIds: [serviceId],
      barberId,
      date,
      time,
      source,
    });

    onClose();
    setClientName('');
    setClientPhone('');
    setClientNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Nova Marcação Rápida (Balcão / Telefone)
              </h3>
              <p className="text-[11px] text-stone-400">
                Registo imediato para clientes que ligam ou entram na loja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200">
              {error}
            </div>
          )}

          {/* Source toggle */}
          <div>
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              Origem da Marcação
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSource('telefone')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  source === 'telefone'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-850'
                }`}
              >
                📞 Chamada Telefónica
              </button>
              <button
                type="button"
                onClick={() => setSource('balcao_walkin')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  source === 'balcao_walkin'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-850'
                }`}
              >
                🚶 Presencial (Balcão / Walk-in)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nome do Cliente *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="ex: Carlos Manuel"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Telemóvel (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="ex: 912 345 678"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Barbeiro
              </label>
              <select
                value={barberId}
                onChange={e => setBarberId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {barbers.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Serviço
              </label>
              <select
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (€{s.price.toFixed(2)} - {s.durationMin}m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Quick slot chips if available */}
          {availableSlots.length > 0 && (
            <div>
              <span className="text-[11px] text-stone-400 block mb-1">
                Sugestões de horários vagos:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {availableSlots.slice(0, 6).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTime(s)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                      time === s
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Notas Adicionais (opcional)
            </label>
            <input
              type="text"
              placeholder="ex: cliente com pressa, gosta de café curto..."
              value={clientNotes}
              onChange={e => setClientNotes(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition-all shadow-md active:scale-95"
            >
              Registar Marcação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
