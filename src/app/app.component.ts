import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { pairwise, startWith } from 'rxjs';

import { ThemingService } from './services/theming.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') public cssClass!: string;

  constructor(
    private themingService: ThemingService,
    private overlayContainer: OverlayContainer,
  ) {}

  ngOnInit(): void {
    this.themingService.theme
      .pipe(startWith(undefined), pairwise())
      .subscribe(([oldTheme, newTheme]) => {
        if (newTheme !== undefined) {
          this.cssClass = newTheme;

          //overlayContainer is used for the mat-dialog
          this.overlayContainer.getContainerElement().classList.add(newTheme);
          if (oldTheme !== newTheme && oldTheme !== undefined) {
            //remove the oldTheme from the overlayContainer
            this.overlayContainer
              .getContainerElement()
              .classList.remove(oldTheme);
          }
        }
      });
  }
}
