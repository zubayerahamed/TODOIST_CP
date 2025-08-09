import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { AlertService } from '../../core/services/alert.service';
import { AddProject } from '../../core/models/project.model';

@Component({
  selector: 'app-create-project',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject {
  @Input({ required: true }) isAddProjectModalOpen!: boolean;
  @Output() addProjectModalClose = new EventEmitter<void>();
  @Output() refreshProjectsOfSidebar = new EventEmitter<void>();

  private projectService = inject(ProjectService);
  private alertService = inject(AlertService);

  // Properties for the project form
  enteredName: string = '';
  enteredColor: string = '#645896';
  enteredLayoutType: string = 'LIST';
  enteredIsFavourite: boolean = false;

  // Error message for required fields
  invalidFormSubmit: boolean = false;
  enteredNameError: string = '';
  enteredLayoutTypeError: string = '';

  onCloseAddProjectModal(){
    this.resetForm();
    this.isAddProjectModalOpen = false;
    this.addProjectModalClose.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCloseAddProjectModal();
    }
  }

  validateForm(){
    this.invalidFormSubmit = false;
    this.enteredNameError = '';
    this.enteredLayoutTypeError = '';

    if (!this.enteredName.trim()) {
      this.enteredNameError = 'Project name is required';
      this.invalidFormSubmit = true;
    }

    if (!this.enteredLayoutType) {
      this.enteredLayoutTypeError = 'Layout type is required';
      this.invalidFormSubmit = true;
    }
  }

  resetForm(){
    this.enteredName = '';
    this.enteredColor = '#645896';
    this.enteredLayoutType = 'LIST';
    this.enteredIsFavourite = false;
    this.invalidFormSubmit = false;
    this.enteredNameError = '';
    this.enteredLayoutTypeError = '';
  }

  addProject(){
    // Logic to handle project submission can be added here
    this.validateForm();
    if (this.invalidFormSubmit) return;

    console.log('Project added:', {
      name: this.enteredName,
      color: this.enteredColor,
      layoutType: this.enteredLayoutType,
      isFavourite: this.enteredIsFavourite
    });

    const addProject: AddProject = {
      name: this.enteredName,
      color: this.enteredColor,
      layoutType: this.enteredLayoutType,
      isFavourite: this.enteredIsFavourite
    };


    // Make create project object
    this.projectService.createProject(addProject).subscribe({
      next: (res) => {
        console.log('Project created successfully', res);
        // Show success alert
        this.alertService.success('Success!', 'Project created successfully');
        // Only emit refresh after successful creation
        this.refreshProjectsOfSidebar.emit();
        this.onCloseAddProjectModal();
      },
      error: (err) => {
        console.error('Failed to create project', err);
        // Show error alert
        this.alertService.error('Error!', 'Failed to create project. Please try again.');
        // Still close modal on error, but don't refresh
        this.onCloseAddProjectModal();
      }
    });
  }
}
