import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

import { OnlineStatusService } from '../../services/online-status.service';

@Component({
  selector: 'app-offline-warning-card',
  templateUrl: './offline-warning-card.component.html',
  styleUrls: ['./offline-warning-card.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    AsyncPipe,
  ],
})
export class OfflineWarningCardComponent {
  constructor(public os: OnlineStatusService) {}
}
