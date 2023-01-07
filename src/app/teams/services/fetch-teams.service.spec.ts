import { TestBed } from '@angular/core/testing';

import { FetchTeamsService } from './fetch-teams.service';

describe('FetchTeamsService', () => {
  let service: FetchTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
