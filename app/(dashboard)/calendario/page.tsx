import { getCalendarEvents } from '../../api';
import { CalendarView } from '../../components/calendar-view';

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div className="md:p-6 h-[calc(100vh-80px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Calendário de Eventos</h1>
        <p className="text-gray-500">Acompanhe os próximos eventos e atividades</p>
      </div>
      <CalendarView events={events} />
    </div>
  );
}
