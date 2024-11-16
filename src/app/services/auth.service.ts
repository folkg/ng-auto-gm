import { Injectable } from '@angular/core';
import {
  Auth,
  OAuthProvider,
  reauthenticateWithPopup,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  updateEmail,
  User,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';

import { ensure } from '../shared/utils/checks';
import { getErrorMessage } from '../shared/utils/error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user$: Observable<User | null>;

  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
  ) {
    this.user$ = user(this.auth);
  }

  getUser(): Promise<User> {
    return firstValueFrom(this.user$).then(ensure);
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/login']);
      localStorage.clear();
      sessionStorage.clear();
    } catch (err) {
      throw new Error("Couldn't sign out: " + getErrorMessage(err));
    }
  }

  async loginYahoo(): Promise<void> {
    try {
      const provider = new OAuthProvider('yahoo.com');
      await signInWithPopup(this.auth, provider);
      await this.router.navigate(['/teams']);
    } catch (err) {
      throw new Error("Couldn't sign in with Yahoo: " + getErrorMessage(err));
    }
  }

  async reauthenticateYahoo(): Promise<void> {
    const provider = new OAuthProvider('yahoo.com');
    if (!this.auth.currentUser) {
      throw new Error('User not found');
    }
    await reauthenticateWithPopup(this.auth.currentUser, provider);
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      await sendEmailVerification(this.auth.currentUser as User);
      //TODO: Dialog to tell user to check email
    } catch (err) {
      throw new Error(
        "Couldn't send verification email: " + getErrorMessage(err),
      );
    }
  }

  async updateUserEmail(email: string): Promise<void> {
    try {
      await updateEmail(this.auth.currentUser as User, email);
      await this.sendVerificationEmail();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Firebase: Error (auth/requires-recent-login).') {
          try {
            await this.reauthenticateYahoo();
            await this.updateUserEmail(email);
          } catch (err) {
            throw new Error("Couldn't reauthenticate: " + getErrorMessage(err));
          }
        }
      }
    }
  }
}
