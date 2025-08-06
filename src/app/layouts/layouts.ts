import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layouts',
  standalone: true,
  templateUrl: './layouts.html',
  styleUrl: './layouts.css',
  imports: [RouterOutlet]
})
export class Layouts {

  constructor(private router: Router) {
    // Example condition: redirect to dashboard
    const defaultPage = 'today'; // or get from service or storage
    this.router.navigate([defaultPage]);
  }
}
