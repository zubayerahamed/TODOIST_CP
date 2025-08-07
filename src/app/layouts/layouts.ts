import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthHelper } from '../core/helpers/auth.helper';
import { AttachedFile } from '../core/models/attached-file.model';
import { ChecklistItem } from '../core/models/checklist-item.model';
import { Participant } from '../core/models/participant.model';
import { Subtask } from '../core/models/subtask.model';
import { Tag } from '../core/models/tag.model';
import { Workspace } from '../core/models/workspace.model';
import { AuthService } from '../core/services/auth.service';
import { LeftSidebar } from './left-sidebar/left-sidebar';
import { Header } from "./header/header";
import { CreateEvent } from "../events/create-event/create-event";
import { CreateTask } from "../tasks/create-task/create-task";
import { CreateWorkspace } from "../workspaces/create-workspace/create-workspace";

@Component({
  selector: 'app-layouts',
  standalone: true,
  templateUrl: './layouts.html',
  styleUrl: './layouts.css',
  imports: [CommonModule, FormsModule, LeftSidebar, RouterOutlet, Header, CreateEvent, CreateTask, CreateWorkspace]
})
export class Layouts {

  protected title = 'TODOIST';
  isSidebarOpen = false;
  
  

  constructor(private authService: AuthService, private router: Router) {
    // Example condition: redirect to dashboard
    const defaultPage = 'today'; // or get from service or storage
    this.router.navigate([defaultPage]);
  }

  // Workspace dropdown properties
  isWorkspaceDropdownOpen = false;


  // Available workspaces
  newWorkspaceName: string = '';
  currentWorkspace: Workspace = {
    id: 1,
    name: "Zubayer's Workspace",
    avatar: '/assets/images/zubayer.jpg',
  };
  availableWorkspaces: Workspace[] = [
    { id: 2, name: 'Metatude', avatar: '/assets/images/zubayer.jpg' },
    { id: 3, name: 'ASL', avatar: '/assets/images/zubayer.jpg' },
    { id: 4, name: 'LIRA', avatar: '/assets/images/zubayer.jpg' },
  ];

  // User profile dropdown properties
  isUserProfileDropdownOpen = false;
  currentUser = {
    name: 'Zubayer Ahamed',
    email: 'zubayer@example.com',
    avatar: '/assets/images/zubayer.jpg',
  };

  // Create Workspace modal properties
  isCreateWorkspaceModalOpen: boolean = false;

  // Dummy participants data
  allParticipants: Participant[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 7,
      name: 'Alex Miller',
      email: 'alex.miller@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
  ];




  
  

  // Task-specific properties


  

  // Subtask properties
  
  
  
  
  draggedSubtaskIndex: number | null = null;

  availableTags: Tag[] = [
    { id: 1, name: 'DSA', color: '#28a745' },
    { id: 2, name: 'Spring Security', color: '#17a2b8' },
    { id: 3, name: 'Spring Cloud', color: '#6f42c1' },
    { id: 4, name: 'AWS', color: '#fd7e14' },
  ];

  selectedTags: Tag[] = [
    { id: 1, name: 'DSA', color: '#28a745' },
    { id: 2, name: 'Spring Security', color: '#17a2b8' },
    { id: 3, name: 'Spring Cloud', color: '#6f42c1' },
    { id: 4, name: 'AWS', color: '#fd7e14' },
  ];



  

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Event Modal Methods
  isAddEventModalOpen = false;
  openAddEventModal() {
    this.isAddEventModalOpen = true;
  }
  onCloseAddEventModal(){
    this.isAddEventModalOpen = false;
  }



 

  // Task Modal Methods
  isAddTaskModalOpen = false;
  openAddTaskModal() {
    this.isAddTaskModalOpen = true;
  }
  onCloseAddTaskModal(){
    this.isAddTaskModalOpen = false;
  }





  // Event Participant management methods








  // Task Participant management methods
 

 



  

  

  // Event File attachment methods




  // Task File attachment methods





  


  

 

 







  // Subtask management methods
 





 

  

 

  // Subtask participant management


 

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

    // Check if user profile dropdown is open and close it if clicking outside
    if (this.isUserProfileDropdownOpen) {
      const isClickInsideUserProfileDropdown = target.closest(
        '.user-profile-dropdown'
      );
      const isClickOnUserProfileImage = target.closest('.user-profile-image');

      if (!isClickInsideUserProfileDropdown && !isClickOnUserProfileImage) {
        this.closeUserProfileDropdown();
      }
    }

  }





  



  

  // Subtask progress calculation
  

 

  // Workspace dropdown methods
  toggleWorkspaceDropdown() {
    this.isWorkspaceDropdownOpen = !this.isWorkspaceDropdownOpen;
  }

  closeWorkspaceDropdown() {
    this.isWorkspaceDropdownOpen = false;
  }

  switchWorkspace(workspace: Workspace) {
    this.currentWorkspace = workspace;
    this.closeWorkspaceDropdown();
  }

  onWorkspaceDropdownBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeWorkspaceDropdown();
    }
  }

  // User profile dropdown methods
  toggleUserProfileDropdown() {
    this.isUserProfileDropdownOpen = !this.isUserProfileDropdownOpen;
  }

  closeUserProfileDropdown() {
    this.isUserProfileDropdownOpen = false;
  }

  onUserProfileDropdownBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeUserProfileDropdown();
    }
  }

  openProfileSettings() {
    this.closeUserProfileDropdown();
    // Add profile settings logic here
    console.log('Opening profile settings...');
  }

  logout() {
    this.closeUserProfileDropdown();
    console.log('Logging out...');
    if(!AuthHelper.isAuthenticated()) return;

    this.authService.logout().subscribe({
      next: () => {
        AuthHelper.clearAuthData(); // Clear auth data from session storage
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // Still clear storage just in case
        AuthHelper.clearAuthData();
        this.router.navigate(['/login']);
      },
    });
  }

  // Create Workspace modal methods
  openCreateWorkspaceModal() {
    this.isCreateWorkspaceModalOpen = true;
    this.newWorkspaceName = '';
    this.closeWorkspaceDropdown();
  }

 



 





  // Left sidebar event handlers
  onSidebarToggle() {
    this.toggleSidebar();
  }

  onSidebarClose() {
    this.closeSidebar();
  }

  onWorkspaceDropdownToggle() {
    this.toggleWorkspaceDropdown();
  }

  onWorkspaceDropdownClose() {
    this.closeWorkspaceDropdown();
  }

  onWorkspaceSwitch(workspace: Workspace) {
    this.switchWorkspace(workspace);
  }

  onCreateWorkspaceModalOpen() {
    this.openCreateWorkspaceModal();
  }

  onCreateWorkspaceModalClose() {
    this.isCreateWorkspaceModalOpen = false;
    this.newWorkspaceName = '';
  }

  onWorkspaceCreate(workspaceName: string) {
    this.newWorkspaceName = workspaceName;
    //this.createWorkspace();
  }

  onWorkspaceNameChange(name: string) {
    this.newWorkspaceName = name;
  }

  onAddTaskModalOpen() {
    this.openAddTaskModal();
  }

  onAddEventModalOpen() {
    this.openAddEventModal();
  }


  // Handlers for header component events
  onToggleSidebar() {
    this.toggleSidebar();
  }
  onToggleUserProfileDropdown() {
    this.toggleUserProfileDropdown();
  }
  onCloseUserProfileDropdown() {
    this.closeUserProfileDropdown();
  }
  onOpenProfileSettings() {
    this.openProfileSettings();
  }
  onLogout() {
    this.logout();
  }
}
