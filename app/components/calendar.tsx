import { getUpcomingEvents } from '../api';
import Link from 'next/link';
import { CalendarList } from './calendar-list';

export async function Calendar() {
  const events = await getUpcomingEvents();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Calendário</h2>
        <Link href="/calendario" className="text-sm text-primary hover:underline">
          Ver agenda
        </Link>
      </div>
      <CalendarList events={events} />
    </div>
  );
}
