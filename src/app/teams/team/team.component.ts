import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OnlineStatusService } from 'src/app/services/online-status.service';
import { SetLineupEvent } from '../interfaces/set-lineup-event';
import { Team, getEmptyTeamObject } from '../interfaces/team';
import { RelativeDatePipe } from '../pipes/relative-date.pipe';
import spacetime, { Spacetime } from 'spacetime';

// server update is in Pacific Time, this is when yahoo resets for the day
const SERVER_UPDATE_MINUTE = 55;
const FIRST_SERVER_UPDATE_HOUR = 1;

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
    this.date = spacetime.now().epoch;
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
    const editKeyDate = spacetime(this.team.edit_key, 'Canada/Pacific');
    const now = spacetime.now('Canada/Pacific');
    const isWeeklyLeague =
      this.team.weekly_deadline !== 'intraday' &&
      this.team.weekly_deadline !== '';

    if (isWeeklyLeague) {
      let nextWeeklyUpdate: Spacetime = editKeyDate
        .hour(FIRST_SERVER_UPDATE_HOUR)
        .minute(SERVER_UPDATE_MINUTE);

      if (editKeyDate.day() === now.day()) {
        const firstGameTimestamp = this.gameTimeStamps?.[0];
        if (firstGameTimestamp && firstGameTimestamp > now.epoch) {
          const firstGame: Spacetime = spacetime(firstGameTimestamp);
          return this.getUpdateBeforeGame(firstGame);
        }

        nextWeeklyUpdate = nextWeeklyUpdate.add(1, 'week');
      }

      return this.datePipe.transform(nextWeeklyUpdate.epoch);
    } else if (this.gameTimeStamps) {
      const nextGameTimestamp = this.gameTimeStamps.find(
        (timestamp: number) => timestamp > now.epoch
      );
      if (nextGameTimestamp) {
        const nextGame: Spacetime = spacetime(nextGameTimestamp);
        return this.getUpdateBeforeGame(nextGame);
      }
    }

    const tomorrowMorning = now
      .add(1, 'day')
      .hour(FIRST_SERVER_UPDATE_HOUR)
      .minute(SERVER_UPDATE_MINUTE);
    return this.datePipe.transform(tomorrowMorning.epoch);
  }

  getUpdateBeforeGame(game: Spacetime): string {
    let updateTime = game.minute(SERVER_UPDATE_MINUTE);
    if (game.minute() < SERVER_UPDATE_MINUTE) {
      updateTime = updateTime.subtract(1, 'hour');
    }
    return this.datePipe.transform(updateTime.epoch);
  }
}
