import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom, Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { Team } from '../services/interfaces/team';
import { OnlineStatusService } from '../services/online-status.service';
import { SyncTeamsService } from '../services/sync-teams.service';
import {
  ConfirmDialogComponent,
  DialogData,
} from '../shared/confirm-dialog/confirm-dialog.component';
import { getErrorMessage, logError } from '../shared/utils/error';
import { Schedule } from './interfaces/schedules';
import { SetLineupEvent } from './interfaces/set-lineup-event';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [FirestoreService],
})
export class TeamsComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  schedule: Schedule | null = null;
  user: User | null = null;
  private isDirty: boolean = false;
  private readonly subs: Subscription;

  constructor(
    private readonly auth: AuthService,
    private readonly firestoreService: FirestoreService,
    private readonly syncTeamsService: SyncTeamsService,
    readonly dialog: MatDialog,
    readonly os: OnlineStatusService,
    private readonly snackBar: MatSnackBar
  ) {
    this.subs = new Subscription();

    this.subs.add(
      this.auth.user$.subscribe((user) => {
        this.user = user;
      })
    );

    this.subs.add(
      this.syncTeamsService.teams$.subscribe((teams) => {
        this.teams = teams;
      })
    );

    this.subs.add(
      this.syncTeamsService.loading$.subscribe((loading) => {
        if (loading) {
          this.snackBar.open('Refreshing Teams');
        } else {
          this.snackBar.dismiss();
        }
      })
    );
  }

  ngOnInit(): void {
    this.fetchLeagueSchedules().catch(logError);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private async fetchLeagueSchedules() {
    if (!this.schedule) {
      try {
        this.schedule = await this.firestoreService.fetchSchedules();
      } catch (err) {
        await this.errorDialog(
          getErrorMessage(err) +
            ' Please ensure you are connected to the internet and try again later.',
          'ERROR Fetching Schedules'
        );
      }
    }
  }

  async setLineupBoolean($event: SetLineupEvent): Promise<void> {
    try {
      await this.firestoreService.setLineupsBoolean($event.team, $event.state);
      sessionStorage.setItem('yahooTeams', JSON.stringify(this.teams));
    } catch (ignore) {
      // revert the change if the database write failed
      $event.team.is_setting_lineups = !$event.state;
      await this.errorDialog(
        "Could not update team's status on the server. Please check your internet connection and try again later."
      );
    }
  }

  onDirtyChange(dirty: boolean): void {
    this.isDirty = dirty;
  }

  canDeactivate(): boolean {
    return !this.isDirty;
  }

  private errorDialog(
    message: string,
    title: string = 'ERROR',
    trueButton: string = 'OK',
    falseButton: string | null = null
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
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      data: dialogData,
    });

    return lastValueFrom(dialogRef.afterClosed());
  }
}
