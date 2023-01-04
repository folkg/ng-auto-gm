import { Component, OnInit } from '@angular/core';
import { YahooService } from '../services/yahoo.service';
import { Team } from './team';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  public teams$: any;
  public teams: Team[] =
    JSON.parse(sessionStorage.getItem('yahooTeams')!) || [];

  constructor(public yahoo: YahooService) {}

  async ngOnInit(): Promise<void> {
    this.teams$ = await this.yahoo.getTeams();

    if (this.teams.length === 0) {
      // If teams doesn't exist in sessionStorage, retrieve from API
      this.fetchTeams();
    }
  }
  fetchTeams(): void {
    this.teams$.subscribe((data: any) => {
      // pull out the teams from the response
      const games = data.fantasy_content.users[0].user[1].games;
      for (const key in games) {
        if (key !== 'count' && games.hasOwnProperty(key)) {
          const game = games[key].game[0];
          const usersTeams = games[key].game[1].teams;
          for (const key in usersTeams) {
            if (key !== 'count' && usersTeams.hasOwnProperty(key)) {
              const data: Team = {
                game_name: game.name,
                game_code: game.code,
                game_season: game.season,
                game_is_over: game.is_game_over,
                team_key: usersTeams[key].team[0][0].team_key,
                team_name: usersTeams[key].team[0][2].name,
                team_url: usersTeams[key].team[0][4].url,
                team_logo:
                  usersTeams[key].team[0][5].team_logos[0].team_logo.url,
              };
              this.teams.push(data);
            }
          }
        }
      }
      console.log(this.teams);
      sessionStorage.setItem('yahooTeams', JSON.stringify(this.teams));
    });
  }
  //TODO: Cache teams in sessionStorage. Load from sessionStorage if available instead of API call.
}
