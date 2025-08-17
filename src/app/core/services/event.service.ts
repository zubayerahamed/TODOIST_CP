import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { ApiResponse } from '../models/api-response.model';

export interface EventParticipant {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface EventRequest {
  id?: number;
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
  isReminderSent?: boolean;
  isCompleted?: boolean;
  documents?: number[];
  perticipants?: EventParticipant[];
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

getAllTodaysEvents(): Observable<EventRequest[]> {
  return this.http
    .get<ApiResponse<EventRequest[]>>(`${this.baseUrl}/events/today`)
    .pipe(map(res => res.data)); // pick only the array
}


  getAllByProject(projectId: number): Observable<EventRequest[]> {
  return this.http
    .get<ApiResponse<EventRequest[]>>(`${this.baseUrl}/events/all/${projectId}`)
    .pipe(map(res => res.data));
}

  createEvent(payload: EventRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/events`, payload);
  }

  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${id}`);
  }
}
