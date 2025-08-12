import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../../core/models/project.model';
import { Workspace } from '../../core/models/workspace.model';
import { ProjectService } from '../../core/services/project.service';
import { WorkspaceStateService } from '../../core/services/workspace-state.service';
import { AlertService } from '../../core/services/alert.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthHelper } from '../../core/helpers/auth.helper';
import { SwitchWorkspaceRequest } from '../../core/models/switch-workspace-request.model';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css',
})
export class LeftSidebar implements OnInit, OnChanges, OnDestroy {
  @Input() triggeRrefreshProjectsOfSidebar?: number;
  @Input() isSidebarOpen = false;
  @Input({required: true}) currentWorkspace!: Workspace;
  @Input({required : true}) availableWorkspaces!: Workspace[];
  @Input() isCreateWorkspaceModalOpen = false;
  @Input() newWorkspaceName = '';
  
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() sidebarClose = new EventEmitter<void>();
  @Output() workspaceDropdownToggle = new EventEmitter<void>();
  @Output() workspaceSwitch = new EventEmitter<Workspace>();
  @Output() createWorkspaceModalOpen = new EventEmitter<void>();
  @Output() createWorkspaceModalClose = new EventEmitter<void>();
  @Output() workspaceCreate = new EventEmitter<string>();
  @Output() workspaceNameChange = new EventEmitter<string>();
  @Output() addTaskModalOpen = new EventEmitter<void>();
  @Output() addEventModalOpen = new EventEmitter<void>();
  @Output() addProjectModalOpen = new EventEmitter<void>();
  
  isWorkspaceDropdownOpen = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private workspaceService = inject(WorkspaceService);
  private projectService = inject(ProjectService);
  private workspaceStateService = inject(WorkspaceStateService);
  private alertService = inject(AlertService);
  private workspaceNameSubscription?: Subscription;

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
  public contextMenuPosition: {
    showAbove: boolean;
    showOutside: boolean;
    top?: string;
    left?: string;
  } = { showAbove: false, showOutside: false };

  ngOnInit() {
    this.loadWorkspace();
    this.loadProjects();
  }

  ngOnDestroy() {
    if (this.workspaceNameSubscription) {
      this.workspaceNameSubscription.unsubscribe();
    }
  }

  loadWorkspace(){
    // Subscribe to workspace name changes
    this.workspaceNameSubscription = this.workspaceStateService.workspaceName$.subscribe(
      (name: string) => {
        this.workspaceName = name;
      }
    );
    
    // Initialize from storage if not already set
    if (!this.workspaceName) {
      this.workspaceName = this.workspaceStateService.getWorkspaceName();
    }
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
    if(this.isWorkspaceDropdownOpen){
      this.isWorkspaceDropdownOpen = false;
    } else {
      this.isWorkspaceDropdownOpen = true;
    }
  }

  closeWorkspaceDropdown() {
    this.isWorkspaceDropdownOpen = false;
  }

  switchWorkspace(workspace: Workspace) {
    console.log('%cAttempting to Switching workspace', 'color: green');
    // Check user is authenticated first
    if (!AuthHelper.isAuthenticated()) {
      this.alertService.error('Error!', 'User not authenticated');
      return;
    }

    const email: string  = AuthHelper.getJwtPayloads()?.email?? "";
    if(email == null || email == ''){
      this.alertService.error('Error!', 'User not authenticated');
      return;
    }
    
    // create a switch request with user information and workspace id
    const switchRequest: SwitchWorkspaceRequest = {
      workspaceId: workspace.id,
      email: email
    };

    this.authService.switchWorkspace(switchRequest).subscribe({
      next: (response) => {
        this.alertService.success('Success!', 'Switched to workspace: ' + workspace.name);

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        // Logout from existing first only from frontend part
        AuthHelper.clearAuthData();

        // Store tokens or user info (you can store just token or a user object)
        AuthHelper.setAuthData(accessToken, refreshToken);
        this.workspaceStateService.updateWorkspaceName(AuthHelper.getJwtPayloads()?.workspaceName?? "");
        // this.router.navigate(['/']);

        // Reload page completely to reflect new session
        window.location.reload();
      }, 
      error: (err) => {
        console.log(err);
        this.alertService.error('Error!', 'Workspace switch failed');
      }
    });

    // after get response back, update the session with new credentials
    // reload the entire page to reflect the change
    
    //this.workspaceSwitch.emit(workspace);
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
      
      // Calculate optimal position for context menu
      this.calculateContextMenuPosition(event.target as HTMLElement);
    }
  }

  private calculateContextMenuPosition(triggerElement: HTMLElement) {
    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const contextMenuHeight = 280; // Approximate height of context menu
    
    // Calculate space above and below trigger
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    
    // Determine if menu should show above (if not enough space below)
    const showAbove = spaceBelow < contextMenuHeight && spaceAbove > contextMenuHeight;
    
    // For now, let's keep it simple and not show outside sidebar
    // We'll focus on fixing the above/below positioning first
    const showOutside = false;
    
    this.contextMenuPosition = {
      showAbove,
      showOutside,
      top: '',
      left: ''
    };
  }

  closeProjectContextMenu() {
    this.activeContextMenuProjectId = null;
    this.activeContextMenuSection = null;
    this.contextMenuPosition = { showAbove: false, showOutside: false, top: '', left: '' };
  }

  // Helper method to check if context menu should be shown
  isContextMenuActive(projectId: number, section: 'favourites' | 'projects'): boolean {
    return this.activeContextMenuProjectId === projectId && this.activeContextMenuSection === section;
  }

  
  // Project adding to favourite
  addToFavourites(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Adding to favourites:', project.name);
    this.projectService.addToFavoutire(project.id).subscribe({
      next: (resData) => {
        // Refresh projects after update
        this.alertService.success('Success!', 'Project added to favourite');
        this.loadProjects();
      }, 
      error: (error) => {
        console.error('Error adding to favourites:', error);
        this.alertService.error('Error!', 'Error adding to favourites');
      }
    });
    
    this.closeProjectContextMenu();
  }

  // Project action methods
  removeFavourites(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Removing from favourites:', project.name);
    this.projectService.removeFromFavoutire(project.id).subscribe({
      next: (resData) => {
        // Refresh projects after update
        this.alertService.success('Success!', 'Project remove from favourite');
        this.loadProjects();
      }, 
      error: (error) => {
        console.error('Error adding to favourites:', error);
        this.alertService.error('Error!', 'Error removing from favourites');
      }
    });
    
    this.closeProjectContextMenu();
  }

  deleteProject(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm(`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`)) {
      console.log('Deleting project:', project.name);
      
      this.projectService.deleteProject(project.id).subscribe({
        next: (resData) => {
          // Refresh projects after update
          this.alertService.success('Success!', 'Project deleted successfully');
          this.loadProjects();
        }, 
        error: (error) => {
          console.error('Error deleting project:', error);
          this.alertService.error('Error!', 'Delete operation failed');
        }
      });
      
      this.closeProjectContextMenu();
    }
  }
}
