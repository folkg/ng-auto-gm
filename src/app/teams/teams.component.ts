import { NgIf } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { lastValueFrom } from "rxjs";

import { ProfileCardComponent } from "../profile/profile-card/profile-card.component";
import { AppStatusService } from "../services/app-status.service";
import { AuthService } from "../services/auth.service";
import { SyncTeamsService } from "../services/sync-teams.service";
import {
  ConfirmDialogComponent,
  DialogData,
} from "../shared/confirm-dialog/confirm-dialog.component";
import { OfflineWarningCardComponent } from "../shared/offline-warning-card/offline-warning-card.component";
import { getErrorMessage, logError } from "../shared/utils/error";
import {
  type PauseLineupEvent,
  SetLineupEvent,
} from "./interfaces/outputEvents";
import { Schedule } from "./interfaces/schedules";
import { RelativeDatePipe } from "./pipes/relative-date.pipe";
import { FirestoreService } from "./services/firestore.service";
import { TeamComponent } from "./team/team.component";

@Component({
  selector: "app-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
  providers: [FirestoreService, RelativeDatePipe],
  imports: [
    OfflineWarningCardComponent,
    NgIf,
    ProfileCardComponent,
    TeamComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
  ],
})
export class TeamsComponent implements OnInit {
  readonly user = toSignal(this.auth.user$);
  readonly teams = toSignal(this.syncTeamsService.teams$, { initialValue: [] });
  readonly loading = toSignal(this.syncTeamsService.loading$, {
    initialValue: false,
  });
  readonly schedule = signal<Schedule | null>(null);
  private readonly isDirty = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly firestoreService: FirestoreService,
    readonly syncTeamsService: SyncTeamsService,
    readonly dialog: MatDialog,
    readonly appStatusService: AppStatusService,
  ) {}

  ngOnInit(): void {
    this.fetchLeagueSchedules().catch(logError);
  }

  private async fetchLeagueSchedules() {
    if (!this.schedule()) {
      try {
        this.schedule.set(await this.firestoreService.fetchSchedules());
      } catch (err) {
        await this.errorDialog(
          getErrorMessage(err) +
            " Please ensure you are connected to the internet and try again later.",
          "ERROR Fetching Schedules",
        );
      }
    }
  }

  async setLineupBoolean($event: SetLineupEvent): Promise<void> {
    const teamKey = $event.team.team_key;
    const changeTo = $event.isSettingLineups;

    try {
      await this.firestoreService.setLineupsBoolean(teamKey, changeTo);
      this.syncTeamsService.optimisticallyUpdateTeam(
        teamKey,
        "is_setting_lineups",
        changeTo,
      );
    } catch (ignore) {
      this.syncTeamsService.optimisticallyUpdateTeam(
        teamKey,
        "is_setting_lineups",
        !changeTo,
      );
      await this.errorDialog(
        "Could not update team's status on the server. Please check your internet connection and try again later.",
      );
    } finally {
      this.syncTeamsService.refreshTeams();
    }
  }

  async setPauseLineupActions($event: PauseLineupEvent): Promise<void> {
    const teamKey = $event.team.team_key;

    const initialPauseState = $event.team.lineup_paused_at;
    const isPaused =
      initialPauseState !== undefined && initialPauseState !== -1;

    try {
      this.syncTeamsService.optimisticallyUpdateTeam(
        teamKey,
        "lineup_paused_at",
        isPaused ? -1 : Date.now(),
      );
      await this.firestoreService.setPauseLineupActions(teamKey, !isPaused);
    } catch (ignore) {
      this.syncTeamsService.optimisticallyUpdateTeam(
        teamKey,
        "lineup_paused_at",
        initialPauseState,
      );
      await this.errorDialog(
        "Could not update team's status on the server. Please check your internet connection and try again later.",
      );
    } finally {
      this.syncTeamsService.refreshTeams();
    }
  }

  onDirtyChange(dirty: boolean): void {
    this.isDirty.set(dirty);
  }

  canDeactivate(): boolean {
    return !this.isDirty();
  }

  private errorDialog(
    message: string,
    title: string = "ERROR",
    trueButton: string = "OK",
    falseButton: string | null = null,
  ): Promise<boolean> {
    const dialogData: DialogData = {
      title,
      message,
      trueButton: trueButton,
    };
    if (falseButton !== null) {
      dialogData.falseButton = falseButton;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "350px",
      width: "90%",
      maxWidth: "500px",
      data: dialogData,
    });

    return lastValueFrom(dialogRef.afterClosed());
  }
}
