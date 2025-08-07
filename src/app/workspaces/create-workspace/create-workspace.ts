import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Workspace } from '../../core/models/workspace.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-workspace',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-workspace.html',
  styleUrl: './create-workspace.css',
})
export class CreateWorkspace {
  @Input({required:true}) isCreateWorkspaceModalOpen!: boolean;
  @Input({required:true}) availableWorkspaces!: Workspace[];
  @Input({required:true}) currentWorkspace!: Workspace;
  @Input({required:true}) newWorkspaceName!: string;
  @Output() closeWorkspaceModal = new EventEmitter<void>();

  closeCreateWorkspaceModal() {
    this.isCreateWorkspaceModalOpen = false;
    this.newWorkspaceName = '';
    this.closeWorkspaceModal.emit();
  }

  onCreateWorkspaceModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeCreateWorkspaceModal();
    }
  }

  onWorkspaceNameInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newWorkspaceName = target.value;
  }

  onWorkspaceNameKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.createWorkspace();
    }
  }

  createWorkspace() {
    console.log('hi');
    if (this.newWorkspaceName.trim()) {
      const newWorkspace: Workspace = {
        id: Date.now(),
        name: this.newWorkspaceName.trim(),
        avatar: '/assets/images/zubayer.jpg',
      };

      // Add to available workspaces
      this.availableWorkspaces.push(newWorkspace);

      // Switch to the new workspace
      this.currentWorkspace = newWorkspace;

      // Close the modal
      this.closeCreateWorkspaceModal();

      console.log('Created new workspace:', newWorkspace.name);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Check if create workspace modal should be closed when clicking outside
    if (this.isCreateWorkspaceModalOpen) {
      const isClickInsideModal = target.closest('.modal-container');

      if (!isClickInsideModal) {
        this.closeCreateWorkspaceModal();
      }
    }
  }
}
