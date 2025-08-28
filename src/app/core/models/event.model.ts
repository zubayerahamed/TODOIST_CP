export interface Event {
  id: number;
  projectId: number;
  categoryId: number;
  title: string;
  description: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  isReminderEnabled: boolean;
  reminderBefore: number;
  isReminderSent: boolean;
  isCompleted: boolean;
  eventLink: string;
  checklists: EventChecklist[];
  projectName: string;
  categoryName: string;
}

export interface AddEvent{
  title: string;
  description: string;
  projectId: number;
  categoryId: number;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  isReminderEnabled: boolean;
  reminderBefore: number;
  perticipants: number[];
  documents: number[];
  checklists: AddEventChecklist[];
  eventLink: string;
}

export interface EventChecklist{
  id: number;
  eventId: number;
  description: string;
  isCompleted: boolean;
}

export interface AddEventChecklist{
  description: string;
  isCompleted: boolean;
}
