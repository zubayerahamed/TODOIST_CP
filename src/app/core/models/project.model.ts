export interface Project{
    id: number;
    workspaceId: number;
    name: string;
    color: string;
    isFavourite: boolean;
    seqn: number;
    isSystemDefined: boolean;
    isInheritSettings: boolean;
    layoutType: string;
    totalActiveEvents: number | 0;
	totalActiveTasks: number | 0;
}

export interface AddProject{
    name: string;
    color: string;
    layoutType: string;
    isFavourite: boolean;
}

export interface UpdateProject{
    id: number;
    name: string;
    color: string | null;
    layoutType: string | null;
    isFavourite: boolean | null;
}