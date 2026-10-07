import React, { useState, useMemo } from 'react';
import { useBarbershop } from '../../context/BarbershopContext';
import {
  formatDatePT,
  formatDateShortPT,
  getTodayDateString,
  addDays,
  downloadICSFile,
  getClientWhatsAppConfirmationUrl,
} from '../../utils/calendar';
import {
  Scissors,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Star,
  Info,
  CalendarCheck,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Appointment, Barber, Service } from '../../types/barbershop';

export const ClientBookingFlow: React.FC = () => {
  const {
    services,
    barbers,
    config,
    createAppointment,
    getAvailableSlots,
  } = useBarbershop();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('barber-pedro');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['srv-corte-classico']);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Client details form
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Completed booking
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Selected services calculations
  const selectedServices = useMemo(() => {
    return services.filter(s => selectedServiceIds.includes(s.id));
  }, [services, selectedServiceIds]);

  const totalDuration = useMemo(() => {
    const sum = selectedServices.reduce((acc, s) => acc + s.durationMin, 0);
    return sum > 0 ? sum : 30;
  }, [selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((acc, s) => acc + s.price, 0);
  }, [selectedServices]);

  const selectedBarber = useMemo(() => {
    return barbers.find(b => b.id === selectedBarberId) || barbers[0];
  }, [barbers, selectedBarberId]);

  // Date choices (Next 12 days)
  const availableDates = useMemo(() => {
    const list: { dateStr: string; dayLabel: string; dateLabel: string; isSunday: boolean }[] = [];
    const today = getTodayDateString();
    for (let i = 0; i < 14; i++) {
      const d = addDays(today, i);
      const [y, m, dayNum] = d.split('-').map(Number);
      const dateObj = new Date(y, m - 1, dayNum);
      const dayOfWeek = dateObj.getDay();
      list.push({
        dateStr: d,
        dayLabel: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : formatDateShortPT(d),
        dateLabel: `${dayNum} ${dateObj.toLocaleDateString('pt-PT', { month: 'short' })}`,
        isSunday: dayOfWeek === 0,
      });
    }
    return list;
  }, []);

  // Compute available slots
  const availableSlots = useMemo(() => {
    if (!selectedBarberId || !selectedDate) return [];
    return getAvailableSlots(selectedDate, selectedBarberId, totalDuration);
  }, [selectedDate, selectedBarberId, totalDuration, getAvailableSlots]);

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter(s => s !== id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  const handleNextToSlots = () => {
    if (selectedServiceIds.length === 0) return;
    setStep(3);
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedTime(slot);
    setStep(4);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setFormError('Por favor insira o seu nome.');
      return;
    }
    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setFormError('Por favor insira um número de telemóvel válido (mínimo 9 dígitos).');
      return;
    }

    setFormError('');
    const newAppointment = createAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      clientNotes: clientNotes.trim() || undefined,
      serviceIds: selectedServiceIds,
      barberId: selectedBarberId,
      date: selectedDate,
      time: selectedTime,
      source: 'online',
    });

    setConfirmedBooking(newAppointment);
    setStep(5);
  };

  const handleResetFlow = () => {
    setStep(1);
    setSelectedTime('');
    setConfirmedBooking(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero section */}
      <div className="relative border-b border-stone-800 bg-stone-900/40">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/images/hero_barbearia_pedro_1791388778185.jpg"
            alt="Interior Barbearia D. Pedro V"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <span className="text-amber-500 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2 block">
            Marcação Autónoma & Instantânea
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            {config.name}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {config.subtitle} Escolha o seu barbeiro, selecione os serviços e reserve o seu horário em menos de 1 minuto sem esperas.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {config.address}, {config.city}
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Seg - Sáb: {config.openingHours.weekdays}
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Lembretes Automáticos por WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* Booking Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4">
        {/* Step Indicator (1 to 4) */}
        {step < 5 && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 sm:p-4 mb-6 shadow-xl">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <button
                onClick={() => setStep(1)}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  step === 1
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : step > 1
                    ? 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    : 'text-stone-500'
                }`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
                  1
                </span>
                <span className="truncate">Barbeiro</span>
              </button>

              <button
                onClick={() => setStep(2)}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  step === 2
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : step > 2
                    ? 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    : 'text-stone-500'
                }`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
                  2
                </span>
                <span className="truncate">Serviços</span>
              </button>

              <button
                onClick={() => handleNextToSlots()}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  step === 3
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : step > 3
                    ? 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    : 'text-stone-500'
                }`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
                  3
                </span>
                <span className="truncate">Data & Hora</span>
              </button>

              <button
                disabled={!selectedTime}
                onClick={() => selectedTime && setStep(4)}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  step === 4
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : selectedTime
                    ? 'text-stone-300 hover:text-white'
                    : 'text-stone-600 cursor-not-allowed'
                }`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
                  4
                </span>
                <span className="truncate">Seus Dados</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Select Barber */}
        {step === 1 && (
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm animate-fade-in">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Escolha o seu Barbeiro
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Selecione o profissional da sua preferência para o corte
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {barbers.map(barber => {
                const isSelected = selectedBarberId === barber.id;
                return (
                  <button
                    key={barber.id}
                    onClick={() => {
                      setSelectedBarberId(barber.id);
                    }}
                    className={`relative p-5 rounded-xl border text-left transition-all group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-stone-800/90 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                    }`}
                  >
                    <div>
                      <div className="relative w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden border border-stone-700 bg-stone-800">
                        <img
                          src={barber.photoUrl}
                          alt={barber.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-stone-950 p-1 rounded-full shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <h3 className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {barber.name}
                        </h3>
                        <p className="text-xs text-amber-500/90 font-medium mt-0.5">
                          {barber.role}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-stone-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-white">{barber.rating}</span>
                          <span>·</span>
                          <span>{barber.cutsCount}+ cortes</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-400 mt-3 line-clamp-2 text-center leading-relaxed">
                        {barber.bio}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-wrap gap-1 justify-center">
                      {barber.specialties.map(spec => (
                        <span
                          key={spec}
                          className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <span>Avançar para Serviços</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Services */}
        {step === 2 && (
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Escolha os seus Serviços
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Pode selecionar um ou combinar múltiplos serviços (ex: Corte + Barba + Sobrancelha)
                </p>
              </div>

              {/* Running total banner */}
              <div className="bg-stone-950 px-4 py-2.5 rounded-xl border border-stone-800 flex items-center gap-4 shrink-0">
                <div>
                  <span className="text-[11px] text-stone-400 block uppercase font-medium">Tempo Total</span>
                  <span className="text-sm font-mono font-bold text-amber-400">
                    {totalDuration} min
                  </span>
                </div>
                <div className="h-6 w-px bg-stone-800" />
                <div>
                  <span className="text-[11px] text-stone-400 block uppercase font-medium">Total a Pagar</span>
                  <span className="text-lg font-mono font-bold text-white">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {services.map(service => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-stone-950'
                            : 'border-stone-700 bg-stone-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm sm:text-base font-bold text-white">
                            {service.name}
                          </h3>
                          {service.popular && (
                            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                              Mais Pedido
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                          <span className="flex items-center gap-1 text-stone-400">
                            <Clock className="w-3 h-3 text-amber-500" />
                            {service.durationMin} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-mono font-bold text-white">
                        €{service.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar ao Barbeiro</span>
              </button>

              <button
                onClick={handleNextToSlots}
                disabled={selectedServiceIds.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <span>Escolher Data & Horário ({totalDuration}m)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Date & Time Slot */}
        {step === 3 && (
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Escolha a Data & Horário
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Com o barbeiro <strong className="text-amber-400">{selectedBarber.name}</strong> · Duração: <span className="font-mono text-stone-200">{totalDuration} min</span>
                </p>
              </div>

              <div className="text-xs text-stone-400 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Horários livres sincronizados em tempo real</span>
              </div>
            </div>

            {/* Date carousel / horizontal scroll */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2.5">
                1. Selecione o Dia
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {availableDates.map(item => {
                  const isSelected = selectedDate === item.dateStr;
                  const isClosed = item.isSunday;

                  return (
                    <button
                      key={item.dateStr}
                      disabled={isClosed}
                      onClick={() => {
                        setSelectedDate(item.dateStr);
                        setSelectedTime('');
                      }}
                      className={`min-w-[84px] p-3 rounded-xl border text-center transition-all shrink-0 flex flex-col items-center justify-center ${
                        isClosed
                          ? 'opacity-40 bg-stone-950/40 border-stone-900 cursor-not-allowed'
                          : isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-800/60'
                      }`}
                    >
                      <span className={`text-[11px] uppercase ${isSelected ? 'text-stone-950 font-bold' : 'text-stone-400'}`}>
                        {item.dayLabel}
                      </span>
                      <span className={`text-base font-bold my-0.5 ${isSelected ? 'text-stone-950' : 'text-white'}`}>
                        {item.dateLabel.split(' ')[0]}
                      </span>
                      <span className={`text-[11px] ${isSelected ? 'text-stone-950/80 font-medium' : 'text-stone-500'}`}>
                        {isClosed ? 'Fechado' : item.dateLabel.split(' ')[1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                  2. Horários Livres para {formatDatePT(selectedDate)}
                </label>
                <span className="text-xs text-stone-400 font-mono">
                  {availableSlots.length} horários disponíveis
                </span>
              </div>

              {availableSlots.length === 0 ? (
                <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-8 text-center">
                  <Clock className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-300">
                    Sem horários livres para este dia com este barbeiro.
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Por favor tente selecionar outro dia acima ou escolha outro barbeiro da equipa.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-stone-900 rounded-lg border border-stone-800"
                  >
                    Ver outros barbeiros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {availableSlots.map(slot => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-3 px-2 rounded-xl text-center font-mono text-sm font-semibold border transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-amber-500/60 hover:text-white hover:bg-stone-800'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar aos Serviços</span>
              </button>

              {selectedTime && (
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <span>Continuar com {selectedTime}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Client Info & Final Submission */}
        {step === 4 && (
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm animate-fade-in">
            <div className="mb-6 pb-4 border-b border-stone-800">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                Finalizar Marcação
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Introduza os seus dados para receber a confirmação e o lembrete automático
              </p>
            </div>

            {/* Summary card */}
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 sm:p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] uppercase font-semibold text-stone-400 block">
                  Data e Hora
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {formatDatePT(selectedDate)}
                </p>
                <p className="text-sm font-mono font-bold text-amber-400">
                  às {selectedTime} ({totalDuration} min)
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase font-semibold text-stone-400 block">
                  Barbeiro
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {selectedBarber.name}
                </p>
                <p className="text-xs text-stone-400">
                  {selectedBarber.role}
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase font-semibold text-stone-400 block">
                  Serviços ({selectedServices.length})
                </span>
                <p className="text-xs text-stone-300 mt-0.5">
                  {selectedServices.map(s => s.name).join(', ')}
                </p>
                <p className="text-base font-mono font-bold text-white mt-1">
                  Total: €{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="ex: João Silva"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Telemóvel (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="ex: 912 345 678"
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Usado para enviar o lembrete antes do corte e evitar faltas.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Email (opcional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="ex: joao@exemplo.pt"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Observações / Estilo desejado (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="ex: Degrade 0.5 alto, aparar a barba deixando formato quadrado..."
                  value={clientNotes}
                  onChange={e => setClientNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              {/* Notice */}
              <div className="p-3 bg-stone-950 border border-stone-800/80 rounded-xl flex items-start gap-3 text-xs text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Garantia de pontualidade: reservamos a cadeira exclusivamente para si. O pagamento é realizado diretamente no balcão da barbearia (Dinheiro, MB Way ou Multibanco).
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar aos Horários</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-7 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <span>Confirmar Agendamento</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 5: Success & Digital Pass */}
        {step === 5 && confirmedBooking && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl animate-fade-in max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Marcação Confirmada · Código {confirmedBooking.id}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-3">
                Tudo pronto, {confirmedBooking.clientName.split(' ')[0]}!
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-md mx-auto">
                O seu horário foi registado diretamente no sistema da barbearia. Não precisa de ligar nem de esperar.
              </p>
            </div>

            {/* Ticket representation */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 relative overflow-hidden mb-6 shadow-xl">
              {/* Decorative barber pole stripe subtle border top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-stone-200 to-blue-600" />

              <div className="flex items-center justify-between pb-4 border-b border-stone-800/80">
                <div>
                  <span className="text-xs font-display font-bold text-white">
                    {config.name}
                  </span>
                  <p className="text-[11px] text-stone-400">
                    {config.address}, {config.city}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase font-mono block">Código</span>
                  <span className="text-sm font-mono font-bold text-amber-400">
                    {confirmedBooking.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-5 text-xs">
                <div>
                  <span className="text-stone-400 block mb-0.5">Data & Hora</span>
                  <p className="font-semibold text-white">
                    {formatDatePT(confirmedBooking.date)}
                  </p>
                  <p className="font-mono text-amber-400 font-bold text-base mt-0.5">
                    {confirmedBooking.time}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 block mb-0.5">Barbeiro</span>
                  <p className="font-semibold text-white">
                    {selectedBarber.name}
                  </p>
                  <p className="text-stone-400 mt-0.5">
                    {selectedBarber.role}
                  </p>
                </div>

                <div className="col-span-2 pt-3 border-t border-stone-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-stone-400 block mb-0.5">Serviços Selecionados</span>
                    <p className="font-semibold text-white">
                      {selectedServices.map(s => s.name).join(' + ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-400 block mb-0.5">Valor Total</span>
                    <p className="font-mono text-lg font-bold text-white">
                      €{confirmedBooking.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800/60 text-xs text-stone-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Lembrete Ativo:</strong> Receberá uma notificação no WhatsApp no próprio dia com o resumo do corte.
                </span>
              </div>
            </div>

            {/* Quick Actions for Client */}
            <div className="space-y-3">
              <a
                href={getClientWhatsAppConfirmationUrl(
                  confirmedBooking,
                  selectedBarber.name,
                  selectedServices.map(s => s.name).join(' + '),
                  config.phone
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Confirmação para o WhatsApp da Barbearia</span>
              </a>

              <button
                onClick={() => downloadICSFile(confirmedBooking, selectedBarber, selectedServices)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl border border-stone-700 transition-all text-sm"
              >
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                <span>Adicionar ao Calendário (Google / Apple / Outlook)</span>
              </button>

              <button
                onClick={handleResetFlow}
                className="w-full py-2.5 text-xs text-stone-400 hover:text-white transition-colors"
              >
                Fazer nova marcação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
