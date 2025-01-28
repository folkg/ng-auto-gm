import { Injectable } from "@angular/core";
import { User } from "@firebase/auth";
import { Observable, of } from "rxjs";
import type { Team } from "src/app/services/interfaces/team";

@Injectable({
  providedIn: "root",
})
export class MockAuthService {
  user$: Observable<User> = of({ name: "John Doe" } as unknown as User);
}
export class MockSyncTeamsService {
  teams$: Observable<Team[]> = of([
    { name: "Team 1", allow_transactions: false },
    { name: "Team 2", allow_transactions: true },
  ] as unknown as Team[]);
}
