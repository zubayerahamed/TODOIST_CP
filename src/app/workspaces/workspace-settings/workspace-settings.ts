import { Component } from '@angular/core';

declare global {
  interface Window {
    toggleDropdown: (dropdownId: string) => void;
    selectOption: (dropdownId: string, value: string, text: string, color: string) => void;
  }
}

@Component({
  selector: 'app-workspace-settings',
  imports: [],
  templateUrl: './workspace-settings.html',
  styleUrl: './workspace-settings.css',
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class WorkspaceSettings {

  ngOnInit() {
    // Add global functions for dropdown functionality
    window.toggleDropdown = (dropdownId: string) => {
      const dropdown = document.getElementById(dropdownId + 'Options');
      const selected = document.querySelector(`#${dropdownId}Dropdown .dropdown-selected`);
      
      if (dropdown && selected) {
        const isVisible = dropdown.style.display === 'flex';
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-options').forEach(d => {
          (d as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('.dropdown-selected').forEach(s => {
          s.classList.remove('active');
        });
        
        if (!isVisible) {
          dropdown.style.display = 'flex';
          selected.classList.add('active');
        }
      }
    };

    window.selectOption = (dropdownId: string, value: string, text: string, color: string) => {
      const dropdown = document.getElementById(dropdownId + 'Options');
      const selected = document.querySelector(`#${dropdownId}Dropdown .dropdown-selected`);
      const selectedOption = selected?.querySelector('.selected-option');
      
      if (selectedOption) {
        const colorCircle = selectedOption.querySelector('.color-circle') as HTMLElement;
        const textSpan = selectedOption.querySelector('span');
        
        if (colorCircle && textSpan) {
          colorCircle.style.backgroundColor = color;
          textSpan.textContent = text;
        }
      }
      
      if (dropdown) {
        dropdown.style.display = 'none';
      }
      
      if (selected) {
        selected.classList.remove('active');
      }
    };

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-dropdown')) {
        document.querySelectorAll('.dropdown-options').forEach(d => {
          (d as HTMLElement).style.display = 'none';
        });
        document.querySelectorAll('.dropdown-selected').forEach(s => {
          s.classList.remove('active');
        });
      }
    });
  }
}
