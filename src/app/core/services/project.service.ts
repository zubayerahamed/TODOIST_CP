import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddProject, Project, UpdateProject } from '../models/project.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  findProject(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects/${id}`);
  }

  totalEventAndTasksCount(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects/total-events-and-tasks/${id}`);
  }

  createProject(data: AddProject): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, data);
  }

  updateProject(data: UpdateProject): Observable<any> {
    return this.http.put(`${this.baseUrl}/projects`, data);
  }

  addToFavoutire(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/projects/add-to-favourite/${id}`, null);
  }

  removeFromFavoutire(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/projects/remove-from-favourite/${id}`, null);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projects/${id}`);
  }

  inheightSettingsFromWorkspace(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects/inherit-workspace-settings/${id}`, null);
  }

  disableInheightSettingsFromWorkspace(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/projects/disable-inherit-workspace-settings/${id}`, null);
  }
}
