import { Injectable } from '@angular/core';
import {
  Auth,
  signOut,
  signInWithPopup,
  user,
  OAuthProvider,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  logout(): void {
    signOut(this.auth);
  }

  loginYahoo(): void {
    signInWithPopup(this.auth, new OAuthProvider('yahoo.com')).then((temp) =>
      console.log(temp)
    );
  }
}
