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
import { assert, is } from 'superstruct';
import { Team, TeamFirestore } from '../../services/interfaces/team';
import { Schedule } from '../interfaces/schedules';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private readonly firestore: Firestore,
    private readonly auth: AuthService
  ) {}

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

  // async togglePauseLineupActions(team: Team) {
  //   const user = await firstValueFrom(this.auth.user$);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   const db = this.firestore;
  //   const teamsRef = collection(db, 'users', user.uid, 'teams');
  //   const docRef = doc(teamsRef, team.team_key);
  //   const docSnap = await getDoc(docRef);
  //   const data = docSnap.data();
  //   assert(data, Team);
  //   await updateDoc(docRef, { lineups_paused_at:  });
  // }

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

  async fetchTeams(): Promise<TeamFirestore[]> {
    const user = await firstValueFrom(this.auth.user$);
    if (!user) {
      throw new Error('User not found');
    }

    const teams: TeamFirestore[] = [];
    // fetch teams for the current user and now < end_date
    const teamsRef = collection(this.firestore, 'users', user.uid, 'teams');
    const q = query(teamsRef, where('end_date', '>', Date.now()));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const team = doc.data();
      assert(team, TeamFirestore);
      teams.push(team);
    });

    return teams;
  }
}
