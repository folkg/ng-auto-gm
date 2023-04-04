import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private isDirty: boolean = false;
  constructor(private auth: AuthService) {}

  public logout(): void {
    this.auth.logout();
  }

  public onDirtyChange(dirty: boolean): void {
    this.isDirty = dirty;
    console.log('dirty: ', dirty);
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return !this.isDirty;
  }
}
