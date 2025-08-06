import { Participant } from "./participant.model";

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  assignedParticipant?: Participant;
  order: number;
}
