export interface Category {
  id: number;
  referenceId: number;
  name: string;
  color: string;
  isForTask: boolean;
  isForEvent: boolean;
  seqn: number;
  isDefaultForTask: boolean;
  isDefaultForEvent: boolean;
}

export interface CreateCategory{
  referenceId: number;
  name: string;
  color: string;
  isForTask: boolean;
  isForEvent: boolean;
}

export interface UpdateCategory{
  id: number;
  name: string;
  color: string;
  isForTask: boolean;
  isForEvent: boolean;
}
