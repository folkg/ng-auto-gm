import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
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
    private readonly auth: AuthService,
  ) {}

  async setLineupsBoolean(team: Team, value: boolean): Promise<void> {
    const user = this.auth.user;
    const db = this.firestore;

    const teamsRef = collection(db, 'users', user.uid, 'teams');
    const docRef = doc(teamsRef, team.team_key);

    await updateDoc(docRef, { is_setting_lineups: value });
  }

  async setPauseLineupActions(team: Team, value: boolean): Promise<void> {
    const user = this.auth.user;
    const db = this.firestore;

    const teamsRef = collection(db, 'users', user.uid, 'teams');
    const docRef = doc(teamsRef, team.team_key);

    await updateDoc(docRef, {
      lineups_paused_at: value === true ? serverTimestamp() : undefined,
    });
  }

  async fetchSchedules(): Promise<Schedule> {
    const storedSchedule = sessionStorage.getItem('schedules');
    if (storedSchedule !== null) {
      const schedule = JSON.parse(storedSchedule) as unknown;
      if (is(schedule, Schedule)) {
        return schedule;
      }
    }

    const db = this.firestore;

    const schedulesRef = doc(db, 'schedule', 'today');
    const scheduleSnap = await getDoc(schedulesRef);
    const schedule = scheduleSnap.data();
    assert(schedule, Schedule);

    sessionStorage.setItem('schedules', JSON.stringify(schedule));
    return schedule;
  }

  async fetchTeams(): Promise<TeamFirestore[]> {
    const user = this.auth.user;
    const db = this.firestore;

    const teams: TeamFirestore[] = [];
    // fetch teams for the current user and now < end_date
    const teamsRef = collection(db, 'users', user.uid, 'teams');
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
