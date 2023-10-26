import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Player } from '../interfaces/Player';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.scss'],
})
export class EditTransactionComponent {
  public playerKey: string;
  public playersList: Player[] = [];
  private keySubscription: Subscription | undefined;
  private clickSubscription: Subscription | undefined;

  constructor(
    public dialogRef: MatDialogRef<
      EditTransactionComponent,
      string | undefined
    >,
    @Inject(MAT_DIALOG_DATA) public data: EditTransactionDialogData
  ) {
    this.playersList = data.playersList;
    this.playerKey = data.playerKey;
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
    // Close the dialog, return the selected playerKey
    this.dialogRef.close(this.playerKey);
  }

  onDismiss(): void {
    this.dialogRef.close(undefined);
  }
}

//Interface to represent confirm dialog model.
export interface EditTransactionDialogData {
  playerKey: string;
  playersList: Player[];
}
