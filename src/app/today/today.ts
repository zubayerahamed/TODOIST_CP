import { Component, inject } from '@angular/core';
import { ProjectService } from '../core/services/project.service';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [],
  templateUrl: './today.html',
  styleUrls: ['./today.css'],
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class Today {
  
  pageTitle: string = 'Today';
  public projectService = inject(ProjectService);

  

}
