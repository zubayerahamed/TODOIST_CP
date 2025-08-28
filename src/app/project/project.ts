import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventPreview } from "../core/components/shared/event-preview/event-preview";
import { Event } from '../core/models/event.model';
import { EventService } from '../core/services/event.service';
import { ProjectPageStateService } from '../core/services/porjectpage-state.service';

@Component({
  selector: 'app-project',
  imports: [RouterLink, EventPreview],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4',
  },
})
export class Project implements OnInit {
  @Input() projectName!: string;
  projectId!: string;

  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private projectPageStateService = inject(ProjectPageStateService);

  public events: Event[] = [];

  ngOnInit() {
    const subscription = this.activatedRoute.params.subscribe({
      next: (paramMap) => {
        this.projectId = paramMap['projectId'];
        this.loadEvents();
      },
    });

    const projectPageSubscription = this.projectPageStateService.projectPageUpdate$.subscribe({
      next: (data) => {
          this.loadEvents();
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      projectPageSubscription.unsubscribe();
    });
  }

  loadEvents() {
    this.eventService.getAllInCompleteEvents(parseInt(this.projectId, 10)).subscribe({
      next: (response) => {
        this.events = response.data || [];
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      },
    });
  }

}
