import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodayPageStateService {
  private todayPageUpdateSource = new BehaviorSubject<any>(null);
  todayPageUpdate$ = this.todayPageUpdateSource.asObservable();

  updateTodayPage(data: any) {
    this.todayPageUpdateSource.next(data);
  }
}
