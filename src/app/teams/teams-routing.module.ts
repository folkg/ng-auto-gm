import { NgModule } from '@angular/core';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { DirtyFormGuard } from '../guards/dirty-form.guard';
import { TeamsComponent } from './teams.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: 'teams',
    component: TeamsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DirtyFormGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
