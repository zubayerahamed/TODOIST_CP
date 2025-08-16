import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

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
  isReminderSent?: boolean;  // optional
  isCompleted?: boolean;       // needed for template
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
    getAllByProject(projectId: number): Observable<EventRequest[]> {
    return this.http.get<EventRequest[]>(`${this.baseUrl}/events/all/${projectId}`);
  }

  createEvent(payload: EventRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/events`, payload);
  }

  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${id}`);
  }
}
