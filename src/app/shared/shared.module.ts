import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { OfflineWarningCardComponent } from './offline-warning-card/offline-warning-card.component';
import { RobotsComponent } from './robots/robots.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    OfflineWarningCardComponent,
    RobotsComponent,
    ConfirmDialogComponent,
  ],
  imports: [CommonModule, MatDialogModule, MatCardModule, MatButtonModule],
  exports: [OfflineWarningCardComponent, RobotsComponent],
})
export class SharedModule {}
