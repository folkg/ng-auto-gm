import { Component } from '@angular/core';

import { OnlineStatusService } from '../../services/online-status.service';

@Component({
  selector: 'app-offline-warning-card',
  templateUrl: './offline-warning-card.component.html',
  styleUrls: ['./offline-warning-card.component.scss'],
})
export class OfflineWarningCardComponent {
  constructor(public os: OnlineStatusService) {}
}
