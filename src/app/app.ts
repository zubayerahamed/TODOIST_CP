import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './core/components/alert/alert.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [ RouterOutlet, AlertComponent,
    ReactiveFormsModule,
    FormsModule
   ]
})
export class App {


}
