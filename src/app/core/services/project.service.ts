import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddProject, Project } from '../models/project.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllProjects(): Observable<any> {
    console.log('Fetching all projects from the server...');
    return this.http.get(`${this.baseUrl}/projects`);
  }

  createProject(data: AddProject): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, data);
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

  // Helper Methods
  getFilteredSystemDefinedProjects(projects: Project[]): Project[] {
    return projects.filter((project: Project) => project.isSystemDefined);
  }

  getFilteredfavouriteProjects(projects: Project[]): Project[] {
    console.log(projects);
    return projects.filter((project) => project.isFavourite && !project.isSystemDefined)
  }

  getFilteredallProjects(projects: Project[]){
    //console.log(projects);
    return projects.filter((project) => !project.isSystemDefined);
  }
}
