import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfileModule } from '../profile/profile.module';
import { SharedModule } from '../shared/shared.module';
import { TeamComponent } from './team/team.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { RelativeDatePipe } from './pipes/relative-date.pipe';

@NgModule({
  declarations: [TeamsComponent, TeamComponent, RelativeDatePipe],
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
    ProfileModule,
  ],
  exports: [TeamComponent],
  providers: [RelativeDatePipe],
})
export class TeamsModule {}
