import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../guards/login.guard';
import { TeamComponent } from './team/team.component';
import { TeamsComponent } from './teams.component';

const routes: Routes = [
  { path: 'teams', component: TeamsComponent, canActivate: [LoginGuard] },
  {
    path: 'teams/:teamid',
    component: TeamComponent,
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
