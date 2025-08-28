import { Component, inject, Input } from '@angular/core';
import { Event, EventChecklist } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { AlertService } from '../../../services/alert.service';
import { SidebarStateService } from '../../../services/sidebar-state.service';
import { TodayPageStateService } from '../../../services/todaypage-state.service';
import { ProjectPageStateService } from '../../../services/porjectpage-state.service';

@Component({
  selector: 'app-event-preview',
  imports: [],
  templateUrl: './event-preview.html',
  styleUrl: './event-preview.css',
})
export class EventPreview {
  @Input() events!: Event[];
  @Input() ignoreCompleted!: boolean;

  private eventService = inject(EventService);
  private alertService = inject(AlertService);
  private sidebarStateService = inject(SidebarStateService);
  private todayPageStageService = inject(TodayPageStateService);
  private projectPageStateService = inject(ProjectPageStateService);

  completeEvent(event: Event) {
    if (event.isCompleted) {
      return; // Already completed
    }

    this.eventService.markCompleteEvent(event.id).subscribe({
      next: (response) => {
        event.isCompleted = true;
        this.alertService.success('Success!', 'Event marked as complete.');
        this.sidebarStateService.updateSidebarProjects(null);
        this.sidebarStateService.updatePageCounts(null);
        this.todayPageStageService.updateTodayPage(null);
        this.projectPageStateService.updateProjectPage(null);
      },
      error: (error) => {
        console.error('Error completing event:', error);
        this.alertService.error('Error', 'Failed to mark event as complete.');
      },
    });
  }

  inCompleteEvent(event: Event) {
    if (!event.isCompleted) {
      return; // Already incompleted
    }

    this.eventService.markInCompleteEvent(event.id).subscribe({
      next: (response) => {
        event.isCompleted = false;
        this.alertService.success('Success!', 'Event marked as incomplete.');
        this.sidebarStateService.updateSidebarProjects(null);
        this.sidebarStateService.updatePageCounts(null);
        this.todayPageStageService.updateTodayPage(null);
        this.projectPageStateService.updateProjectPage(null);
      },
      error: (error) => {
        console.error('Error completing event:', error);
        this.alertService.error('Error', 'Failed to mark event as incomplete.');
      },
    });
  }

  toggleChecklist(checklist: EventChecklist) {
    if (checklist.isCompleted) {
      this.eventService.markInCompleteEventChecklist(checklist.id).subscribe({
        next: (response) => {
          checklist.isCompleted = false;
          this.alertService.success(
            'Success!',
            'Checklist item marked as incomplete.'
          );
        },
        error: (error) => {
          console.error('Error marking checklist item as incomplete:', error);
          this.alertService.error(
            'Error',
            'Failed to mark checklist item as incomplete.'
          );
        },
      });
    } else {
      this.eventService.markCompleteEventChecklist(checklist.id).subscribe({
        next: (response) => {
          checklist.isCompleted = true;
          this.alertService.success(
            'Success!',
            'Checklist item marked as complete.'
          );
        },
        error: (error) => {
          console.error('Error marking checklist item as complete:', error);
          this.alertService.error(
            'Error',
            'Failed to mark checklist item as complete.'
          );
        },
      });
    }
  }

  getDisplayDate(eventDate: Date): string {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // normalize by removing time part
    const normalize = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const eventDay = normalize(new Date(eventDate));
    const todayDay = normalize(today);
    const tomorrowDay = normalize(tomorrow);

    if (eventDay.getTime() === todayDay.getTime()) {
      return 'Today';
    } else if (eventDay.getTime() === tomorrowDay.getTime()) {
      return 'Tomorrow';
    } else {
      return eventDay.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }

  // Format "HH:mm:ss" (string) → "hh:mm AM/PM"
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Calculate duration between start & end
  getDuration(start: string, end: string): string {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(sh, sm, 0);

    const endDate = new Date();
    endDate.setHours(eh, em, 0);

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;

    return result.trim();
  }
}
