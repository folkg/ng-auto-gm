import { NodeWithI18n } from '@angular/compiler';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OnlineStatusService } from 'src/app/services/online-status.service';
import { SetLineupEvent } from '../interfaces/set-lineup-event';
import { Team } from '../interfaces/team';
import { RelativeDatePipe } from '../pipes/relative-date.pipe';

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
    start_date: 0,
    end_date: 0,
    weekly_deadline: 0,
    edit_key: '',
    is_subscribed: false,
    is_setting_lineups: false,
    last_updated: 0,
    faab_balance: 0,
    waiver_rule: '',
    current_weekly_adds: 0,
    current_season_adds: 0,
    max_weekly_adds: 0,
    max_season_adds: 0,
    max_games_played: 0,
    max_innings_pitched: 0,
    allow_transactions: false,
    allow_dropping: false,
    allow_adding: false,
    allow_add_drops: false,
    allow_waiver_adds: false,
  };
  @Input() gameTimeStamps: number[] | null = null;
  @Output() toggleEvent = new EventEmitter<SetLineupEvent>();
  public date: number;

  constructor(
    public os: OnlineStatusService,
    private datePipe: RelativeDatePipe
  ) {
    this.date = Date.now();
  }

  onToggle($event: MatSlideToggleChange) {
    this.toggleEvent.emit({ team: this.team, state: $event.checked });
  }

  gotoExternalDomain(url: string) {
    (window as any).open(url, '_blank');
  }

  getNextLineupUpdate(): string {
    const SERVER_UPDATE_MINUTES = 55;

    // set the editKey of the team to a Date object in PST timezone
    const editKeyDate = new Date(Date.parse(this.team.edit_key! + 'GMT-0800'));
    const today = new Date();

    if (
      this.team.weekly_deadline !== 'intraday' &&
      this.team.weekly_deadline !== '' &&
      editKeyDate.getDay() !== today.getDay()
    ) {
      // if the editKeyDate is not today in a weekly league, then the next update is next week
      // set the minutes to 55 on editKeyDate
      editKeyDate.setMinutes(SERVER_UPDATE_MINUTES);
      return this.datePipe.transform(editKeyDate.getTime());
    } else if (this.gameTimeStamps) {
      // find the first game that hasn't happened yet
      const now = Date.now();
      const nextGame = this.gameTimeStamps.find(
        (timestamp: number) => timestamp > now
      );
      if (nextGame) {
        // get the timestamp of the scheduled update before the next game
        // 55 minutes after the hour cron job on server
        const nextGameHour = new Date(nextGame).getHours();
        const nextGameMinutes = new Date(nextGame).getMinutes();
        let updateTime;
        if (nextGameMinutes < SERVER_UPDATE_MINUTES) {
          updateTime = new Date(
            new Date(nextGame).setHours(
              nextGameHour - 1,
              SERVER_UPDATE_MINUTES,
              0,
              0
            )
          ).getTime();
        } else {
          updateTime = new Date(
            new Date(nextGame).setHours(
              nextGameHour,
              SERVER_UPDATE_MINUTES,
              0,
              0
            )
          ).getTime();
        }
        return this.datePipe.transform(updateTime);
      }
    }

    return 'Next Game Day';
  }
}
