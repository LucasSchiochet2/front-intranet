import { getCalendarEvents } from '../api';
import Link from 'next/link';

export async function Calendar() {
  const events = await getCalendarEvents();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Calendário</h2>
        <Link href="/calendario" className="text-sm text-[var(--color-primary)] hover:underline">
          Ver agenda
        </Link>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex-shrink-0 w-12 text-center bg-gray-50 rounded-lg p-1">
              <span className="block text-xs font-medium text-gray-500 uppercase">
                {new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
              </span>
              <span className="block text-lg font-bold text-gray-900">
                {new Date(event.date).getDate()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <i className="las la-clock"></i>
                  {event.time}
                </span>
                {event.location && event.location !== '-' && (
                  <span className="flex items-center gap-1">
                    <i className="las la-map-marker"></i>
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
