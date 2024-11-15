import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { SyncTeamsService } from '../services/sync-teams.service';
import { ThemingService } from '../services/theming.service';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss'],
})
export class AppNavComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  public isLoggedIn: boolean = false;
  public hasTransactionsEnabled: boolean = false;
  private subs = new Subscription();

  constructor(
    private breakpointObserver: BreakpointObserver,
    public themingService: ThemingService,
    public auth: AuthService,
    private sts: SyncTeamsService,
  ) {}

  ngOnInit(): void {
    this.subs = new Subscription();

    this.subs.add(
      this.auth.user$.subscribe((user) => {
        if (user) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      }),
    );

    this.subs.add(
      this.sts.teams$.subscribe((teams) => {
        this.hasTransactionsEnabled = teams.some(
          (team) => team.allow_transactions,
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  toggleDarkMode() {
    this.themingService.darkModeOn = !this.themingService.darkModeOn;
  }
}
