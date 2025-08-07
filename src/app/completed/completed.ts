import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-completed',
  imports: [],
  templateUrl: './completed.html',
  styleUrl: './completed.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class Completed {

}
