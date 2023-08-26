import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, lastValueFrom, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  ConfirmDialogComponent,
  DialogData,
} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Team } from './interfaces/team';

@Injectable({
  providedIn: 'root',
})
export class SyncTeamsService {
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  public teams$: Observable<Team[]> = this.teamsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private fns: Functions,
    private auth: AuthService,
    public dialog: MatDialog
  ) {
    this.teams$.subscribe((teams) => {
      if (teams.length > 0) {
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
      Object.assign(team, firestoreTeam);
    });
  }

  private async fetchTeamsFromFirestore(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.user$.pipe(take(1)).subscribe(async (user) => {
        if (user) {
          try {
            const db = this.firestore;
            const teams: any = [];
            // fetch teams for the current user and now < end_date
            const teamsRef = collection(db, 'users', user.uid, 'teams');
            const q = query(teamsRef, where('end_date', '>', Date.now()));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              teams.push({ team_key: doc.id, ...doc.data() });
            });
            resolve(teams);
          } catch (err: Error | any) {
            reject('Error fetching teams from Firebase. ' + err.message);
          }
        }
      });
    });
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
