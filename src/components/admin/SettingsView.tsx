import React, { useState } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import {
  Settings,
  Store,
  Instagram,
  Phone,
  MapPin,
  Clock,
  Download,
  RotateCcw,
  CheckCircle2,
  Save,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, resetDataToSample, appointments, clients, services, barbers } =
    useBarbershop();

  const [name, setName] = useState(config.name);
  const [subtitle, setSubtitle] = useState(config.subtitle);
  const [phone, setPhone] = useState(config.phone);
  const [address, setAddress] = useState(config.address);
  const [city, setCity] = useState(config.city);
  const [instagramHandle, setInstagramHandle] = useState(config.instagramHandle);
  const [instagramUrl, setInstagramUrl] = useState(config.instagramUrl);
  const [weekdaysHours, setWeekdaysHours] = useState(config.openingHours.weekdays);
  const [slotInterval, setSlotInterval] = useState(config.slotIntervalMin);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      name,
      subtitle,
      phone,
      address,
      city,
      instagramHandle,
      instagramUrl,
      slotIntervalMin: Number(slotInterval),
      openingHours: {
        ...config.openingHours,
        weekdays: weekdaysHours,
      },
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      config,
      services,
      barbers,
      appointments,
      clients,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-barbearia-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="mb-6 pb-4 border-b border-stone-800">
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <span>Configurações Gerais da Barbearia</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Informações visíveis aos clientes na marcação e integração com redes sociais
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nome da Barbearia
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Telemóvel de Contacto / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Slogan / Subtítulo
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Morada da Barbearia
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Localidade / Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Instagram link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Identificador Instagram
              </label>
              <div className="relative">
                <Instagram className="w-4 h-4 text-pink-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={e => setInstagramHandle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Link do Perfil Instagram
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={e => setInstagramUrl(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Horário Semanal
              </label>
              <input
                type="text"
                value={weekdaysHours}
                onChange={e => setWeekdaysHours(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Intervalo da Agenda (Minutos)
              </label>
              <select
                value={slotInterval}
                onChange={e => setSlotInterval(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value={15}>15 minutos</option>
                <option value={20}>20 minutos</option>
                <option value={30}>30 minutos (recomendado)</option>
                <option value={45}>45 minutos</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configurações</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup and Data Maintenance */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-display text-base font-bold text-white mb-1">
          Segurança de Dados & Cópia de Segurança
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          Todos os dados (agendamentos, clientes, histórico) são guardados de forma segura e local. Pode exportar uma cópia de segurança a qualquer momento.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-500" />
            <span>Descarregar Backup (.json)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Tem a certeza que deseja restaurar os dados de demonstração iniciais?')) {
                resetDataToSample();
              }
            }}
            className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-300 border border-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Restaurar Dados de Demonstração</span>
          </button>
        </div>
      </div>
    </div>
  );
};
