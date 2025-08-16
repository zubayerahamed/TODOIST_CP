

import { Toast } from 'bootstrap';


import { Component, ElementRef,  EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

// Services
import { EventService } from '../../core/services/event.service';

// Models
import { EventRequest } from '../../core/services/event.service';
import { AttachedFile } from '../../core/models/attached-file.model';
import { Participant } from '../../core/models/participant.model';
import { ChecklistItem } from '../../core/models/checklist-item.model';

// Constants
import { FILE_ICON_MAPPING } from '../../core/constants/file-icons.const';



@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-event.html',
  styleUrls: ['./create-event.css'],
})

export class CreateEvent implements OnInit {
  // Input/Output properties
  @Input() isAddEventModalOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<any>();

  // View children
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('successToast') successToast!: ElementRef;


  // Form properties
  eventForm!: FormGroup;
  submitting = false;

  // Data properties
  attachedFiles: AttachedFile[] = [];
  allParticipants: Participant[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/assets/images/avatars/john.jpg',
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
    selectedParticipants: Participant[] = [
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
  ];

    // UI state properties
  isParticipantSearchOpen = false;
  participantSearchQuery = '';
  checklistItems: ChecklistItem[] = [];
  newChecklistItem = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private eventService: EventService,
    private host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      eventDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      projectId: [null],
      categoryId: [null],
      description: ['', Validators.maxLength(500)],
      location: ['', Validators.maxLength(100)],
      isReminderEnabled: [false],
      reminderBefore: [0, [Validators.min(0), Validators.max(1440)]],
      participants: [[]]
    });
  }

  /**
   * Closes the add event modal and resets the form
   */
  closeAddEventModal() {
    this.isAddEventModalOpen = false;
    this.closed.emit();
  }

  /**
   * Handles backdrop click to close modal
   */
  onEventModalBackdropClick(event: MouseEvent): void {
    if (event.target === this.host.nativeElement.querySelector('.modal-backdrop')) {
      this.closeAddEventModal();
    }
  }

  private formToPayload(): EventRequest {
    const v = this.eventForm.value;
    return {
      title: v.title,
      description: v.description || null,
      projectId: v.projectId ? Number(v.projectId) : null,
      categoryId: v.categoryId ? Number(v.categoryId) : null,
      eventDate: v.eventDate,
      startTime: v.startTime || '00:00',
      endTime: v.endTime || '23:59',
      location: v.location || null,
      isReminderEnabled: !!v.isReminderEnabled,
      reminderBefore: v.reminderBefore == null ? 0 : Number(v.reminderBefore),
      perticipants: this.eventForm.value.perticipants || [],
      documents: this.attachedFiles.filter((f) => f.docId !== undefined).map((f) => f.docId!),
    };
  }

/**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.formToPayload();

    this.eventService.createEvent(payload)
      .pipe(
        finalize(() => this.submitting = false)
      )
      .subscribe({
        next: (response) => this.handleSuccess(response),
        error: (error) => this.handleError(error)
      });
  }

    /**
   * Handles successful event creation
   * @param response - API response
   */
  private handleSuccess(response: any): void {
    this.showSuccessToast(response.message);
    this.created.emit(response);
    this.closeAddEventModal();
  }

  /**
   * Handles creation error
   * @param error - Error object
   */
  private handleError(error: any): void {
    console.error('Create event failed', error);
    // Implement proper error handling (e.g., show error toast)
  }

  /**
   * Displays success toast message
   * @param message - Message to display
   */
  private showSuccessToast(message: string): void {
    if (this.successToast) {
      const toastElement = this.successToast.nativeElement;
      const toastBody = toastElement.querySelector('.toast-body');

      if (toastBody) {
        toastBody.textContent = message;
        const toast = new Toast(toastElement);
        toast.show();
      }
    }
  }


  // Participant management methods

  /**
   * Opens participant search dropdown
   */
  openParticipantSearch(): void {
    this.isParticipantSearchOpen = true;
    this.participantSearchQuery = '';
  }

  /**
   * Closes participant search dropdown
   */
  closeParticipantSearch(): void {
    this.isParticipantSearchOpen = false;
    this.participantSearchQuery = '';
  }

  /**
   * Handles participant search input changes
   * @param event - Input event
   */
  onParticipantSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.participantSearchQuery = target.value;
  }

  /**
   * Gets filtered participants based on search query
   */
  get filteredParticipants(): Participant[] {
    if (!this.participantSearchQuery.trim()) {
      return this.allParticipants.filter(
        participant => !this.selectedParticipants.some(
          selected => selected.id === participant.id
        )
      );
    }

    const query = this.participantSearchQuery.toLowerCase();
    return this.allParticipants.filter(
      participant =>
        !this.selectedParticipants.some(selected => selected.id === participant.id) &&
        (participant.name.toLowerCase().includes(query) ||
         participant.email.toLowerCase().includes(query))
    );
  }

  /**
   * Adds participant to selected list
   * @param participant - Participant to add
   */
  addParticipant(participant: Participant): void {
    if (!this.selectedParticipants.some(p => p.id === participant.id)) {
      this.selectedParticipants.push(participant);
    }
    this.closeParticipantSearch();
  }

  /**
   * Removes participant from selected list
   * @param participantId - ID of participant to remove
   */
  removeParticipant(participantId: number): void {
    this.selectedParticipants = this.selectedParticipants.filter(
      participant => participant.id !== participantId
    );
  }
// Checklist management methods

  /**
   * Gets count of completed checklist items
   */
  get completedChecklistCount(): number {
    return this.checklistItems.filter(item => item.completed).length;
  }

  /**
   * Gets checklist completion percentage
   */
  get checklistProgress(): number {
    if (this.checklistItems.length === 0) return 0;
    const completedItems = this.completedChecklistCount;
    return Math.round((completedItems / this.checklistItems.length) * 100);
  }

  /**
   * Handles checklist input changes
   * @param event - Input event
   */
  onChecklistInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newChecklistItem = target.value;
  }

  /**
   * Handles checklist input key press
   * @param event - Keyboard event
   */
  onChecklistInputKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addChecklistItem();
    }
  }

  /**
   * Adds new checklist item
   */
  addChecklistItem(): void {
    if (this.newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now(),
        text: this.newChecklistItem.trim(),
        completed: false,
      };
      this.checklistItems.push(newItem);
      this.newChecklistItem = '';
    }
  }

  /**
   * Toggles checklist item completion status
   * @param itemId - ID of item to toggle
   */
  toggleChecklistItem(itemId: number): void {
    const item = this.checklistItems.find(item => item.id === itemId);
    if (item) {
      item.completed = !item.completed;
    }
  }

  /**
   * Removes checklist item
   * @param itemId - ID of item to remove
   */
  removeChecklistItem(itemId: number): void {
    this.checklistItems = this.checklistItems.filter(
      item => item.id !== itemId
    );
  }

  // File management methods

  /**
   * Formats file size to human-readable format
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

  /**
   * Removes file from attached files list
   * @param fileId - ID of file to remove
   */
  removeFile(fileId: number): void {
    this.attachedFiles = this.attachedFiles.filter(file => file.id !== fileId);
  }

  /**
   * Handles file selection
   * @param event - File input event
   */
  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file, index) => {
        this.processFileUpload(file, index);
      });
    }

    target.value = '';
  }

  /**
   * Processes file upload
   * @param file - File to upload
   * @param index - File index
   */
  private processFileUpload(file: File, index: number): void {
    const tempId = Date.now() + index;
    const attachedFile: AttachedFile = {
      id: tempId,
      name: file.name,
      type: file.type,
      size: file.size,
      icon: this.getFileIcon(file)
    };

    this.attachedFiles.push(attachedFile);

    this.uploadFile(file).subscribe({
      next: (response) => this.handleFileUploadSuccess(response, tempId),
      error: () => this.handleFileUploadError(file.name, tempId)
    });
  }

  /**
   * Handles successful file upload
   * @param response - API response
   * @param tempId - Temporary file ID
   */
  private handleFileUploadSuccess(response: any, tempId: number): void {
    const docId = response?.data?.id;

    if (!docId) {
      console.error('Failed to get document ID from upload response');
      this.attachedFiles = this.attachedFiles.filter(file => file.id !== tempId);
      return;
    }

    const fileToUpdate = this.attachedFiles.find(file => file.id === tempId);
    if (fileToUpdate) {
      fileToUpdate.docId = docId;
    }
  }

  /**
   * Handles file upload error
   * @param fileName - Name of failed file
   * @param tempId - Temporary file ID
   */
  private handleFileUploadError(fileName: string, tempId: number): void {
    console.error(`Failed to upload file: ${fileName}`);
    this.attachedFiles = this.attachedFiles.filter(file => file.id !== tempId);
  }

  /**
   * Uploads file to server
   * @param file - File to upload
   * @returns Observable of upload response
   */
  private uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:8081/api/v1/documents/upload', formData);
  }

  /**
   * Gets appropriate icon for file type
   * @param file - File object
   * @returns Icon string
   */
 private getFileIcon(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const fileType = file.type.split('/')[0];

  // First try to match by extension
  if (FILE_ICON_MAPPING[extension]) {
    return FILE_ICON_MAPPING[extension];
  }

  // Then try to match by file type (like 'image', 'audio', etc.)
  if (FILE_ICON_MAPPING[fileType]) {
    return FILE_ICON_MAPPING[fileType];
  }

  // Fallback to generic file icon
  return 'FILE';
}
}