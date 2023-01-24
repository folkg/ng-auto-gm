import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  themes = ['dark-theme', 'light-theme']; // <- list all themes in this array
  theme = new BehaviorSubject('light-theme'); // <- initial theme
  private _darkModeOn: boolean;
  public get darkModeOn(): boolean {
    return this._darkModeOn;
  }
  public set darkModeOn(value: boolean) {
    this._darkModeOn = value;
    this.theme.next(this.darkModeOn ? 'dark-theme' : 'light-theme');
    localStorage.setItem('darkModeOn', JSON.stringify(this.darkModeOn));
  }

  //TODO: Add a toggle somewhere in navbar to switch between themes
  constructor(private ref: ApplicationRef) {
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (localStorage.getItem('darkModeOn') !== null) {
      // First check if dark mode is enabled in local storage
      this._darkModeOn = JSON.parse(
        localStorage.getItem('darkModeOn') || 'false'
      );
    } else {
      // Next, check if dark mode is enabled on system
      this._darkModeOn = darkMediaQuery.matches;
    }

    // If dark mode is enabled then directly switch to the dark-theme
    if (this.darkModeOn) {
      this.theme.next('dark-theme');
    }

    // Watch for changes of the system preference
    darkMediaQuery.addEventListener('change', () => {
      this.darkModeOn = darkMediaQuery.matches;
      this.theme.next(this.darkModeOn ? 'dark-theme' : 'light-theme');

      // Trigger refresh of UI
      this.ref.tick();
    });
  }
}
