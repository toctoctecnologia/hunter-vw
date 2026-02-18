import type { AgendaEvent } from '@/types/agendaEvent';

interface AgendaEventListProps {
  events: AgendaEvent[];
}

export const AgendaEventList = ({ events }: AgendaEventListProps) => (
  <div className="space-y-2">
    {events.map(evt => (
      <div
        key={evt.id}
        className="relative border-l-4 p-2 mb-1 rounded-lg"
        style={{ borderColor: evt.color }}
      >
        {evt.badge && (
          <span className="absolute top-1 right-1 bg-white text-xs px-2 py-0.5 rounded">
            {evt.badge}
          </span>
        )}
        <div className="text-sm font-semibold">{evt.title}</div>
        <div className="text-xs text-gray-500">
          {evt.startTime} – {evt.endTime}
        </div>
        {evt.description && (
          <div className="text-xs text-gray-700">{evt.description}</div>
        )}
      </div>
    ))}
  </div>
);

export default AgendaEventList;
