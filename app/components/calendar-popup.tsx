'use client';

import { X, Clock, Calendar as CalendarIcon, User } from 'lucide-react';
import { CalendarEvent } from '../interfaces';
import { useEffect, useRef } from 'react';

interface CalendarPopupProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarPopup({ event, isOpen, onClose }: CalendarPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        ref={popupRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            Detalhes do Evento
          </h3>
          <button
            onClick={onClose}
            aria-label="Fechar popup"
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span>
                  {new Date(event.start_date).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    timeZone: 'UTC'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  {new Date(event.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                  {' - '}
                  {new Date(event.end_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                </span>
              </div>
              {event.collaborator && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{event.collaborator.name}</span>
                </div>
              )}
            </div>
          </div>

          {event.description && (
            <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p>{event.description}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
