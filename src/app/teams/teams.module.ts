import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '../shared/shared.module';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { TeamComponent } from './team/team.component';
import { NthPipe } from './pipes/nth.pipe';
import { FormsModule } from '@angular/forms';
import { RelativeDatePipe } from './pipes/relative-date.pipe';

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
    SharedModule,
  ],
  providers: [RelativeDatePipe],
})
export class TeamsModule {}
