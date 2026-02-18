export interface Service {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  icon?: import('lucide-react').LucideIcon;
  professional?: string;
  price?: string;
  property?: {
    name?: string;
    type?: string;
    address?: {
      street?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
    };
  };
  scheduledDate?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  area?: number;
  status?: string;
  progress?: number;
  credits?: number;
  currency?: string;
  statusText?: string;
  completedTasks?: string[];
  gallery?: string[];
}
