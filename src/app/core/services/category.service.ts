import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Category,
  CreateCategory,
  UpdateCategory,
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllWorkspaceCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories/all/workspace`);
  }

  getAllProjectCategories(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories/all/project/${id}`);
  }

  createCategory(data: CreateCategory): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, data);
  }

  updateCategory(data: UpdateCategory): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  addToDefaultTask(referenceid: number, id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/add-to-default-task/${referenceid}/${id}`, null);
  }

  addToDefaultEvent(referenceid: number, id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/add-to-default-event/${referenceid}/${id}`, null);
  }

  // Helper methods
  getFilteredTaskCategories(categories: Category[]): Category[] {
    return categories.filter((category) => category.isForTask);
  }

  getFilteredEventCategories(categories: Category[]): Category[] {
    return categories.filter((category) => category.isForEvent);
  }
}
