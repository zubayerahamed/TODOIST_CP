import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthHelper } from '../../core/helpers/auth.helper';
import { Category } from '../../core/models/category,model';
import { UpdateWorkspace, Workspace } from '../../core/models/workspace.model';
import { AlertService } from '../../core/services/alert.service';
import { CategoryService } from '../../core/services/category.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { WorkspaceStateService } from '../../core/services/workspace-state.service';
import { Types } from '../../types/types';

@Component({
  selector: 'app-workspace-settings',
  imports: [Types, FormsModule],
  templateUrl: './workspace-settings.html',
  styleUrl: './workspace-settings.css',
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4',
  },
})
export class WorkspaceSettings implements OnInit {
  private categoryService = inject(CategoryService);
  private workspaceService = inject(WorkspaceService);
  private alertService = inject(AlertService);
  private workspaceStateService = inject(WorkspaceStateService);

  public categories: Category[] = [];
  public taskCategories: Category[] = [];
  public eventCategories: Category[] = [];
  public workspace!: Workspace;
  public enteredWorkspaceName: string = "";

  ngOnInit(): void {
    this.loadWorkspace();
    this.loadWorkspaceCategories();
  }

  loadWorkspace(){
    const workspaceId = AuthHelper.getJwtPayloads()?.workspaceId ?? 0;
    if(workspaceId == 0) return;

    this.workspaceService.findWorkspace(workspaceId).subscribe({
      next: (resData) => {
        this.workspace = resData.data;
        this.enteredWorkspaceName = this.workspace!.name;
      }, 
      error: (resErr) => {
        console.error(resErr);
      }
    });
  }

  onUpdateWorkspace(){
    const updateWorkspace: UpdateWorkspace = {
      id: this.workspace!.id,
      name: this.enteredWorkspaceName,
    };

    this.workspaceService.updateWorkspace(updateWorkspace).subscribe({
      next: (resData) => {
        this.alertService.success('Success!', 'Workspace updated successfully');
        this.workspace = resData.data;
        this.enteredWorkspaceName = this.workspace!.name;
        
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
    this.loadWorkspaceCategories();
  }

  loadWorkspaceCategories() {
    this.categoryService.getAllWorkspaceCategories().subscribe({
      next: (resData) => {
        this.categories = resData.data || [];
        this.processCategories();
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
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
  }

  // Edit type modal events
  isEditTypesModalOpen = false;
  openEditTypesModal() {
    this.isEditTypesModalOpen = true;
  }
  onEditTypesModalClose() {
    this.isEditTypesModalOpen = false;
  }
}
