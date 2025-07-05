
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './Authentication/login/login';  // Make sure Login is a Standalone component or module

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login }
];
