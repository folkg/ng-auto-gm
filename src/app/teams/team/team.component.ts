import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OnlineStatusService } from 'src/app/services/online-status.service';
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
  @Input() gameTimeStamps: number[] | null = null;
  @Output() toggleEvent = new EventEmitter<SetLineupEvent>();
  public date: number;

  constructor(public os: OnlineStatusService) {
    this.date = Date.now();
  }

  onToggle($event: MatSlideToggleChange) {
    this.toggleEvent.emit({ team: this.team, state: $event.checked });
  }

  gotoExternalDomain(url: string) {
    (window as any).open(url, '_blank');
  }

  getNextLineupUpdate() {
    // look at the schedule and find the next game that matches game_code
    if (this.gameTimeStamps) {
      // find the first game that hasn't happened yet
      const now = Date.now();
      const nextGame = this.gameTimeStamps.find(
        (timestamp: number) => timestamp > now
      );
      if (nextGame) {
        // get the timestamp of the scheduled update before the next game
        // 55 minutes after the hour cron job on server
        const SERVER_UPDATE_MINUTES = 55;
        const nextGameHour = new Date(nextGame).getHours();
        const nextGameMinutes = new Date(nextGame).getMinutes();
        if (nextGameMinutes < SERVER_UPDATE_MINUTES) {
          return new Date(
            new Date(nextGame).setHours(
              nextGameHour - 1,
              SERVER_UPDATE_MINUTES,
              0,
              0
            )
          ).getTime();
        } else {
          return new Date(
            new Date(nextGame).setHours(
              nextGameHour,
              SERVER_UPDATE_MINUTES,
              0,
              0
            )
          ).getTime();
        }
      }
    }
    return null;
  }
}
