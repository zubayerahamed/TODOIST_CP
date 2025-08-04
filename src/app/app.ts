import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'TODOIST';
  isSidebarOpen = false;
  isAddEventModalOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  openAddEventModal() {
    this.isAddEventModalOpen = true;
  }

  closeAddEventModal() {
    this.isAddEventModalOpen = false;
  }

  onModalBackdropClick(event: Event) {
    // Close modal only if clicking on the backdrop (not the modal content)
    if (event.target === event.currentTarget) {
      this.closeAddEventModal();
    }
  }
}
