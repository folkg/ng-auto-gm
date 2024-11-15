import { Component } from '@angular/core';
import type { User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import {
  ConfirmDialogComponent,
  DialogData,
} from '../shared/confirm-dialog/confirm-dialog.component';
import { getErrorMessage } from '../shared/utils/error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user$: Observable<User | null> = this.auth.user$;

  constructor(
    private readonly auth: AuthService,
    public readonly dialog: MatDialog,
  ) {}

  login() {
    this.auth
      .loginYahoo()
      .catch((err) => this.errorDialog(getErrorMessage(err)));
  }

  logout() {
    this.auth.logout().catch((err) => this.errorDialog(getErrorMessage(err)));
  }

  errorDialog(message: string, title: string = 'ERROR'): void {
    const dialogData: DialogData = {
      title,
      message,
      trueButton: 'OK',
    };
    this.dialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      data: dialogData,
    });
  }
}
