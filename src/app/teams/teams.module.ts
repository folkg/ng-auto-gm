import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { TeamComponent } from './team/team.component';

@NgModule({
  declarations: [TeamsComponent, TeamComponent],
  imports: [CommonModule, TeamsRoutingModule],
})
export class TeamsModule {}
