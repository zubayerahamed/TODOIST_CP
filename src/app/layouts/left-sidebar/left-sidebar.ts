import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Workspace } from '../../core/models/workspace.model';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css',
})
export class LeftSidebar {
  @Input() isSidebarOpen = false;
  @Input() currentWorkspace: Workspace = {
    id: 1,
    name: "Zubayer's Workspace",
    avatar: '/assets/images/zubayer.jpg',
  };
  @Input() availableWorkspaces: Workspace[] = [];
  @Input() isWorkspaceDropdownOpen = false;
  @Input() isCreateWorkspaceModalOpen = false;
  @Input() newWorkspaceName = '';

  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() sidebarClose = new EventEmitter<void>();
  @Output() workspaceDropdownToggle = new EventEmitter<void>();
  @Output() workspaceDropdownClose = new EventEmitter<void>();
  @Output() workspaceSwitch = new EventEmitter<Workspace>();
  @Output() createWorkspaceModalOpen = new EventEmitter<void>();
  @Output() createWorkspaceModalClose = new EventEmitter<void>();
  @Output() workspaceCreate = new EventEmitter<string>();
  @Output() workspaceNameChange = new EventEmitter<string>();
  @Output() addTaskModalOpen = new EventEmitter<void>();
  @Output() addEventModalOpen = new EventEmitter<void>();

  public projectService = inject(ProjectService);
  public projects: Project[] = [];
  public systemDefinedProjects: Project[] = [];
  public favouriteProjects: Project[] = [];
  public allProjects: Project[] = [];

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects(){
    this.projectService.getAllProjects().subscribe({
      next: (resData) => {
        //console.log('Projects fetched successfully:', resData);
        this.projects = resData.data || [];
        this.processProjects();
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }

  private processProjects(): void {
    // Process data once and store in properties
    this.systemDefinedProjects = this.projectService.getFilteredSystemDefinedProjects(this.projects);
    this.favouriteProjects = this.projectService.getFilteredfavouriteProjects(this.projects);
    this.allProjects = this.projectService.getFilteredallProjects(this.projects);
  }
  

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  closeSidebar() {
    this.sidebarClose.emit();
  }

  toggleWorkspaceDropdown() {
    this.workspaceDropdownToggle.emit();
  }

  closeWorkspaceDropdown() {
    this.workspaceDropdownClose.emit();
  }

  switchWorkspace(workspace: Workspace) {
    this.workspaceSwitch.emit(workspace);
  }

  onWorkspaceDropdownBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeWorkspaceDropdown();
    }
  }

  openCreateWorkspaceModal() {
    this.createWorkspaceModalOpen.emit();
  }

  closeCreateWorkspaceModal() {
    this.createWorkspaceModalClose.emit();
  }

  onCreateWorkspaceModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeCreateWorkspaceModal();
    }
  }

  onWorkspaceNameInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.workspaceNameChange.emit(target.value);
  }

  onWorkspaceNameKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.createWorkspace();
    }
  }

  createWorkspace() {
    if (this.newWorkspaceName.trim()) {
      this.workspaceCreate.emit(this.newWorkspaceName.trim());
    }
  }

  openAddTaskModal() {
    this.addTaskModalOpen.emit();
  }

  openAddEventModal() {
    this.addEventModalOpen.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Check if workspace dropdown is open and close it if clicking outside
    if (this.isWorkspaceDropdownOpen) {
      const isClickInsideWorkspaceDropdown = target.closest(
        '.workspace-dropdown'
      );
      const isClickOnWorkspaceLink = target.closest('.workspace-dropdown-link');

      if (!isClickInsideWorkspaceDropdown && !isClickOnWorkspaceLink) {
        this.closeWorkspaceDropdown();
      }
    }

    // Check if create workspace modal should be closed when clicking outside
    if (this.isCreateWorkspaceModalOpen) {
      const isClickInsideModal = target.closest('.modal-container');

      if (!isClickInsideModal) {
        this.closeCreateWorkspaceModal();
      }
    }
  }
}
