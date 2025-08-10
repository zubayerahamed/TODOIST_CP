import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AlertService } from '../core/services/alert.service';
import { StatusService } from '../core/services/status.service';
import { Status, CreateStatus, UpdateStatus } from '../core/models/status.model';

@Component({
  selector: 'app-statuses',
  imports: [CommonModule],
  templateUrl: './statuses.html',
  styleUrl: './statuses.css',
})
export class Statuses {
  // Modal state
  @Input({ required: true }) isEditStatusesModalOpen!: boolean;
  @Input({ required: true }) statuses!: Status[];
  @Output() onEditStatusesModalClose = new EventEmitter<void>();
  @Output() triggerRefreshAfterSave = new EventEmitter<void>();

  private statusService = inject(StatusService);
  private alertService = inject(AlertService);

  // Modal methods
  openEditStatusesModal() {
    this.isEditStatusesModalOpen = true;
  }

  closeEditStatusesModal() {
    this.isEditStatusesModalOpen = false;
    this.onEditStatusesModalClose.emit();
  }

  onEditStatusesModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeEditStatusesModal();
    }
  }

  // Status management methods
  addNewStatus() {
    const maxOrder = Math.max(...this.statuses.filter(s => !s.isCompleted).map(s => s.order), 0);
    const newStatus: Status = {
      id: this.statuses.length < 1
        ? -1
        : Math.min(...this.statuses.map(s => s.id)) - 1 >= 0
        ? -1
        : Math.min(...this.statuses.map(s => s.id)) - 1,
      name: '',
      color: '#dddddd',
      order: maxOrder + 1,
      isCompleted: false
    };
    
    // Insert before the completed status
    const completedIndex = this.statuses.findIndex(s => s.isCompleted);
    if (completedIndex !== -1) {
      this.statuses.splice(completedIndex, 0, newStatus);
    } else {
      this.statuses.push(newStatus);
    }
  }

  removeStatus(id: number, name: string) {
    const status = this.statuses.find(s => s.id === id);
    if (status?.isCompleted) {
      this.alertService.error('Error!', 'Cannot delete the Completed status');
      return;
    }

    if (id > 0) {
      if (confirm(`Are you sure you want to delete the status "${name}"? This action cannot be undone.`)) {
        this.statusService.deleteStatus(id).subscribe({
          next: (response) => {
            this.alertService.success('Success!', 'Status deleted successfully');
            this.triggerRefreshAfterSave.emit();
          },
          error: (error) => {
            console.error(error);
            this.alertService.error('Error!', 'Failed to delete status. Please try again.');
          },
        });
      }
    }

    this.statuses = this.statuses.filter((status) => status.id !== id);
  }

  updateStatusName(id: number, name: string) {
    const status = this.statuses.find((status) => status.id == id);
    if (status && !status.isCompleted) {
      status.name = name;
    }
  }

  updateStatusColor(id: number, color: string) {
    const status = this.statuses.find((status) => status.id == id);
    if (status && !status.isCompleted) {
      status.color = color;
    }
  }

  // Arrow button methods for reordering
  moveStatusUp(index: number) {
    if (index > 0 && !this.statuses[index].isCompleted && !this.statuses[index - 1].isCompleted) {
      [this.statuses[index], this.statuses[index - 1]] = [this.statuses[index - 1], this.statuses[index]];
    }
  }

  moveStatusDown(index: number) {
    if (index < this.statuses.length - 1 && !this.statuses[index].isCompleted && !this.statuses[index + 1].isCompleted) {
      [this.statuses[index], this.statuses[index + 1]] = [this.statuses[index + 1], this.statuses[index]];
    }
  }

  canMoveUp(index: number): boolean {
    return index > 0 && !this.statuses[index].isCompleted && !this.statuses[index - 1].isCompleted;
  }

  canMoveDown(index: number): boolean {
    return index < this.statuses.length - 1 && !this.statuses[index].isCompleted && !this.statuses[index + 1].isCompleted;
  }

  saveStatuses() {
    // Update order for all statuses
    this.statuses.forEach((status, index) => {
      status.order = index + 1;
    });

    const createStatusList: CreateStatus[] = this.statuses
      .filter((status) => status.id < 0)
      .map((status) => ({
        name: status.name,
        color: status.color,
        order: status.order,
        isCompleted: status.isCompleted
      }));

    const updateStatusList: UpdateStatus[] = this.statuses
      .filter((status) => status.id > 0)
      .map((status) => ({
        id: status.id,
        name: status.name,
        color: status.color,
        order: status.order,
        isCompleted: status.isCompleted
      }));

    // Combine all API calls into one list
    const createRequests = createStatusList.map((status) =>
      this.statusService.createStatus(status)
    );

    const updateRequests = updateStatusList.map((status) =>
      this.statusService.updateStatus(status)
    );

    // Wait for ALL requests to finish
    forkJoin([...createRequests, ...updateRequests]).subscribe({
      next: (results) => {
        console.log('All statuses saved/updated:', results);
        this.alertService.success('Success!', 'Statuses updated successfully');
        this.closeEditStatusesModal();
        this.triggerRefreshAfterSave.emit();
      },
      error: (err) => {
        console.error('Error saving/updating statuses:', err);
        this.alertService.error('Error!', 'Failed to update statuses');
      },
    });
  }
}
