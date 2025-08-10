export interface Tag {
  id: number;
  name: string;
  workspaceId: number;
  color: string;
}

export interface CreateTag {
  name: string;
}

export interface UpdateTag {
  id: number;
  name: string;
}
