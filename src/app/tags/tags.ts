import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagService } from '../core/services/tag.service';
import { CreateTag } from '../core/models/tag.model';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-tags',
  imports: [CommonModule, FormsModule],
  templateUrl: './tags.html',
  styleUrl: './tags.css'
})
export class Tags {

  @Input({required:true}) isCreateTagModalOpen!: boolean;
  @Output() closeTagModal = new EventEmitter<void>();
  @Output() triggerRefreshAfterSave = new EventEmitter<void>();

  private tagService = inject(TagService);
  private alertService = inject(AlertService);

  enteredTagName: string = "";

  closeCreateTagModal() {
    this.isCreateTagModalOpen = false;
    this.closeTagModal.emit();
  }

  onCreateTagModalBackdropClick(event: Event){
    if (event.target === event.currentTarget) {
      this.closeCreateTagModal();
    }
  }

  createTag(){
    const newTag: CreateTag = {
      name: this.enteredTagName
    }

    this.tagService.createTag(newTag).subscribe({
      next: (resData) => {
        this.alertService.success('Success!', 'Tag created successfully');
        this.enteredTagName = "";
        this.closeCreateTagModal();
        this.triggerRefreshAfterSave.emit();
      },
      error: (err) => {
        console.log(err);
        this.alertService.error('Error!', 'Error creating tag');
      }
    });
  }
}
