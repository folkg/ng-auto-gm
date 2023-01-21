import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
  private mailApiUrl = 'http://localhost:3000/send-email';

  constructor(private auth: AuthService, private http: HttpClient) {}

  onSubmit() {
    this.auth.user$.pipe(take(1)).subscribe((user) => {
      const emailBody: string =
        'UID: ' +
        user.uid +
        '\n' +
        user.email +
        '\n' +
        user.displayName +
        '\n' +
        (this.feedbackType || 'General') +
        '\n' +
        this.feedback;
      console.log(emailBody);

      this.PostEmail(emailBody).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
    this.submitted = true;
  }

  PostEmail(email: string): Observable<unknown> {
    return this.http
      .post(
        this.mailApiUrl,
        { _subject: this.title, message: email, _honeypot: this.honeypot },
        { responseType: 'text' }
      )
      .pipe(
        map((response) => {
          if (response) {
            return response;
          }
          return null;
        }),
        (error: any) => {
          return error;
        }
      );
  }
}
