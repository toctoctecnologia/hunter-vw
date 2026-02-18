import React from 'react';
import { CreateEventModal } from './CreateEventModal';

export type AgendarAgendaModalProps = React.ComponentProps<typeof CreateEventModal>;

export const AgendarAgendaModal = (props: AgendarAgendaModalProps) => {
  return <CreateEventModal {...props} />;
};

export default AgendarAgendaModal;
