import { Injectable } from '@angular/core';
import {
  Auth,
  signOut,
  signInWithPopup,
  reauthenticateWithPopup,
  user,
  OAuthProvider,
  updateEmail,
  getAuth,
  User,
  sendEmailVerification,
} from '@angular/fire/auth';
import { EMPTY, Observable } from 'rxjs';
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
    signOut(this.auth);
    this.yahooService.clearYahooAccessToken();
  }

  loginYahoo(): void {
    const provider = new OAuthProvider('yahoo.com');
    signInWithPopup(this.auth, provider).then(async (result) => {
      if (result) {
        console.log(result);
        // check if the user's email is verified and get them to confirm it if not
        if (!result.user.emailVerified) {
          // TODO: create a material dialog form to ask the user to enter their email address
          // firebase should hopefully send a verification email to the user automatically
        }
        // load the yahoo access token in anticipation of using it
        this.yahooService.loadYahooAccessToken();
      }
    });
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
    } catch (err) {
      console.log(err);
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
          } catch (err) {
            console.log(err);
          }
        }
      }
      console.log(err);
    }
  }
}
