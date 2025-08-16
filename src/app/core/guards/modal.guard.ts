import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CreateEvent } from '../../events/create-event/create-event';


@Injectable({
  providedIn: 'root'
})
export class ModalGuard implements CanDeactivate<CreateEvent> {
  canDeactivate(component: CreateEvent): boolean {
    if (component.isAddEventModalOpen) {
      return confirm('You have an open modal. Close it and lose changes?');
    }
    return true;
  }
}