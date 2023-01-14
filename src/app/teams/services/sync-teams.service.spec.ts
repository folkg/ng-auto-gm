import { TestBed } from '@angular/core/testing';

import { SyncTeamsService } from './sync-teams.service';

describe('FetchTeamsService', () => {
  let service: SyncTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
