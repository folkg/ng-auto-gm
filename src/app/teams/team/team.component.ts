import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SetLineupEvent } from '../interfaces/set-lineup-event';
import { Team } from '../interfaces/team';

@Component({
  selector: 'app-team[team]',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent {
  @Input() team: Team = {
    game_name: '',
    game_code: '',
    game_season: '',
    game_is_over: false,
    team_key: '',
    team_name: '',
    team_url: '',
    team_logo: '',
    league_name: '',
    num_teams: 0,
    rank: '',
    points_for: 0,
    points_against: 0,
    points_back: 0,
    outcome_totals: {
      wins: 0,
      losses: 0,
      ties: 0,
      percentage: 0,
    },
    scoring_type: '',
    current_week: '',
    end_week: '',
    start_date: 0,
    end_date: 0,
    weekly_deadline: 0,
    edit_key: '',
    is_approved: false,
    is_setting_lineups: false,
    last_updated: 0,
  };
  @Output() toggleEvent = new EventEmitter<SetLineupEvent>();
  public date = Date.now();

  onToggle($event: MatSlideToggleChange) {
    this.toggleEvent.emit({ team: this.team, state: $event.checked });
  }

  gotoExternalDomain(url: string) {
    (window as any).open(url, '_blank');
  }
}
