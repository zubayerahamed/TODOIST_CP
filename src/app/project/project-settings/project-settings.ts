import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Category } from '../../core/models/category.model';
import { Project } from '../../core/models/project.model';
import { Status } from '../../core/models/status.model';
import { Workflow } from '../../core/models/workflow.model';
import { UpdateWorkspace, Workspace } from '../../core/models/workspace.model';
import { AlertService } from '../../core/services/alert.service';
import { CategoryService } from '../../core/services/category.service';
import { ProjectService } from '../../core/services/project.service';
import { StatusService } from '../../core/services/status.service';
import { TagService } from '../../core/services/tag.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { WorkspaceStateService } from '../../core/services/workspace-state.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { Statuses } from '../../statuses/statuses';
import { Types } from '../../types/types';

@Component({
  selector: 'app-project-settings',
  imports: [Types, Statuses, FormsModule, RouterLink],
  templateUrl: './project-settings.html',
  styleUrl: './project-settings.css',
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4',
  },
})
export class ProjectSettings implements OnInit {
  public projectId!: number;

  private projectService = inject(ProjectService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private categoryService = inject(CategoryService);
  private statusService = inject(StatusService);
  private workspaceService = inject(WorkspaceService);
  private alertService = inject(AlertService);
  private workspaceStateService = inject(WorkspaceStateService);
  private workflowService = inject(WorkflowService);
  private tagService = inject(TagService);

  public project?: Project;

  public tags: Workflow[] = [];
  public workflows: Workflow[] = [];
  public nonSystemDefinedWorkflows: Workflow[] = [];
  public categories: Category[] = [];
  public taskCategories: Category[] = [];
  public eventCategories: Category[] = [];
  public defaultTaskCategory?: Category;
  public defaultEventCategory?: Category;
  public workspace!: Workspace;
  public enteredProjectName: string = "";
  public systemDefinedWorkflow?: Workflow;

  // Status-related properties
  public statuses: Status[] = [];

  constructor(){
    this.enteredProjectName = "";
  }

  ngOnInit(): void {
    console.log("On init called");
    
    // Subscribe to route parameter changes to handle navigation between different projects
    const routeParamsSub = this.activatedRoute.params.subscribe(params => {
      const newProjectId = +params['projectId']; // Convert string to number
      if (newProjectId && newProjectId !== this.projectId) {
        this.projectId = newProjectId;
        console.log("Project ID changed to:", this.projectId);
        this.loadAllData();
      }
    });

    // Clean up subscription when component is destroyed
    this.destroyRef.onDestroy(() => {
      routeParamsSub.unsubscribe();
    });
  }

  private loadAllData(): void {
    this.loadProject();
    this.loadProjectCategories();
    this.loadProjectWorkflows();
  }

  loadProject(){
    this.projectService.findProject(this.projectId).subscribe({
      next: (resData) => {
        this.project = resData.data;
        this.enteredProjectName = this.project?.name?? "";
      }, 
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadProjectCategories() {
    this.categoryService.getAllProjectCategories(this.projectId).subscribe({
      next: (resData) => {
        this.categories = resData.data || [];
        this.processCategories();
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }

  loadProjectWorkflows(){
    this.workflowService.getAllProjectWorkflows(this.projectId).subscribe({
      next: (resData) => {
        this.workflows = resData.data || [];
        this.processWorkflows();
      },
      error: (error) => {
        console.error('Error fetching workflows:', error);
      },
    });
  }

  onInheritSettings(event: Event){
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.projectService.inheightSettingsFromWorkspace(this.projectId).subscribe({
        next: (resData) => {
          this.alertService.success('Success!', 'Settings inherited successfully');
          this.loadAllData();
        }, 
        error: (err) => {
          console.log(err);
          this.alertService.error('Error!', 'Failted to inherit settings from workspace');
        }
      }); 
    } else {
      this.projectService.disableInheightSettingsFromWorkspace(this.projectId).subscribe({
        next: (resData) => {
          this.alertService.success('Success!', 'Disable settings inheritence successfully');
          this.loadAllData();
        }, 
        error: (err) => {
          console.log(err);
          this.alertService.error('Error!', 'Failted to disable inherit settings');
        }
      }); 
    }
    
  }

  private processWorkflows(): void {
    this.workflows = this.workflows.sort((a, b) => a.seqn - b.seqn);
    this.nonSystemDefinedWorkflows = this.workflows.filter((w) => !w.isSystemDefined);
    this.systemDefinedWorkflow =  this.workflows.find((c) => c.isSystemDefined);
  }



  onUpdateWorkspace(){
    const updateWorkspace: UpdateWorkspace = {
      id: this.workspace!.id,
      name: this.enteredProjectName,
    };

    this.workspaceService.updateWorkspace(updateWorkspace).subscribe({
      next: (resData) => {
        this.alertService.success('Success!', 'Workspace updated successfully');
        this.workspace = resData.data;
        this.enteredProjectName = this.workspace!.name;
        
        // Use WorkspaceStateService to update workspace name
        // This will automatically notify all subscribers (like left-sidebar)
        this.workspaceStateService.updateWorkspaceName(this.workspace!.name);
      },
      error: (resErr) => {
        console.error(resErr);
        this.alertService.error('Error!', 'Workspace updated failed');
      }
    });

  }

  onTriggerRefreshAfterSave() {
    this.loadProjectCategories();
    this.loadProjectWorkflows();
  }

  loadStatuses() {
    this.statusService.getAllStatuses().subscribe({
      next: (resData) => {
        this.statuses = resData.data || [];
      },
      error: (error) => {
        console.error('Error fetching statuses:', error);
      },
    });
  }

  

  private processCategories(): void {
    this.taskCategories = this.categoryService.getFilteredTaskCategories(
      this.categories
    );
    this.eventCategories = this.categoryService.getFilteredEventCategories(
      this.categories
    );

    this.defaultTaskCategory =  this.categories.find((c) => c.isDefaultForTask);
    this.defaultEventCategory =  this.categories.find((c) => c.isDefaultForEvent);
  }

  // Edit type modal events
  isEditTypesModalOpen = false;
  openEditTypesModal() {
    this.isEditTypesModalOpen = true;
  }
  onEditTypesModalClose() {
    this.isEditTypesModalOpen = false;
  }

  // Edit tags modal events
  isCreateTagModalOpen = false;
  openEditTagModal() {
    this.isCreateTagModalOpen = true;
  }
  onEditTagModalClose() {
    this.isCreateTagModalOpen = false;
  }
  removeTag(id: number, name: string){
    if(confirm('Are you sure to delte tag '+name+'?')){
      this.tagService.deleteTag(id).subscribe({
        next: (resData) => {
          this.alertService.success('Success!','Tag deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting tag:', error);
          this.alertService.error('Error!', 'Cant delete tag');
        }
      });
    }
  }

  // Edit status modal events
  isEditStatusesModalOpen = false;
  openEditStatusesModal() {
    this.isEditStatusesModalOpen = true;
  }
  onEditStatusesModalClose() {
    this.isEditStatusesModalOpen = false;
  }

  // Dropdown state management
  isTaskDropdownOpen = false;
  isEventDropdownOpen = false;

  toggleTaskDropdown() {
    this.isTaskDropdownOpen = !this.isTaskDropdownOpen;
    // Close event dropdown if open
    if (this.isTaskDropdownOpen) {
      this.isEventDropdownOpen = false;
    }
  }

  toggleEventDropdown() {
    this.isEventDropdownOpen = !this.isEventDropdownOpen;
    // Close task dropdown if open
    if (this.isEventDropdownOpen) {
      this.isTaskDropdownOpen = false;
    }
  }

  onSelectDefaultTask(category: Category) {
    this.categoryService.addToDefaultTask(this.projectId, category.id).subscribe({
      next: () => {
        this.defaultTaskCategory = category;
        this.isTaskDropdownOpen = false;
        this.alertService.success('Success!', 'Default task type updated successfully');
        this.loadProjectCategories();
      },
      error: (error) => {
        console.error('Error updating default task type:', error);
        this.alertService.error('Error!', 'Failed to update default task type');
      }
    });
  }

  onSelectDefaultEvent(category: Category) {
    this.categoryService.addToDefaultEvent(this.projectId, category.id).subscribe({
      next: () => {
        this.defaultEventCategory = category;
        this.isEventDropdownOpen = false;
        this.alertService.success('Success!', 'Default event type updated successfully');
        this.loadProjectCategories();
      },
      error: (error) => {
        console.error('Error updating default event type:', error);
        this.alertService.error('Error!', 'Failed to update default event type');
      }
    });
  }
}
