import { Injectable } from '@angular/core';
import { YahooService } from 'src/app/services/yahoo.service';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Team } from '../interfaces/team';
import { AuthService } from 'src/app/services/auth.service';
import { ReplaySubject, take } from 'rxjs';

@Injectable({
  providedIn: null,
})
export class SyncTeamsService {
  constructor(
    private yahoo: YahooService,
    private firestore: Firestore,
    private fns: Functions,
    private auth: AuthService
  ) {}

  async buildTeams(): Promise<Team[]> {
    // fetch teams from yahoo and firebase in parallel
    const [yahooTeams, firebaseTeams] = await Promise.all([
      this.fetchTeamsFromYahoo(),
      this.fetchTeamsFromFirebase(),
    ]);

    const teams: Team[] = [];
    firebaseTeams.forEach((team: any) => {
      const yahooTeam = yahooTeams.find((t) => t.team_key === team.team_key);
      if (yahooTeam) {
        // remove the team from the yahooTeams array and merge it with the team from firebase
        yahooTeams.splice(yahooTeams.indexOf(yahooTeam), 1);
        teams.push({ ...yahooTeam, ...team });
      }
    });

    // check if any of the (active) teams from yahoo are missing from firebase,
    // and if so, refresh the teams on the server
    for (const yTeam of yahooTeams) {
      if (yTeam.end_date > Date.now()) {
        const refreshTeamsOnServer = httpsCallable(this.fns, 'refreshTeams');
        // no need to await this call, it will run in the background
        refreshTeamsOnServer({});
        break;
      }
    }
    // add the remaining teams from yahoo to the teams array for display on the frontend
    teams.push(...yahooTeams);
    console.log('Merged teams:');
    console.log(teams);
    sessionStorage.setItem('yahooTeams', JSON.stringify(teams));
    return teams;
  }

  async setLineupsBooleanFirebase(team: Team, value: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.user$.pipe(take(1)).subscribe(async (user) => {
        const db = this.firestore;
        const teamsRef = collection(db, 'users', user.uid, 'teams');
        const docRef = doc(teamsRef, team.team_key);
        try {
          await updateDoc(docRef, { is_setting_lineups: value });
          resolve();
        } catch (e) {
          console.log('Error updating is_setting_lineups in Firebase');
          reject();
        }
      });
    });
  }

  private async fetchTeamsFromFirebase(): Promise<any> {
    return new Promise((resolve) => {
      this.auth.user$.pipe(take(1)).subscribe(async (user) => {
        const db = this.firestore;
        const teams: any = [];
        // fetch teams for the current user and now < end_date
        const teamsRef = collection(db, 'users', user.uid, 'teams');
        const q = query(teamsRef, where('end_date', '>', Date.now()));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          teams.push({ team_key: doc.id, ...doc.data() });
        });
        console.log('Fetched teams from Firebase:');
        console.log(teams);
        resolve(teams);
      });
    });
  }

  private async fetchTeamsFromYahoo(): Promise<Team[]> {
    //TODO: Introduce error checking. If yahoo doesn't respond, don't wipe out the teams in the DB.
    const standings$ = await this.yahoo.getAllStandings();
    return new Promise((resolve) => {
      standings$.pipe(take(1)).subscribe((data: any) => {
        const teams: Team[] = [];
        const games = data.fantasy_content.users[0].user[1].games;
        console.log(games); //use this to debug the JSON object and see all the data
        // Loop through each "game" (nfl, nhl, nba, mlb)
        for (const key in games) {
          if (key !== 'count') {
            const game = games[key].game[0];
            const leagues = games[key].game[1].leagues;
            // Loop through each league within the game
            for (const key in leagues) {
              if (key !== 'count') {
                const allTeams = leagues[key].league[1].standings[0].teams;
                let usersTeam = this.getUsersTeam(allTeams);
                const data: Team = {
                  game_name: game.name,
                  game_code: game.code,
                  game_season: game.season,
                  game_is_over: game.is_game_over,
                  team_key: usersTeam.team[0][0].team_key,
                  team_name: usersTeam.team[0][2].name,
                  team_url: usersTeam.team[0][4].url,
                  team_logo: usersTeam.team[0][5].team_logos[0].team_logo.url,
                  league_name: leagues[key].league[0].name,
                  num_teams: leagues[key].league[0].num_teams,
                  rank: usersTeam.team[2].team_standings.rank,
                  points_for: usersTeam.team[2].team_standings.points_for,
                  points_against:
                    usersTeam.team[2].team_standings.points_against,
                  points_back: usersTeam.team[2].team_standings.points_back,
                  outcome_totals:
                    usersTeam.team[2].team_standings.outcome_totals,
                  scoring_type: leagues[key].league[0].scoring_type,
                  current_week: leagues[key].league[0].current_week,
                  end_week: leagues[key].league[0].end_week,
                  start_date: Date.parse(leagues[key].league[0].start_date),
                  end_date: Date.parse(leagues[key].league[0].end_date),
                  weekly_deadline: leagues[key].league[0].weekly_deadline,
                  edit_key: leagues[key].league[0].edit_key,
                  is_approved: true,
                  is_setting_lineups: false,
                  last_updated: -1,
                };
                teams.push(data);
              }
            }
          }
        }
        console.log('Fetched teams from Yahoo API:');
        console.log(teams);
        resolve(teams);
      });
    });
  }

  private getUsersTeam(allTeams: any) {
    // Find the team managed by the current login
    for (const key in allTeams) {
      if (
        key !== 'count' &&
        allTeams[key].team[0][3].is_owned_by_current_login
      ) {
        return allTeams[key];
      }
    }
  }
}
