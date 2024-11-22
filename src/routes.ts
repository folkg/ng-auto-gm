import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import type { Routes } from '@angular/router';

import { AboutComponent } from './app/about/about.component';
import { DirtyFormGuard } from './app/guards/dirty-form.guard';
import { LoginComponent } from './app/login/login.component';
import { NotfoundComponent } from './app/notfound/notfound.component';
import { TeamsComponent } from './app/teams/teams.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToTeams = () => redirectLoggedInTo(['/teams']);

export const routes: Routes = [
  { path: '', redirectTo: '/teams', pathMatch: 'full' },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToTeams },
  },
  {
    path: 'teams',
    component: TeamsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DirtyFormGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'feedback',
    loadComponent: () =>
      import('./app/feedback/feedback.component').then(
        (m) => m.FeedbackComponent,
      ),
    canActivate: [AuthGuard],
    canDeactivate: [DirtyFormGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./app/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
    canDeactivate: [DirtyFormGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./app/transactions/transactions.component').then(
        (m) => m.TransactionsComponent,
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./app/cart/cart.component').then((m) => m.CartComponent),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  { path: '**', component: NotfoundComponent },
];
