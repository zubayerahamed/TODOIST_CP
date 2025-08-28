import { KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Event } from '../../../models/event.model';
import { EventPreview } from '../event-preview/event-preview';

@Component({
  selector: 'app-page-detail',
  imports: [KeyValuePipe, EventPreview],
  templateUrl: './page-detail.html',
  styleUrl: './page-detail.css',
})
export class PageDetail {
  @Input() groupedEvents!: { [key: string]: Event[] };
  @Input() ignoreCompleted!: boolean;
}
