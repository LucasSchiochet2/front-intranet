'use client';

import { useState } from 'react';
import { CalendarEvent } from '../interfaces';
import { CalendarPopup } from './calendar-popup';

interface CalendarListProps {
  events: CalendarEvent[];
}

export function CalendarList({ events }: CalendarListProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  return (
    <>
      <div className="space-y-4">
        {events.slice(0, 3).map((event) => (
          <div 
            key={event.id} 
            onClick={() => setSelectedEvent(event)}
            className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
          >
            <div className="shrink-0 w-12 text-center bg-gray-50 rounded-lg p-1">
              <span className="block text-xs font-medium text-gray-500 uppercase">
                {new Date(event.start_date).toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '')}
              </span>
              <span className="block text-lg font-bold text-gray-900">
                {new Date(event.start_date).getUTCDate()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <i className="las la-clock"></i>
                  {new Date(event.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CalendarPopup 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </>
  );
}
