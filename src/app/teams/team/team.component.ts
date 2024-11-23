import { AsyncPipe, DecimalPipe, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from "@angular/material/slide-toggle";
import { MatTooltip } from "@angular/material/tooltip";
import spacetime, { Spacetime } from "spacetime";
import { OnlineStatusService } from "src/app/services/online-status.service";

import { Team } from "../../services/interfaces/team";
import { NthPipe } from "../../shared/pipes/nth.pipe";
import {
  type PauseLineupEvent,
  SetLineupEvent,
} from "../interfaces/outputEvents";
import { RelativeDatePipe } from "../pipes/relative-date.pipe";

// server update is in Pacific Time, this is when yahoo resets for the day
const SERVER_UPDATE_MINUTE = 55;
const FIRST_SERVER_UPDATE_HOUR = 1;

@Component({
  selector: "app-team[team][gameTimeStamps]",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatDivider,
    MatCardContent,
    NgIf,
    MatCardActions,
    MatSlideToggle,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    AsyncPipe,
    DecimalPipe,
    NthPipe,
    RelativeDatePipe,
  ],
})
export class TeamComponent {
  @Input({ required: true }) team!: Team;
  @Input({ required: true }) gameTimeStamps!: number[] | null;
  @Output() toggleSetLineupEvent = new EventEmitter<SetLineupEvent>();
  @Output() togglePauseLineupEvent = new EventEmitter<PauseLineupEvent>();
  date: number;
  scoringType: { [key: string]: string } = {
    head: "Head to Head Scoring",
    roto: "Rotisserie Scoring",
    point: "Points Scoring",
    headpoint: "Head to Head (Points) Scoring",
    headone: "Head to Head (One Win) Scoring",
  };

  constructor(
    readonly os: OnlineStatusService,
    private readonly datePipe: RelativeDatePipe,
  ) {
    this.date = spacetime.now().epoch;
  }

  onToggleSetLineup($event: MatSlideToggleChange) {
    this.toggleSetLineupEvent.emit({
      team: this.team,
      isSettingLineups: $event.checked,
    });
  }

  onTogglePauseLineup() {
    this.togglePauseLineupEvent.emit({
      team: this.team,
    });
  }

  gotoExternalDomain(url: string) {
    if (url) {
      window.open(url, "_blank");
    }
  }

  getNextLineupUpdate(lineupPausedAt: number | undefined): string {
    const now = spacetime.now("Canada/Pacific");

    const tomorrowMorning = this.datePipe.transform(
      now
        .add(1, "day")
        .hour(FIRST_SERVER_UPDATE_HOUR)
        .minute(SERVER_UPDATE_MINUTE).epoch,
    );

    if (this.isToday(lineupPausedAt)) {
      return tomorrowMorning;
    }

    const editKeyDate = spacetime(this.team.edit_key, "Canada/Pacific");
    const isWeeklyLeague =
      this.team.weekly_deadline !== "intraday" &&
      this.team.weekly_deadline !== "";

    if (isWeeklyLeague) {
      let nextWeeklyUpdate: Spacetime = editKeyDate
        .hour(FIRST_SERVER_UPDATE_HOUR)
        .minute(SERVER_UPDATE_MINUTE);

      if (editKeyDate.day() === now.day()) {
        const firstGameTimestamp = this.gameTimeStamps?.[0];
        if (
          firstGameTimestamp !== undefined &&
          firstGameTimestamp > now.epoch
        ) {
          const firstGame: Spacetime = spacetime(firstGameTimestamp);
          return this.getUpdateBeforeGame(firstGame);
        }

        nextWeeklyUpdate = nextWeeklyUpdate.add(1, "week");
      }

      return this.datePipe.transform(nextWeeklyUpdate.epoch);
    } else if (this.gameTimeStamps) {
      const nextGameTimestamp = this.gameTimeStamps.find(
        (timestamp) => timestamp > now.epoch,
      );
      if (nextGameTimestamp !== undefined) {
        const nextGame: Spacetime = spacetime(nextGameTimestamp);
        return this.getUpdateBeforeGame(nextGame);
      }
    }

    return tomorrowMorning;
  }

  getUpdateBeforeGame(game: Spacetime): string {
    let updateTime = game.minute(SERVER_UPDATE_MINUTE);
    if (game.minute() < SERVER_UPDATE_MINUTE) {
      updateTime = updateTime.subtract(1, "hour");
    }
    return this.datePipe.transform(updateTime.epoch);
  }

  isToday(timestamp: number | undefined): boolean {
    if (timestamp === undefined || timestamp === -1) {
      return false;
    }
    const now = spacetime.now("Canada/Pacific");
    const date = spacetime(timestamp, "Canada/Pacific");
    return now.isSame(date, "day");
  }
}
