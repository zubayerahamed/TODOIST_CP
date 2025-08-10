import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTag, UpdateTag } from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllTags(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tags`);
  }

  createTag(data: CreateTag): Observable<any> {
    return this.http.post(`${this.baseUrl}/tags`, data);
  }

  updateTag(data: UpdateTag): Observable<any> {
    return this.http.put(`${this.baseUrl}/tags`, data);
  }

  findTag(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tags/${id}`);
  }

  deleteTag(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tags/${id}`);
  }
}
