import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project.model';

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
