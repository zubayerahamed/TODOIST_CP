import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Status, CreateStatus, UpdateStatus } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private statuses: Status[] = [
    { id: 1, name: 'New task', color: '#ff9800', order: 1, isCompleted: false },
    { id: 2, name: 'Scheduled', color: '#2196f3', order: 2, isCompleted: false },
    { id: 3, name: 'In Progress', color: '#9c27b0', order: 3, isCompleted: false },
    { id: 4, name: 'Hold', color: '#f44336', order: 4, isCompleted: false },
    { id: 5, name: 'Completed', color: '#000000', order: 5, isCompleted: true }
  ];

  private nextId = 6;

  getAllStatuses(): Observable<{ data: Status[] }> {
    return of({ data: [...this.statuses].sort((a, b) => a.order - b.order) });
  }

  createStatus(status: CreateStatus): Observable<{ data: Status }> {
    const newStatus: Status = {
      id: this.nextId++,
      ...status
    };
    this.statuses.push(newStatus);
    return of({ data: newStatus });
  }

  updateStatus(status: UpdateStatus): Observable<{ data: Status }> {
    const index = this.statuses.findIndex(s => s.id === status.id);
    if (index !== -1) {
      this.statuses[index] = { ...status };
    }
    return of({ data: this.statuses[index] });
  }

  deleteStatus(id: number): Observable<{ success: boolean }> {
    const index = this.statuses.findIndex(s => s.id === id);
    if (index !== -1 && !this.statuses[index].isCompleted) {
      this.statuses.splice(index, 1);
    }
    return of({ success: true });
  }

  updateStatusOrder(statuses: Status[]): Observable<{ data: Status[] }> {
    // Update the order of statuses, but keep completed status at the end
    const nonCompletedStatuses = statuses.filter(s => !s.isCompleted);
    const completedStatus = statuses.find(s => s.isCompleted);
    
    nonCompletedStatuses.forEach((status, index) => {
      status.order = index + 1;
      const existingIndex = this.statuses.findIndex(s => s.id === status.id);
      if (existingIndex !== -1) {
        this.statuses[existingIndex] = status;
      }
    });

    if (completedStatus) {
      completedStatus.order = nonCompletedStatuses.length + 1;
      const completedIndex = this.statuses.findIndex(s => s.id === completedStatus.id);
      if (completedIndex !== -1) {
        this.statuses[completedIndex] = completedStatus;
      }
    }

    return of({ data: [...this.statuses].sort((a, b) => a.order - b.order) });
  }
}
