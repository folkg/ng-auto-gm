import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormsModule } from '@angular/forms';
import { NthPipe } from './pipes/nth.pipe';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { TeamComponent } from './team/team.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';

@NgModule({
  declarations: [TeamsComponent, TeamComponent, NthPipe, RelativeDatePipe],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule,
  ],
  exports: [TeamComponent],
  providers: [RelativeDatePipe],
})
export class TeamsModule {}
