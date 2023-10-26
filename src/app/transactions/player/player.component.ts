import { Component, Input } from '@angular/core';
import { Player } from '../interfaces/Player';

@Component({
  selector: 'app-player[player]',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() player!: Player;
  @Input() isAdding: boolean | null = null;
  public expanded = false;

  get playerPositions(): string {
    return this.player.eligible_positions.filter((p) => p !== 'BN').join(', ');
  }

  get playerOwnership(): string {
    if (this.player.ownership?.ownership_type === 'waivers') {
      return `Waivers until ${this.player.ownership.waiver_date}`;
    } else if (this.player.ownership?.ownership_type === 'freeagents') {
      return 'Free Agent';
    }
    return '';
  }
}
