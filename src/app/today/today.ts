import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ProjectService } from '../core/services/project.service';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [],
  templateUrl: './today.html',
  styleUrl: './today.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-5'
  }
})
export class Today {
  
  pageTitle: string = 'Today';
  public projectService = inject(ProjectService);

  

}
