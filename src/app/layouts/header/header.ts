import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy{

    time: string = '';
  private intervalId: any;


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

    private updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 -> 12
    const hoursStr = hours.toString().padStart(2, '0');

    this.time = `${hoursStr} : ${minutes} : ${seconds} ${ampm}`;
  }

    ngOnInit() {
    this.updateTime(); // initial call
    this.intervalId = setInterval(() => this.updateTime(), 1000); // update every second
  }

    ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

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
