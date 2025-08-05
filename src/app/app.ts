import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

interface Participant {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface AttachedFile {
  id: number;
  name: string;
  type: string;
  size: number;
  icon: string;
}

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

interface Subtask {
  id: number;
  title: string;
  assignedTo?: Participant;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'TODOIST';
  isSidebarOpen = false;
  isAddEventModalOpen = false;
  isAddTaskModalOpen = false;
  isParticipantSearchOpen = false;
  isTaskParticipantSearchOpen = false;
  participantSearchQuery = '';
  taskParticipantSearchQuery = '';

  // Dummy participants data
  allParticipants: Participant[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 6, name: 'Emily Davis', email: 'emily.davis@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 7, name: 'Alex Miller', email: 'alex.miller@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 8, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', avatar: '/assets/images/zubayer.jpg' }
  ];

  selectedParticipants: Participant[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatar: '/assets/images/zubayer.jpg' }
  ];

  attachedFiles: AttachedFile[] = [];
  checklistItems: ChecklistItem[] = [];
  newChecklistItem = '';

  // Task-specific properties
  taskSelectedParticipants: Participant[] = [
    { id: 1, name: 'Me', email: 'me@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 2, name: 'Azmee', email: 'azmee@example.com', avatar: '/assets/images/zubayer.jpg' },
    { id: 3, name: 'Shamim', email: 'shamim@example.com', avatar: '/assets/images/zubayer.jpg' }
  ];
  
  taskAttachedFiles: AttachedFile[] = [];
  subtasks: Subtask[] = [];
  newSubtaskTitle = '';
  showSubtasks = false;
  
  availableTags: Tag[] = [
    { id: 1, name: 'DSA', color: '#28a745' },
    { id: 2, name: 'Spring Security', color: '#17a2b8' },
    { id: 3, name: 'Spring Cloud', color: '#6f42c1' },
    { id: 4, name: 'AWS', color: '#fd7e14' }
  ];
  
  selectedTags: Tag[] = [
    { id: 1, name: 'DSA', color: '#28a745' },
    { id: 2, name: 'Spring Security', color: '#17a2b8' },
    { id: 3, name: 'Spring Cloud', color: '#6f42c1' },
    { id: 4, name: 'AWS', color: '#fd7e14' }
  ];

  get filteredParticipants(): Participant[] {
    if (!this.participantSearchQuery.trim()) {
      return this.allParticipants.filter(p => !this.selectedParticipants.find(sp => sp.id === p.id));
    }
    
    const query = this.participantSearchQuery.toLowerCase();
    return this.allParticipants.filter(participant => 
      !this.selectedParticipants.find(sp => sp.id === participant.id) &&
      (participant.name.toLowerCase().includes(query) || 
       participant.email.toLowerCase().includes(query))
    );
  }

  get filteredTaskParticipants(): Participant[] {
    if (!this.taskParticipantSearchQuery.trim()) {
      return this.allParticipants.filter(p => !this.taskSelectedParticipants.find(sp => sp.id === p.id));
    }
    
    const query = this.taskParticipantSearchQuery.toLowerCase();
    return this.allParticipants.filter(participant => 
      !this.taskSelectedParticipants.find(sp => sp.id === participant.id) &&
      (participant.name.toLowerCase().includes(query) || 
       participant.email.toLowerCase().includes(query))
    );
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Event Modal Methods
  openAddEventModal() {
    this.isAddEventModalOpen = true;
  }

  closeAddEventModal() {
    this.isAddEventModalOpen = false;
    this.isParticipantSearchOpen = false;
    this.participantSearchQuery = '';
  }

  onEventModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeAddEventModal();
    }
  }

  // Task Modal Methods
  openAddTaskModal() {
    this.isAddTaskModalOpen = true;
  }

  closeAddTaskModal() {
    this.isAddTaskModalOpen = false;
    this.isTaskParticipantSearchOpen = false;
    this.taskParticipantSearchQuery = '';
    this.showSubtasks = false;
    this.subtasks = [];
    this.newSubtaskTitle = '';
  }

  onTaskModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeAddTaskModal();
    }
  }

  // Event Participant management methods
  openParticipantSearch() {
    this.isParticipantSearchOpen = true;
    this.participantSearchQuery = '';
  }

  closeParticipantSearch() {
    this.isParticipantSearchOpen = false;
    this.participantSearchQuery = '';
  }

  onParticipantSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.participantSearchQuery = target.value;
  }

  addParticipant(participant: Participant) {
    if (!this.selectedParticipants.find(p => p.id === participant.id)) {
      this.selectedParticipants.push(participant);
    }
    this.closeParticipantSearch();
  }

  removeParticipant(participantId: number) {
    this.selectedParticipants = this.selectedParticipants.filter(p => p.id !== participantId);
  }

  // Task Participant management methods
  openTaskParticipantSearch() {
    this.isTaskParticipantSearchOpen = true;
    this.taskParticipantSearchQuery = '';
  }

  closeTaskParticipantSearch() {
    this.isTaskParticipantSearchOpen = false;
    this.taskParticipantSearchQuery = '';
  }

  onTaskParticipantSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.taskParticipantSearchQuery = target.value;
  }

  addTaskParticipant(participant: Participant) {
    if (!this.taskSelectedParticipants.find(p => p.id === participant.id)) {
      this.taskSelectedParticipants.push(participant);
    }
    this.closeTaskParticipantSearch();
  }

  removeTaskParticipant(participantId: number) {
    this.taskSelectedParticipants = this.taskSelectedParticipants.filter(p => p.id !== participantId);
  }

  // Event File attachment methods
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
          icon: this.getFileIcon(file.name, file.type)
        };
        this.attachedFiles.push(attachedFile);
      }
    }
    
    target.value = '';
  }

  removeFile(fileId: number) {
    this.attachedFiles = this.attachedFiles.filter(f => f.id !== fileId);
  }

  // Task File attachment methods
  onTaskFileSelect(event: Event) {
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
          icon: this.getFileIcon(file.name, file.type)
        };
        this.taskAttachedFiles.push(attachedFile);
      }
    }
    
    target.value = '';
  }

  removeTaskFile(fileId: number) {
    this.taskAttachedFiles = this.taskAttachedFiles.filter(f => f.id !== fileId);
  }

  // Subtask management methods
  showSubtaskSection() {
    this.showSubtasks = true;
  }

  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      const randomParticipant = this.allParticipants[Math.floor(Math.random() * this.allParticipants.length)];
      const newSubtask: Subtask = {
        id: Date.now(),
        title: this.newSubtaskTitle.trim(),
        assignedTo: randomParticipant
      };
      this.subtasks.push(newSubtask);
      this.newSubtaskTitle = '';
    }
  }

  removeSubtask(subtaskId: number) {
    this.subtasks = this.subtasks.filter(s => s.id !== subtaskId);
    if (this.subtasks.length === 0) {
      this.showSubtasks = false;
    }
  }

  onSubtaskInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newSubtaskTitle = target.value;
  }

  onSubtaskInputKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSubtask();
    }
  }

  onSubtaskTitleChange(subtaskId: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const subtask = this.subtasks.find(s => s.id === subtaskId);
    if (subtask) {
      subtask.title = target.value;
    }
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

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Checklist management methods
  addChecklistItem() {
    if (this.newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now(),
        text: this.newChecklistItem.trim(),
        completed: false
      };
      this.checklistItems.push(newItem);
      this.newChecklistItem = '';
    }
  }

  toggleChecklistItem(itemId: number) {
    const item = this.checklistItems.find(item => item.id === itemId);
    if (item) {
      item.completed = !item.completed;
    }
  }

  removeChecklistItem(itemId: number) {
    this.checklistItems = this.checklistItems.filter(item => item.id !== itemId);
  }

  get checklistProgress(): number {
    if (this.checklistItems.length === 0) return 0;
    const completedItems = this.checklistItems.filter(item => item.completed).length;
    return Math.round((completedItems / this.checklistItems.length) * 100);
  }

  get completedChecklistCount(): number {
    return this.checklistItems.filter(item => item.completed).length;
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
}
