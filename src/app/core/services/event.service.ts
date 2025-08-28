import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { AddEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllEvents(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/all/${id}`);
  }


  createEvent(data: AddEvent): Observable<any> {
    return this.http.post(`${this.baseUrl}/events`, data);
  }

 
}