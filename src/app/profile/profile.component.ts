import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
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

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.profileForm.patchValue({
          email: user.email,
        });
      }
    });
  }

  cancelChanges() {
    this.isEditing = !this.isEditing;
    this.profileForm.reset({ email: this.user?.email });
  }

  async saveChanges() {
    try {
      await this.auth.updateEmail(this.profileForm.value.email);
      this.isEditing = !this.isEditing;
      this.profileForm.markAsPristine();
    } catch (err) {
      console.log(err);
    }
  }

  sendVerificationEmail(): void {
    this.auth.sendVerificationEmail();
  }

  logout(): void {
    this.auth.logout();
  }
}
