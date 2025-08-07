import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Input({required : true}) appTitle!: string;
  @Input() isUserProfileDropdownOpen = false;
  @Input() currentUser = {
    name: 'Zubayer Ahamed',
    email: 'zubayer@example.com',
    avatar: '/assets/images/zubayer.jpg',
  };

  @Output() toggleUserProfileDropdown = new EventEmitter<void>();
  @Output() closeUserProfileDropdown = new EventEmitter<void>();
  @Output() userProfileDropdownBackdropClick = new EventEmitter<void>();
  @Output() openProfileSettings = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleUserProfileDropdown(){
    this.toggleUserProfileDropdown.emit();
  }

  userProfileDropdownClose() {
    this.closeUserProfileDropdown.emit();
  }

  onUserProfileDropdownBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.userProfileDropdownClose();
    }
  }

  onOpenProfileSettings(){
    this.openProfileSettings.emit();
  }

  onLogout(){
    this.logout.emit();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
