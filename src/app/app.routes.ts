
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './Authentication/login/login';  // Make sure Login is a Standalone component or module
import { SideNavBar } from './Home/side-nav-bar/side-nav-bar';
import { Dashboard } from './Home/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {path:'sidebar',component:SideNavBar},
  {path: 'dashboard',component:Dashboard}
];
