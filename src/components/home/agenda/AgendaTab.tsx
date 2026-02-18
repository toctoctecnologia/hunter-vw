import React from 'react';

export interface AgendaTabProps {
  events?: any[];
  onEventClick?: (event: any) => void;
  onClose?: () => void;
}

export function AgendaTab({ events, onEventClick }: AgendaTabProps) {
  return (
    <div>
      {/* Agenda Tab Placeholder */}
      Agenda Tab
    </div>
  );
}