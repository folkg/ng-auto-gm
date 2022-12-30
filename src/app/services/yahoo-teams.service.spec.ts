import { TestBed } from '@angular/core/testing';

import { YahooTeamsService } from './yahoo-teams.service';

describe('YahooTeamsService', () => {
  let service: YahooTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YahooTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
