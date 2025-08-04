// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Layouts } from './layouts/layouts';
import { Login } from './Authentication/login/login';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [

  {
    path: '',
    component: Layouts,
    children:[
      {
        path: 'dashboard',
        component: Dashboard,
      }
    ]
  },
  {
    path: 'login',
    component: Login,
  }


  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: Login },
  // { path: 'sidebar', component: SideNavBar },
  // { path: 'dashboard', component: Dashboard },
];
