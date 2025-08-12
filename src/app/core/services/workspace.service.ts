import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddWorkspace, UpdateWorkspace } from '../models/workspace.model';
import { BaseService } from './base.service';

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

  getAllOtherWorkspaces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/workspaces/all/others`);
  }

  createWorkspace(data: AddWorkspace): Observable<any> {
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
