import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { OnlineStatusService } from '../services/online-status.service';
import {
  ConfirmDialogComponent,
  DialogData,
} from '../shared/confirm-dialog/confirm-dialog.component';
import { Schedule } from './interfaces/schedules';
import { SetLineupEvent } from './interfaces/set-lineup-event';
import { Team } from '../services/interfaces/team';
import { FirestoreService } from './services/firestore.service';
import { SyncTeamsService } from '../services/sync-teams.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [FirestoreService],
})
export class TeamsComponent implements OnInit, OnDestroy {
  public teams: Team[] = [];
  public schedule: Schedule | null = null;
  private isDirty: boolean = false;
  user: User | null = null;
  private userSubscription: Subscription | undefined;
  private teamsSubscription: Subscription | undefined;
  private loadingTeamsSubscription: Subscription | undefined;

  constructor(
    private sts: SyncTeamsService,
    private fs: FirestoreService,
    private auth: AuthService,
    public dialog: MatDialog,
    public os: OnlineStatusService,
    private _snackBar: MatSnackBar
  ) {
    this.userSubscription = this.auth.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

    this.teamsSubscription = this.sts.teams$.subscribe((teams) => {
      this.teams = teams;
    });

    this.loadingTeamsSubscription = this.sts.loading$.subscribe((loading) => {
      if (loading) {
        this._snackBar.open('Refreshing Teams');
      } else {
        this._snackBar.dismiss();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.schedule = JSON.parse(sessionStorage.getItem('schedules') ?? 'null');
    await this.fetchLeagueSchedules();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.teamsSubscription?.unsubscribe();
    this.loadingTeamsSubscription?.unsubscribe();
  }

  private async fetchLeagueSchedules() {
    if (!this.schedule) {
      try {
        this.schedule = await this.fs.fetchSchedulesFromFirestore();
      } catch (err: any) {
        this.errorDialog(
          err.message +
            ' Please ensure you are connected to the internet and try again later.',
          'ERROR Fetching Schedules'
        );
      }
    }
  }

  async setLineupBoolean($event: SetLineupEvent): Promise<void> {
    try {
      await this.fs.setLineupsBooleanFirestore($event.team, $event.state);
      sessionStorage.setItem('yahooTeams', JSON.stringify(this.teams));
    } catch (err) {
      // revert the change if the database write failed
      $event.team.is_setting_lineups = !$event.state;
      this.errorDialog(
        "Could not update team's status on the server. Please check your internet connection and try again later."
      );
    }
  }

  public onDirtyChange(dirty: boolean): void {
    this.isDirty = dirty;
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return !this.isDirty;
  }

  private async errorDialog(
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
    if (falseButton) {
      dialogData.falseButton = falseButton;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      data: dialogData,
    });

    return await lastValueFrom(dialogRef.afterClosed());
  }
}
