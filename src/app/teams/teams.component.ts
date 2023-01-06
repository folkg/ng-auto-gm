import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { YahooService } from '../services/yahoo.service';
import { Team } from './team';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  public teams: Team[] =
    JSON.parse(sessionStorage.getItem('yahooTeams')!) || [];

  constructor(public yahoo: YahooService) {}

  async ngOnInit(): Promise<void> {
    if (this.teams.length === 0) {
      // If teams doesn't exist in sessionStorage, retrieve from API
      await this.fetchTeamsFromYahoo();
    }
  }

  //TODO: Implement cloud function to update teams in firebase when called by frontend. It will be similar to this one.
  //TODO: Pull teams from firebase. Any reason we need a function to pre-process this? Or can we pull direct from DB?
  async fetchTeamsFromYahoo(): Promise<void> {
    this.teams = [];
    const leagues$ = await this.yahoo.getAllStandings();
    leagues$.subscribe((data: any) => {
      const games = data.fantasy_content.users[0].user[1].games;
      // console.log(games); //use this to debug the JSON object and see all the data
      // Loop through each "game" (nfl, nhl, nba, mlb)
      for (const key in games) {
        if (key !== 'count' && games.hasOwnProperty(key)) {
          const game = games[key].game[0];
          const leagues = games[key].game[1].leagues;
          // Loop through each league within the game
          for (const key in leagues) {
            if (key !== 'count' && leagues.hasOwnProperty(key)) {
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
                outcome_totals: usersTeam.team[2].team_standings.outcome_totals,
                scoring_type: leagues[key].league[0].scoring_type,
                current_week: leagues[key].league[0].current_week,
                end_week: leagues[key].league[0].end_week,
                start_date: leagues[key].league[0].start_date,
                end_date: leagues[key].league[0].end_date,
                edit_key: leagues[key].league[0].edit_key,
                is_approved: true,
                is_setting_lineups: false,
              };
              this.teams.push(data);
            }
          }
        }
      }
      console.log('Fetched teams from Yahoo API:');
      console.log(this.teams);
      sessionStorage.setItem('yahooTeams', JSON.stringify(this.teams));
    });
  }

  private getUsersTeam(allTeams: any) {
    // Find the team managed by the current login
    for (const key in allTeams) {
      if (key !== 'count' && allTeams.hasOwnProperty(key)) {
        if (allTeams[key].team[0][3].is_owned_by_current_login) {
          return allTeams[key];
        }
      }
    }
  }

  async onToggle($event: MatSlideToggleChange, team: Team): Promise<void> {
    //TODO: update the server with the new setting, and reflect it back to the toggle with a dialog (if it fails)
    //TODO: Write a cloud function to handle the update on the server, and return the final value. It will need to check for approved payment.
    //TODO: Also return the next lineup setting time
    //TODO: Add failure dialog with error message (server comm error, team not paid for, etc)
    // currently simulating an error
    console.log(team.team_key, $event.checked);
    await new Promise((f) => setTimeout(f, 2000));
    team.is_setting_lineups = !$event.checked;
  }
}
