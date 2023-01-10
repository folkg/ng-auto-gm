import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class DirtyFormGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: ComponentCanDeactivate
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //TODO:Make it a dialog
    return component.canDeactivate()
      ? true
      : confirm(
          'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.'
        );
  }
}
