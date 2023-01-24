import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { OfflineWarningCardComponent } from './offline-warning-card/offline-warning-card.component';

@NgModule({
  declarations: [OfflineWarningCardComponent],
  imports: [CommonModule, MatCardModule],
  exports: [OfflineWarningCardComponent],
})
export class SharedModule {}
