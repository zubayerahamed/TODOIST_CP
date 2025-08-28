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

  getAllUpcomingEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pages/upcoming`);
  }
  
  getAllCompletedEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pages/completed`);
  }

  getCountOfAllTodaysEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pages/today/count`);
  }

  getCountOfAllUpcomingEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pages/upcoming/count`);
  }
  
  getCountOfAllCompletedEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pages/completed/count`);
  }
}