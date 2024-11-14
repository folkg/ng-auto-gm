import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { logError } from '../shared/utils/error';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private isDirty: boolean = false;
  constructor(private readonly auth: AuthService) {}

  public logout(): void {
    this.auth.logout().catch(logError);
  }

  public onDirtyChange(dirty: boolean): void {
    this.isDirty = dirty;
  }

  public canDeactivate(): boolean {
    return !this.isDirty;
  }
}
