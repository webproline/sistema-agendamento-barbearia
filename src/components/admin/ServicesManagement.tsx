import React, { useState } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import { Scissors, Plus, Edit2, Trash2, Clock, Check, X } from 'lucide-react';
import { Service, ServiceCategory } from '../../types/barbershop';

export const ServicesManagement: React.FC = () => {
  const { services, addOrEditService, deleteService } = useBarbershop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('cabelo');
  const [price, setPrice] = useState<number>(15);
  const [durationMin, setDurationMin] = useState<number>(30);
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(false);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setCategory('cabelo');
    setPrice(15);
    setDurationMin(30);
    setDescription('');
    setPopular(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setPrice(srv.price);
    setDurationMin(srv.durationMin);
    setDescription(srv.description);
    setPopular(!!srv.popular);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const srv: Service = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      name: name.trim(),
      category,
      price: Number(price),
      durationMin: Number(durationMin),
      description: description.trim(),
      popular,
      active: true,
    };

    addOrEditService(srv);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div>
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-500" />
            <span>Preçário & Catálogo de Serviços</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Defina preços (€), duração de cada serviço na agenda e descrições visíveis no agendamento online
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(srv => (
          <div
            key={srv.id}
            className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-display text-base font-bold text-white">
                    {srv.name}
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    {srv.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-white block">
                    €{srv.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-amber-500 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {srv.durationMin}m
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                {srv.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between">
              {srv.popular ? (
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-semibold border border-amber-500/20">
                  Destaque
                </span>
              ) : (
                <span className="text-[10px] text-stone-500">Padrão</span>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteService(srv.id)}
                  className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h3 className="font-display text-lg font-bold text-white">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
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
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Corte Degradê + Barba"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Preço (€) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Duração (Minutos) *
                  </label>
                  <select
                    value={durationMin}
                    onChange={e => setDurationMin(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value={15}>15 min</option>
                    <option value={20}>20 min</option>
                    <option value={30}>30 min</option>
                    <option value={40}>40 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={75}>75 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ServiceCategory)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="cabelo">Cabelo</option>
                  <option value="barba">Barba</option>
                  <option value="combo">Combo</option>
                  <option value="especial">Especial / Tratamento</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  placeholder="Descrição exibida ao cliente na marcação..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={popular}
                  onChange={e => setPopular(e.target.checked)}
                  className="rounded border-stone-700 bg-stone-950 text-amber-500"
                />
                <label htmlFor="popularCheck" className="text-xs text-stone-300 cursor-pointer">
                  Destacar como serviço "Mais Pedido"
                </label>
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
                  Guardar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
