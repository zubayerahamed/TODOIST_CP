import { Component, inject } from '@angular/core';
import { EventRequest, EventService } from '../core/services/event.service';
import { ProjectService } from '../core/services/project.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-upcoming',
  imports: [CommonModule, DatePipe],
  templateUrl: './upcoming.html',
  styleUrls: ['./upcoming.css'],
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class Upcoming {

  constructor(
    private eventService: EventService,
  ) { }

  pageTitle: string = 'Today';
  public projectService = inject(ProjectService);

  tasks: string = '';
  events: EventRequest[] = [];

  ngOnInit(): void {
    this.eventService.getAllTodaysEvents().subscribe({
      next: (events) => {
        this.events = events.map(ev => ({
          ...ev,
          perticipants: ev.perticipants ?? []
        }));
        console.log("Events loaded:", this.events);
      },
      error: (err) => console.error(err),
    });
  }

  getEventDuration(event: EventRequest): string {
    const start = event.startTime.split(':').map(Number);
    const end = event.endTime.split(':').map(Number);

    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];

    let diffMinutes = endMinutes - startMinutes;
    if (diffMinutes < 0) diffMinutes += 24 * 60;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
  }

}
