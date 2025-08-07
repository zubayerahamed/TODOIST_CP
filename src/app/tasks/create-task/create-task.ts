import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Participant } from '../../core/models/participant.model';
import { Subtask } from '../../core/models/subtask.model';
import { AttachedFile } from '../../core/models/attached-file.model';

@Component({
  selector: 'app-create-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask {
  @Input({required : true}) isAddTaskModalOpen!: boolean;
  @Output() isAddTaskModalClose = new EventEmitter<void>();

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
  newSubtaskTitle = '';
  subtasks: Subtask[] = [];
  isTaskParticipantSearchOpen = false;
  taskParticipantSearchQuery = '';
  isSubtaskParticipantSearchOpen: { [key: number]: boolean } = {};
  subtaskParticipantSearchQuery: { [key: number]: string } = {};
  taskAttachedFiles: AttachedFile[] = [];
  taskSelectedParticipants: Participant[] = [
    {
      id: 1,
      name: 'Me',
      email: 'me@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 2,
      name: 'Azmee',
      email: 'azmee@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
    {
      id: 3,
      name: 'Shamim',
      email: 'shamim@example.com',
      avatar: '/assets/images/zubayer.jpg',
    },
  ];

  onTaskModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeAddTaskModal();
    }
  }

  closeSubtaskParticipantSearch(subtaskId: number) {
    this.isSubtaskParticipantSearchOpen[subtaskId] = false;
    this.subtaskParticipantSearchQuery[subtaskId] = '';
  }

  closeAddTaskModal() {
    this.isAddTaskModalOpen = false;
    this.isTaskParticipantSearchOpen = false;
    this.taskParticipantSearchQuery = '';
    // Close all subtask participant searches when closing task modal
    Object.keys(this.isSubtaskParticipantSearchOpen).forEach((key) => {
      this.closeSubtaskParticipantSearch(parseInt(key));
    });
    this.isAddTaskModalClose.emit();
  }

  removeTaskParticipant(participantId: number) {
    this.taskSelectedParticipants = this.taskSelectedParticipants.filter(
      (p) => p.id !== participantId
    );
  }

  openTaskParticipantSearch() {
    this.isTaskParticipantSearchOpen = true;
    this.taskParticipantSearchQuery = '';
  }

  onTaskParticipantSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.taskParticipantSearchQuery = target.value;
  }

  closeTaskParticipantSearch() {
    this.isTaskParticipantSearchOpen = false;
    this.taskParticipantSearchQuery = '';
  }

  get filteredTaskParticipants(): Participant[] {
    if (!this.taskParticipantSearchQuery.trim()) {
      return this.allParticipants.filter(
        (p) => !this.taskSelectedParticipants.find((sp) => sp.id === p.id)
      );
    }

    const query = this.taskParticipantSearchQuery.toLowerCase();
    return this.allParticipants.filter(
      (participant) =>
        !this.taskSelectedParticipants.find((sp) => sp.id === participant.id) &&
        (participant.name.toLowerCase().includes(query) ||
          participant.email.toLowerCase().includes(query))
    );
  }

  addTaskParticipant(participant: Participant) {
    if (!this.taskSelectedParticipants.find((p) => p.id === participant.id)) {
      this.taskSelectedParticipants.push(participant);
    }
    this.closeTaskParticipantSearch();
  }

  get completedSubtaskCount(): number {
    return this.subtasks.filter((subtask) => subtask.completed).length;
  }

  get subtaskProgress(): number {
    if (this.subtasks.length === 0) return 0;
    const completedSubtasks = this.subtasks.filter(
      (subtask) => subtask.completed
    ).length;
    return Math.round((completedSubtasks / this.subtasks.length) * 100);
  }

  onNewSubtaskInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newSubtaskTitle = target.value;
  }

  onNewSubtaskKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSubtask();
    }
  }

  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: Date.now(),
        title: this.newSubtaskTitle.trim(),
        completed: false,
        assignedParticipant: undefined,
        order: this.subtasks.length,
      };
      this.subtasks.push(newSubtask);
      this.newSubtaskTitle = '';
    }
  }

  toggleSubtask(subtaskId: number) {
    const subtask = this.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
    }
  }

  openSubtaskParticipantSearch(subtaskId: number) {
    this.isSubtaskParticipantSearchOpen[subtaskId] = true;
    this.subtaskParticipantSearchQuery[subtaskId] = '';
  }

  onSubtaskParticipantSearchInput(subtaskId: number, event: Event) {
    const target = event.target as HTMLInputElement;
    this.subtaskParticipantSearchQuery[subtaskId] = target.value;
  }

  getFilteredSubtaskParticipants(subtaskId: number): Participant[] {
    const subtask = this.subtasks.find((s) => s.id === subtaskId);
    if (!subtask) return [];

    const query = this.subtaskParticipantSearchQuery[subtaskId] || '';
    let availableParticipants = this.allParticipants.filter(
      (p) =>
        !subtask.assignedParticipant || subtask.assignedParticipant.id !== p.id
    );

    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      availableParticipants = availableParticipants.filter(
        (participant) =>
          participant.name.toLowerCase().includes(searchQuery) ||
          participant.email.toLowerCase().includes(searchQuery)
      );
    }

    return availableParticipants;
  }

  addParticipantToSubtask(subtaskId: number, participant: Participant) {
    const subtask = this.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.assignedParticipant = participant;
    }
    this.closeSubtaskParticipantSearch(subtaskId);
  }

  onSubtaskTitleChange(subtaskId: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const subtask = this.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.title = target.value;
    }
  }

  removeSubtask(subtaskId: number) {
    this.subtasks = this.subtasks.filter((s) => s.id !== subtaskId);
    // Update order for remaining subtasks
    this.subtasks.forEach((subtask, index) => {
      subtask.order = index;
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeTaskFile(fileId: number) {
    this.taskAttachedFiles = this.taskAttachedFiles.filter(
      (f) => f.id !== fileId
    );
  }

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
          icon: this.getFileIcon(file.name, file.type),
        };
        this.taskAttachedFiles.push(attachedFile);
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

  // Subtask ordering functionality
  moveSubtaskUp(index: number) {
    if (index > 0) {
      const temp = this.subtasks[index];
      this.subtasks[index] = this.subtasks[index - 1];
      this.subtasks[index - 1] = temp;

      // Update order for all subtasks
      this.subtasks.forEach((subtask, idx) => {
        subtask.order = idx;
      });
    }
  }

  moveSubtaskDown(index: number) {
    if (index < this.subtasks.length - 1) {
      const temp = this.subtasks[index];
      this.subtasks[index] = this.subtasks[index + 1];
      this.subtasks[index + 1] = temp;

      // Update order for all subtasks
      this.subtasks.forEach((subtask, idx) => {
        subtask.order = idx;
      });
    }
  }

  removeParticipantFromSubtask(subtaskId: number) {
    const subtask = this.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.assignedParticipant = undefined;
    }
  }

  onSubtaskParticipantSearchBackdropClick(event: Event, subtaskId: number) {
    // Close the dropdown if clicking outside of it
    if (event.target === event.currentTarget) {
      this.closeSubtaskParticipantSearch(subtaskId);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Check if any subtask participant search is open
    const openSearches = Object.keys(
      this.isSubtaskParticipantSearchOpen
    ).filter((key) => this.isSubtaskParticipantSearchOpen[parseInt(key)]);

    if (openSearches.length > 0) {
      // Check if the click is outside any subtask participant search dropdown
      const isClickInsideDropdown = target.closest(
        '.subtask-participant-dropdown'
      );
      const isClickOnParticipantCircle = target.closest(
        '.subtask-participant-circle'
      );

      if (!isClickInsideDropdown && !isClickOnParticipantCircle) {
        // Close all open subtask participant searches
        openSearches.forEach((key) => {
          this.closeSubtaskParticipantSearch(parseInt(key));
        });
      }
    }

  }
}
