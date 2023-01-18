import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {
  DialogData,
  ConfirmDialogComponent,
} from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user$: Observable<any> = this.auth.user$;

  constructor(private auth: AuthService, public dialog: MatDialog) {}

  login() {
    try {
      this.auth.loginYahoo();
    } catch (err: Error | any) {
      this.errorDialog(err.message);
    }
  }

  logout() {
    try {
      this.auth.logout();
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
