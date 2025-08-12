import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Participant } from '../../core/models/participant.model';
import { ChecklistItem } from '../../core/models/checklist-item.model';
import { AttachedFile } from '../../core/models/attached-file.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface EventRequest {
  title: string;
  description?: string | null;
  projectId?: number | null;
  categoryId?: number | null;
  eventDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  location?: string | null;
  isReminderEnabled: boolean;
  reminderBefore: number;
  documents?: number[] ;
}
@Component({
  selector: 'app-create-event',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEvent implements OnInit {

  @Input() isAddEventModalOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<any>();
  // @Input({required : true}) isAddEventModalOpen!: boolean;
  @Output() isAddEventModalClose = new EventEmitter<void>();

  eventForm!: FormGroup;
  submitting = false;

    constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      eventDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      title: ['', Validators.required],
      projectId: [null],
      categoryId: [null],
      description: [''],
      location: [''],
      isReminderEnabled: [false],
      reminderBefore: [0]
    });
  }

    closeAddEventModal() {
    this.isAddEventModalOpen = false;
    this.closed.emit();
  }

  onEventModalBackdropClick(e: MouseEvent) {
    if (e.target === this.host.nativeElement.querySelector('.modal-backdrop')) {
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
      documents: this.attachedFiles
  .filter(f => f.docId !== undefined)
  .map(f => f.docId!)

    };
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.formToPayload();

    this.http.post('http://localhost:8081/api/v1/events', payload).subscribe({
      next: (res) => {
        this.submitting = false;
        this.created.emit(res);
        this.closeAddEventModal();
      },
      error: (err) => {
        this.submitting = false;
        console.error('Create event failed', err);
      }
    });
  }

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

  isParticipantSearchOpen = false;
  participantSearchQuery = '';
  checklistItems: ChecklistItem[] = [];
  newChecklistItem = '';
  attachedFiles: AttachedFile[] = [];

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

  removeParticipant(participantId: number) {
    this.selectedParticipants = this.selectedParticipants.filter(
      (p) => p.id !== participantId
    );
  }



  openParticipantSearch() {
    this.isParticipantSearchOpen = true;
    this.participantSearchQuery = '';
  }

  onParticipantSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.participantSearchQuery = target.value;
  }

  closeParticipantSearch() {
    this.isParticipantSearchOpen = false;
    this.participantSearchQuery = '';
  }

  get filteredParticipants(): Participant[] {
    if (!this.participantSearchQuery.trim()) {
      return this.allParticipants.filter(
        (p) => !this.selectedParticipants.find((sp) => sp.id === p.id)
      );
    }

    const query = this.participantSearchQuery.toLowerCase();
    return this.allParticipants.filter(
      (participant) =>
        !this.selectedParticipants.find((sp) => sp.id === participant.id) &&
        (participant.name.toLowerCase().includes(query) ||
          participant.email.toLowerCase().includes(query))
    );
  }

  addParticipant(participant: Participant) {
    if (!this.selectedParticipants.find((p) => p.id === participant.id)) {
      this.selectedParticipants.push(participant);
    }
    this.closeParticipantSearch();
  }

  get completedChecklistCount(): number {
    return this.checklistItems.filter((item) => item.completed).length;
  }

  get checklistProgress(): number {
    if (this.checklistItems.length === 0) return 0;
    const completedItems = this.checklistItems.filter(
      (item) => item.completed
    ).length;
    return Math.round((completedItems / this.checklistItems.length) * 100);
  }

  onChecklistInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newChecklistItem = target.value;
  }

  onChecklistInputKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addChecklistItem();
    }
  }

  // Checklist management methods
  addChecklistItem() {
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

  toggleChecklistItem(itemId: number) {
    const item = this.checklistItems.find((item) => item.id === itemId);
    if (item) {
      item.completed = !item.completed;
    }
  }

  removeChecklistItem(itemId: number) {
    this.checklistItems = this.checklistItems.filter(
      (item) => item.id !== itemId
    );
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(fileId: number) {
    this.attachedFiles = this.attachedFiles.filter((f) => f.id !== fileId);
  }

onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Create a temporary attachedFile entry with a temporary id
      const tempId = Date.now() + i;
      const attachedFile: AttachedFile = {
        id: tempId,
        name: file.name,
        type: file.type,
        size: file.size,
        icon: this.getFileIcon(file.name, file.type),
      };
      this.attachedFiles.push(attachedFile);

      // Upload file to backend and update attachedFile with real docId
      this.uploadFile(file).subscribe({
  next: (response: any) => {
    // Extract document id from the response
    const docId = response?.data?.id;

    if (!docId) {
      alert(`Failed to get document ID from upload response for file: ${file.name}`);
      this.attachedFiles = this.attachedFiles.filter(f => f.id !== tempId);
      return;
    }

    const fileToUpdate = this.attachedFiles.find(f => f.id === tempId);
    if (fileToUpdate) {
      fileToUpdate.docId = docId;
    }
  },
        error: () => {
          alert(`Failed to upload file: ${file.name}`);
          // Remove file from attachedFiles on failure
          this.attachedFiles = this.attachedFiles.filter(f => f.id !== tempId);
        }
      });
    }
  }

  target.value = '';
}

uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  // Adjust URL to your backend file upload endpoint
  return this.http.post<number>('http://localhost:8081/api/v1/documents/upload', formData);
}


  getFileIcon(fileName: string, fileType: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (fileType.startsWith('image/')) {
      return 'JPG';
    } else if (extension === 'pdf') {
      return 'PDF';
    } else if (extension === 'doc' || extension === 'docx') {
      return 'DOC';
    } else if (extension === 'xls' || extension === 'xlsx') {
      return 'XLS';
    } else if (extension === 'ppt' || extension === 'pptx') {
      return 'PPT';
    } else if (extension === 'txt') {
      return 'TXT';
    } else if (extension === 'zip' || extension === 'rar') {
      return 'ZIP';
    } else if (extension === 'csv') {
      return 'CSV';
    } else {
      return 'FILE';
    }
  }
}
