import { Component, HostBinding, OnInit } from '@angular/core';
import { ThemingService } from './services/theming.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') public cssClass!: string;

  constructor(private themingService: ThemingService) {}

  ngOnInit(): void {
    this.themingService.theme.subscribe((theme: string) => {
      this.cssClass = theme;
    });
  }
}
