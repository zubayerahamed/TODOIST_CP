import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateWorkspace, Workspace } from '../models/workspace.model';
import { CreateWorkspace } from '../../workspaces/create-workspace/create-workspace';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAllWorkspaces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/workspaces`);
  }

  createWorkspace(data: CreateWorkspace): Observable<any> {
    return this.http.post(`${this.baseUrl}/workspaces`, data);
  }

  updateWorkspace(data: UpdateWorkspace): Observable<any> {
    return this.http.put(`${this.baseUrl}/workspaces`, data);
  }

  findWorkspace(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/workspaces/${id}`);
  }

  deleteWorkspace(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/workspaces/${id}`);
  }

}
