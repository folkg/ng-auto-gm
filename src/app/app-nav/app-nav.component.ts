import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
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
      shareReplay()
    );
  isLoggedIn: boolean = false;
  private subscription: Subscription | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public themingService: ThemingService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.auth.user$.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggleDarkMode() {
    this.themingService.darkModeOn = !this.themingService.darkModeOn;
  }
}
