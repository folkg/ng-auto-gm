import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { TeamsComponent } from './teams.component';

const routes: Routes = [
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/:teamid', component: TeamComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
