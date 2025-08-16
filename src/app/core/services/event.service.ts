import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface EventRequest {
  title: string;
  description?: string | null;
  projectId?: number | null;
  categoryId?: number | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  isReminderEnabled: boolean;
  reminderBefore: number;
  documents?: number[];
  perticipants: number[];
}

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseService {
  constructor(protected http: HttpClient) {
    super();
  }

  getAllEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/events`);
  }

  createEvent(payload: EventRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/events`, payload);
  }

  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${id}`);
  }
}
