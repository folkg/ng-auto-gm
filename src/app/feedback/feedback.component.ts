import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { AsyncPipe } from "@angular/common";
import { Component, ViewChild, signal } from "@angular/core";
import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatChipListbox, MatChipOption } from "@angular/material/chips";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { Functions, getFunctions, httpsCallable } from "@firebase/functions";

import { AppStatusService } from "../services/app-status.service";
import { AuthService } from "../services/auth.service";
import { OfflineWarningCardComponent } from "../shared/offline-warning-card/offline-warning-card.component";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"],
  imports: [
    OfflineWarningCardComponent,
    ReactiveFormsModule,
    FormsModule,
    MatChipListbox,
    MatChipOption,
    MatFormField,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    MatButton,
    AsyncPipe,
  ],
})
export class FeedbackComponent {
  feedback: string = "";
  title: string = "";
  honeypot: string = ""; //bots will likely fill this in
  feedbackType: string = "General";
  readonly feedbackTypes = FEEDBACK_TYPES;

  readonly submitted = signal(false);
  readonly success = signal<boolean | undefined>(undefined);

  @ViewChild("feedbackForm") feedbackForm: NgForm | undefined;

  private readonly functions: Functions;

  constructor(
    private readonly auth: AuthService,
    readonly appStatusService: AppStatusService,
  ) {
    this.functions = getFunctions();
  }

  async onSubmitCloudFunction(): Promise<void> {
    this.submitted.set(true);

    if (this.honeypot !== "") {
      this.success.set(false);
      return;
    }

    const user = await this.auth.getUser();

    const emailBody =
      user.displayName + "\n" + user.uid + "\n\n" + this.feedback;

    const data: FeedbackData = {
      userEmail: user.email ?? "unknown email",
      feedbackType: this.feedbackType,
      title: this.title,
      message: emailBody,
    };

    const sendFeedbackEmail = httpsCallable<FeedbackData, boolean>(
      this.functions,
      "sendfeedbackemail",
    );

    sendFeedbackEmail(data)
      .then((result) => {
        this.success.set(result.data);
      })
      .catch(() => {
        this.success.set(false);
      });
  }

  public canDeactivate(): boolean {
    return this.feedbackForm?.pristine ?? this.submitted();
  }
}

type FeedbackData = {
  userEmail: string;
  feedbackType: string;
  title: string;
  message: string;
};

const FEEDBACK_TYPES = ["General", "Bug Report", "Feature Request"];
