import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { YahooService } from '../services/yahoo.service';
import { Team } from './interfaces/team';
import { FetchTeamsService } from './services/fetch-teams.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [FetchTeamsService],
})
export class TeamsComponent implements OnInit {
  public teams: Team[] =
    JSON.parse(sessionStorage.getItem('yahooTeams')!) || [];
  public date = Date.now();

  constructor(public yahoo: YahooService, private ft: FetchTeamsService) {}

  async ngOnInit(): Promise<void> {
    if (this.teams.length === 0) {
      // If teams doesn't exist in sessionStorage, retrieve from APIs
      this.teams = await this.ft.buildTeams();
    }
  }

  gotoExternalDomain(url: string) {
    (window as any).open(url, '_blank');
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
