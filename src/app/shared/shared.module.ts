import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { OfflineWarningCardComponent } from './offline-warning-card/offline-warning-card.component';
import { RobotsComponent } from './robots/robots.component';
import { NthPipe } from './pipes/nth.pipe';

@NgModule({
  declarations: [
    OfflineWarningCardComponent,
    RobotsComponent,
    ConfirmDialogComponent,
    NthPipe,
  ],
  imports: [CommonModule, MatDialogModule, MatCardModule, MatButtonModule],
  exports: [OfflineWarningCardComponent, RobotsComponent, NthPipe],
})
export class SharedModule {}
