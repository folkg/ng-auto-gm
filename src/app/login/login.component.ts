import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user$: Observable<any> = this.auth.user$;

  constructor(private auth: AuthService, private route: Router) {}

  login() {
    this.auth.loginYahoo();
  }

  logout() {
    this.auth.logout();
  }
}
