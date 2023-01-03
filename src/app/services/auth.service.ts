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
  isLoggedIn: boolean = false;
  // credential$: Observable<any> = '';

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
    this.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  logout(): void {
    signOut(this.auth);
    //TODO: Is this enough to be logged out? I think firebase auth takes care of the rest?
    localStorage.setItem('yahooAccessToken', '');
  }

  loginYahoo(): void {
    const provider = new OAuthProvider('yahoo.com');
    provider.setCustomParameters({ access_type: 'offline' });
    signInWithPopup(this.auth, provider).then((result) => {
      if (result) {
        console.log(result);
        // const credential = OAuthProvider.credentialFromResult(result);
        // console.log(credential);

        // TODO: Query database for accessToken and refresh token somehow, and ensure we have the correct rights to access the data we need.
        // https://github.com/angular/angularfire/blob/master/samples/modular/src/app/firestore/firestore.component.ts
        // https://cloud.google.com/firestore/docs/security/rules-query
        // https://stackoverflow.com/questions/57511133/user-to-access-only-his-her-document-in-firestore
        // we can test with postman maybe to make sure we cannot access if unauthenicated?
        // add a rule so that we can only read if query belong to our own id?
        // localStorage.setItem('yahooAccessToken', credential?.accessToken!);
      }
    });
  }

  //TODO: On page load, get the latest token and expiry date (if expired) from firestore, and check if it is still valid. If not, refresh it.
}
