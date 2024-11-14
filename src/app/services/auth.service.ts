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
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user$: Observable<User | null>;

  constructor(private readonly auth: Auth, private readonly router: Router) {
    this.user$ = user(this.auth);
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
      localStorage.clear();
      sessionStorage.clear();
    } catch (err: Error | any) {
      throw new Error("Couldn't sign out: " + err.message);
    }
  }

  async loginYahoo(): Promise<void> {
    try {
      const provider = new OAuthProvider('yahoo.com');
      const result = await signInWithPopup(this.auth, provider);
      if (result) {
        this.router.navigate(['/teams']);
      }
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
      //TODO: Dialog to tell user to check email
    } catch (err: Error | any) {
      throw new Error("Couldn't send verification email: " + err.message);
    }
  }

  async updateUserEmail(email: string): Promise<void> {
    try {
      await updateEmail(this.auth.currentUser as User, email);
      this.sendVerificationEmail();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Firebase: Error (auth/requires-recent-login).') {
          try {
            await this.reauthenticateYahoo();
            this.updateUserEmail(email);
          } catch (err: Error | any) {
            throw new Error("Couldn't reauthenticate: " + err.message);
          }
        }
      }
    }
  }
}
