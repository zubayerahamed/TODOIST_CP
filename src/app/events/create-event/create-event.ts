import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Participant } from '../../core/models/participant.model';
import { ChecklistItem } from '../../core/models/checklist-item.model';
import { AttachedFile } from '../../core/models/attached-file.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { AddEvent } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-create-event',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEvent implements OnInit {
  @Input({required : true}) isAddEventModalOpen!: boolean;
  @Output() isAddEventModalClose = new EventEmitter<void>();

  private alterService = inject(AlertService);
  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);
  private eventService = inject(EventService);

  public projects: Project[] = [];
  public categories: Category[] = [];
  public checklistItems: ChecklistItem[] = [];

  // Form properties
  enteredEventDate: string = new Date().toISOString().split('T')[0];
  enteredEventStartTime: string = '';
  enteredEventEndTime: string = '';
  enteredEventTitle: string = '';
  enteredEventDescription: string = '';
  selectedProjectId: number | null = null;
  selectedCategoryId: number | null = null;
  enteredEventLocation: string = '';
  selectedReminder: number | null = null;
  enteredEventLink: string = '';

  // Form error properties
  eventDateError: string = '';
  eventStartTimeError: string = '';
  eventEndTimeError: string = '';
  eventTitleError: string = '';
  eventProjectError: string = '';

  ngOnInit() {
    this.initializeDateTime();
    this.loadProjects();
  }

  initializeDateTime(){
    const now = new Date();

    // Format as HH:mm for <input type="time">
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    this.enteredEventStartTime = `${hours}:${minutes}`;

    // Set end time to one hour later
    const endTime = new Date(now.getTime() + 60 * 60 * 1000);
    const endHours = endTime.getHours().toString().padStart(2, '0');
    const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
    this.enteredEventEndTime = `${endHours}:${endMinutes}`;
  }

  loadProjects(){
    console.log('Loading projects...');
    // Fetch projects from the service
    this.projectService.getAllProjects().subscribe({
      next: (resData) => {
        this.projects = resData.data || [];
      }, 
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
    });
  }

  onProjectChange(event: Event) {
    if(this.selectedProjectId == null) return;

    // Fetch the categories for the selected project. 
    this.categoryService.getAllProjectCategories(this.selectedProjectId).subscribe({
      next: (resData) => {
        this.categories = resData.data || [];
        this.categories = this.categories.filter(cat => cat.isForEvent);
      }, 
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  resetForm(){
    this.enteredEventDate = new Date().toISOString().split('T')[0];
    this.enteredEventStartTime = '';
    this.enteredEventEndTime = '';
    this.enteredEventTitle = '';
    this.enteredEventDescription = '';
    this.selectedProjectId = null;
    this.selectedCategoryId = null;
    this.enteredEventLocation = '';
    this.selectedReminder = null;
    this.enteredEventLink = '';

    this.resetErrorMessages();
  }

  resetErrorMessages(){
    this.eventDateError = '';
    this.eventStartTimeError = '';
    this.eventEndTimeError = '';
    this.eventTitleError = '';
    this.eventProjectError = '';
  }

  validateForm(): boolean {

    // Reset errors
    this.resetErrorMessages();
    let isValid = true;
  
    if(this.enteredEventTitle.trim().length === 0){
      this.eventTitleError = 'Event title is required.';
      isValid = false;
    }

    if(this.enteredEventDate.trim().length === 0){
      this.eventDateError = 'Event date is required.';
      isValid = false;
    }
  
    if(this.enteredEventStartTime.trim().length === 0){
      this.eventStartTimeError = 'Event start time is required.';
      isValid = false;
    }

    if(this.enteredEventEndTime.trim().length === 0){
      this.eventEndTimeError = 'Event end time is required.';
      isValid = false;
    }

    // check if end time is after start time
    if(this.enteredEventStartTime && this.enteredEventEndTime){
      const start = this.enteredEventStartTime;
      const end = this.enteredEventEndTime;

      if(start >= end){
        this.eventEndTimeError = 'End time must be after start time.';
        isValid = false;
      }
    }

    if(this.selectedProjectId == null){
      this.eventProjectError = 'Please select a project.';
      isValid = false;
    }

    return isValid;
  }

  onCreateEvent(){
    if(!this.validateForm()) return;

    // Prepare event data
    let eventDate = new Date(this.enteredEventDate);
    let formattedDate = eventDate.toISOString().split('T')[0];

    const eventData : AddEvent = { 
      title: this.enteredEventTitle,
      description: this.enteredEventDescription,
      projectId: this.selectedProjectId!,
      categoryId: this.selectedCategoryId!,
      eventDate: formattedDate,
      startTime: this.enteredEventStartTime,
      endTime: this.enteredEventEndTime,
      location: this.enteredEventLocation,
      isReminderEnabled: this.selectedReminder != null,
      reminderBefore: this.selectedReminder || 0,
      perticipants: [],
      documents: [],
      checklists: this.checklistItems? this.checklistItems.map(item => ({ description: item.text, isCompleted: item.completed })) : [],
      eventLink: this.enteredEventLink
    };

    console.log(eventData);

    this.eventService.createEvent(eventData).subscribe({
      next: (resData) => {
        this.alterService.success('Success!', 'Event created successfully!');
        this.closeAddEventModal();
      },
      error: (error) => {
        console.error('Error creating event:', error);
        this.alterService.error('Error!', 'Failed to create event. Please try again.');
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

  closeAddEventModal() {
    this.resetForm();
    this.isAddEventModalOpen = false;
    this.isParticipantSearchOpen = false;
    this.participantSearchQuery = '';
    this.isAddEventModalClose.emit();
  }

  onEventModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeAddEventModal();
    }
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
        const attachedFile: AttachedFile = {
          id: Date.now() + i,
          name: file.name,
          type: file.type,
          size: file.size,
          icon: this.getFileIcon(file.name, file.type),
        };
        this.attachedFiles.push(attachedFile);
      }
    }

    target.value = '';
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
