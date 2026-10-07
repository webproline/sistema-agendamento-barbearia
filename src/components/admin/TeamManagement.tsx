import React, { useState } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import { Users, Clock, Star, Phone, CheckCircle2, Edit2, Plus, X } from 'lucide-react';
import { Barber } from '../../types/barbershop';

export const TeamManagement: React.FC = () => {
  const { barbers, addOrEditBarber } = useBarbershop();
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('19:30');
  const [lunchStart, setLunchStart] = useState('13:00');
  const [lunchEnd, setLunchEnd] = useState('14:00');

  const handleEdit = (b: Barber) => {
    setEditingBarber(b);
    setName(b.name);
    setRole(b.role);
    setPhone(b.phone);
    setBio(b.bio);
    setStartTime(b.workingHours.start);
    setEndTime(b.workingHours.end);
    setLunchStart(b.workingHours.lunchStart || '13:00');
    setLunchEnd(b.workingHours.lunchEnd || '14:00');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBarber) {
      const updated: Barber = {
        ...editingBarber,
        name: name.trim(),
        role: role.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        workingHours: {
          start: startTime,
          end: endTime,
          lunchStart,
          lunchEnd,
        },
      };
      addOrEditBarber(updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Equipa & Barbeiros da Loja</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Gerir horários de trabalho, pausas de almoço e perfis profissionais
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {barbers.map(barber => (
          <div
            key={barber.id}
            className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden border border-stone-700 bg-stone-800 shadow-md">
                <img
                  src={barber.photoUrl}
                  alt={barber.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center mb-4">
                <h4 className="font-display text-lg font-bold text-white">
                  {barber.name}
                </h4>
                <p className="text-xs text-amber-500 font-medium">
                  {barber.role}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mt-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-white">{barber.rating}</span>
                  <span>·</span>
                  <span>{barber.cutsCount} cortes</span>
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    Horário:
                  </span>
                  <span className="font-mono text-white font-semibold">
                    {barber.workingHours.start} - {barber.workingHours.end}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    Almoço:
                  </span>
                  <span className="font-mono text-stone-300">
                    {barber.workingHours.lunchStart || '13:00'} - {barber.workingHours.lunchEnd || '14:00'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    Contacto:
                  </span>
                  <span className="font-mono text-stone-300">
                    {barber.phone}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 justify-center">
                {barber.specialties.map(spec => (
                  <span
                    key={spec}
                    className="text-[10px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => handleEdit(barber)}
                className="px-3 py-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-stone-950 hover:bg-stone-800 rounded-lg border border-stone-800 flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Horário & Perfil</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h3 className="font-display text-lg font-bold text-white">
                Editar Barbeiro ({editingBarber.name})
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Cargo / Especialidade
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Início Turno
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Fim Turno
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Início Almoço
                  </label>
                  <input
                    type="time"
                    value={lunchStart}
                    onChange={e => setLunchStart(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Fim Almoço
                  </label>
                  <input
                    type="time"
                    value={lunchEnd}
                    onChange={e => setLunchEnd(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition-all"
                >
                  Guardar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
