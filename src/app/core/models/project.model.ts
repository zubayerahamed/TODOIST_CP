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
}