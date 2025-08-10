export interface Workflow {
  id: number;
  referenceId: number;
  referenceType: string;
  name: string;
  isSystemDefined: boolean;
  seqn: number;
  color: string;
}

export interface CreateWorkflow {
  referenceId: number;
  name: string;
  seqn: number;
  color: string;
}

export interface UpdateWorkflow {
  id: number;
  name: string;
  seqn: number;
  color: string;
}
