import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  message: string;
  trueButton: string;
  falseButton: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.trueButton = data.trueButton || '';
    this.falseButton = data.falseButton || '';
  }

  ngOnInit() {
    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.onDismiss();
      }
    });

    this.dialogRef.backdropClick().subscribe((event) => {
      this.onDismiss();
    });
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
