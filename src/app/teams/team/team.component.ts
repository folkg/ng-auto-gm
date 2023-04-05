import { NodeWithI18n } from '@angular/compiler';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OnlineStatusService } from 'src/app/services/online-status.service';
import { SetLineupEvent } from '../interfaces/set-lineup-event';
import { Team, getEmptyTeamObject } from '../interfaces/team';
import { RelativeDatePipe } from '../pipes/relative-date.pipe';

@Component({
  selector: 'app-team[team]',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent {
  @Input() team: Team = getEmptyTeamObject();
  @Input() gameTimeStamps: number[] | null = null;
  @Output() toggleEvent = new EventEmitter<SetLineupEvent>();
  public date: number;
  public scoringType: { [key: string]: string } = {
    head: 'Head to Head Scoring',
    roto: 'Rotisserie Scoring',
    point: 'Points Scoring',
    headpoint: 'Head to Head (Points) Scoring',
    headone: 'Head to Head (One Win) Scoring',
  };

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
    if (url) {
      (window as any).open(url, '_blank');
    }
  }

  getNextLineupUpdate(): string {
    const SERVER_UPDATE_MINUTES = 55;

    // set the editKey of the team to a Date object in PT timezone
    // -8 hours from GMT is conservative and will work for PST and PDT
    const editKeyDate = new Date(Date.parse(this.team.edit_key + 'GMT-0800'));
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
