import React, { useState } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import { formatDatePT } from '../../utils/calendar';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  FileText,
  Save,
  MessageSquare,
} from 'lucide-react';
import { ClientProfile } from '../../types/barbershop';
import { getWhatsAppUrl } from '../../utils/calendar';

export const ClientsCRM: React.FC = () => {
  const { clients, updateClientNotes, barbers, appointments } = useBarbershop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(clients[0] || null);
  const [editingNotes, setEditingNotes] = useState(selectedClient?.notes || '');

  const filteredClients = clients.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      (c.email && c.email.toLowerCase().includes(term))
    );
  });

  const handleSelectClient = (c: ClientProfile) => {
    setSelectedClient(c);
    setEditingNotes(c.notes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedClient) return;
    updateClientNotes(selectedClient.phone, editingNotes);
  };

  // Get client's appointments history
  const clientAppointments = selectedClient
    ? appointments.filter(
        a => a.clientPhone.replace(/\D/g, '') === selectedClient.phone.replace(/\D/g, '')
      )
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Client List (Left 1 col) */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col h-[740px]">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Ficha de Clientes ({clients.length})</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Histórico de visitas, preferências e assiduidade
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou telemóvel..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Client items */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-800/60 pr-1">
          {filteredClients.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-8">
              Nenhum cliente encontrado.
            </p>
          ) : (
            filteredClients.map(client => {
              const isSelected = selectedClient?.phone === client.phone;
              return (
                <button
                  key={client.phone}
                  onClick={() => handleSelectClient(client)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-2 my-1 ${
                    isSelected
                      ? 'bg-amber-500/10 border border-amber-500/60 text-white'
                      : 'hover:bg-stone-850 text-stone-300'
                  }`}
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm truncate text-white">
                      {client.name}
                    </h4>
                    <p className="text-xs font-mono text-stone-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5 text-stone-500" />
                      {client.phone}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-1">
                      <span>{client.totalVisits} cortes</span>
                      <span>·</span>
                      <span className="font-mono">€{client.totalSpent.toFixed(2)} total</span>
                    </div>
                  </div>

                  {client.noShowCount > 0 && (
                    <span className="text-[10px] text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900/60 font-semibold shrink-0">
                      {client.noShowCount} falta(s)
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Client Detail (Right 2 cols) */}
      <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl h-[740px] flex flex-col overflow-y-auto">
        {selectedClient ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
              <div>
                <h3 className="font-display text-2xl font-bold text-white">
                  {selectedClient.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-stone-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-mono text-stone-300">
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                    {selectedClient.phone}
                  </span>
                  {selectedClient.email && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-stone-500" />
                        {selectedClient.email}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppUrl(selectedClient.phone, 'Olá!')}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Mensagem WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-[11px] text-stone-400 block uppercase font-medium">Total de Visitas</span>
                <span className="text-xl font-mono font-bold text-white">
                  {selectedClient.totalVisits}
                </span>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-[11px] text-stone-400 block uppercase font-medium">Faturação Total</span>
                <span className="text-xl font-mono font-bold text-amber-400">
                  €{selectedClient.totalSpent.toFixed(2)}
                </span>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-[11px] text-stone-400 block uppercase font-medium">Faltas (No-Show)</span>
                <span className={`text-xl font-mono font-bold ${selectedClient.noShowCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedClient.noShowCount}
                </span>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-[11px] text-stone-400 block uppercase font-medium">Última Visita</span>
                <span className="text-xs font-semibold text-stone-300 block mt-1">
                  {selectedClient.lastVisitDate ? formatDatePT(selectedClient.lastVisitDate) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Barber & Style Notes (CRM Notes) */}
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  Notas do Barbeiro (Preferências de Corte & Estilo)
                </span>
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                >
                  <Save className="w-3 h-3" />
                  <span>Guardar</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={editingNotes}
                onChange={e => setEditingNotes(e.target.value)}
                placeholder="ex: Gosta do degradê navalhado 0.5 alto, corte tesoura em cima, barba reta nas bochechas, café curto com açúcar..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Past & Upcoming Appointments for this client */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Histórico de Agendamentos ({clientAppointments.length})
              </h4>
              <div className="space-y-2">
                {clientAppointments.length === 0 ? (
                  <p className="text-xs text-stone-500 bg-stone-950 p-4 rounded-xl border border-stone-800 text-center">
                    Sem histórico de agendamentos registado.
                  </p>
                ) : (
                  clientAppointments.map(app => {
                    const barber = barbers.find(b => b.id === app.barberId);
                    return (
                      <div
                        key={app.id}
                        className="bg-stone-950 border border-stone-800/80 p-3 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-amber-400 font-bold">
                            {app.time}
                          </span>
                          <div>
                            <span className="text-white font-semibold">
                              {formatDatePT(app.date)}
                            </span>
                            <span className="text-stone-500 ml-2">
                              com {barber?.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-white font-bold">
                            €{app.totalPrice.toFixed(2)}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            app.status === 'concluido'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                              : app.status === 'faltou'
                              ? 'bg-red-950 text-red-400 border border-red-800/60'
                              : 'bg-stone-900 text-stone-300'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-stone-500 text-sm">
            Selecione um cliente à esquerda para ver os detalhes.
          </div>
        )}
      </div>
    </div>
  );
};
