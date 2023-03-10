import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import { OnlineStatusService } from '../services/online-status.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  //TODO: Implement the basic profile screen where a user can edit only their email address
  //TODO: Implement a dialog form asking the user to enter their email address if it is not verified
  emailFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
  ]);
  profileForm: FormGroup = new FormGroup({
    email: this.emailFormControl,
  });
  user: User | null = null;
  isEditing: boolean = false;
  private subscription: Subscription | undefined;

  constructor(private auth: AuthService, public os: OnlineStatusService) {}
  ngOnInit(): void {
    this.subscription = this.auth.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.profileForm.patchValue({
          email: user.email,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  cancelChanges() {
    this.isEditing = !this.isEditing;
    this.profileForm.reset({ email: this.user?.email });
  }

  async saveChanges() {
    try {
      await this.auth.updateUserEmail(this.profileForm.value.email);
      this.isEditing = !this.isEditing;
      this.profileForm.markAsPristine();
    } catch (err: Error | any) {
      console.log(err);
    }
  }

  sendVerificationEmail(): void {
    this.auth.sendVerificationEmail();
  }

  logout(): void {
    this.auth.logout();
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.profileForm.pristine;
  }
}
