import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { OnlineStatusService } from '../../services/online-status.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  emailFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
  ]);
  profileForm: FormGroup = new FormGroup({
    email: this.emailFormControl,
  });
  user: User | null = null;
  isEditing: boolean = false;
  private userSubscription: Subscription | undefined;
  private dirtySubscription: Subscription | undefined;
  @Output() isDirty = new EventEmitter<boolean>();

  constructor(private auth: AuthService, public os: OnlineStatusService) {}
  ngOnInit(): void {
    this.userSubscription = this.auth.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.profileForm.patchValue({
          email: user.email,
        });
      }
    });

    this.dirtySubscription = this.profileForm.valueChanges.subscribe(() => {
      if (this.profileForm.pristine) {
        console.log('pristine');
        this.isDirty.emit(false);
      } else {
        console.log('dirty');
        this.isDirty.emit(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.dirtySubscription?.unsubscribe();
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
}
