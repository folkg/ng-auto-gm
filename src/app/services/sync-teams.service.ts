import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FirebaseError } from '@angular/fire/app';
import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import {
  catchError,
  concat,
  defer,
  distinctUntilChanged,
  endWith,
  from,
  lastValueFrom,
  map,
  Observable,
  of,
  shareReplay,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  ConfirmDialogComponent,
  DialogData,
} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { array, assert, is } from 'superstruct';

import { getErrorMessage } from '../shared/utils/error';
import { FirestoreService } from '../teams/services/firestore.service';
import { Team, type TeamFirestore } from './interfaces/team';

@Injectable({
  providedIn: 'root',
})
export class SyncTeamsService {
  readonly teams$: Observable<Team[]>;

  readonly loading$: Observable<boolean>;

  constructor(
    private readonly fns: Functions,
    private readonly auth: AuthService,
    private readonly firestoreService: FirestoreService,
    readonly dialog: MatDialog,
  ) {
    this.teams$ = defer(() => {
      const sessionStorageTeams = this.loadSessionStorageTeams();
      const hasValidSessionStorageTeams =
        is(sessionStorageTeams, array(Team)) && sessionStorageTeams.length > 0;

      if (hasValidSessionStorageTeams) {
        return concat(
          of(sessionStorageTeams),
          from(this.patchTeamPropertiesFromFirestore(sessionStorageTeams)),
        );
      }

      const localStorageTeams = this.loadLocalStorageTeams();
      const hasValidLocalStorageTeams = is(localStorageTeams, array(Team));

      if (hasValidLocalStorageTeams) {
        return concat(of(localStorageTeams), from(this.getFreshTeams()));
      }

      return from(this.getFreshTeams());
    }).pipe(
      catchError((err) => {
        this.handleFetchTeamsError(err);
        return of([]);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.loading$ = this.teams$.pipe(
      map(() => true),
      endWith(false),
      distinctUntilChanged(),
    );

    this.teams$.pipe(takeUntilDestroyed()).subscribe((teams) => {
      if (teams.length > 0) {
        // localStorage will persist the teams across sessions
        // If we fetch a team once per session, it is assumed to be fresh for the duration of the session.
        sessionStorage.setItem('yahooTeams', JSON.stringify(teams));
        localStorage.setItem('yahooTeams', JSON.stringify(teams));
      }
    });
  }

  private loadSessionStorageTeams(): unknown {
    return JSON.parse(sessionStorage.getItem('yahooTeams') ?? '[]');
  }

  private loadLocalStorageTeams(): unknown {
    return JSON.parse(localStorage.getItem('yahooTeams') ?? '[]');
  }

  private async getFreshTeams(): Promise<Team[]> {
    const fetchedTeams = await this.fetchTeamsFromYahoo();
    return this.patchTeamPropertiesFromFirestore(fetchedTeams);
  }

  private async fetchTeamsFromYahoo(): Promise<Team[]> {
    // fetch teams from yahoo via firebase function
    const fetchTeamsFromServer: HttpsCallable<null, Team[]> =
      httpsCallableFromURL(
        this.fns,
        'https://fantasyautocoach.com/api/fetchuserteams',
      );
    try {
      const teamsData = await fetchTeamsFromServer();
      const teams = teamsData.data;

      assert(teams, array(Team));
      return teams;
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'functions/data-loss') {
        // if the error is data-loss, it means the user's access token has expired
        throw new Error('Refresh Token Error');
      }

      throw new Error(
        'Error fetching teams from Yahoo: ' + getErrorMessage(err),
      );
    }
  }

  private async patchTeamPropertiesFromFirestore(
    teamsToPatch: Team[],
  ): Promise<Team[]> {
    const firestoreTeams = await this.fetchTeamsFromFirestore();

    teamsToPatch.forEach((teamToPatch) => {
      const firestoreTeam = firestoreTeams.find(
        (firestoreTeam) => firestoreTeam.team_key === teamToPatch.team_key,
      );
      Object.assign(teamToPatch, firestoreTeam);
    });

    return teamsToPatch;
  }

  private fetchTeamsFromFirestore(): Promise<TeamFirestore[]> {
    return this.firestoreService.fetchTeams();
  }

  private handleFetchTeamsError(err: unknown): void {
    const errorMessage = getErrorMessage(err);
    if (errorMessage === 'Refresh Token Error') {
      this.errorDialog(
        'Your teams are currently not being managed!\n' +
          'Please sign in again below to grant access for Fantasy AutoCoach to continue managing your teams.',
        'Yahoo Access Has Expired',
        'Sign in with Yahoo',
        'Cancel',
      )
        .then((result) => {
          if (result) {
            this.reauthenticateYahoo().catch(console.error);
          }
        })
        .catch(console.error);
    } else if (errorMessage) {
      this.errorDialog(errorMessage, 'ERROR Fetching Teams').catch(
        console.error,
      );
    } else {
      this.errorDialog(
        'Please ensure you are connected to the internet and try again',
        'ERROR Fetching Teams',
      ).catch(console.error);
    }
  }

  private async reauthenticateYahoo(): Promise<void> {
    await this.auth.reauthenticateYahoo();
  }

  private errorDialog(
    message: string,
    title: string = 'ERROR',
    trueButton: string = 'OK',
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
      minWidth: '350px',
      width: '90%',
      maxWidth: '500px',
      data: dialogData,
    });

    return lastValueFrom(dialogRef.afterClosed());
  }
}
