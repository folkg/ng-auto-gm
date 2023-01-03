import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class YahooService {
  readonly CORS_BASE_URL: string = 'https://cors-anywhere.herokuapp.com/'; //for development only
  readonly API_URL: string =
    this.CORS_BASE_URL + 'https://fantasysports.yahooapis.com/fantasy/v2/';

  headers: HttpHeaders = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('yahooAccessToken'),
  });

  getTeams$: Observable<Object> = this.http.get(
    this.API_URL +
      'users;use_login=1/games;game_keys=nfl,nhl,nba,mlb/teams/?format=json',
    { headers: this.headers }
  );

  constructor(private auth: AuthService, private http: HttpClient) {}

  getPlayers(teamKey: string): Observable<Object> {
    return this.http.get(
      this.API_URL + 'team/' + teamKey + '/players?format=json',
      { headers: this.headers }
    );
  }

  getStandings(teamKey: string): Observable<Object> {
    const leagueKey: string = teamKey.split('.t.', 1)[0];
    return this.http.get(
      this.API_URL + 'league/' + leagueKey + '/settings?format=json',
      { headers: this.headers }
    );
  }
}
