export interface Workspace {
  id: number;
  name: string;
  avatar: string;
}

export interface CreateWorkspace{
  name: string;
}

export interface UpdateWorkspace{
  id: number;
  name: string;
}
