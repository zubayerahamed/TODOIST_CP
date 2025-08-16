import { Component, inject } from '@angular/core';
import { ProjectService } from '../core/services/project.service';
import { EventRequest, EventService } from '../core/services/event.service';
import { CommonModule, DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule,DatePipe],
  templateUrl: './today.html',
  styleUrls: ['./today.css'],
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class Today {

  constructor(private eventService: EventService) {}

  pageTitle: string = 'Today';
  public projectService = inject(ProjectService);

  events: EventRequest[] = [];
  projectId = 2;

ngOnInit(): void {
  this.eventService.getAllByProject(this.projectId).subscribe({
    next: (data) => this.events = data,
    error: (err) => console.error(err)
  });
}


}
