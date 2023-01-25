import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Team } from '../interfaces/team';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: null,
})
export class SyncTeamsService {
  constructor(
    private firestore: Firestore,
    private fns: Functions,
    private auth: AuthService
  ) {}

  async fetchTeamsFromYahoo(): Promise<Team[]> {
    // fetch teams from yahoo via firebase function
    const fetchTeamsFromServer = httpsCallable(this.fns, 'fetchuserteams');
    const teams = await fetchTeamsFromServer();
    return teams.data as Team[];
  }

  async setLineupsBooleanFirestore(team: Team, value: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.user$.pipe(take(1)).subscribe(async (user) => {
        try {
          const db = this.firestore;
          const teamsRef = collection(db, 'users', user.uid, 'teams');
          const docRef = doc(teamsRef, team.team_key);
          await updateDoc(docRef, { is_setting_lineups: value });
          resolve();
        } catch (err: Error | any) {
          reject(
            'Error updating is_setting_lineups in Firebase: ' + err.message
          );
        }
      });
    });
  }

  async fetchSchedulesFromFirestore(): Promise<any> {
    // first check if schedules are already in sessionStorage
    if (sessionStorage.getItem('schedules') !== null) {
      return JSON.parse(sessionStorage.getItem('schedules')!);
    }
    try {
      // fetch the schedules for all leagues from firebase and save them to sessionStorage
      const db = this.firestore;
      const schedulesRef = doc(db, 'schedule', 'today');
      const scheduleSnap = await getDoc(schedulesRef);
      const schedule = scheduleSnap.data();
      if (schedule) {
        // save schedules to sessionStorage
        sessionStorage.setItem('schedules', JSON.stringify(schedule));
        return schedule;
      }
    } catch (err: Error | any) {
      throw new Error('Error fetching schedules from Firebase' + err.message);
    }
    return null;
  }

  async fetchTeamsFromFirestore(): Promise<any> {
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
}
