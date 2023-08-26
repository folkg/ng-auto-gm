import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Team } from '../interfaces/team';

@Injectable({
  providedIn: null,
})
export class FirestoreService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  public async setLineupsBooleanFirestore(
    team: Team,
    value: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.user$.pipe(take(1)).subscribe(async (user) => {
        try {
          const db = this.firestore;
          const teamsRef = collection(db, 'users', user.uid, 'teams');
          const docRef = doc(teamsRef, team.team_key);
          await updateDoc(docRef, { is_setting_lineups: value });
          resolve();
        } catch (err: any) {
          reject(
            'Error updating is_setting_lineups in Firebase: ' + err.message
          );
        }
      });
    });
  }

  public async fetchSchedulesFromFirestore(): Promise<any> {
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
    } catch (err: any) {
      throw new Error('Error fetching schedules from Firebase' + err.message);
    }
    return null;
  }
}
