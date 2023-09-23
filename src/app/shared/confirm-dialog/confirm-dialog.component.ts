import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  title: string;
  message: string;
  trueButton: string;
  falseButton: string;
  private keySubscription: Subscription | undefined;
  private clickSubscription: Subscription | undefined;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.trueButton = data.trueButton ?? '';
    this.falseButton = data.falseButton ?? '';
  }

  ngOnInit() {
    this.keySubscription = this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.onDismiss();
      }
    });

    this.clickSubscription = this.dialogRef
      .backdropClick()
      .subscribe((event) => {
        this.onDismiss();
      });
  }

  ngOnDestroy(): void {
    this.keySubscription?.unsubscribe();
    this.clickSubscription?.unsubscribe();
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

//Interface to represent confirm dialog model.
export interface DialogData {
  title: string;
  message: string;
  trueButton?: string;
  falseButton?: string;
}
