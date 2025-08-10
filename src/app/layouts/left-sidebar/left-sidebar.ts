import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Project } from '../../core/models/project.model';
import { Workspace } from '../../core/models/workspace.model';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css',
})
export class LeftSidebar implements OnInit, OnChanges {
  @Input() triggeRrefreshProjectsOfSidebar?: number;
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
  @Output() addProjectModalOpen = new EventEmitter<void>();

  public projectService = inject(ProjectService);

  public workspace!: Workspace;
  public workspaceName: string = "";
  public projects: Project[] = [];
  public systemDefinedProjects: Project[] = [];
  public favouriteProjects: Project[] = [];
  public allProjects: Project[] = [];

  // Dropdown states for collapsible sections
  public isFavouritesExpanded: boolean = true;
  public isMyProjectsExpanded: boolean = true;

  // Context menu states - section-specific
  public activeContextMenuProjectId: number | null = null;
  public activeContextMenuSection: 'favourites' | 'projects' | null = null;

  ngOnInit() {
    this.loadWorkspace();
    this.loadProjects();
  }

  loadWorkspace(){
    this.workspaceName = sessionStorage.getItem("workspaceName")?? "";
  }

  ngOnChanges(){
    console.log("Refresh trigger count: " + this.triggeRrefreshProjectsOfSidebar);
    if(this.triggeRrefreshProjectsOfSidebar && this.triggeRrefreshProjectsOfSidebar > 0){
      this.loadProjects();
    }
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

    // Check if project context menu should be closed when clicking outside
    if (this.activeContextMenuProjectId !== null && this.activeContextMenuSection !== null) {
      const isClickInsideContextMenu = target.closest('.project-context-menu');
      const isClickOnContextMenuTrigger = target.closest('.btn-edit-project');

      if (!isClickInsideContextMenu && !isClickOnContextMenuTrigger) {
        this.closeProjectContextMenu();
      }
    }
  }


  // Add Project Method
  addProject(){
    console.log('Add Project clicked');
    this.addProjectModalOpen.emit();
  }

  // Toggle dropdown methods
  toggleFavouritesDropdown() {
    this.isFavouritesExpanded = !this.isFavouritesExpanded;
  }

  toggleMyProjectsDropdown() {
    this.isMyProjectsExpanded = !this.isMyProjectsExpanded;
  }

  // Context menu methods
  toggleProjectContextMenu(projectId: number, section: 'favourites' | 'projects', event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.activeContextMenuProjectId === projectId && this.activeContextMenuSection === section) {
      this.activeContextMenuProjectId = null;
      this.activeContextMenuSection = null;
    } else {
      this.activeContextMenuProjectId = projectId;
      this.activeContextMenuSection = section;
    }
  }

  closeProjectContextMenu() {
    this.activeContextMenuProjectId = null;
    this.activeContextMenuSection = null;
  }

  // Helper method to check if context menu should be shown
  isContextMenuActive(projectId: number, section: 'favourites' | 'projects'): boolean {
    return this.activeContextMenuProjectId === projectId && this.activeContextMenuSection === section;
  }

  // Project action methods
  removeFromFavourites(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Removing from favourites:', project.name);
    // TODO: Implement API call to update project favourite status
    // this.projectService.updateProject(project.id, { isFavourite: false }).subscribe(...)
    
    this.closeProjectContextMenu();
    // Refresh projects after update
    this.loadProjects();
  }

  addToFavourites(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Adding to favourites:', project.name);
    // TODO: Implement API call to update project favourite status
    // this.projectService.updateProject(project.id, { isFavourite: true }).subscribe(...)
    
    this.closeProjectContextMenu();
    // Refresh projects after update
    this.loadProjects();
  }

  deleteProject(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm(`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`)) {
      console.log('Deleting project:', project.name);
      // TODO: Implement API call to delete project
      // this.projectService.deleteProject(project.id).subscribe(...)
      
      this.closeProjectContextMenu();
      // Refresh projects after deletion
      this.loadProjects();
    }
  }
}
