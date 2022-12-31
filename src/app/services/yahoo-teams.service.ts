import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserData } from './user-data';

//TODO: Do we want to proxy this request, or just send it directly to the Yahoo API?
@Injectable({
  providedIn: 'root',
})
export class YahooTeamsService {
  userData!: UserData;
  headers: HttpHeaders = new HttpHeaders({
    token: 'Bearer ' + this.userData.accessToken,
  });
  getTeams$ = this.http.get(
    'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/teams',
    { headers: this.headers }
  );

  constructor(private auth: AuthService, private http: HttpClient) {
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

  // Do we want a method that returns an observable? Or a stream variable?
  // We can do error checking in a method, but not in a stream variable.
  getTeams() {
    const headers = new HttpHeaders({
      token: 'Bearer ' + this.userData.accessToken,
    });
    const results = this.http.get(
      'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/teams',
      { headers }
    );
    return results;
  }
}
