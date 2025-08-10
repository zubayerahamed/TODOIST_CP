export interface JwtPayload {
  email: string;
  workspaceId: number;
  workspaceName: string;
  workspaceActive: boolean;
  workspaceSystemDefined: boolean;
  roles: string[];
  sub: string;
  exp: number;
  iat: number;
  [key: string]: any;
}
