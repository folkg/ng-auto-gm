import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';

import {
  DialogData,
  ConfirmDialogComponent,
} from '../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class DirtyFormGuard implements CanDeactivate<unknown> {
  constructor(public dialog: MatDialog) {}

  async confirmDialog(): Promise<boolean> {
    const title = 'WARNING: You have unsaved changes.';
    const message =
      'Press Cancel to stay and save these changes, or Proeed to leave this page and lose these changes.';
    const dialogData: DialogData = {
      title,
      message,
      trueButton: 'Proceed',
      falseButton: 'Cancel',
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      data: dialogData,
    });
    return await lastValueFrom(dialogRef.afterClosed());
  }

  canDeactivate(
    component: ComponentCanDeactivate
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //TODO:Make it a dialog
    return component.canDeactivate() ? true : this.confirmDialog();
  }
}
