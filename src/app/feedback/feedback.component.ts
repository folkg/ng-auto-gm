import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  AsyncPipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { AuthService } from '../services/auth.service';
import { OnlineStatusService } from '../services/online-status.service';
import { OfflineWarningCardComponent } from '../shared/offline-warning-card/offline-warning-card.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    OfflineWarningCardComponent,
    ReactiveFormsModule,
    FormsModule,
    MatChipListbox,
    NgFor,
    MatChipOption,
    MatFormField,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    MatButton,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    AsyncPipe,
  ],
})
export class FeedbackComponent {
  feedback: string = '';
  title: string = '';
  honeypot: string = ''; //bots will likely fill this in
  feedbackType: string = 'General';
  feedbackTypes: string[] = ['General', 'Bug Report', 'Feature Request'];
  submitted: boolean = false;
  success: boolean | null = null;

  @ViewChild('feedbackForm') feedbackForm: NgForm | undefined;

  constructor(
    private readonly auth: AuthService,
    private readonly fns: Functions,
    readonly os: OnlineStatusService,
  ) {}

  async onSubmitCloudFunction(): Promise<void> {
    if (this.honeypot !== '') {
      return;
    }

    this.submitted = true;
    const user = await this.auth.getUser();

    const emailBody: string =
      user.displayName + '\n' + user.uid + '\n\n' + this.feedback;
    const data: FeedbackData = {
      userEmail: user.email ?? 'unknown email',
      feedbackType: this.feedbackType,
      title: this.title,
      message: emailBody,
    };

    const sendFeedbackEmail: HttpsCallable<FeedbackData, boolean> =
      httpsCallableFromURL(
        this.fns,
        // 'https://email-sendfeedbackemail-nw73xubluq-uc.a.run.app'
        'https://fantasyautocoach.com/api/sendfeedbackemail',
      );
    sendFeedbackEmail(data)
      .then((result) => {
        this.success = result.data;
      })
      .catch(() => {
        this.success = false;
      });
  }

  public canDeactivate(): boolean {
    return this.feedbackForm?.pristine ?? this.submitted;
  }
}

type FeedbackData = {
  userEmail: string;
  feedbackType: string;
  title: string;
  message: string;
};
