import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  minDate?: string;
  disableSundays?: boolean;
  workingDays?: number[];
  markedDates?: string[];
}

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  selectedDate,
  onSelectDate,
  minDate,
  disableSundays = false,
  workingDays,
  markedDates = [],
}) => {
  const [year, month, selectedDay] = selectedDate.split('-').map(Number);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(year, month - 1, 1));
  useEffect(() => {
    setVisibleMonth(new Date(year, month - 1, 1));
  }, [year, month]);
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const offset = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const minMonth = minDate ? new Date(Number(minDate.slice(0, 4)), Number(minDate.slice(5, 7)) - 1, 1) : undefined;
  const canGoBack = !minMonth || visibleMonth > minMonth;
  const marks = new Set(markedDates);
  const today = new Date();

  const changeMonth = (amount: number) => {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1));
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 sm:p-5" aria-label="Calendário mensal">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={!canGoBack}
          aria-label="Mês anterior"
          className="rounded-lg p-2 text-stone-300 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-semibold capitalize text-white">
          {visibleMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Mês seguinte"
          className="rounded-lg p-2 text-stone-300 hover:bg-stone-800"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
          <span key={day} className="py-2 text-[10px] font-semibold uppercase text-stone-500 sm:text-xs">{day}</span>
        ))}
        {Array.from({ length: offset }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
          const dateString = toDateString(date);
          const isSelected = year === visibleMonth.getFullYear() && month === visibleMonth.getMonth() + 1 && selectedDay === day;
          const isDisabled = (!!minDate && dateString < minDate) ||
            (disableSundays && date.getDay() === 0) ||
            (!!workingDays && !workingDays.includes(date.getDay()));
          const isToday = toDateString(today) === dateString;

          return (
            <button
              key={dateString}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateString)}
              aria-pressed={isSelected}
              aria-label={`${day} de ${visibleMonth.toLocaleDateString('pt-PT', { month: 'long' })}${marks.has(dateString) ? ', com marcações' : ''}`}
              className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors sm:h-11 sm:w-11 ${
                isSelected ? 'bg-amber-500 font-bold text-stone-950' :
                isDisabled ? 'cursor-not-allowed text-stone-700' :
                'text-stone-200 hover:bg-stone-800'
              } ${isToday && !isSelected ? 'ring-1 ring-amber-500/70' : ''}`}
            >
              {day}
              {marks.has(dateString) && <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-stone-950' : 'bg-amber-400'}`} />}
            </button>
          );
        })}
      </div>
      {markedDates.length > 0 && (
        <p className="mt-3 text-center text-[11px] text-stone-500">Os pontos assinalam dias com marcações.</p>
      )}
    </div>
  );
};
