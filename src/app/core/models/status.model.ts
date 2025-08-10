export interface Status {
  id: number;
  name: string;
  color: string;
  order: number;
  isCompleted: boolean;
}

export interface CreateStatus {
  name: string;
  color: string;
  order: number;
  isCompleted: boolean;
}

export interface UpdateStatus {
  id: number;
  name: string;
  color: string;
  order: number;
  isCompleted: boolean;
}
