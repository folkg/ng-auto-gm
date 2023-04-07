import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OnlineStatusService } from 'src/app/services/online-status.service';
import { SetLineupEvent } from '../interfaces/set-lineup-event';
import { Team, getEmptyTeamObject } from '../interfaces/team';
import { RelativeDatePipe } from '../pipes/relative-date.pipe';
import spacetime from 'spacetime';

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
    // server update is in Pacific Time
    const SERVER_UPDATE_HOUR = 1;
    const SERVER_UPDATE_MINUTE = 55;

    const editKeyDate = spacetime(this.team.edit_key, 'Canada/Pacific');
    const now = spacetime.now('Canada/Pacific');

    if (this.team.weekly_deadline === '1' && editKeyDate.day() !== now.day()) {
      const nextMondayMorning = editKeyDate
        .hour(SERVER_UPDATE_HOUR)
        .minute(SERVER_UPDATE_MINUTE);
      return this.datePipe.transform(nextMondayMorning.epoch);
    } else if (this.gameTimeStamps) {
      const nextGameTimestamp = this.gameTimeStamps.find(
        (timestamp: number) => timestamp > Date.now()
      );
      if (nextGameTimestamp) {
        const nextGame = spacetime(nextGameTimestamp);
        let nextUpdateTime = nextGame.minute(SERVER_UPDATE_MINUTE);
        if (nextGame.minute() < SERVER_UPDATE_MINUTE) {
          nextUpdateTime = nextUpdateTime.subtract(1, 'hour');
        }
        return this.datePipe.transform(nextUpdateTime.epoch);
      }
    }
    const tomorrowMorning = now
      .add(1, 'day')
      .hour(SERVER_UPDATE_HOUR)
      .minute(SERVER_UPDATE_MINUTE);
    return this.datePipe.transform(tomorrowMorning.epoch);
  }
}
