import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserData } from './user-data';

@Injectable({
  providedIn: 'root',
})
export class YahooTeamsService {
  userData: UserData | undefined;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.userData = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          emailVerified: user.emailVerified,
          accessToken: user.accessToken,
        };
      }
    });
  }
}
