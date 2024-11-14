import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FirebaseError } from '@angular/fire/app';
import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  ConfirmDialogComponent,
  DialogData,
} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { array, assert } from 'superstruct';

import { getErrorMessage } from '../shared/utils/error';
import { FirestoreService } from '../teams/services/firestore.service';
import { Team, type TeamFirestore } from './interfaces/team';

@Injectable({
  providedIn: 'root',
})
export class SyncTeamsService {
  private readonly teamsSubject = new BehaviorSubject<Team[]>([]);
  readonly teams$: Observable<Team[]> = this.teamsSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(
    private readonly fns: Functions,
    private readonly auth: AuthService,
    private readonly firestoreService: FirestoreService,
    readonly dialog: MatDialog
  ) {
    this.teams$.pipe(takeUntilDestroyed()).subscribe((teams) => {
      if (teams.length > 0) {
        // localStorage will persist the teams across sessions
        // If we fetch a team once per session, it is assumed to be fresh for the duration of the session.
        sessionStorage.setItem('yahooTeams', JSON.stringify(teams));
        localStorage.setItem('yahooTeams', JSON.stringify(teams));
      }
    });

    this.init().catch(console.error);
  }

  async init(): Promise<void> {
    const sessionStorageTeams = JSON.parse(
      sessionStorage.getItem('yahooTeams') ?? '[]'
    ) as unknown;
    assert(sessionStorageTeams, array(Team));
    this.teamsSubject.next(sessionStorageTeams);

    try {
      if (sessionStorageTeams.length === 0) {
        // If teams doesn't exist in sessionStorage, show old teams from
        // localstorage and retrieve fresh from APIs
        this.loadingSubject.next(true);

        const localStorageTeams = JSON.parse(
          localStorage.getItem('yahooTeams') ?? '[]'
        ) as unknown;
        assert(localStorageTeams, array(Team));
        this.teamsSubject.next(localStorageTeams);

        const fetchedTeams = await this.fetchTeamsFromYahoo();
        await this.patchTeamPropertiesFromFirestore(fetchedTeams);
        this.teamsSubject.next(fetchedTeams);

        this.loadingSubject.next(false);
      } else {
        // If teams exist in sessionStorage, just refresh properties from firestore
        await this.patchTeamPropertiesFromFirestore(sessionStorageTeams);
        this.teamsSubject.next(sessionStorageTeams);
      }
    } catch (err: unknown) {
      this.loadingSubject.next(false);
      await this.handleFetchTeamsError(err);
    }
  }

  private async fetchTeamsFromYahoo(): Promise<Team[]> {
    // fetch teams from yahoo via firebase function
    const fetchTeamsFromServer: HttpsCallable<null, Team[]> =
      httpsCallableFromURL(
        this.fns,
        'https://fantasyautocoach.com/api/fetchuserteams'
      );
    try {
      const teamsData = await fetchTeamsFromServer();
      const teams = teamsData.data;

      assert(teams, array(Team));
      return teams;
    } catch (err: unknown) {
      if (err instanceof FirebaseError && err.code === 'functions/data-loss') {
        // if the error is data-loss, it means the user's access token has expired
        throw new Error('Refresh Token Error');
      }

      throw new Error(
        'Error fetching teams from Yahoo: ' + getErrorMessage(err)
      );
    }
  }

  private async patchTeamPropertiesFromFirestore(teamsToPatch: Team[]) {
    const firestoreTeams = await this.fetchTeamsFromFirestore();

    teamsToPatch.forEach((teamToPatch) => {
      const firestoreTeam = firestoreTeams.find(
        (firestoreTeam) => firestoreTeam.team_key === teamToPatch.team_key
      );
      Object.assign(teamToPatch, firestoreTeam);
    });
  }

  private fetchTeamsFromFirestore(): Promise<TeamFirestore[]> {
    return this.firestoreService.fetchTeams();
  }

  private async handleFetchTeamsError(err: unknown) {
    const errorMessage = getErrorMessage(err);
    if (errorMessage === 'Refresh Token Error') {
      const result = await this.errorDialog(
        'Your teams are currently not being managed!\n' +
          'Please sign in again below to grant access for Fantasy AutoCoach to continue managing your teams.',
        'Yahoo Access Has Expired',
        'Sign in with Yahoo',
        'Cancel'
      );
      if (result) {
        await this.reauthenticateYahoo();
      }
    } else if (errorMessage) {
      await this.errorDialog(errorMessage, 'ERROR Fetching Teams');
    } else {
      await this.errorDialog(
        'Please ensure you are connected to the internet and try again',
        'ERROR Fetching Teams'
      );
    }
  }

  private async reauthenticateYahoo(): Promise<void> {
    await this.auth.reauthenticateYahoo();
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
