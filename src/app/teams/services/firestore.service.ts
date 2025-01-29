import { Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { AuthService } from "src/app/services/auth.service";

import { assertType, isType } from "src/app/shared/utils/checks";
import { TeamFirestore } from "../../services/interfaces/team";
import { Schedule } from "../interfaces/schedules";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  private readonly firestore: Firestore;

  constructor(private readonly auth: AuthService) {
    this.firestore = getFirestore();
  }

  async setLineupsBoolean(teamKey: string, value: boolean): Promise<void> {
    const user = await this.auth.getUser();

    const db = this.firestore;

    const teamsRef = collection(db, "users", user.uid, "teams");
    const docRef = doc(teamsRef, teamKey);

    await updateDoc(docRef, { is_setting_lineups: value });
  }

  async setPauseLineupActions(teamKey: string, value: boolean): Promise<void> {
    const user = await this.auth.getUser();
    const db = this.firestore;

    const teamsRef = collection(db, "users", user.uid, "teams");
    const docRef = doc(teamsRef, teamKey);

    await updateDoc(docRef, {
      lineup_paused_at: value === true ? Date.now() : -1,
    });
  }

  async fetchSchedules(): Promise<Schedule> {
    const storedSchedule = sessionStorage.getItem("schedules");
    if (storedSchedule !== null) {
      const schedule = JSON.parse(storedSchedule);
      if (isType(schedule, Schedule)) {
        return schedule;
      }
    }

    const db = this.firestore;

    const schedulesRef = doc(db, "schedule", "today");
    const scheduleSnap = await getDoc(schedulesRef);
    const schedule = scheduleSnap.data();
    assertType(schedule, Schedule);

    sessionStorage.setItem("schedules", JSON.stringify(schedule));
    return schedule;
  }

  async fetchTeams(): Promise<TeamFirestore[]> {
    const user = await this.auth.getUser();
    const db = this.firestore;

    // fetch teams for the current user and now < end_date
    const teamsRef = collection(db, "users", user.uid, "teams");
    const teamsSnapshot = await getDocs(
      query(teamsRef, where("end_date", ">=", Date.now())),
    );

    return teamsSnapshot.docs.map((doc) => {
      const team = doc.data();
      assertType(team, TeamFirestore);
      return team;
    });
  }
}
