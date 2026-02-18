import { createContext, useContext } from 'react';

interface EventModalContextValue {
  openEventModal: (eventId: string) => void;
}

export const EventModalContext = createContext<EventModalContextValue>({
  openEventModal: () => {}
});

export const useEventModal = () => useContext(EventModalContext);
