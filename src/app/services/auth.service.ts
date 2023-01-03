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
  user$: Observable<any> = user(this.auth);

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  logout(): void {
    signOut(this.auth);
    localStorage.setItem('yahooAccessToken', '');
  }

  loginYahoo(): void {
    signInWithPopup(this.auth, new OAuthProvider('yahoo.com')).then(
      (result) => {
        const credential = OAuthProvider.credentialFromResult(result);
        console.log(credential);
        localStorage.setItem('yahooAccessToken', credential?.accessToken!);
      }
    );
  }
}
