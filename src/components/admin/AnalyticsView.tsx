import React from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import { getTodayDateString } from '../../utils/calendar';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Scissors,
  ShieldCheck,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { appointments, services, barbers, clients } = useBarbershop();
  const todayStr = getTodayDateString();

  // Today's stats
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const todayCompleted = todayAppointments.filter(a => a.status === 'concluido');
  const todayRevenue = todayCompleted.reduce((sum, a) => sum + a.totalPrice, 0);
  const todayProjectedRevenue = todayAppointments
    .filter(a => a.status !== 'cancelado' && a.status !== 'faltou')
    .reduce((sum, a) => sum + a.totalPrice, 0);

  // All time completed
  const allCompleted = appointments.filter(a => a.status === 'concluido');
  const totalRevenueAll = allCompleted.reduce((sum, a) => sum + a.totalPrice, 0);
  const totalNoShows = appointments.filter(a => a.status === 'faltou').length;
  const totalBookings = appointments.filter(a => a.status !== 'cancelado').length;
  const noShowRate = totalBookings > 0 ? ((totalNoShows / totalBookings) * 100).toFixed(1) : '0';
  const averageTicket = allCompleted.length > 0 ? (totalRevenueAll / allCompleted.length).toFixed(2) : '18.50';

  // Services distribution
  const serviceCounts: Record<string, number> = {};
  appointments.forEach(a => {
    if (a.status !== 'cancelado') {
      a.serviceIds.forEach(id => {
        serviceCounts[id] = (serviceCounts[id] || 0) + 1;
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="uppercase font-semibold tracking-wider">Faturação de Hoje</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-white">
              €{todayRevenue.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Previsão do dia: <strong className="text-amber-400 font-mono">€{todayProjectedRevenue.toFixed(2)}</strong> ({todayAppointments.length} cortes)
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="uppercase font-semibold tracking-wider">Ticket Médio</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-white">
              €{averageTicket}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Valor médio por cliente atendido
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="uppercase font-semibold tracking-wider">Taxa de Faltas (No-Show)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-emerald-400">
              {noShowRate}%
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Muito baixa graças aos lembretes automáticos
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="uppercase font-semibold tracking-wider">Base de Clientes</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-white">
              {clients.length}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Clientes fidelizados registados no sistema
          </p>
        </div>
      </div>

      {/* Services breakdown & Barbers performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular services list */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-display text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-500" />
            <span>Serviços Mais Solicitados</span>
          </h3>
          <p className="text-xs text-stone-400 mb-6">
            Ranking de preferência dos clientes na marcação online e presencial
          </p>

          <div className="space-y-4">
            {services.map(srv => {
              const count = serviceCounts[srv.id] || 0;
              const max = Math.max(...Object.values(serviceCounts), 1);
              const percentage = Math.round((count / max) * 100);

              return (
                <div key={srv.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-200">{srv.name}</span>
                    <span className="font-mono text-stone-400">
                      {count} pedidos · <strong className="text-white">€{srv.price.toFixed(2)}</strong>
                    </span>
                  </div>
                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Barbers stats */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-display text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Desempenho dos Barbeiros</span>
          </h3>
          <p className="text-xs text-stone-400 mb-6">
            Marcações atribuídas e taxa de ocupação da cadeira
          </p>

          <div className="space-y-4">
            {barbers.map(barber => {
              const barberApps = appointments.filter(
                a => a.barberId === barber.id && a.status !== 'cancelado'
              );
              const barberRevenue = appointments
                .filter(a => a.barberId === barber.id && a.status === 'concluido')
                .reduce((sum, a) => sum + a.totalPrice, 0);

              return (
                <div
                  key={barber.id}
                  className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={barber.photoUrl}
                      alt={barber.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-stone-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{barber.name}</h4>
                      <p className="text-xs text-stone-400">{barber.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-white block">
                      {barberApps.length} atendimentos
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      €{barberRevenue.toFixed(2)} faturado
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
