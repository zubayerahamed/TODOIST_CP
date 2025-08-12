export interface Workspace {
  id: number;
  name: string;
  isActive: boolean;
  isSystemDefined: boolean;
  avatar: string;
  isPrimary: boolean;
  isAdmin: boolean;
  isCollaborator: boolean;
}

export interface AddWorkspace {
  name: string;
}

export interface UpdateWorkspace {
  id: number;
  name: string;
}
