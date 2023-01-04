import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class YahooService {
  readonly CORS_BASE_URL: string = 'https://cors-anywhere.herokuapp.com/'; //for development only
  readonly API_URL: string =
    this.CORS_BASE_URL + 'https://fantasysports.yahooapis.com/fantasy/v2/';

  private credential: any =
    JSON.parse(sessionStorage.getItem('yahooCredential')!) || null;

  teams: any = [];

  constructor(private http: HttpClient, private fns: Functions) {
    //If logged in, fetch the access token if not in session storage
  }

  async fetchYahooAccessToken(): Promise<void> {
    // call the cloud function 'getAccessToken'
    const getAccessToken = httpsCallable(this.fns, 'getAccessToken');
    this.credential = await getAccessToken({});
    sessionStorage.setItem('yahooCredential', JSON.stringify(this.credential));
  }

  clearYahooAccessToken(): void {
    sessionStorage.setItem('yahooCredential', '');
  }

  async get(url: string): Promise<Observable<Object>> {
    if (
      !this.credential ||
      this.credential.data.tokenExpirationTime <= Date.now()
    ) {
      await this.fetchYahooAccessToken();
    }

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.credential.data.accessToken,
    });

    return this.http.get(this.API_URL + url, { headers: headers });
  }

  async getTeams(): Promise<Observable<Object>> {
    return await this.get(
      'users;use_login=1/games;game_keys=nfl,nhl,nba,mlb/teams/?format=json'
    );
  }

  async getPlayers(teamKey: string): Promise<Observable<Object>> {
    return await this.get('team/' + teamKey + '/players?format=json');
  }

  async getStandings(teamKey: string): Promise<Observable<Object>> {
    const leagueKey: string = teamKey.split('.t.', 1)[0];
    return await this.get('league/' + leagueKey + '/standings?format=json');
  }
}
