import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileCardComponent } from '../shared/profile-card/profile-card.component';
import { OfflineWarningCardComponent } from './offline-warning-card/offline-warning-card.component';
import { RobotsComponent } from './robots/robots.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    OfflineWarningCardComponent,
    RobotsComponent,
    ConfirmDialogComponent,
    ProfileCardComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [OfflineWarningCardComponent, RobotsComponent, ProfileCardComponent],
})
export class SharedModule {}
