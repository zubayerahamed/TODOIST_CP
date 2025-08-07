import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),  // Input binding for components
      withRouterConfig({ paramsInheritanceStrategy: 'always' }) // Always inherit params from parent routes,
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
};
