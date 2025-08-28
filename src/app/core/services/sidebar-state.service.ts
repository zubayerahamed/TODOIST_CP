import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
    private sidebarUpdateSource = new BehaviorSubject<any>(null);
    sidebarUpdate$ = this.sidebarUpdateSource.asObservable();

    updateSidebarProjects(data: any) {
        this.sidebarUpdateSource.next(data);
    }
}