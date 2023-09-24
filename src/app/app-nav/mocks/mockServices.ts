import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService {
  user$: Observable<any> = of({ name: 'John Doe' });
}
export class MockSyncTeamsService {
  teams$: Observable<any> = of([
    { name: 'Team 1', allow_transactions: false },
    { name: 'Team 2', allow_transactions: true },
  ]);
}
