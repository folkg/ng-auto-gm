import { Component, ViewChild } from '@angular/core';
import { Functions, httpsCallableFromURL } from '@angular/fire/functions';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs';
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

  @ViewChild('feedbackForm') feedbackForm!: NgForm;

  constructor(
    private auth: AuthService,
    private fns: Functions,
    public os: OnlineStatusService
  ) {}

  onSubmitCloudFunction() {
    if (this.honeypot === '') {
      this.submitted = true;
      this.auth.user$.pipe(take(1)).subscribe(async (user) => {
        const emailBody: string =
          user.displayName + '\n' + user.uid + '\n\n' + this.feedback;
        const data = {
          userEmail: user.email,
          feedbackType: this.feedbackType || 'General',
          title: this.title,
          message: emailBody,
        };

        const sendFeedbackEmail = httpsCallableFromURL(
          this.fns,
          'https://sendfeedbackemail-nw73xubluq-uc.a.run.app'
        );
        try {
          const result = await sendFeedbackEmail(data);
          this.success = result.data as boolean;
        } catch (err: Error | any) {
          this.success = false;
        }
      });
    }
  }

  public canDeactivate(): boolean {
    return this.feedbackForm?.pristine || this.submitted;
  }
}
