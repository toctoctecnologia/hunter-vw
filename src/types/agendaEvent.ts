export interface AgendaEvent {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'canceled';
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  participants?: string[];
  color?: string;     // hex or Tailwind class
  badge?: string;
  imageUrl?: string;
}
