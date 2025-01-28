import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AsyncPipe, NgIf } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatNavList } from "@angular/material/list";
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";
import { MatTooltip } from "@angular/material/tooltip";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { AuthService } from "../services/auth.service";
import { SyncTeamsService } from "../services/sync-teams.service";
import { ThemingService } from "../services/theming.service";
import { shareLatest } from "../shared/utils/shareLatest";

@Component({
  selector: "app-app-nav",
  templateUrl: "./app-nav.component.html",
  styleUrls: ["./app-nav.component.scss"],
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatToolbar,
    MatNavList,
    NgIf,
    MatListItem,
    RouterLink,
    MatSidenavContent,
    MatIconButton,
    MatIcon,
    MatTooltip,
    RouterOutlet,
    AsyncPipe,
  ],
})
export class AppNavComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareLatest(),
    );
  isLoggedIn: boolean = false;
  hasTransactionsEnabled: boolean = false;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    readonly themingService: ThemingService,
    readonly auth: AuthService,
    private readonly sts: SyncTeamsService,
  ) {}

  private readonly subs = new Subscription();

  ngOnInit(): void {
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
