import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ThemingService } from '../services/theming.service';
import { SyncTeamsService } from '../services/sync-teams.service';

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
      shareReplay()
    );
  public isLoggedIn: boolean = false;
  public hasTransactionsEnabled: boolean = false;
  private userSubscription: Subscription | undefined;
  private teamsSubscription: Subscription | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public themingService: ThemingService,
    public auth: AuthService,
    private sts: SyncTeamsService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.auth.user$.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });

    this.teamsSubscription = this.sts.teams$.subscribe((teams) => {
      this.hasTransactionsEnabled = teams.some(
        (team) => team.allow_transactions
      );
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.teamsSubscription?.unsubscribe();
  }

  toggleDarkMode() {
    this.themingService.darkModeOn = !this.themingService.darkModeOn;
  }
}
