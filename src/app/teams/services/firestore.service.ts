import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Team } from '../../services/interfaces/team';
import { Schedule } from '../interfaces/schedules';
import { assert, is } from 'superstruct';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  async setLineupsBoolean(team: Team, value: boolean): Promise<void> {
    try {
      const user = await firstValueFrom(this.auth.user$);
      if (!user) {
        throw new Error('User not found');
      }
      const db = this.firestore;
      const teamsRef = collection(db, 'users', user.uid, 'teams');
      const docRef = doc(teamsRef, team.team_key);
      await updateDoc(docRef, { is_setting_lineups: value });
    } catch (err: any) {
      console.error(
        'Error updating is_setting_lineups in Firebase: ' + err.message
      );
    }
  }

  async fetchSchedulesFromFirestore(): Promise<Schedule> {
  async fetchSchedules(): Promise<Schedule> {
    const storedSchedule = sessionStorage.getItem('schedules');
    if (storedSchedule !== null) {
      const schedule = JSON.parse(storedSchedule);
      if (is(schedule, Schedule)) {
        return schedule;
      }
    }

    const schedulesRef = doc(this.firestore, 'schedule', 'today');
    const scheduleSnap = await getDoc(schedulesRef);
    const schedule = scheduleSnap.data();
    assert(schedule, Schedule);

    sessionStorage.setItem('schedules', JSON.stringify(schedule));
    return schedule;
  }

  // TODO: Proper typing, validation, and error handling
  async fetchTeams(): Promise<any> {
    const user = await firstValueFrom(this.auth.user$);
    if (!user) {
      return null;
    }
    const db = this.firestore;
    const teams: any = [];
    // fetch teams for the current user and now < end_date
    const teamsRef = collection(db, 'users', user.uid, 'teams');
    const q = query(teamsRef, where('end_date', '>', Date.now()));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      teams.push({ team_key: doc.id, ...doc.data() });
    });
    return teams;
  }
}
