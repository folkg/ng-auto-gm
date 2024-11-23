import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { assertDefined } from 'src/app/shared/utils/checks';
import { logError } from 'src/app/shared/utils/error';

import { AuthService } from '../../services/auth.service';
import { OnlineStatusService } from '../../services/online-status.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardTitle,
    MatCardContent,
    NgIf,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
    MatCardActions,
    AsyncPipe,
  ],
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
  ]);
  profileForm = new FormGroup({
    email: this.emailFormControl,
  });
  user: User | null = null;
  isEditing: boolean = false;
  private subs = new Subscription();
  @Output() isDirty = new EventEmitter<boolean>();

  constructor(
    private readonly auth: AuthService,
    readonly os: OnlineStatusService,
  ) {}
  ngOnInit(): void {
    this.subs = new Subscription();

    this.subs.add(
      this.auth.user$.subscribe((user) => {
        this.user = user;
        if (user) {
          this.profileForm.patchValue({
            email: user.email,
          });
        }
      }),
    );

    this.subs.add(
      this.profileForm.valueChanges.subscribe(() => {
        if (this.profileForm.pristine) {
          this.isDirty.emit(false);
        } else {
          this.isDirty.emit(true);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  cancelChanges() {
    this.isEditing = !this.isEditing;
    this.profileForm.reset({ email: this.user?.email });
  }

  async saveChanges() {
    try {
      const emailAddress = this.profileForm.value.email;
      assertDefined(emailAddress, 'Email address is required');
      await this.auth.updateUserEmail(emailAddress);
      this.isEditing = !this.isEditing;
      this.profileForm.markAsPristine();
    } catch (err) {
      logError(err, 'Error updating email:');
    }
  }

  async sendVerificationEmail(): Promise<void> {
    await this.auth.sendVerificationEmail();
  }
}
