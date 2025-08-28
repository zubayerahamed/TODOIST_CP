import { Component, inject, OnInit } from '@angular/core';
import { Event } from '../core/models/event.model';
import { PageService } from '../core/services/page.service';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './today.html',
  styleUrls: ['./today.css'],
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class Today implements OnInit {
  
  pageTitle: string = 'Today';

  private pageService = inject(PageService);

  public events: Event[] = [];
  public groupedEvents: { [key: string]: Event[] } = {};
  
  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(){
    this.pageService.getAllTodaysEvents().subscribe({
      next: (response) => {
        this.events = response.data || [];
        this.groupedEvents = this.proupEventsByProjectName(this.events);
        console.log(this.groupedEvents);
      },
      error: (error) => {
        console.error('Error fetching today\'s events:', error);
      },
    });
  }

  proupEventsByProjectName(events: Event[]): { [key: string]: Event[] } {
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
