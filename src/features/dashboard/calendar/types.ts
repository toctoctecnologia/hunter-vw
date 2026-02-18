interface Time {
  hour: number;
  minute: number;
  second: number;
}

export interface CalendarAppointment {
  uuid: string;
  title: string;
  description: string;
  appointmentDate: string; // '2025-10-26'
  startingTime: Time | string; // Pode ser objeto Time ou string "HH:mm:ss"
  endingTime: Time | string; // Pode ser objeto Time ou string "HH:mm:ss"
  color: string;
}

export interface TaskType {
  code: string;
  name: string;
  description: string;
  leadRequired: boolean;
}

export interface TaskLead {
  uuid: string;
  name: string;
  phone: string;
  email: string;
}

export interface Task {
  uuid: string;
  title: string;
  description: string;
  taskType: TaskType;
  taskDate: string; //'2025-10-26'
  taskTime: Time;
  lead: TaskLead;
  color: string;
  completed: boolean;
  propertyCode?: string;
}
