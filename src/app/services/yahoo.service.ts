import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class YahooService {
  readonly CORS_BASE_URL: string = 'https://cors-anywhere.herokuapp.com/'; //for development only
  readonly API_URL: string =
    this.CORS_BASE_URL + 'https://fantasysports.yahooapis.com/fantasy/v2/';

  private credential: any;

  teams: any = [];

  constructor(private http: HttpClient, private fns: Functions) {
    try {
      this.credential = JSON.parse(
        localStorage.getItem('yahooCredential') || ''
      );
    } catch {
      this.credential = null;
    }
  }

  async loadYahooAccessToken(): Promise<void> {
    if (!this.credential || this.credential.tokenExpirationTime <= Date.now()) {
      // call the cloud function 'getAccessToken'
      console.log('Getting new Yahoo access token');
      try {
        const getAccessToken = httpsCallable(this.fns, 'getAccessToken');
        const data = await getAccessToken({});
        this.credential = data.data;
        localStorage.setItem(
          'yahooCredential',
          JSON.stringify(this.credential)
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  clearYahooAccessToken(): void {
    localStorage.setItem('yahooCredential', '');
  }

  async httpGet(url: string): Promise<Observable<Object>> {
    await this.loadYahooAccessToken();

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.credential.accessToken,
    });

    return this.http.get(this.API_URL + url, { headers: headers });
  }

  async getAllTeams(): Promise<Observable<Object>> {
    return await this.httpGet(
      'users;use_login=1/games;game_keys=nfl,nhl,nba,mlb/teams/?format=json'
    );
  }

  async getAllStandings(): Promise<Observable<Object>> {
    return await this.httpGet(
      'users;use_login=1/games;game_keys=nfl,nhl,nba,mlb/leagues/standings?format=json'
    );
  }

  async getPlayers(teamKey: string): Promise<Observable<Object>> {
    return await this.httpGet('team/' + teamKey + '/players?format=json');
  }
}
