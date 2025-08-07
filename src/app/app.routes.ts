// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './Authentication/login/login';
import { Layouts } from './layouts/layouts';
import { Today } from './today/today';
import { Register } from './Authentication/register/register';
import { ForgotPassword } from './Authentication/forgot-password/forgot-password';
import { ResetPassword } from './Authentication/reset-password/reset-password';
import { AuthGuard } from './core/guards/auth.guard';
import { Project } from './project/project';


export const routes: Routes = [

  {
    path: '',
    component: Layouts,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'today',
        component: Today,
        data: { title: 'Today' }
      },
      {
        path: 'project/:projectId',
        component: Project,
        data: { title: 'Project' }
      }
    ]
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'reset-password',
    component: ResetPassword,
  }


  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: Login },
  // { path: 'sidebar', component: SideNavBar },
  // { path: 'dashboard', component: Dashboard },
];
