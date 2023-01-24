import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { isDevMode } from '@angular/core';

import { Functions, httpsCallable } from '@angular/fire/functions';
import { YahooCredential } from './interfaces/credential';

@Injectable({
  providedIn: 'root',
})
export class YahooService {
  API_URL: string = 'https://fantasysports.yahooapis.com/fantasy/v2/';

  private _credential: YahooCredential | null = null;
  public set credential(credential: YahooCredential | null) {
    this._credential = credential;
    localStorage.setItem('yahooCredential', JSON.stringify(this._credential));
  }
  public get credential(): YahooCredential | null {
    return this._credential;
  }

  teams: any = [];

  constructor(private http: HttpClient, private fns: Functions) {
    if (isDevMode()) {
      // use CORS proxy to avoid CORS error in dev mode
      const CORS_BASE_URL: string = 'https://cors-anywhere.herokuapp.com/';
      this.API_URL = CORS_BASE_URL + this.API_URL;
    }
    this.credential = JSON.parse(
      localStorage.getItem('yahooCredential') || 'null'
    );
  }

  async loadYahooAccessToken(): Promise<void> {
    if (!this.credential || this.credential.tokenExpirationTime <= Date.now()) {
      try {
        const getAccessToken = httpsCallable(this.fns, 'getaccesstoken');
        const data = await getAccessToken({});
        this.credential = data.data as YahooCredential;
      } catch (err: Error | any) {
        throw new Error('Could not get Yahoo access token from the Server.');
      }
    }
  }

  async httpGet(url: string): Promise<Observable<Object>> {
    try {
      await this.loadYahooAccessToken();
    } catch (err: Error | any) {
      throw new Error(err.message);
    }

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.credential?.accessToken,
    });
    //
    return this.http.get(this.API_URL + url, { headers: headers }).pipe(
      catchError((err: Error | any) => {
        throw new Error(err.message);
      })
    );
  }

  async getAllStandings(): Promise<Observable<Object>> {
    try {
      return await this.httpGet(
        'users;use_login=1/games;game_keys=nfl,nhl,nba,mlb/leagues/standings?format=json'
      );
    } catch (err: Error | any) {
      throw new Error(err.message);
    }
  }
}
