import { Component } from '@angular/core';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';

@Component({
  selector: 'app-layouts',
  imports: [FlatpickrDirective],
  providers: [provideFlatpickrDefaults()],
  templateUrl: './layouts.html',
  styleUrl: './layouts.css'
})
export class Layouts {

}
