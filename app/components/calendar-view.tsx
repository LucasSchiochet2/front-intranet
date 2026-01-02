'use client';

import { useState } from 'react';
import { CalendarEvent } from '../api';
import { CalendarPopup } from './calendar-popup';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const d = new Date(year, month, 1 - (firstDayOfMonth - i));
      days.push({ date: d, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }
    
    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isEventOnDay = (eventDateStr: string, day: Date) => {
    const eventDate = new Date(eventDateStr);
    return eventDate.getUTCDate() === day.getDate() &&
           eventDate.getUTCMonth() === day.getMonth() &&
           eventDate.getUTCFullYear() === day.getFullYear();
  };

  const hasEvents = (date: Date) => {
    return events.some(event => isEventOnDay(event.start_date, date));
  };

  const selectedDateEvents = events.filter(event => 
    isEventOnDay(event.start_date, selectedDate)
  );

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const isSelected = isSameDay(day.date, selectedDate);
            const isToday = isSameDay(day.date, new Date());
            const dayHasEvents = hasEvents(day.date);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  h-14 rounded-lg flex flex-col items-center justify-center relative transition-all
                  ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                  ${isSelected ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-50'}
                  ${isToday && !isSelected ? 'bg-blue-50 text-primary font-bold' : ''}
                `}
              >
                <span className="text-sm">{day.date.getDate()}</span>
                {dayHasEvents && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Eventos do dia
        </h3>
        
        <div className="text-sm text-gray-500 mb-6 capitalize">
          {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map(event => (
              <div 
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                className="p-4 rounded-lg border border-gray-100 hover:border-primary hover:shadow-sm transition-all group bg-gray-50 cursor-pointer"
              >
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(event.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                      {' - '}
                      {new Date(event.end_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-500 mt-2 line-clamp-2 text-xs">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>Nenhum evento para este dia.</p>
            </div>
          )}
        </div>
      </div>

      <CalendarPopup 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}
