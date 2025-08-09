import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration: number;
  showProgress: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  showAlert(
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    duration: number = 5000,
    showProgress: boolean = true
  ): void {
    const alert: Alert = {
      id: this.generateId(),
      type,
      title,
      message,
      duration,
      showProgress
    };

    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([...currentAlerts, alert]);

    // Auto remove alert after duration
    setTimeout(() => {
      this.removeAlert(alert.id);
    }, duration);
  }

  success(title: string, message: string, duration?: number): void {
    this.showAlert('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number): void {
    this.showAlert('error', title, message, duration);
  }

  warning(title: string, message: string, duration?: number): void {
    this.showAlert('warning', title, message, duration);
  }

  info(title: string, message: string, duration?: number): void {
    this.showAlert('info', title, message, duration);
  }

  removeAlert(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next(currentAlerts.filter(alert => alert.id !== id));
  }

  clearAll(): void {
    this.alertsSubject.next([]);
  }
}
