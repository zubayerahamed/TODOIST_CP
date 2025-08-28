import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class PageService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllTodaysEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pages/today`);
  }

  
}