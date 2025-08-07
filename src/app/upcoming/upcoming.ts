import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-upcoming',
  imports: [],
  templateUrl: './upcoming.html',
  styleUrl: './upcoming.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class Upcoming {

}
