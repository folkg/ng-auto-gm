import { Component, ViewChild } from '@angular/core';
import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import { NgForm } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { OnlineStatusService } from '../services/online-status.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
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
    private auth: AuthService,
    private fns: Functions,
    public os: OnlineStatusService
  ) {}

  async onSubmitCloudFunction(): Promise<void> {
    if (this.honeypot === '') {
      this.submitted = true;
      await firstValueFrom(this.auth.user$).then((user) => {
        if (!user) {
          return;
        }
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
            'https://fantasyautocoach.com/api/sendfeedbackemail'
          );
        sendFeedbackEmail(data)
          .then((result) => {
            this.success = result.data;
          })
          .catch(() => {
            this.success = false;
          });
      });
    }
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
