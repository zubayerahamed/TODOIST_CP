import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddWorkspace, Workspace } from '../../core/models/workspace.model';
import { AlertService } from '../../core/services/alert.service';
import { WorkspaceService } from '../../core/services/workspace.service';

@Component({
  selector: 'app-create-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-workspace.html',
  styleUrl: './create-workspace.css',
})
export class CreateWorkspace {
  @Input({required:true}) isCreateWorkspaceModalOpen!: boolean;
  @Input({required:true}) availableWorkspaces!: Workspace[];
  @Output() closeWorkspaceModal = new EventEmitter<void>();

  private alterService = inject(AlertService);
  private workspaceService = inject(WorkspaceService);

  enteredWorkspaceName: string = '';
  worskapceNameErr: string = "";

  closeCreateWorkspaceModal() {
    this.isCreateWorkspaceModalOpen = false;
    this.enteredWorkspaceName = '';
    this.worskapceNameErr = "";
    this.closeWorkspaceModal.emit();
  }

  onCreateWorkspaceModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeCreateWorkspaceModal();
    }
  }

  onWorkspaceNameKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.createWorkspace();
    }
  }

  createWorkspace() {
    this.worskapceNameErr = "";
    if(this.enteredWorkspaceName == ''){
      this.worskapceNameErr = "Workspace name required";
      return;
    }

    const newWorkspace: AddWorkspace = {
      name: this.enteredWorkspaceName.trim(),
    };

    this.workspaceService.createWorkspace(newWorkspace).subscribe({
      next: (resData) => {
        this.alterService.success('Success!', 'Workspace created successfully');

        const savedWorkspace: Workspace = resData.data;

        // Add to available workspaces
        this.availableWorkspaces.push(savedWorkspace);
        // Close the modal
        this.closeCreateWorkspaceModal();
      },
      error: (err) => {
        this.alterService.error("Error!", "Failed to create workspace");
      }
    });
  }
}
