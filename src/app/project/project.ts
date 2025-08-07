import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project',
  imports: [],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {

  @Input({required:true}) projectId!: number;

  ngOnInit() {
    
  }

}
