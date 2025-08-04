import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { FlatpickrDefaults, provideFlatpickrDefaults } from 'angularx-flatpickr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(),
    // provideFlatpickrDefaults({
    //   dateFormat: 'Y-m-d', // Example default date format
    //   enableTime: false, // Example default setting
    //   allowInput: true, // Example default setting
    // } as FlatpickrDefaults),
  ]
};
