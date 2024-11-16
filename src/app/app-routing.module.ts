import { NgModule } from '@angular/core';
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { NotfoundComponent } from './notfound/notfound.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToTeams = () => redirectLoggedInTo(['/teams']);

const routes: Routes = [
  { path: '', redirectTo: '/teams', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToTeams },
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then((m) => m.CartModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (m) => m.TransactionsModule,
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
