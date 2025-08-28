import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PageDetail } from "../core/components/shared/page-detail/page-detail";
import { Event } from '../core/models/event.model';
import { PageService } from '../core/services/page.service';
import { TodayPageStateService } from '../core/services/todaypage-state.service';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [PageDetail],
  templateUrl: './today.html',
  styleUrls: ['./today.css'],
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class Today implements OnInit {
  
  pageTitle: string = 'Today';

  private destroyRef = inject(DestroyRef);
  private pageService = inject(PageService);
  private todayPageStageService = inject(TodayPageStateService);

  public events: Event[] = [];
  public groupedEvents: { [key: string]: Event[] } = {};
  
  ngOnInit(): void {
    const todayPageSubscription = this.todayPageStageService.todayPageUpdate$.subscribe({
      next: (data) => {
        this.loadEvents();
      },
    });

    this.destroyRef.onDestroy(() => {
      todayPageSubscription.unsubscribe();
    });

    this.loadEvents();
  }

  loadEvents(){
    this.pageService.getAllTodaysEvents().subscribe({
      next: (response) => {
        this.events = response.data || [];
        this.groupedEvents = this.groupEventsByProjectName(this.events);
      },
      error: (error) => {
        console.error('Error fetching today\'s events:', error);
      },
    });
  }

  groupEventsByProjectName(events: Event[]): { [key: string]: Event[] } {
    return events.reduce((groupedEvents, event) => {
      const projectName = event.projectName;
      if (!groupedEvents[projectName]) {
        groupedEvents[projectName] = [];
      }
      groupedEvents[projectName].push(event);
      return groupedEvents;
    }, {} as { [key: string]: Event[] });
  }

}
