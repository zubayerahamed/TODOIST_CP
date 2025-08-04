import { Component } from '@angular/core';
import { Login } from '../Authentication/login/login';

@Component({
  selector: 'app-dashboard',
  imports: [Login],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
