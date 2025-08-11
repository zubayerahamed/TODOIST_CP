import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateWorkflow, UpdateWorkflow } from '../models/workflow.model';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllWorkspaceWorkflows(): Observable<any> {
    return this.http.get(`${this.baseUrl}/workflows/all/workspace`);
  }

  getAllProjectWorkflows(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/workflows/all/project/${id}`);
  }

  createWorkflow(data: CreateWorkflow): Observable<any> {
    return this.http.post(`${this.baseUrl}/workflows`, data);
  }

  updateWorkflow(data: UpdateWorkflow): Observable<any> {
    return this.http.put(`${this.baseUrl}/workflows`, data);
  }

  deleteWorkflow(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/workflows/${id}`);
  }
}
