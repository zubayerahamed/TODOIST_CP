import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceStateService {
  private workspaceNameSubject = new BehaviorSubject<string>('');
  public workspaceName$: Observable<string> = this.workspaceNameSubject.asObservable();

  constructor() {
    this.initializeFromStorage();
  }

  updateWorkspaceName(name: string): void {
    this.workspaceNameSubject.next(name);
    sessionStorage.setItem("workspaceName", name);
  }

  getWorkspaceName(): string {
    return this.workspaceNameSubject.value || sessionStorage.getItem("workspaceName") || '';
  }

  initializeFromStorage(): void {
    const storedName = sessionStorage.getItem("workspaceName") || '';
    this.workspaceNameSubject.next(storedName);
  }
}
