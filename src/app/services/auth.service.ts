import { Injectable } from '@angular/core';
import {
  Auth,
  signOut,
  signInWithPopup,
  user,
  OAuthProvider,
} from '@angular/fire/auth';
// import {
//   Firestore,
//   collection,
//   query,
//   where,
//   collectionData,
// } from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { YahooService } from './yahoo.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<any> = EMPTY;

  constructor(
    private auth: Auth,
    private yahooService: YahooService // private firestore: Firestore,
  ) {
    // set up the user$ observable for the logged in user
    this.user$ = user(this.auth);
  }

  logout(): void {
    signOut(this.auth);
    this.yahooService.clearYahooAccessToken();
  }

  loginYahoo(): void {
    const provider = new OAuthProvider('yahoo.com');
    signInWithPopup(this.auth, provider).then(async (result) => {
      if (result) {
        console.log(result);
        this.yahooService.fetchYahooAccessToken();
      }
    });
  }

  //TODO: On page load, get the latest token and expiry date (if expired) from firestore, and check if it is still valid. If not, refresh it.
}
