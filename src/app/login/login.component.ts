import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {
  DialogData,
  ConfirmDialogComponent,
} from '../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import type { User } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user$: Observable<User | null> = this.auth.user$;

  constructor(private auth: AuthService, public dialog: MatDialog) {}

  async login() {
    try {
      await this.auth.loginYahoo();
    } catch (err: Error | any) {
      this.errorDialog(err.message);
    }
  }

  async logout() {
    try {
      await this.auth.logout();
    } catch (err: Error | any) {
      this.errorDialog(err.message);
    }
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
