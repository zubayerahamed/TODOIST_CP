import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectPageStateService {
  private projectPageUpdateSource = new BehaviorSubject<any>(null);
  projectPageUpdate$ = this.projectPageUpdateSource.asObservable();

  updateProjectPage(data: any) {
    this.projectPageUpdateSource.next(data);
  }
}
