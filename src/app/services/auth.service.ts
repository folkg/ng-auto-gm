import { Injectable } from '@angular/core';
import {
  Auth,
  signOut,
  signInWithPopup,
  reauthenticateWithPopup,
  user,
  OAuthProvider,
  updateEmail,
  User,
  sendEmailVerification,
} from '@angular/fire/auth';
import { EMPTY, Observable } from 'rxjs';
import { YahooCredential } from './interfaces/credential';
import { YahooService } from './yahoo.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<any> = EMPTY;

  constructor(private auth: Auth, private yahooService: YahooService) {
    // set up the user$ observable for the logged in user
    this.user$ = user(this.auth);
  }

  logout(): void {
    try {
      signOut(this.auth);
      this.yahooService.clearYahooAccessToken();
    } catch (err: Error | any) {
      throw new Error("Couldn't sign out: " + err.message);
    }
  }

  loginYahoo(): void {
    try {
      const provider = new OAuthProvider('yahoo.com');
      signInWithPopup(this.auth, provider).then(async (result) => {
        if (result) {
          const oauthCredential = OAuthProvider.credentialFromResult(result);
          const accessToken = oauthCredential?.accessToken || '';
          const credential: YahooCredential = {
            accessToken: accessToken,
            tokenExpirationTime: Date.now() + 3600000,
          };
          this.yahooService.credential = credential;
        }
      });
    } catch (err: Error | any) {
      throw new Error("Couldn't sign in with Yahoo: " + err.message);
    }
  }

  async reauthenticateYahoo(): Promise<void> {
    const provider = new OAuthProvider('yahoo.com');
    await reauthenticateWithPopup(this.auth.currentUser!, provider);
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      await sendEmailVerification(this.auth.currentUser as User);
      console.log('Email verification sent');
      //TODO: Dialog to tell user to check email
    } catch (err: Error | any) {
      throw new Error("Couldn't send verification email: " + err.message);
    }
  }

  async updateEmail(email: string): Promise<void> {
    console.log(email);
    try {
      await updateEmail(this.auth.currentUser as User, email);
      console.log('Email updated');
      this.sendVerificationEmail();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Firebase: Error (auth/requires-recent-login).') {
          try {
            await this.reauthenticateYahoo();
            this.updateEmail(email);
          } catch (err: Error | any) {
            throw new Error("Couldn't reauthenticate: " + err.message);
          }
        }
      }
    }
  }
}
