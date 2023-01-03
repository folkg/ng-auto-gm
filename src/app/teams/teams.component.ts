import { Component } from '@angular/core';
import { YahooService } from '../services/yahoo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent {
  constructor(public yahoo: YahooService) {}
  //TODO: Cache teams in sessionStorage. Load from sessionStorage if available instead of API call.
}
