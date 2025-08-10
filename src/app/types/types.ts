import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  Category,
  CreateCategory,
  UpdateCategory,
} from '../core/models/category,model';
import { CategoryService } from '../core/services/category.service';
import { forkJoin } from 'rxjs';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-types',
  imports: [CommonModule],
  templateUrl: './types.html',
  styleUrl: './types.css',
})
export class Types {
  // Modal state
  @Input({ required: true }) isEditTypesModalOpen!: boolean;
  @Input({ required: true }) categories!: Category[];
  @Output() onEditTypesModalClose = new EventEmitter<void>();
  @Output() triggerRefreshAfterSave = new EventEmitter<void>();

  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);

  // Modal methods
  openEditTypesModal() {
    this.isEditTypesModalOpen = true;
  }

  closeEditTypesModal() {
    this.isEditTypesModalOpen = false;
    this.onEditTypesModalClose.emit();
  }

  onEditTypesModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeEditTypesModal();
    }
  }

  // Type management methods
  addNewCategory() {
    const newCategory: Category = {
      id:
        this.categories.length < 1
          ? -1
          : Math.min(...this.categories.map((c) => c.id)) - 1 >= 0
          ? -1
          : Math.min(...this.categories.map((c) => c.id)) - 1,
      referenceId: 0,
      name: '',
      color: '#dddddd',
      isForTask: false,
      isForEvent: false,
      seqn: 999,
      isDefaultForEvent: false,
      isDefaultForTask: false
    };
    this.categories.push(newCategory);
    console.log(this.categories);
  }

  removeCategory(id: number, name: string) {
    if (id > 0) {
      if (confirm(`Are you sure you want to delete the type "${name}"? This action cannot be undone.`)) {
        this.categoryService.deleteCategory(id).subscribe({
          next: (response) => {
            this.alertService.success('Success!', 'Category deleted successfully');
            this.triggerRefreshAfterSave.emit();
          },
          error: (error) => {
            console.error(error);
            this.alertService.error('Error!', 'Failed to delete category. Please try again.');
          },
        });
      }
    }

    this.categories = this.categories.filter((category) => category.id !== id);
  }

  updateCategoryName(id: number, name: string) {
    const category = this.categories.find((category) => category.id == id);
    if (category) {
      category.name = name;
    }
  }

  updateCategoryColor(id: number, color: string) {
    const category = this.categories.find((category) => category.id == id);
    if (category) {
      category.color = color;
    }
  }

  updateCategoryForTask(id: number, isTask: boolean) {
    const category = this.categories.find((category) => category.id == id);
    if (category) {
      category.isForTask = isTask;
    }
  }

  updateCategoryEvent(id: number, isEvent: boolean) {
    const category = this.categories.find((category) => category.id == id);
    if (category) {
      category.isForEvent = isEvent;
    }
  }

  saveTypes() {
    // Here you would typically save to a service or API
    const createCategoryList: CreateCategory[] = this.categories
      .filter((category) => category.id < 0)
      .map((category) => ({
        referenceId: category.referenceId,
        name: category.name,
        color: category.color,
        isForTask: category.isForTask,
        isForEvent: category.isForEvent,
      }));

    const updateCategoryList: UpdateCategory[] = this.categories
      .filter((category) => category.id > 0)
      .map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        isForTask: category.isForTask,
        isForEvent: category.isForEvent,
      }));

    // Combine all API calls into one list
    const createRequests = createCategoryList.map((category) =>
      this.categoryService.createCategory(category)
    );

    const updateRequests = updateCategoryList.map((category) =>
      this.categoryService.updateCategory(category)
    );

    // Wait for ALL requests to finish
    forkJoin([...createRequests, ...updateRequests]).subscribe({
      next: (results) => {
        console.log('All categories saved/updated:', results);
        this.alertService.success('Success!', 'Category edited successfully');
        this.closeEditTypesModal();
        this.triggerRefreshAfterSave.emit();
      },
      error: (err) => {
        console.error('Error saving/updating categories:', err);
        this.alertService.error('Error!', 'Category edit failed');
      },
    });
  }
}
