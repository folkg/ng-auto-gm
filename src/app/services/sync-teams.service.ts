import { Injectable } from '@angular/core';

import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  ConfirmDialogComponent,
  DialogData,
} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Team } from './interfaces/team';
import { FirestoreService } from '../teams/services/firestore.service';

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
    this.teams$.subscribe((teams) => {
      if (teams.length > 0) {
        // TODO: Why is this being stored in both sessionStorage and localStorage?
        sessionStorage.setItem('yahooTeams', JSON.stringify(teams));
        localStorage.setItem('yahooTeams', JSON.stringify(teams));
      }
    });
    this.init();
  }

  async init(): Promise<void> {
    const sessionStorageTeams = JSON.parse(
      sessionStorage.getItem('yahooTeams') ?? '[]'
    );
    this.teamsSubject.next(sessionStorageTeams);

    try {
      if (sessionStorageTeams.length === 0) {
        // If teams doesn't exist in sessionStorage, show old teams from
        // localstorage and retrieve fresh from APIs
        this.loadingSubject.next(true);

        const localStorageTeams = JSON.parse(
          localStorage.getItem('yahooTeams') ?? '[]'
        );
        // TODO: User superstruct to validate the teams
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
    } catch (err: any) {
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
      const teams = await fetchTeamsFromServer();
      // TODO: User superstruct to validate the teams
      return teams.data;
    } catch (err: any) {
      if (err.code === 'functions/data-loss') {
        // if the error is data-loss, it means the user's access token has expired
        throw new Error('Refresh Token Error');
      }
      throw new Error('Error fetching teams from Yahoo: ' + err.message);
    }
  }

  private async patchTeamPropertiesFromFirestore(teamsToPatch: Team[]) {
    const firestoreTeams = await this.fetchTeamsFromFirestore();

    teamsToPatch.forEach((team) => {
      const firestoreTeam = firestoreTeams.find(
        (t: any) => t.team_key === team.team_key
      );
      // TODO: User superstruct to validate the team
      Object.assign(team, firestoreTeam);
    });
  }

  private fetchTeamsFromFirestore(): Promise<any> {
    return this.firestoreService.fetchTeams();
  }

  private async handleFetchTeamsError(err: any) {
    if (err.message === 'Refresh Token Error') {
      const result = await this.errorDialog(
        'Your teams are currently not being managed!\n' +
          'Please sign in again below to grant access for Fantasy AutoCoach to continue managing your teams.',
        'Yahoo Access Has Expired',
        'Sign in with Yahoo',
        'Cancel'
      );
      if (result) {
        this.reauthenticateYahoo();
      }
    } else if (err.message) {
      this.errorDialog(err.message, 'ERROR Fetching Teams');
    } else {
      this.errorDialog(
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
    if (falseButton) {
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
