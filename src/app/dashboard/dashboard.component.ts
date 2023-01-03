import { Component, OnInit } from '@angular/core';
import { YahooService } from '../services/yahoo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(public yahoo: YahooService) {}
}
