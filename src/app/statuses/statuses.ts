import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AlertService } from '../core/services/alert.service';
import { StatusService } from '../core/services/status.service';
import { Status, CreateStatus, UpdateStatus } from '../core/models/status.model';
import { CreateWorkflow, UpdateWorkflow, Workflow } from '../core/models/workflow.model';
import { WorkflowService } from '../core/services/workflow.service';

@Component({
  selector: 'app-statuses',
  imports: [CommonModule],
  templateUrl: './statuses.html',
  styleUrl: './statuses.css',
})
export class Statuses {
  // Modal state
  @Input({ required: true }) projectId!: number;
  @Input({ required: true }) isProjectType!: boolean;
  @Input({ required: true }) isEditStatusesModalOpen!: boolean;
  @Input({ required: true }) statuses!: Workflow[];
  @Output() onEditStatusesModalClose = new EventEmitter<void>();
  @Output() triggerRefreshAfterSave = new EventEmitter<void>();

  private statusService = inject(WorkflowService);
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
    const maxOrder = Math.max(...this.statuses.filter(s => !s.isSystemDefined).map(s => s.seqn), 0);
    const newStatus: Workflow = {
      id: this.statuses.length < 1
        ? -1
        : Math.min(...this.statuses.map(s => s.id)) - 1 >= 0
        ? -1
        : Math.min(...this.statuses.map(s => s.id)) - 1,
      referenceId: this.projectId,
      referenceType: 'WORKSPACE',
      name: '',
      color: '#dddddd',
      seqn: maxOrder + 1,
      isSystemDefined: false
    };
    
    // Insert before the completed status
    const completedIndex = this.statuses.findIndex(s => s.isSystemDefined);
    if (completedIndex !== -1) {
      this.statuses.splice(completedIndex, 0, newStatus);
    } else {
      this.statuses.push(newStatus);
    }
  }

  removeStatus(id: number, name: string) {
    const status = this.statuses.find(s => s.id === id);
    if (status?.isSystemDefined) {
      this.alertService.error('Error!', 'Cannot delete the Completed status');
      return;
    }

    if (id > 0) {
      if (confirm(`Are you sure you want to delete the status "${name}"? This action cannot be undone.`)) {
        this.statusService.deleteWorkflow(id).subscribe({
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
    if (status && !status.isSystemDefined) {
      status.name = name;
    }
  }

  updateStatusColor(id: number, color: string) {
    const status = this.statuses.find((status) => status.id == id);
    if (status && !status.isSystemDefined) {
      status.color = color;
    }
  }

  // Arrow button methods for reordering
  moveStatusUp(index: number) {
    if (index > 0 && !this.statuses[index].isSystemDefined && !this.statuses[index - 1].isSystemDefined) {
      [this.statuses[index], this.statuses[index - 1]] = [this.statuses[index - 1], this.statuses[index]];
    }
  }

  moveStatusDown(index: number) {
    if (index < this.statuses.length - 1 && !this.statuses[index].isSystemDefined && !this.statuses[index + 1].isSystemDefined) {
      [this.statuses[index], this.statuses[index + 1]] = [this.statuses[index + 1], this.statuses[index]];
    }
  }

  canMoveUp(index: number): boolean {
    return index > 0 && !this.statuses[index].isSystemDefined && !this.statuses[index - 1].isSystemDefined;
  }

  canMoveDown(index: number): boolean {
    return index < this.statuses.length - 1 && !this.statuses[index].isSystemDefined && !this.statuses[index + 1].isSystemDefined;
  }

  saveStatuses() {
    // Update order for all statuses
    this.statuses.forEach((status, index) => {
      status.seqn = index + 1;
    });

    const createStatusList: CreateWorkflow[] = this.statuses
      .filter((status) => status.id < 0)
      .map((status) => ({
        referenceId: status.referenceId,
        name: status.name,
        color: status.color,
        seqn: status.seqn,
      }));

    const updateStatusList: UpdateWorkflow[] = this.statuses
      .filter((status) => status.id > 0 && !status.isSystemDefined)
      .map((status) => ({
        id: status.id,
        name: status.name,
        color: status.color,
        seqn: status.seqn,
      }));

    // Combine all API calls into one list
    const createRequests = createStatusList.map((status) =>
      this.statusService.createWorkflow(status)
    );

    const updateRequests = updateStatusList.map((status) =>
      this.statusService.updateWorkflow(status)
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
